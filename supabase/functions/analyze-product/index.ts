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
  coverage: string;
  support: string;
  strapType: string;
  padding: string;
  occasion: string[];
  style: string;
  priceSegment: string;
  hasLace: boolean;
  hasWire: boolean;
  isSeamless: boolean;
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
    const { productId, tenantId } = await req.json();
    
    if (!productId || !tenantId) {
      throw new Error("Product ID and Tenant ID are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

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
      action_type: "single_analysis",
      input_data: { productName: product.name, personaCount: personas.length },
      results_summary: {
        averageLikeProbability: scores.reduce((a, b) => a + b.likeProbability, 0) / scores.length,
        highestMatch: scores.reduce((a, b) => a.likeProbability > b.likeProbability ? a : b).personaName,
      }
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
  const systemPrompt = `You are an expert fashion product analyst specializing in lingerie, innerwear, and intimate apparel. 
Analyze the product and extract structured features. Be precise and use standardized terminology.`;

  const userPrompt = `Analyze this product and extract features:

Product Name: ${product.name}
Brand: ${product.brand || "Unknown"}
Description: ${product.description || "No description"}
Category: ${product.category}
Subcategory: ${product.subcategory || ""}
Price: ₹${product.price}
Tags: ${product.tags?.join(", ") || "None"}

Extract and return structured features.`;

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
          description: "Extract product features",
          parameters: {
            type: "object",
            properties: {
              category: { type: "string", enum: ["bra", "panty", "sportswear", "nightwear", "camisole", "shapewear", "set"] },
              subcategory: { type: "string" },
              fabric: { type: "array", items: { type: "string" } },
              color: { type: "string" },
              colorFamily: { type: "string", enum: ["nude", "pastel", "bold", "dark", "print", "white", "black"] },
              coverage: { type: "string", enum: ["low", "medium", "high", "full"] },
              support: { type: "string", enum: ["none", "light", "medium", "high", "maximum"] },
              strapType: { type: "string", enum: ["regular", "multiway", "strapless", "racerback", "halter", "none"] },
              padding: { type: "string", enum: ["none", "light", "moderate", "push-up", "heavy"] },
              occasion: { type: "array", items: { type: "string" } },
              style: { type: "string", enum: ["basic", "sporty", "romantic", "sexy", "practical", "trendy"] },
              priceSegment: { type: "string", enum: ["budget", "mid-range", "premium", "luxury"] },
              hasLace: { type: "boolean" },
              hasWire: { type: "boolean" },
              isSeamless: { type: "boolean" },
              patternType: { type: "string", enum: ["solid", "print", "lace", "mesh", "stripes", "floral"] }
            },
            required: ["category", "fabric", "color", "colorFamily", "coverage", "support", "style", "priceSegment"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "extract_features" } }
    }),
  });

  if (!response.ok) {
    console.error("AI extraction failed:", await response.text());
    // Return default features
    return {
      category: product.category || "bra",
      fabric: ["cotton"],
      color: "neutral",
      colorFamily: "nude",
      coverage: "medium",
      support: "medium",
      strapType: "regular",
      padding: "light",
      occasion: ["daily"],
      style: "basic",
      priceSegment: product.price < 500 ? "budget" : product.price < 1000 ? "mid-range" : "premium",
      hasLace: false,
      hasWire: false,
      isSeamless: false,
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
  
  const systemPrompt = `You are an expert consumer behavior analyst. Score how well a product matches a consumer persona.
Consider demographics, psychographics, shopping preferences, and price sensitivity.
Be precise with probability scores and provide actionable insights.`;

  const userPrompt = `Score this product against the persona:

PRODUCT:
- Name: ${product.name}
- Category: ${features.category}
- Style: ${features.style}
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
