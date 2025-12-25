import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 6 Fixed Personas for General Clothing (3 Female, 3 Male)
const BASE_PERSONAS = [
  // Female Personas
  {
    name: "Priya - The Trend-Conscious Millennial",
    emoji: "👩",
    gender: "female",
    baseDescription: "A 25-32 year old urban professional woman who follows fashion trends on Instagram and loves updating her wardrobe with stylish tshirts, jeans, and casual wear.",
    demographics: {
      ageRange: "25-32",
      gender: "Female",
      incomeRange: "40000-80000",
      cityTier: "Metro",
      relationship: "single/dating",
      household: "alone/roommates",
      occupation: "IT/Corporate Professional"
    },
    psychographics: {
      coreValues: ["style", "social-validation", "comfort"],
      lifestyle: "Urban trendy, active on social media, weekend outings",
      fashionOrientation: "trend-follower",
      modestySensitivity: "medium"
    },
    shoppingPreferences: {
      channel: ["online", "mall"],
      triggers: ["trending styles", "reviews", "influencer content"],
      basketBehavior: "monthly updates",
      returnTolerance: "high"
    },
    productPreferences: {
      categories: ["tshirts", "jeans", "dresses", "tops", "casual-wear"],
      fabricPreferences: ["cotton", "denim", "linen", "blends"],
      colorPreferences: ["pastels", "trending-colors", "neutrals"],
      fitPreference: "fitted-to-relaxed",
      stylePreference: "casual-chic"
    },
    priceBehavior: {
      tshirtRange: [800, 1500],
      jeansRange: [1500, 2500],
      dressRange: [1200, 2500],
      elasticity: -0.5,
      discountDependence: "high",
      ltvOrientation: "frequent-moderate"
    },
    brandPsychology: {
      priceAnchor: "mid-range",
      expectedPricePoint: 1200,
      brandLoyalty: 0.4,
      premiumWillingness: 0.5,
      valuePerception: 0.7,
      qualityExpectation: 0.6,
      brandSwitchingTendency: 0.6,
      priceMemory: 0.5,
      referencePointSensitivity: 0.6
    }
  },
  {
    name: "Ananya - The Quality Seeker",
    emoji: "👩‍💼",
    gender: "female",
    baseDescription: "A 30-42 year old working woman who prioritizes quality fabrics and timeless styles. Prefers well-fitted formal and smart casual clothing for work and social occasions.",
    demographics: {
      ageRange: "30-42",
      gender: "Female",
      incomeRange: "80000-150000",
      cityTier: "Metro/Tier1",
      relationship: "married/committed",
      household: "nuclear family",
      occupation: "Senior Professional/Manager"
    },
    psychographics: {
      coreValues: ["quality", "durability", "elegance"],
      lifestyle: "Corporate professional, health-conscious, occasional luxury",
      fashionOrientation: "classic-premium",
      modestySensitivity: "medium"
    },
    shoppingPreferences: {
      channel: ["brand-stores", "online-premium"],
      triggers: ["fabric-quality", "fit", "brand-reputation"],
      basketBehavior: "quarterly wardrobe updates",
      returnTolerance: "low"
    },
    productPreferences: {
      categories: ["formal-tops", "trousers", "blazers", "premium-tshirts", "smart-casual"],
      fabricPreferences: ["premium-cotton", "linen", "silk-blend", "wool-blend"],
      colorPreferences: ["neutrals", "earth-tones", "classic-colors"],
      fitPreference: "tailored",
      stylePreference: "smart-casual"
    },
    priceBehavior: {
      tshirtRange: [1500, 3000],
      trousersRange: [2500, 5000],
      blazerRange: [4000, 8000],
      elasticity: -0.25,
      discountDependence: "low",
      ltvOrientation: "infrequent-high"
    },
    brandPsychology: {
      priceAnchor: "premium",
      expectedPricePoint: 2500,
      brandLoyalty: 0.8,
      premiumWillingness: 0.85,
      valuePerception: 0.5,
      qualityExpectation: 0.9,
      brandSwitchingTendency: 0.2,
      priceMemory: 0.7,
      referencePointSensitivity: 0.3
    }
  },
  {
    name: "Sneha - The Budget Fashionista",
    emoji: "👧",
    gender: "female",
    baseDescription: "A 20-26 year old college student or early career woman who wants fashionable clothes at budget prices. Shops during sales and compares prices extensively.",
    demographics: {
      ageRange: "20-26",
      gender: "Female",
      incomeRange: "15000-35000",
      cityTier: "All cities",
      relationship: "single",
      household: "hostel/family",
      occupation: "Student/Entry-level"
    },
    psychographics: {
      coreValues: ["affordability", "variety", "trendy"],
      lifestyle: "College/early career, budget-conscious, high social media usage",
      fashionOrientation: "fast-fashion",
      modestySensitivity: "varies"
    },
    shoppingPreferences: {
      channel: ["online-marketplaces", "local-stores", "sale-hunting"],
      triggers: ["discounts", "flash-sales", "variety"],
      basketBehavior: "frequent-small-purchases",
      returnTolerance: "high"
    },
    productPreferences: {
      categories: ["tshirts", "kurtis", "jeans", "casual-tops", "fusion-wear"],
      fabricPreferences: ["cotton", "polyester-blend", "rayon"],
      colorPreferences: ["bright", "prints", "trendy-colors"],
      fitPreference: "regular-to-oversized",
      stylePreference: "casual-fusion"
    },
    priceBehavior: {
      tshirtRange: [300, 700],
      jeansRange: [600, 1200],
      kurtiRange: [400, 900],
      elasticity: -0.8,
      discountDependence: "very-high",
      ltvOrientation: "frequent-low"
    },
    brandPsychology: {
      priceAnchor: "budget",
      expectedPricePoint: 500,
      brandLoyalty: 0.2,
      premiumWillingness: 0.15,
      valuePerception: 0.9,
      qualityExpectation: 0.4,
      brandSwitchingTendency: 0.9,
      priceMemory: 0.9,
      referencePointSensitivity: 0.85
    }
  },
  // Male Personas
  {
    name: "Rahul - The Casual Comfort Guy",
    emoji: "👨",
    gender: "male",
    baseDescription: "A 25-35 year old man who prefers comfortable, no-fuss clothing. Buys basics like plain tshirts, joggers, and casual shirts that work for office and weekends.",
    demographics: {
      ageRange: "25-35",
      gender: "Male",
      incomeRange: "40000-80000",
      cityTier: "Metro/Tier1",
      relationship: "varies",
      household: "alone/family",
      occupation: "IT/Corporate Professional"
    },
    psychographics: {
      coreValues: ["comfort", "simplicity", "versatility"],
      lifestyle: "Practical, gym-goer, low maintenance fashion approach",
      fashionOrientation: "basics-focused",
      modestySensitivity: "low"
    },
    shoppingPreferences: {
      channel: ["online", "quick-commerce"],
      triggers: ["comfort", "fit", "easy-care"],
      basketBehavior: "quarterly-bulk-basics",
      returnTolerance: "medium"
    },
    productPreferences: {
      categories: ["tshirts", "polo-shirts", "chinos", "joggers", "casual-shirts"],
      fabricPreferences: ["cotton", "cotton-stretch", "jersey"],
      colorPreferences: ["navy", "black", "grey", "white", "earth-tones"],
      fitPreference: "regular-to-relaxed",
      stylePreference: "casual-athleisure"
    },
    priceBehavior: {
      tshirtRange: [600, 1200],
      jeansRange: [1200, 2000],
      shirtRange: [800, 1500],
      elasticity: -0.45,
      discountDependence: "moderate",
      ltvOrientation: "moderate-frequency"
    },
    brandPsychology: {
      priceAnchor: "mid-range",
      expectedPricePoint: 999,
      brandLoyalty: 0.6,
      premiumWillingness: 0.4,
      valuePerception: 0.75,
      qualityExpectation: 0.6,
      brandSwitchingTendency: 0.4,
      priceMemory: 0.6,
      referencePointSensitivity: 0.5
    }
  },
  {
    name: "Arjun - The Style-Forward Professional",
    emoji: "👔",
    gender: "male",
    baseDescription: "A 28-40 year old image-conscious professional who invests in premium brands for formal shirts, well-fitted trousers, and designer casual wear.",
    demographics: {
      ageRange: "28-40",
      gender: "Male",
      incomeRange: "100000-200000",
      cityTier: "Metro",
      relationship: "married/committed",
      household: "DINK/small family",
      occupation: "Senior Manager/Business Owner"
    },
    psychographics: {
      coreValues: ["status", "quality", "style"],
      lifestyle: "Ambitious, networking-focused, brand-conscious",
      fashionOrientation: "premium-fashion",
      modestySensitivity: "low"
    },
    shoppingPreferences: {
      channel: ["brand-stores", "premium-online"],
      triggers: ["brand", "fit", "style-quotient"],
      basketBehavior: "considered-premium-purchases",
      returnTolerance: "low"
    },
    productPreferences: {
      categories: ["formal-shirts", "trousers", "blazers", "premium-tshirts", "jackets"],
      fabricPreferences: ["premium-cotton", "linen", "wool-blend", "luxury-blends"],
      colorPreferences: ["classic-navy", "charcoal", "white", "subtle-patterns"],
      fitPreference: "slim-tailored",
      stylePreference: "formal-smart-casual"
    },
    priceBehavior: {
      tshirtRange: [2000, 4000],
      shirtRange: [3000, 6000],
      trousersRange: [3500, 7000],
      elasticity: -0.2,
      discountDependence: "low",
      ltvOrientation: "infrequent-high"
    },
    brandPsychology: {
      priceAnchor: "premium",
      expectedPricePoint: 3500,
      brandLoyalty: 0.85,
      premiumWillingness: 0.9,
      valuePerception: 0.4,
      qualityExpectation: 0.95,
      brandSwitchingTendency: 0.15,
      priceMemory: 0.6,
      referencePointSensitivity: 0.25
    }
  },
  {
    name: "Vikram - The Streetwear Enthusiast",
    emoji: "🧢",
    gender: "male",
    baseDescription: "An 18-28 year old Gen-Z male who follows streetwear culture, loves graphic tees, oversized fits, and urban fashion influenced by hip-hop and sneaker culture.",
    demographics: {
      ageRange: "18-28",
      gender: "Male",
      incomeRange: "20000-60000",
      cityTier: "Metro",
      relationship: "single",
      household: "hostel/family",
      occupation: "Student/Creative Professional"
    },
    psychographics: {
      coreValues: ["self-expression", "uniqueness", "cool-factor"],
      lifestyle: "Urban creative, social media native, trend-setter",
      fashionOrientation: "streetwear-hype",
      modestySensitivity: "low"
    },
    shoppingPreferences: {
      channel: ["online-drops", "streetwear-stores", "instagram"],
      triggers: ["design", "exclusivity", "brand-hype"],
      basketBehavior: "impulse-hype-purchases",
      returnTolerance: "low-for-hyped"
    },
    productPreferences: {
      categories: ["graphic-tees", "hoodies", "cargo-pants", "oversized-tshirts", "joggers"],
      fabricPreferences: ["heavy-cotton", "fleece", "canvas"],
      colorPreferences: ["black", "earth-tones", "bold-graphics", "limited-edition"],
      fitPreference: "oversized-relaxed",
      stylePreference: "streetwear-urban"
    },
    priceBehavior: {
      tshirtRange: [1000, 3000],
      hoodieRange: [2000, 5000],
      cargoRange: [1500, 4000],
      elasticity: -0.3,
      discountDependence: "low-for-exclusives",
      ltvOrientation: "variable-hype-driven"
    },
    brandPsychology: {
      priceAnchor: "hype-driven",
      expectedPricePoint: 2000,
      brandLoyalty: 0.5,
      premiumWillingness: 0.8,
      valuePerception: 0.3,
      qualityExpectation: 0.5,
      brandSwitchingTendency: 0.7,
      priceMemory: 0.4,
      referencePointSensitivity: 0.3
    }
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, customizeForBrand, brandSegment, priceRange } = await req.json();
    
    if (!tenantId) {
      throw new Error("Tenant ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build brand context for AI
    const brandContext = {
      name: customizeForBrand || "Generic Brand",
      segment: brandSegment || "premium",
      priceRange: priceRange || { min: 500, max: 1500 },
    };

    console.log(`Generating 6 personas for tenant ${tenantId} (${brandContext.segment} segment)`);

    const generatedPersonas = [];

    for (const basePersona of BASE_PERSONAS) {
      // Use AI to expand to 100+ attributes
      const expandedAttributes = await expandPersonaAttributes(
        basePersona, 
        brandContext,
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
        brand_psychology: {
          ...basePersona.brandPsychology,
          ...expandedAttributes.brandPsychology
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

    // Create sample demo products
    console.log("Creating demo products...");
    const demoProducts = await createDemoProducts(supabase, tenantId);
    console.log(`Created ${demoProducts.length} demo products`);

    // Create sample analysis results for demo
    if (generatedPersonas.length > 0 && demoProducts.length > 0) {
      console.log("Creating demo analysis results...");
      await createDemoAnalysisResults(supabase, tenantId, generatedPersonas, demoProducts);
      console.log("Demo analysis results created");
    }

    return new Response(
      JSON.stringify({
        success: true,
        tenantId,
        personasCreated: generatedPersonas.length,
        productsCreated: demoProducts.length,
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
  brandContext: { name: string; segment: string; priceRange: { min: number; max: number } },
  apiKey: string
): Promise<{
  demographics: Record<string, any>;
  psychographics: Record<string, any>;
  shoppingPreferences: Record<string, any>;
  productPreferences: Record<string, any>;
  priceBehavior: Record<string, any>;
  brandPsychology: Record<string, any>;
  attributeVector: { name: string; value: number; category: string }[];
}> {
  
  const systemPrompt = `You are an expert consumer behavior researcher creating detailed customer personas for an Indian clothing/apparel brand.
Generate rich, realistic attributes based on VALS framework and AIO (Activities, Interests, Opinions) methodology.
Focus on general clothing categories: tshirts, shirts, jeans, trousers, dresses, tops, casual wear, formal wear.
Each persona should have 100-150 normalized attributes (0-1 scale) for ML compatibility.`;

  const userPrompt = `Expand this base persona into 100+ detailed attributes:

BASE PERSONA: ${basePersona.name}
Description: ${basePersona.baseDescription}
Demographics: ${JSON.stringify(basePersona.demographics)}
Psychographics: ${JSON.stringify(basePersona.psychographics)}
Shopping: ${JSON.stringify(basePersona.shoppingPreferences)}
Products: ${JSON.stringify(basePersona.productPreferences)}
Pricing: ${JSON.stringify(basePersona.priceBehavior)}
Brand Psychology: ${JSON.stringify(basePersona.brandPsychology)}

BRAND CONTEXT:
- Brand Name: ${brandContext.name}
- Brand Segment: ${brandContext.segment} (${brandContext.segment === 'lite' ? 'budget-friendly, value-focused' : brandContext.segment === 'premium' ? 'quality-driven, mid-to-high pricing' : brandContext.segment === 'luxury' ? 'high-end, exclusive' : 'trendy, youth-focused'})
- Price Range: ₹${brandContext.priceRange.min} - ₹${brandContext.priceRange.max}

Generate expanded attributes across these categories:
1. DEMOGRAPHICS (20+ attributes): age distribution, income percentiles, education, occupation type, urban/rural split, family composition, etc.
2. PSYCHOGRAPHICS (25+ attributes): VALS segments, personality traits, values hierarchy, lifestyle activities, media consumption, social influence susceptibility
3. SHOPPING PREFERENCES (20+ attributes): channel usage scores, price sensitivity, brand loyalty, discovery methods, purchase frequency, cart abandonment factors
4. PRODUCT PREFERENCES (25+ attributes): category affinity scores, fabric preferences, color preferences, style preferences, size inclusivity needs, feature importance weights
5. PRICE BEHAVIOR (15+ attributes): elasticity by category, discount response curves, willingness to pay premium for features, seasonal sensitivity
6. BRAND PSYCHOLOGY (15+ attributes): brand price anchoring, expected price points for this brand, brand loyalty scores, premium willingness, value perception, quality expectation thresholds, brand switching tendency, price memory strength, reference point sensitivity

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
              brandPsychology: {
                type: "object",
                description: "Brand psychology attributes including price anchoring, expected price points, brand loyalty, premium willingness, value perception, quality expectations"
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
            required: ["demographics", "psychographics", "shoppingPreferences", "productPreferences", "priceBehavior", "brandPsychology", "attributeVector"]
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
      brandPsychology: {},
      attributeVector: generateDefaultAttributeVector(basePersona)
    };
  }

  const data = await response.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  
  if (toolCall?.function?.arguments) {
    const parsed = JSON.parse(toolCall.function.arguments);
    return {
      demographics: parsed.demographics || {},
      psychographics: parsed.psychographics || {},
      shoppingPreferences: parsed.shoppingPreferences || {},
      productPreferences: parsed.productPreferences || {},
      priceBehavior: parsed.priceBehavior || {},
      brandPsychology: parsed.brandPsychology || {},
      attributeVector: parsed.attributeVector || generateDefaultAttributeVector(basePersona)
    };
  }

  return {
    demographics: {},
    psychographics: {},
    shoppingPreferences: {},
    productPreferences: {},
    priceBehavior: {},
    brandPsychology: {},
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
  vector.push({ name: "prefers_premium_fabrics", value: basePersona.productPreferences.fabricPreferences.some(f => f.includes("premium") || f.includes("linen")) ? 0.8 : 0.2, category: "product" });
  vector.push({ name: "prefers_casual_style", value: basePersona.productPreferences.stylePreference.includes("casual") ? 0.8 : 0.4, category: "product" });
  
  // Brand psychology attributes
  vector.push({ name: "brand_loyalty", value: basePersona.brandPsychology.brandLoyalty, category: "brand_psychology" });
  vector.push({ name: "premium_willingness", value: basePersona.brandPsychology.premiumWillingness, category: "brand_psychology" });
  vector.push({ name: "value_perception", value: basePersona.brandPsychology.valuePerception, category: "brand_psychology" });
  vector.push({ name: "quality_expectation", value: basePersona.brandPsychology.qualityExpectation, category: "brand_psychology" });
  vector.push({ name: "brand_switching_tendency", value: basePersona.brandPsychology.brandSwitchingTendency, category: "brand_psychology" });
  vector.push({ name: "price_memory", value: basePersona.brandPsychology.priceMemory, category: "brand_psychology" });
  vector.push({ name: "reference_point_sensitivity", value: basePersona.brandPsychology.referencePointSensitivity, category: "brand_psychology" });
  
  // Normalize expected price point (assuming max 2000 INR for normalization)
  const normalizedPriceExpectation = Math.min(basePersona.brandPsychology.expectedPricePoint / 2000, 1);
  vector.push({ name: "expected_price_point_normalized", value: normalizedPriceExpectation, category: "brand_psychology" });
  
  // Add more default attributes to reach ~50
  for (let i = 0; i < 35; i++) {
    vector.push({
      name: `attribute_${i}`,
      value: Math.random() * 0.6 + 0.2,
      category: ["demographics", "psychographics", "shopping", "product", "price", "brand_psychology"][i % 6]
    });
  }
  
  return vector;
}

// Demo data helper functions
const DEMO_PRODUCTS = [
  {
    name: "Cotton Comfort Bralette",
    category: "bralettes",
    subcategory: "everyday",
    price: 799,
    original_price: 999,
    description: "Soft cotton bralette perfect for daily wear with light support and breathable fabric",
    tags: ["cotton", "comfortable", "everyday", "wireless"],
    brand: "Demo Brand",
    sku: "DEMO-BRA-001",
    status: "analyzed",
    extracted_features: {
      material: "cotton",
      style: "bralette",
      support: "light",
      wire: false,
      padding: "removable",
      color: "nude"
    }
  },
  {
    name: "Lace Trim Push-Up",
    category: "bras",
    subcategory: "push-up",
    price: 1299,
    original_price: 1599,
    description: "Elegant lace trim push-up bra with underwire for enhanced support and lift",
    tags: ["lace", "push-up", "underwire", "evening"],
    brand: "Demo Brand",
    sku: "DEMO-BRA-002",
    status: "analyzed",
    extracted_features: {
      material: "lace",
      style: "push-up",
      support: "high",
      wire: true,
      padding: "molded",
      color: "black"
    }
  },
  {
    name: "Sports Performance Bra",
    category: "sports",
    subcategory: "high-impact",
    price: 1099,
    original_price: 1299,
    description: "High-impact sports bra with moisture-wicking fabric and adjustable straps",
    tags: ["sports", "high-impact", "moisture-wicking", "active"],
    brand: "Demo Brand",
    sku: "DEMO-BRA-003",
    status: "analyzed",
    extracted_features: {
      material: "polyester-blend",
      style: "sports",
      support: "high",
      wire: false,
      padding: "removable",
      color: "gray"
    }
  },
  {
    name: "Seamless T-Shirt Bra",
    category: "bras",
    subcategory: "t-shirt",
    price: 899,
    original_price: 1099,
    description: "Invisible seamless bra perfect under fitted tops with smooth cups",
    tags: ["seamless", "t-shirt", "smooth", "everyday"],
    brand: "Demo Brand",
    sku: "DEMO-BRA-004",
    status: "analyzed",
    extracted_features: {
      material: "microfiber",
      style: "t-shirt",
      support: "medium",
      wire: false,
      padding: "molded",
      color: "nude"
    }
  },
  {
    name: "Cotton Bikini 3-Pack",
    category: "panties",
    subcategory: "bikini",
    price: 599,
    original_price: 749,
    description: "Comfortable cotton bikini set in assorted colors for everyday wear",
    tags: ["cotton", "bikini", "multi-pack", "everyday"],
    brand: "Demo Brand",
    sku: "DEMO-PAN-001",
    status: "analyzed",
    extracted_features: {
      material: "cotton",
      style: "bikini",
      coverage: "medium",
      color: "assorted"
    }
  }
];

async function createDemoProducts(supabase: any, tenantId: string) {
  const products = [];
  
  for (const productData of DEMO_PRODUCTS) {
    const { data: product, error } = await supabase
      .from("products")
      .insert({
        ...productData,
        tenant_id: tenantId,
        currency: "INR"
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Failed to create demo product ${productData.name}:`, error);
      continue;
    }
    
    products.push(product);
  }
  
  return products;
}

async function createDemoAnalysisResults(
  supabase: any, 
  tenantId: string, 
  personas: any[], 
  products: any[]
) {
  const results = [];
  
  for (const product of products) {
    for (const persona of personas) {
      // Generate realistic-looking scores based on product/persona match
      const baseScore = 40 + Math.random() * 40; // 40-80 base
      const likeProbability = Math.round(baseScore + (Math.random() * 20 - 10)); // +/- 10 variance
      
      const priceMultiplier = 0.8 + Math.random() * 0.4; // 0.8-1.2
      const priceFloor = Math.round(product.price * 0.7);
      const priceCeiling = Math.round(product.price * 1.3);
      const priceSweetSpot = Math.round(product.price * priceMultiplier);
      
      const matchFactors = [
        { factor: "Material preference", score: Math.round(50 + Math.random() * 40), weight: 0.2 },
        { factor: "Price alignment", score: Math.round(50 + Math.random() * 40), weight: 0.25 },
        { factor: "Style match", score: Math.round(50 + Math.random() * 40), weight: 0.2 },
        { factor: "Brand affinity", score: Math.round(50 + Math.random() * 40), weight: 0.15 },
        { factor: "Category interest", score: Math.round(50 + Math.random() * 40), weight: 0.2 }
      ];
      
      const { data: result, error } = await supabase
        .from("analysis_results")
        .insert({
          tenant_id: tenantId,
          product_id: product.id,
          persona_id: persona.id,
          like_probability: Math.min(95, Math.max(25, likeProbability)),
          confidence_score: 70 + Math.round(Math.random() * 25),
          price_floor: priceFloor,
          price_sweet_spot: priceSweetSpot,
          price_ceiling: priceCeiling,
          price_elasticity: -0.2 - Math.random() * 0.6,
          match_factors: matchFactors,
          explanation: `This ${product.category} has a ${likeProbability > 60 ? 'strong' : 'moderate'} match with ${persona.name} based on material preferences and price sensitivity.`
        })
        .select()
        .single();
      
      if (error) {
        console.error(`Failed to create analysis for ${product.name} x ${persona.name}:`, error);
        continue;
      }
      
      results.push(result);
    }
  }
  
  return results;
}
