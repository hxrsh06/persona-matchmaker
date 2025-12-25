import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Base persona templates from Lovable's spec
const BASE_PERSONAS = [
  {
    name: "Comfort-First Millennial",
    emoji: "💼",
    baseDescription: "Busy professional prioritizing comfort and practicality in daily wear",
    demographics: {
      ageRange: "22-28",
      incomeRange: "25000-50000",
      cityTier: "Metro",
      relationship: "single/dating",
      household: "alone/roommates"
    },
    psychographics: {
      coreValues: ["comfort", "practicality", "quality"],
      lifestyle: "9-6 corporate with gym 3x/week",
      fashionOrientation: "basics-only",
      modestySensitivity: "medium"
    },
    shoppingPreferences: {
      channel: ["online"],
      triggers: ["new arrivals", "influencer content"],
      basketBehavior: "single items",
      returnTolerance: "medium"
    },
    productPreferences: {
      categories: ["bralette", "sports bra", "seamless", "t-shirt bra"],
      fabricPreferences: ["cotton", "modal", "microfiber"],
      colorPreferences: ["nudes", "pastels", "neutrals"],
      coveragePreference: "medium",
      supportPreference: "low-medium",
      wirePreference: "non-wired"
    },
    priceBehavior: {
      braRange: [699, 999],
      pantyRange: [199, 399],
      setRange: [899, 1399],
      elasticity: -0.4,
      discountDependence: "medium",
      ltvOrientation: "frequent-low"
    }
  },
  {
    name: "Trend-Driven Gen Z",
    emoji: "✨",
    baseDescription: "Fashion-forward college student, highly influenced by social media trends",
    demographics: {
      ageRange: "18-22",
      incomeRange: "10000-25000",
      cityTier: "Metro/Tier1",
      relationship: "single",
      household: "hostel/family"
    },
    psychographics: {
      coreValues: ["self-expression", "trends", "affordability"],
      lifestyle: "College, high social media usage, weekend outings",
      fashionOrientation: "fashion-first",
      modestySensitivity: "low"
    },
    shoppingPreferences: {
      channel: ["online", "instagram-shops"],
      triggers: ["influencer content", "limited drops", "discounts"],
      basketBehavior: "impulse purchases",
      returnTolerance: "high"
    },
    productPreferences: {
      categories: ["bralette", "lace", "sets", "fun prints"],
      fabricPreferences: ["lace", "polyamide", "mesh"],
      colorPreferences: ["bold", "prints", "black"],
      coveragePreference: "low",
      supportPreference: "none-light",
      wirePreference: "non-wired"
    },
    priceBehavior: {
      braRange: [399, 699],
      pantyRange: [149, 299],
      setRange: [599, 999],
      elasticity: -0.7,
      discountDependence: "high",
      ltvOrientation: "occasional-high"
    }
  },
  {
    name: "Young Mom (WFH)",
    emoji: "👶",
    baseDescription: "Work-from-home mom prioritizing comfort, durability, and easy maintenance",
    demographics: {
      ageRange: "28-35",
      incomeRange: "30000-60000",
      cityTier: "Metro/Tier1",
      relationship: "married",
      household: "nuclear family with kids"
    },
    psychographics: {
      coreValues: ["comfort", "durability", "value"],
      lifestyle: "WFH, mom duties, limited personal time",
      fashionOrientation: "functional-first",
      modestySensitivity: "high"
    },
    shoppingPreferences: {
      channel: ["online"],
      triggers: ["reviews", "word-of-mouth", "value packs"],
      basketBehavior: "bulk/multi-buy",
      returnTolerance: "low"
    },
    productPreferences: {
      categories: ["full-coverage bra", "nursing bra", "nightwear", "cotton panties"],
      fabricPreferences: ["cotton", "modal", "breathable"],
      colorPreferences: ["nudes", "pastels", "neutrals"],
      coveragePreference: "high",
      supportPreference: "high",
      wirePreference: "both"
    },
    priceBehavior: {
      braRange: [599, 999],
      pantyRange: [149, 349],
      setRange: [799, 1499],
      elasticity: -0.3,
      discountDependence: "low",
      ltvOrientation: "frequent-low"
    }
  },
  {
    name: "Premium Comfort Seeker",
    emoji: "👑",
    baseDescription: "Established professional investing in quality pieces for everyday luxury",
    demographics: {
      ageRange: "35-44",
      incomeRange: "50000-100000",
      cityTier: "Metro",
      relationship: "married/committed",
      household: "DINK/small family"
    },
    psychographics: {
      coreValues: ["quality", "comfort", "self-care"],
      lifestyle: "Corporate, health-conscious, occasional luxury",
      fashionOrientation: "premium-basics",
      modestySensitivity: "medium"
    },
    shoppingPreferences: {
      channel: ["online", "brand websites", "occasional retail"],
      triggers: ["quality reviews", "brand reputation", "new launches"],
      basketBehavior: "considered purchases",
      returnTolerance: "medium"
    },
    productPreferences: {
      categories: ["push-up", "padded", "premium cotton", "shapewear"],
      fabricPreferences: ["premium cotton", "modal", "silk blend"],
      colorPreferences: ["nudes", "pastels", "classic black"],
      coveragePreference: "medium-high",
      supportPreference: "high",
      wirePreference: "both"
    },
    priceBehavior: {
      braRange: [999, 1799],
      pantyRange: [299, 599],
      setRange: [1299, 2499],
      elasticity: -0.2,
      discountDependence: "low",
      ltvOrientation: "infrequent-high"
    }
  },
  {
    name: "Value-Conscious Shopper",
    emoji: "💰",
    baseDescription: "Budget-aware shopper seeking best value without compromising basics",
    demographics: {
      ageRange: "20-30",
      incomeRange: "15000-35000",
      cityTier: "Tier2/Tier3",
      relationship: "varies",
      household: "family"
    },
    psychographics: {
      coreValues: ["value", "practicality", "durability"],
      lifestyle: "Student/early career, budget-focused",
      fashionOrientation: "basics-only",
      modestySensitivity: "high"
    },
    shoppingPreferences: {
      channel: ["online", "local stores"],
      triggers: ["discounts", "deals", "value packs"],
      basketBehavior: "planned purchases",
      returnTolerance: "high"
    },
    productPreferences: {
      categories: ["t-shirt bra", "basic panty", "cotton sets"],
      fabricPreferences: ["cotton", "polyamide"],
      colorPreferences: ["nudes", "pastels", "white"],
      coveragePreference: "medium-high",
      supportPreference: "medium",
      wirePreference: "non-wired"
    },
    priceBehavior: {
      braRange: [299, 599],
      pantyRange: [99, 249],
      setRange: [399, 799],
      elasticity: -0.8,
      discountDependence: "high",
      ltvOrientation: "frequent-low"
    }
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, customizeForBrand } = await req.json();
    
    if (!tenantId) {
      throw new Error("Tenant ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Generating personas for tenant ${tenantId}`);

    const generatedPersonas = [];

    for (const basePersona of BASE_PERSONAS) {
      // Use AI to expand to 100+ attributes
      const expandedAttributes = await expandPersonaAttributes(
        basePersona, 
        customizeForBrand,
        lovableApiKey
      );

      // Build the full persona object
      const fullPersona = {
        tenant_id: tenantId,
        name: basePersona.name,
        description: basePersona.baseDescription,
        avatar_emoji: basePersona.emoji,
        demographics: {
          ...basePersona.demographics,
          ...expandedAttributes.demographics
        },
        psychographics: {
          ...basePersona.psychographics,
          ...expandedAttributes.psychographics
        },
        shopping_preferences: {
          ...basePersona.shoppingPreferences,
          ...expandedAttributes.shoppingPreferences
        },
        product_preferences: {
          ...basePersona.productPreferences,
          ...expandedAttributes.productPreferences
        },
        price_behavior: {
          ...basePersona.priceBehavior,
          ...expandedAttributes.priceBehavior
        },
        attribute_vector: expandedAttributes.attributeVector,
        is_active: true
      };

      // Insert into database
      const { data: persona, error } = await supabase
        .from("personas")
        .insert(fullPersona)
        .select()
        .single();

      if (error) {
        console.error(`Failed to create persona ${basePersona.name}:`, error);
        continue;
      }

      generatedPersonas.push(persona);
      console.log(`Created persona: ${basePersona.name} with ${expandedAttributes.attributeVector.length} attributes`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        tenantId,
        personasCreated: generatedPersonas.length,
        personas: generatedPersonas.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          attributeCount: p.attribute_vector?.length || 0
        }))
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Persona generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function expandPersonaAttributes(
  basePersona: typeof BASE_PERSONAS[0],
  brandContext: string | undefined,
  apiKey: string
): Promise<{
  demographics: Record<string, any>;
  psychographics: Record<string, any>;
  shoppingPreferences: Record<string, any>;
  productPreferences: Record<string, any>;
  priceBehavior: Record<string, any>;
  attributeVector: { name: string; value: number; category: string }[];
}> {
  
  const systemPrompt = `You are an expert consumer behavior researcher creating detailed customer personas for an Indian lingerie/innerwear brand.
Generate rich, realistic attributes based on VALS framework and AIO (Activities, Interests, Opinions) methodology.
Each persona should have 100-150 normalized attributes (0-1 scale) for ML compatibility.`;

  const userPrompt = `Expand this base persona into 100+ detailed attributes:

BASE PERSONA: ${basePersona.name}
Description: ${basePersona.baseDescription}
Demographics: ${JSON.stringify(basePersona.demographics)}
Psychographics: ${JSON.stringify(basePersona.psychographics)}
Shopping: ${JSON.stringify(basePersona.shoppingPreferences)}
Products: ${JSON.stringify(basePersona.productPreferences)}
Pricing: ${JSON.stringify(basePersona.priceBehavior)}

${brandContext ? `BRAND CONTEXT: ${brandContext}` : ''}

Generate expanded attributes across these categories:
1. DEMOGRAPHICS (20+ attributes): age distribution, income percentiles, education, occupation type, urban/rural split, family composition, etc.
2. PSYCHOGRAPHICS (25+ attributes): VALS segments, personality traits, values hierarchy, lifestyle activities, media consumption, social influence susceptibility
3. SHOPPING PREFERENCES (20+ attributes): channel usage scores, price sensitivity, brand loyalty, discovery methods, purchase frequency, cart abandonment factors
4. PRODUCT PREFERENCES (25+ attributes): category affinity scores, fabric preferences, color preferences, style preferences, size inclusivity needs, feature importance weights
5. PRICE BEHAVIOR (15+ attributes): elasticity by category, discount response curves, willingness to pay premium for features, seasonal sensitivity

Return normalized attribute vectors (0-1 scale) for ML scoring compatibility.`;

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
          name: "expand_persona",
          description: "Return expanded persona attributes",
          parameters: {
            type: "object",
            properties: {
              demographics: {
                type: "object",
                description: "Expanded demographic attributes"
              },
              psychographics: {
                type: "object",
                description: "Expanded psychographic attributes"
              },
              shoppingPreferences: {
                type: "object",
                description: "Expanded shopping behavior attributes"
              },
              productPreferences: {
                type: "object",
                description: "Expanded product taste attributes"
              },
              priceBehavior: {
                type: "object",
                description: "Expanded price sensitivity attributes"
              },
              attributeVector: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    value: { type: "number", minimum: 0, maximum: 1 },
                    category: { type: "string" }
                  }
                },
                description: "Normalized attribute vector for ML (100+ items)"
              }
            },
            required: ["demographics", "psychographics", "shoppingPreferences", "productPreferences", "priceBehavior", "attributeVector"]
          }
        }
      }],
      tool_choice: { type: "function", function: { name: "expand_persona" } }
    }),
  });

  if (!response.ok) {
    console.error("AI expansion failed:", await response.text());
    // Return minimal expansion
    return {
      demographics: {},
      psychographics: {},
      shoppingPreferences: {},
      productPreferences: {},
      priceBehavior: {},
      attributeVector: generateDefaultAttributeVector(basePersona)
    };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (toolCall?.function?.arguments) {
    return JSON.parse(toolCall.function.arguments);
  }

  return {
    demographics: {},
    psychographics: {},
    shoppingPreferences: {},
    productPreferences: {},
    priceBehavior: {},
    attributeVector: generateDefaultAttributeVector(basePersona)
  };
}

