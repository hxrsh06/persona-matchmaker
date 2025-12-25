import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProductFeatures {
  category: string;
  subcategory?: string;
  fabric: string[];
  color: string;
  colorFamily: string;
  fit: string;
  rise?: string;
  length?: string;
  neckline?: string;
  sleeve?: string;
  occasion: string[];
  style: string;
  priceSegment: string;
  hasStretch: boolean;
  isPrinted: boolean;
  patternType: string;
}

interface PersonaScore {
  personaId: string;
  personaName: string;
  likeProbability: number;
  confidenceScore: number;
  priceFloor: number;
  priceSweetSpot: number;
  priceCeiling: number;
  priceElasticity: number;
  explanation: string;
  matchFactors: { factor: string; weight: number; contribution: string }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      return new Response(
        JSON.stringify({ code: 401, message: "Missing JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jwt = authHeader.split(" ")[1];

    const { productId, tenantId } = await req.json();

    if (!productId || !tenantId) {
      throw new Error("Product ID and Tenant ID are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Admin client (bypasses RLS) + Auth client (validates JWT)
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    });

    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      return new Response(
        JSON.stringify({ code: 401, message: "Invalid JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: hasAccess, error: accessError } = await supabase.rpc(
      "has_tenant_access",
      { _tenant_id: tenantId, _user_id: user.id }
    );

    if (accessError || !hasAccess) {
      return new Response(
        JSON.stringify({ code: 403, message: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      throw new Error(`Product not found: ${productError?.message}`);
    }

    // Fetch all active personas for this tenant
    const { data: personas, error: personasError } = await supabase
      .from("personas")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("is_active", true);

    if (personasError) {
      throw new Error(`Failed to fetch personas: ${personasError.message}`);
    }

    if (!personas || personas.length === 0) {
      throw new Error("No active personas found for this tenant");
    }

    console.log(`Analyzing product ${product.name} against ${personas.length} personas`);

    // Get extracted features or use existing
    let features = product.extracted_features;
    
    if (!features || Object.keys(features).length === 0) {
      // Extract features using AI
      features = await extractProductFeatures(product, lovableApiKey);
      
      // Save extracted features
      await supabase
        .from("products")
        .update({ 
          extracted_features: features,
          status: "analyzed"
        })
        .eq("id", productId);
    }

    // Score against each persona
    const scores: PersonaScore[] = [];
    
    for (const persona of personas) {
      const score = await scoreProductAgainstPersona(
        product,
        features,
        persona,
        lovableApiKey
      );
      scores.push(score);

      // Upsert analysis result
      await supabase
        .from("analysis_results")
        .upsert({
          product_id: productId,
          persona_id: persona.id,
          tenant_id: tenantId,
          like_probability: score.likeProbability,
          confidence_score: score.confidenceScore,
          price_floor: score.priceFloor,
          price_sweet_spot: score.priceSweetSpot,
          price_ceiling: score.priceCeiling,
          price_elasticity: score.priceElasticity,
          explanation: score.explanation,
          match_factors: score.matchFactors,
        }, {
          onConflict: "product_id,persona_id"
        });
    }

    // Log analysis
    await supabase.from("analysis_history").insert({
      tenant_id: tenantId,
      product_id: productId,
      user_id: user.id,
      action_type: "single_analysis",
      input_data: { productName: product.name, personaCount: personas.length },
      results_summary: {
        averageLikeProbability:
          scores.reduce((a, b) => a + b.likeProbability, 0) / scores.length,
        highestMatch: scores.reduce((a, b) =>
          a.likeProbability > b.likeProbability ? a : b
        ).personaName,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        features,
        scores,
        summary: {
          averageLikeProbability: Math.round(scores.reduce((a, b) => a + b.likeProbability, 0) / scores.length),
          highestMatch: scores.reduce((a, b) => a.likeProbability > b.likeProbability ? a : b),
          lowestMatch: scores.reduce((a, b) => a.likeProbability < b.likeProbability ? a : b),
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function extractProductFeatures(product: any, apiKey: string): Promise<ProductFeatures> {
  const systemPrompt = `You are an expert fashion product analyst specializing in casual and formal apparel including t-shirts, shirts, jeans, trousers, shorts, joggers, hoodies, and polo shirts. 
Analyze the product and extract structured features. Be precise and use standardized terminology.`;

  const userPrompt = `Analyze this apparel product and extract features:

Product Name: ${product.name}
Brand: ${product.brand || "Unknown"}
Description: ${product.description || "No description"}
Category: ${product.category}
Subcategory: ${product.subcategory || ""}
Price: ₹${product.price}
Tags: ${product.tags?.join(", ") || "None"}

Extract and return structured features for this apparel item.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [{
        type: "function",
        function: {
          name: "extract_features",
          description: "Extract apparel product features",
          parameters: {
            type: "object",
            properties: {
              category: { 
                type: "string", 
                enum: ["tshirt", "shirt", "jeans", "trousers", "shorts", "joggers", "hoodie", "polo", "jacket", "sweater"] 
              },
              subcategory: { type: "string" },
              fabric: { 
                type: "array", 
                items: { type: "string" },
                description: "Fabrics like cotton, polyester, denim, linen, fleece, modal, spandex"
              },
              color: { type: "string" },
              colorFamily: { 
                type: "string", 
                enum: ["neutral", "earth", "pastel", "bold", "dark", "print", "white", "black", "blue", "grey"] 
              },
              fit: { 
                type: "string", 
                enum: ["slim", "regular", "relaxed", "oversized", "athletic", "tailored"] 
              },
              rise: { 
                type: "string", 
                enum: ["low", "mid", "high"],
                description: "For bottoms only"
              },
              length: { 
                type: "string", 
                enum: ["cropped", "regular", "long", "short", "above-knee", "below-knee"],
                description: "Length of the garment"
              },
              neckline: { 
                type: "string", 
                enum: ["crew", "v-neck", "collar", "polo", "henley", "mock", "hoodie", "none"],
                description: "For tops only"
              },
              sleeve: { 
                type: "string", 
                enum: ["sleeveless", "short", "half", "three-quarter", "full", "rolled"],
                description: "Sleeve length for tops"
              },
              occasion: { 
                type: "array", 
                items: { type: "string" },
                description: "e.g., casual, work, weekend, sports, party, travel"
              },
              style: { 
                type: "string", 
                enum: ["basic", "sporty", "smart-casual", "formal", "streetwear", "trendy", "classic"] 
              },
              priceSegment: { 
                type: "string", 
                enum: ["budget", "mid-range", "premium", "luxury"] 
              },
              hasStretch: { type: "boolean" },
              isPrinted: { type: "boolean" },
              patternType: { 
                type: "string", 
                enum: ["solid", "striped", "checked", "graphic", "floral", "geometric", "abstract"] 
              }
            },
            required: ["category", "fabric", "color", "colorFamily", "fit", "occasion", "style", "priceSegment", "patternType"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "extract_features" } }
    }),
  });

  if (!response.ok) {
    console.error("AI extraction failed:", await response.text());
    // Return default features for general apparel
    return {
      category: product.category || "tshirt",
      fabric: ["cotton"],
      color: "neutral",
      colorFamily: "neutral",
      fit: "regular",
      occasion: ["casual"],
      style: "basic",
      priceSegment: product.price < 800 ? "budget" : product.price < 1500 ? "mid-range" : "premium",
      hasStretch: false,
      isPrinted: false,
      patternType: "solid"
    };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (toolCall?.function?.arguments) {
    return JSON.parse(toolCall.function.arguments);
  }

  throw new Error("Failed to extract features");
}

async function scoreProductAgainstPersona(
  product: any,
  features: ProductFeatures,
  persona: any,
  apiKey: string
): Promise<PersonaScore> {
  
  const systemPrompt = `You are an expert consumer behavior analyst specializing in apparel and fashion retail. Score how well a product matches a consumer persona.
Consider demographics, psychographics, shopping preferences, and price sensitivity.
Be precise with probability scores and provide actionable insights.`;

  const userPrompt = `Score this apparel product against the persona:

PRODUCT:
- Name: ${product.name}
- Category: ${features.category}
- Style: ${features.style}
- Fit: ${features.fit}
- Price: ₹${product.price}
- Features: ${JSON.stringify(features)}

PERSONA: ${persona.name}
- Demographics: ${JSON.stringify(persona.demographics)}
- Psychographics: ${JSON.stringify(persona.psychographics)}
- Shopping Preferences: ${JSON.stringify(persona.shopping_preferences)}
- Product Preferences: ${JSON.stringify(persona.product_preferences)}
- Price Behavior: ${JSON.stringify(persona.price_behavior)}

Calculate:
1. Like probability (0-100%) - how likely this persona would like/swipe right on this product
2. Optimal price band (floor, sweet spot, ceiling) for this persona
3. Key match factors driving the score
4. A short explanation`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [{
        type: "function",
        function: {
          name: "score_match",
          description: "Return the persona-product match score",
          parameters: {
            type: "object",
            properties: {
              likeProbability: { type: "number", minimum: 0, maximum: 100 },
              confidenceScore: { type: "number", minimum: 0, maximum: 100 },
              priceFloor: { type: "number" },
              priceSweetSpot: { type: "number" },
              priceCeiling: { type: "number" },
              priceElasticity: { type: "number", minimum: -1, maximum: 1 },
              explanation: { type: "string" },
              matchFactors: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    factor: { type: "string" },
                    weight: { type: "number" },
                    contribution: { type: "string" }
                  }
                }
              }
            },
            required: ["likeProbability", "confidenceScore", "priceFloor", "priceSweetSpot", "priceCeiling", "explanation", "matchFactors"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "score_match" } }
    }),
  });

  if (!response.ok) {
    console.error("AI scoring failed:", await response.text());
    // Return default score
    return {
      personaId: persona.id,
      personaName: persona.name,
      likeProbability: 50,
      confidenceScore: 30,
      priceFloor: product.price * 0.8,
      priceSweetSpot: product.price,
      priceCeiling: product.price * 1.2,
      priceElasticity: -0.5,
      explanation: "Unable to generate detailed analysis. Default scoring applied.",
      matchFactors: []
    };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (toolCall?.function?.arguments) {
    const result = JSON.parse(toolCall.function.arguments);
    return {
      personaId: persona.id,
      personaName: persona.name,
      ...result
    };
  }

  throw new Error("Failed to score product");
}
