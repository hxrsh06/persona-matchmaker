import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, imageUrl } = await req.json();
    
    if (!productId || !imageUrl) {
      throw new Error("Product ID and image URL are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Extracting features from image for product ${productId}`);

    // Use Gemini Vision for image analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert fashion product analyst specializing in casual and formal apparel including t-shirts, shirts, jeans, trousers, shorts, joggers, hoodies, and polo shirts.
Analyze product images and extract visual features with high precision.
Focus on: color, pattern, fabric texture, fit/silhouette, style category, neckline, sleeve design, and overall aesthetic.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this apparel product image and extract visual features.
Return structured data about:
1. Primary color and color family
2. Pattern type (solid, striped, checked, graphic, etc.)
3. Fit type (slim, regular, relaxed, oversized)
4. Style classification (basic, sporty, smart-casual, formal, streetwear, trendy)
5. Visible fabric types
6. Neckline and sleeve details (for tops)
7. Overall quality perception (budget, mid-range, premium, luxury)
8. Target occasion (casual, work, weekend, sports, party)`
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "extract_visual_features",
            description: "Extract visual features from apparel product image",
            parameters: {
              type: "object",
              properties: {
                primaryColor: { type: "string" },
                colorFamily: { 
                  type: "string", 
                  enum: ["neutral", "earth", "pastel", "bold", "dark", "print", "white", "black", "blue", "grey", "multicolor"] 
                },
                patternType: { 
                  type: "string", 
                  enum: ["solid", "striped", "checked", "graphic", "floral", "geometric", "abstract", "camo", "tie-dye"] 
                },
                fitType: { 
                  type: "string", 
                  enum: ["slim", "regular", "relaxed", "oversized", "athletic", "tailored"] 
                },
                styleCategory: { 
                  type: "string", 
                  enum: ["basic", "sporty", "smart-casual", "formal", "streetwear", "trendy", "classic", "athleisure"] 
                },
                visibleFabrics: { 
                  type: "array", 
                  items: { type: "string" } 
                },
                hasStretch: { type: "boolean" },
                hasTexture: { type: "boolean" },
                isPrinted: { type: "boolean" },
                isDistressed: { type: "boolean" },
                necklineStyle: { 
                  type: "string", 
                  enum: ["crew", "v-neck", "collar", "polo", "henley", "mock", "hoodie", "scoop", "boat", "none"] 
                },
                sleeveStyle: { 
                  type: "string", 
                  enum: ["sleeveless", "short", "half", "three-quarter", "full", "rolled", "raglan", "none"] 
                },
                qualityPerception: { 
                  type: "string", 
                  enum: ["budget", "mid-range", "premium", "luxury"] 
                },
                targetOccasions: { 
                  type: "array", 
                  items: { type: "string" } 
                },
                aestheticTags: { 
                  type: "array", 
                  items: { type: "string" } 
                },
                confidenceScore: { type: "number", minimum: 0, maximum: 100 }
              },
              required: [
                "primaryColor", "colorFamily", "patternType", "fitType", 
                "styleCategory", "visibleFabrics", "qualityPerception", "confidenceScore"
              ]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "extract_visual_features" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vision API error:", errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Vision API failed: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No features extracted from image");
    }

    const visualFeatures = JSON.parse(toolCall.function.arguments);

    // Update product with visual features
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("extracted_features")
      .eq("id", productId)
      .single();

    if (productError) {
      throw new Error(`Product not found: ${productError.message}`);
    }

    // Merge visual features with existing features
    const mergedFeatures = {
      ...(product.extracted_features || {}),
      visual: visualFeatures,
      // Override some text-based features with visual analysis
      color: visualFeatures.primaryColor,
      colorFamily: visualFeatures.colorFamily,
      patternType: visualFeatures.patternType,
      fit: visualFeatures.fitType,
      style: visualFeatures.styleCategory,
      hasStretch: visualFeatures.hasStretch,
      isPrinted: visualFeatures.isPrinted,
    };

    await supabase
      .from("products")
      .update({ 
        extracted_features: mergedFeatures,
        status: "analyzed"
      })
      .eq("id", productId);

    console.log(`Visual features extracted for product ${productId}:`, visualFeatures);

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        visualFeatures,
        mergedFeatures
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Image extraction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