function generateDefaultAttributeVector(basePersona: typeof BASE_PERSONAS[0]) {
  // Generate default normalized attributes based on base persona
  const vector: { name: string; value: number; category: string }[] = [];
  
  // Demographics attributes
  const ageMin = parseInt(basePersona.demographics.ageRange.split("-")[0]);
  vector.push({ name: "age_18_24", value: ageMin <= 22 ? 0.8 : 0.2, category: "demographics" });
  vector.push({ name: "age_25_34", value: ageMin >= 25 && ageMin < 35 ? 0.8 : 0.2, category: "demographics" });
  vector.push({ name: "age_35_44", value: ageMin >= 35 ? 0.8 : 0.2, category: "demographics" });
  vector.push({ name: "metro_city", value: basePersona.demographics.cityTier.includes("Metro") ? 0.9 : 0.3, category: "demographics" });
  
  // Price sensitivity
  vector.push({ name: "price_sensitive", value: Math.abs(basePersona.priceBehavior.elasticity), category: "price" });
  vector.push({ name: "discount_driven", value: basePersona.priceBehavior.discountDependence === "high" ? 0.9 : 0.3, category: "price" });
  
  // Product preferences
  vector.push({ name: "prefers_cotton", value: basePersona.productPreferences.fabricPreferences.includes("cotton") ? 0.8 : 0.3, category: "product" });
  vector.push({ name: "prefers_lace", value: basePersona.productPreferences.fabricPreferences.includes("lace") ? 0.8 : 0.2, category: "product" });
  vector.push({ name: "prefers_wireless", value: basePersona.productPreferences.wirePreference === "non-wired" ? 0.9 : 0.4, category: "product" });
  
  // Add more default attributes to reach ~50
  for (let i = 0; i < 40; i++) {
    vector.push({
      name: `attribute_${i}`,
      value: Math.random() * 0.6 + 0.2,
      category: ["demographics", "psychographics", "shopping", "product", "price"][i % 5]
    });
  }
  
  return vector;
}
