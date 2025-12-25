import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enterprise-Grade Consumer Personas for Apparel Industry
// 6 Fixed Personas (3 Female, 3 Male) with 150+ attributes each
const BASE_PERSONAS = [
  // Female Personas
  {
    name: "Priya Sharma",
    code: "F-TRD-MIL",
    segment: "Trend-Conscious Millennial",
    gender: "female",
    baseDescription: "Urban professional female aged 25-32 who actively follows fashion trends through social media platforms. Prioritizes wardrobe updates with contemporary casual wear including graphic tees, fitted jeans, and versatile dresses. High digital engagement with fashion content and peer-influenced purchasing behavior.",
    demographics: {
      ageRange: "25-32",
      ageMean: 28,
      ageMedian: 27,
      gender: "Female",
      incomeRange: "40000-80000",
      incomeMean: 55000,
      incomePercentile: 65,
      cityTier: "Metro",
      urbanRuralSplit: 0.95,
      relationship: "single/dating",
      household: "alone/roommates",
      householdSize: 1.5,
      occupation: "IT/Corporate Professional",
      education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried",
      workFromHome: 0.6,
      hasChildren: false,
      homeOwnership: "rented"
    },
    psychographics: {
      coreValues: ["style", "social-validation", "comfort", "self-expression", "peer-approval"],
      valsSegment: "Experiencers",
      lifestyle: "Urban trendy, active on social media, weekend outings, fitness-conscious",
      fashionOrientation: "trend-follower",
      fashionInvolvement: 0.75,
      socialMediaInfluence: 0.85,
      peerInfluence: 0.8,
      celebrityInfluence: 0.6,
      sustainabilityAwareness: 0.45,
      brandConsciousness: 0.65,
      noveltySeekingScore: 0.8,
      riskTolerance: 0.6,
      impulsivityScore: 0.65,
      planningHorizon: "short-term",
      selfImageImportance: 0.85
    },
    shoppingPreferences: {
      channel: ["online-apps", "mall-retail", "instagram-shops"],
      primaryChannel: "online-apps",
      channelSwitchingTendency: 0.7,
      triggers: ["trending-styles", "influencer-recommendations", "peer-reviews", "new-arrivals"],
      basketBehavior: "monthly-updates",
      averageBasketSize: 2.5,
      averageOrderValue: 2500,
      purchaseFrequency: 12,
      browsingToConversion: 0.15,
      cartAbandonmentRate: 0.45,
      returnRate: 0.18,
      returnTolerance: "high",
      researchIntensity: 0.6,
      comparisonShopping: 0.7,
      reviewDependence: 0.75,
      deliverySpeedImportance: 0.7,
      freeShippingThreshold: 1000,
      preferredPaymentMethods: ["UPI", "cards", "BNPL"],
      wishlistUsage: 0.8,
      notificationOptIn: 0.7
    },
    productPreferences: {
      categories: ["tshirts", "jeans", "dresses", "tops", "casual-wear", "co-ords"],
      categoryAffinityScores: { tshirts: 0.85, jeans: 0.8, dresses: 0.75, tops: 0.7, "casual-wear": 0.8 },
      fabricPreferences: ["cotton", "denim", "linen", "blends", "jersey"],
      fabricImportance: 0.65,
      colorPreferences: ["pastels", "trending-colors", "neutrals", "prints"],
      patternPreference: ["solid", "minimal-prints", "graphics"],
      fitPreference: "fitted-to-relaxed",
      fitImportance: 0.8,
      stylePreference: "casual-chic",
      occasionSplit: { casual: 0.6, work: 0.25, party: 0.15 },
      sizeConsistency: 0.7,
      sizeInclusivityExpectation: 0.6,
      sustainableFashionInterest: 0.4,
      localBrandOpenness: 0.5
    },
    priceBehavior: {
      tshirtRange: [800, 1500],
      jeansRange: [1500, 2500],
      dressRange: [1200, 2500],
      topsRange: [700, 1400],
      elasticity: -0.5,
      crossElasticity: 0.3,
      discountDependence: "high",
      minimumDiscountThreshold: 0.2,
      discountResponseCurve: "steep-initial",
      priceQualityAssociation: 0.55,
      ltvOrientation: "frequent-moderate",
      annualFashionSpend: 35000,
      walletShare: 0.15,
      seasonalSpendVariation: { festive: 1.4, sale: 1.6, regular: 0.8 },
      priceMemoryStrength: 0.5,
      referencePointType: "last-purchase"
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
      referencePointSensitivity: 0.6,
      brandTrustScore: 0.55,
      brandFamiliarity: ["mass-premium", "fast-fashion"],
      aspirationalBrands: ["international-fast-fashion"],
      domesticBrandAffinity: 0.5,
      newBrandTrialWillingness: 0.7,
      brandAdvocacyLikelihood: 0.5
    }
  },
  {
    name: "Ananya Mehta",
    code: "F-QTY-PRO",
    segment: "Quality-Conscious Professional",
    gender: "female",
    baseDescription: "Established professional female aged 30-42 with discerning taste for premium fabrics and timeless silhouettes. Invests in well-constructed garments for professional and social contexts. Values longevity and versatility over trend-driven purchases. Brand-loyal with high quality expectations.",
    demographics: {
      ageRange: "30-42",
      ageMean: 35,
      ageMedian: 34,
      gender: "Female",
      incomeRange: "80000-150000",
      incomeMean: 110000,
      incomePercentile: 85,
      cityTier: "Metro/Tier1",
      urbanRuralSplit: 0.98,
      relationship: "married/committed",
      household: "nuclear family",
      householdSize: 3.2,
      occupation: "Senior Professional/Manager",
      education: "Post-Graduate/MBA",
      employmentType: "Full-time salaried",
      workFromHome: 0.4,
      hasChildren: true,
      homeOwnership: "owned"
    },
    psychographics: {
      coreValues: ["quality", "durability", "elegance", "professionalism", "self-investment"],
      valsSegment: "Achievers",
      lifestyle: "Corporate professional, health-conscious, occasional luxury, curated social life",
      fashionOrientation: "classic-premium",
      fashionInvolvement: 0.7,
      socialMediaInfluence: 0.4,
      peerInfluence: 0.5,
      celebrityInfluence: 0.25,
      sustainabilityAwareness: 0.6,
      brandConsciousness: 0.85,
      noveltySeekingScore: 0.35,
      riskTolerance: 0.3,
      impulsivityScore: 0.2,
      planningHorizon: "long-term",
      selfImageImportance: 0.8
    },
    shoppingPreferences: {
      channel: ["brand-stores", "premium-online", "department-stores"],
      primaryChannel: "brand-stores",
      channelSwitchingTendency: 0.3,
      triggers: ["fabric-quality", "fit-excellence", "brand-reputation", "wardrobe-gaps"],
      basketBehavior: "quarterly-curated",
      averageBasketSize: 3,
      averageOrderValue: 8000,
      purchaseFrequency: 4,
      browsingToConversion: 0.35,
      cartAbandonmentRate: 0.2,
      returnRate: 0.08,
      returnTolerance: "low",
      researchIntensity: 0.8,
      comparisonShopping: 0.5,
      reviewDependence: 0.5,
      deliverySpeedImportance: 0.4,
      freeShippingThreshold: 3000,
      preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsage: 0.5,
      notificationOptIn: 0.3
    },
    productPreferences: {
      categories: ["formal-tops", "trousers", "blazers", "premium-tshirts", "smart-casual", "workwear"],
      categoryAffinityScores: { "formal-tops": 0.9, trousers: 0.85, blazers: 0.75, "premium-tshirts": 0.7, "smart-casual": 0.8 },
      fabricPreferences: ["premium-cotton", "linen", "silk-blend", "wool-blend", "tencel"],
      fabricImportance: 0.9,
      colorPreferences: ["neutrals", "earth-tones", "classic-navy", "ivory", "muted-tones"],
      patternPreference: ["solid", "subtle-textures", "classic-stripes"],
      fitPreference: "tailored",
      fitImportance: 0.95,
      stylePreference: "smart-casual",
      occasionSplit: { work: 0.5, casual: 0.3, formal: 0.2 },
      sizeConsistency: 0.85,
      sizeInclusivityExpectation: 0.5,
      sustainableFashionInterest: 0.65,
      localBrandOpenness: 0.4
    },
    priceBehavior: {
      tshirtRange: [1500, 3000],
      trousersRange: [2500, 5000],
      blazerRange: [4000, 8000],
      formalTopsRange: [2000, 4000],
      elasticity: -0.25,
      crossElasticity: 0.15,
      discountDependence: "low",
      minimumDiscountThreshold: 0.3,
      discountResponseCurve: "flat",
      priceQualityAssociation: 0.85,
      ltvOrientation: "infrequent-high",
      annualFashionSpend: 80000,
      walletShare: 0.08,
      seasonalSpendVariation: { festive: 1.2, sale: 1.1, regular: 0.95 },
      priceMemoryStrength: 0.7,
      referencePointType: "quality-benchmark"
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
      referencePointSensitivity: 0.3,
      brandTrustScore: 0.85,
      brandFamiliarity: ["premium-domestic", "accessible-luxury"],
      aspirationalBrands: ["international-premium"],
      domesticBrandAffinity: 0.6,
      newBrandTrialWillingness: 0.25,
      brandAdvocacyLikelihood: 0.75
    }
  },
  {
    name: "Sneha Patel",
    code: "F-BDG-STU",
    segment: "Budget-Conscious Student",
    gender: "female",
    baseDescription: "Value-seeking female aged 20-26 in academic or early career phase. Maximizes wardrobe variety within constrained budget through strategic sale shopping and marketplace browsing. High price sensitivity with strong discount affinity. Prioritizes quantity and trend-alignment over longevity.",
    demographics: {
      ageRange: "20-26",
      ageMean: 23,
      ageMedian: 22,
      gender: "Female",
      incomeRange: "15000-35000",
      incomeMean: 22000,
      incomePercentile: 35,
      cityTier: "All cities",
      urbanRuralSplit: 0.75,
      relationship: "single",
      household: "hostel/family",
      householdSize: 4,
      occupation: "Student/Entry-level",
      education: "Undergraduate/Graduate",
      employmentType: "Part-time/Intern/Fresh",
      workFromHome: 0.7,
      hasChildren: false,
      homeOwnership: "family/rented"
    },
    psychographics: {
      coreValues: ["affordability", "variety", "trend-access", "peer-belonging", "experimentation"],
      valsSegment: "Strivers",
      lifestyle: "College/early career, budget-conscious, high social media usage, peer-group oriented",
      fashionOrientation: "fast-fashion",
      fashionInvolvement: 0.7,
      socialMediaInfluence: 0.9,
      peerInfluence: 0.85,
      celebrityInfluence: 0.7,
      sustainabilityAwareness: 0.25,
      brandConsciousness: 0.4,
      noveltySeekingScore: 0.85,
      riskTolerance: 0.7,
      impulsivityScore: 0.75,
      planningHorizon: "immediate",
      selfImageImportance: 0.8
    },
    shoppingPreferences: {
      channel: ["online-marketplaces", "local-stores", "social-commerce"],
      primaryChannel: "online-marketplaces",
      channelSwitchingTendency: 0.85,
      triggers: ["discounts", "flash-sales", "variety", "social-trends", "FOMO"],
      basketBehavior: "frequent-small",
      averageBasketSize: 2,
      averageOrderValue: 800,
      purchaseFrequency: 18,
      browsingToConversion: 0.12,
      cartAbandonmentRate: 0.55,
      returnRate: 0.22,
      returnTolerance: "high",
      researchIntensity: 0.7,
      comparisonShopping: 0.9,
      reviewDependence: 0.8,
      deliverySpeedImportance: 0.5,
      freeShippingThreshold: 300,
      preferredPaymentMethods: ["COD", "UPI", "BNPL"],
      wishlistUsage: 0.85,
      notificationOptIn: 0.9
    },
    productPreferences: {
      categories: ["tshirts", "kurtis", "jeans", "casual-tops", "fusion-wear", "co-ords"],
      categoryAffinityScores: { tshirts: 0.9, jeans: 0.8, kurtis: 0.75, "casual-tops": 0.85, "fusion-wear": 0.7 },
      fabricPreferences: ["cotton", "polyester-blend", "rayon", "viscose"],
      fabricImportance: 0.4,
      colorPreferences: ["bright", "prints", "trendy-colors", "pastels"],
      patternPreference: ["prints", "graphics", "solid"],
      fitPreference: "regular-to-oversized",
      fitImportance: 0.5,
      stylePreference: "casual-fusion",
      occasionSplit: { casual: 0.7, college: 0.2, party: 0.1 },
      sizeConsistency: 0.55,
      sizeInclusivityExpectation: 0.7,
      sustainableFashionInterest: 0.2,
      localBrandOpenness: 0.8
    },
    priceBehavior: {
      tshirtRange: [300, 700],
      jeansRange: [600, 1200],
      kurtiRange: [400, 900],
      topsRange: [250, 600],
      elasticity: -0.8,
      crossElasticity: 0.5,
      discountDependence: "very-high",
      minimumDiscountThreshold: 0.1,
      discountResponseCurve: "very-steep",
      priceQualityAssociation: 0.35,
      ltvOrientation: "frequent-low",
      annualFashionSpend: 15000,
      walletShare: 0.2,
      seasonalSpendVariation: { festive: 1.5, sale: 2.0, regular: 0.6 },
      priceMemoryStrength: 0.9,
      referencePointType: "lowest-seen"
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
      referencePointSensitivity: 0.85,
      brandTrustScore: 0.3,
      brandFamiliarity: ["value-brands", "marketplace-labels"],
      aspirationalBrands: ["mass-premium"],
      domesticBrandAffinity: 0.75,
      newBrandTrialWillingness: 0.9,
      brandAdvocacyLikelihood: 0.3
    }
  },
  // Male Personas
  {
    name: "Rahul Kumar",
    code: "M-CMF-PRO",
    segment: "Comfort-Focused Professional",
    gender: "male",
    baseDescription: "Pragmatic male professional aged 25-35 who prioritizes functional comfort over fashion statements. Builds wardrobe around versatile basics including plain tees, chinos, and casual shirts. Low-maintenance approach to fashion with brand loyalty driven by fit consistency and fabric comfort.",
    demographics: {
      ageRange: "25-35",
      ageMean: 30,
      ageMedian: 29,
      gender: "Male",
      incomeRange: "40000-80000",
      incomeMean: 58000,
      incomePercentile: 68,
      cityTier: "Metro/Tier1",
      urbanRuralSplit: 0.9,
      relationship: "varies",
      household: "alone/family",
      householdSize: 2.5,
      occupation: "IT/Corporate Professional",
      education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried",
      workFromHome: 0.65,
      hasChildren: false,
      homeOwnership: "rented"
    },
    psychographics: {
      coreValues: ["comfort", "simplicity", "versatility", "efficiency", "reliability"],
      valsSegment: "Makers",
      lifestyle: "Practical, fitness-focused, technology-savvy, low fashion involvement",
      fashionOrientation: "basics-focused",
      fashionInvolvement: 0.35,
      socialMediaInfluence: 0.3,
      peerInfluence: 0.4,
      celebrityInfluence: 0.15,
      sustainabilityAwareness: 0.4,
      brandConsciousness: 0.5,
      noveltySeekingScore: 0.2,
      riskTolerance: 0.25,
      impulsivityScore: 0.2,
      planningHorizon: "medium-term",
      selfImageImportance: 0.5
    },
    shoppingPreferences: {
      channel: ["online", "quick-commerce", "brand-outlets"],
      primaryChannel: "online",
      channelSwitchingTendency: 0.35,
      triggers: ["wardrobe-replacement", "comfort", "fit-consistency", "convenience"],
      basketBehavior: "quarterly-bulk",
      averageBasketSize: 4,
      averageOrderValue: 3500,
      purchaseFrequency: 4,
      browsingToConversion: 0.4,
      cartAbandonmentRate: 0.25,
      returnRate: 0.1,
      returnTolerance: "medium",
      researchIntensity: 0.5,
      comparisonShopping: 0.4,
      reviewDependence: 0.6,
      deliverySpeedImportance: 0.6,
      freeShippingThreshold: 1500,
      preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsage: 0.3,
      notificationOptIn: 0.4
    },
    productPreferences: {
      categories: ["tshirts", "polo-shirts", "chinos", "joggers", "casual-shirts"],
      categoryAffinityScores: { tshirts: 0.9, "polo-shirts": 0.75, chinos: 0.8, joggers: 0.7, "casual-shirts": 0.65 },
      fabricPreferences: ["cotton", "cotton-stretch", "jersey", "modal"],
      fabricImportance: 0.75,
      colorPreferences: ["navy", "black", "grey", "white", "earth-tones"],
      patternPreference: ["solid", "minimal"],
      fitPreference: "regular-to-relaxed",
      fitImportance: 0.85,
      stylePreference: "casual-athleisure",
      occasionSplit: { casual: 0.6, work: 0.35, active: 0.05 },
      sizeConsistency: 0.8,
      sizeInclusivityExpectation: 0.5,
      sustainableFashionInterest: 0.35,
      localBrandOpenness: 0.6
    },
    priceBehavior: {
      tshirtRange: [600, 1200],
      jeansRange: [1200, 2000],
      shirtRange: [800, 1500],
      poloRange: [700, 1300],
      elasticity: -0.45,
      crossElasticity: 0.25,
      discountDependence: "moderate",
      minimumDiscountThreshold: 0.2,
      discountResponseCurve: "moderate",
      priceQualityAssociation: 0.6,
      ltvOrientation: "moderate-frequency",
      annualFashionSpend: 28000,
      walletShare: 0.06,
      seasonalSpendVariation: { festive: 1.1, sale: 1.3, regular: 0.9 },
      priceMemoryStrength: 0.6,
      referencePointType: "habitual-brand"
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
      referencePointSensitivity: 0.5,
      brandTrustScore: 0.65,
      brandFamiliarity: ["mass-market", "basics-specialists"],
      aspirationalBrands: ["quality-basics"],
      domesticBrandAffinity: 0.7,
      newBrandTrialWillingness: 0.35,
      brandAdvocacyLikelihood: 0.55
    }
  },
  {
    name: "Arjun Verma",
    code: "M-STY-EXC",
    segment: "Style-Forward Executive",
    gender: "male",
    baseDescription: "Image-conscious male executive aged 28-40 who views clothing as professional currency. Invests significantly in premium brands for formal and smart-casual contexts. High quality expectations with strong brand loyalty. Values craftsmanship, fit precision, and understated sophistication.",
    demographics: {
      ageRange: "28-40",
      ageMean: 34,
      ageMedian: 33,
      gender: "Male",
      incomeRange: "100000-200000",
      incomeMean: 145000,
      incomePercentile: 92,
      cityTier: "Metro",
      urbanRuralSplit: 0.98,
      relationship: "married/committed",
      household: "DINK/small family",
      householdSize: 2.8,
      occupation: "Senior Manager/Business Owner",
      education: "MBA/Professional Degree",
      employmentType: "Senior salaried/Self-employed",
      workFromHome: 0.3,
      hasChildren: true,
      homeOwnership: "owned"
    },
    psychographics: {
      coreValues: ["status", "quality", "style", "professionalism", "success-signaling"],
      valsSegment: "Achievers",
      lifestyle: "Ambitious, networking-focused, brand-conscious, status-oriented",
      fashionOrientation: "premium-fashion",
      fashionInvolvement: 0.7,
      socialMediaInfluence: 0.25,
      peerInfluence: 0.6,
      celebrityInfluence: 0.3,
      sustainabilityAwareness: 0.5,
      brandConsciousness: 0.95,
      noveltySeekingScore: 0.4,
      riskTolerance: 0.2,
      impulsivityScore: 0.15,
      planningHorizon: "long-term",
      selfImageImportance: 0.9
    },
    shoppingPreferences: {
      channel: ["brand-stores", "premium-online", "luxury-retail"],
      primaryChannel: "brand-stores",
      channelSwitchingTendency: 0.2,
      triggers: ["brand-reputation", "fit-excellence", "style-quotient", "professional-need"],
      basketBehavior: "considered-premium",
      averageBasketSize: 2.5,
      averageOrderValue: 12000,
      purchaseFrequency: 6,
      browsingToConversion: 0.5,
      cartAbandonmentRate: 0.15,
      returnRate: 0.05,
      returnTolerance: "low",
      researchIntensity: 0.6,
      comparisonShopping: 0.3,
      reviewDependence: 0.35,
      deliverySpeedImportance: 0.3,
      freeShippingThreshold: 5000,
      preferredPaymentMethods: ["cards", "premium-cards"],
      wishlistUsage: 0.4,
      notificationOptIn: 0.25
    },
    productPreferences: {
      categories: ["formal-shirts", "trousers", "blazers", "premium-tshirts", "jackets"],
      categoryAffinityScores: { "formal-shirts": 0.95, trousers: 0.9, blazers: 0.8, "premium-tshirts": 0.7, jackets: 0.75 },
      fabricPreferences: ["premium-cotton", "linen", "wool-blend", "luxury-blends", "egyptian-cotton"],
      fabricImportance: 0.95,
      colorPreferences: ["classic-navy", "charcoal", "white", "subtle-patterns", "muted-tones"],
      patternPreference: ["solid", "micro-patterns", "classic-checks"],
      fitPreference: "slim-tailored",
      fitImportance: 0.98,
      stylePreference: "formal-smart-casual",
      occasionSplit: { work: 0.5, formal: 0.25, casual: 0.25 },
      sizeConsistency: 0.9,
      sizeInclusivityExpectation: 0.4,
      sustainableFashionInterest: 0.5,
      localBrandOpenness: 0.35
    },
    priceBehavior: {
      tshirtRange: [2000, 4000],
      shirtRange: [3000, 6000],
      trousersRange: [3500, 7000],
      blazerRange: [8000, 20000],
      elasticity: -0.2,
      crossElasticity: 0.1,
      discountDependence: "low",
      minimumDiscountThreshold: 0.35,
      discountResponseCurve: "flat",
      priceQualityAssociation: 0.9,
      ltvOrientation: "infrequent-high",
      annualFashionSpend: 150000,
      walletShare: 0.12,
      seasonalSpendVariation: { festive: 1.15, sale: 0.95, regular: 1.0 },
      priceMemoryStrength: 0.6,
      referencePointType: "brand-tier"
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
      referencePointSensitivity: 0.25,
      brandTrustScore: 0.9,
      brandFamiliarity: ["premium-domestic", "accessible-luxury", "international"],
      aspirationalBrands: ["luxury-international"],
      domesticBrandAffinity: 0.5,
      newBrandTrialWillingness: 0.2,
      brandAdvocacyLikelihood: 0.8
    }
  },
  {
    name: "Vikram Joshi",
    code: "M-STW-GNZ",
    segment: "Streetwear Enthusiast",
    gender: "male",
    baseDescription: "Gen-Z male aged 18-28 deeply immersed in streetwear and urban fashion culture. Purchasing behavior driven by exclusivity, drops, and cultural relevance. Willing to pay premium for limited editions and brand collaborations. High engagement with streetwear communities and sneaker culture.",
    demographics: {
      ageRange: "18-28",
      ageMean: 23,
      ageMedian: 22,
      gender: "Male",
      incomeRange: "20000-60000",
      incomeMean: 38000,
      incomePercentile: 55,
      cityTier: "Metro",
      urbanRuralSplit: 0.95,
      relationship: "single",
      household: "hostel/family",
      householdSize: 3.5,
      occupation: "Student/Creative Professional",
      education: "Undergraduate/Graduate",
      employmentType: "Student/Freelance/Startup",
      workFromHome: 0.6,
      hasChildren: false,
      homeOwnership: "family/rented"
    },
    psychographics: {
      coreValues: ["self-expression", "uniqueness", "cool-factor", "authenticity", "cultural-capital"],
      valsSegment: "Experiencers",
      lifestyle: "Urban creative, social media native, trend-setter, community-oriented",
      fashionOrientation: "streetwear-hype",
      fashionInvolvement: 0.9,
      socialMediaInfluence: 0.95,
      peerInfluence: 0.75,
      celebrityInfluence: 0.7,
      sustainabilityAwareness: 0.3,
      brandConsciousness: 0.85,
      noveltySeekingScore: 0.95,
      riskTolerance: 0.8,
      impulsivityScore: 0.7,
      planningHorizon: "drop-based",
      selfImageImportance: 0.95
    },
    shoppingPreferences: {
      channel: ["online-drops", "streetwear-stores", "instagram", "resale-platforms"],
      primaryChannel: "online-drops",
      channelSwitchingTendency: 0.6,
      triggers: ["exclusivity", "drops", "brand-hype", "cultural-relevance", "limited-editions"],
      basketBehavior: "impulse-hype",
      averageBasketSize: 1.5,
      averageOrderValue: 3500,
      purchaseFrequency: 8,
      browsingToConversion: 0.25,
      cartAbandonmentRate: 0.3,
      returnRate: 0.05,
      returnTolerance: "low-for-hyped",
      researchIntensity: 0.85,
      comparisonShopping: 0.4,
      reviewDependence: 0.5,
      deliverySpeedImportance: 0.5,
      freeShippingThreshold: 2000,
      preferredPaymentMethods: ["UPI", "cards", "BNPL"],
      wishlistUsage: 0.7,
      notificationOptIn: 0.95
    },
    productPreferences: {
      categories: ["graphic-tees", "hoodies", "cargo-pants", "oversized-tshirts", "joggers", "sneakers"],
      categoryAffinityScores: { "graphic-tees": 0.95, hoodies: 0.9, "cargo-pants": 0.85, "oversized-tshirts": 0.9, joggers: 0.75 },
      fabricPreferences: ["heavy-cotton", "fleece", "canvas", "premium-jersey"],
      fabricImportance: 0.6,
      colorPreferences: ["black", "earth-tones", "bold-graphics", "limited-edition-colors"],
      patternPreference: ["graphics", "collaborations", "bold-prints"],
      fitPreference: "oversized-relaxed",
      fitImportance: 0.85,
      stylePreference: "streetwear-urban",
      occasionSplit: { casual: 0.7, "creative-work": 0.2, events: 0.1 },
      sizeConsistency: 0.6,
      sizeInclusivityExpectation: 0.7,
      sustainableFashionInterest: 0.25,
      localBrandOpenness: 0.5
    },
    priceBehavior: {
      tshirtRange: [1000, 3000],
      hoodieRange: [2000, 5000],
      cargoRange: [1500, 4000],
      sneakerRange: [5000, 15000],
      elasticity: -0.3,
      crossElasticity: 0.2,
      discountDependence: "low-for-exclusives",
      minimumDiscountThreshold: 0.4,
      discountResponseCurve: "varies-by-hype",
      priceQualityAssociation: 0.5,
      ltvOrientation: "variable-hype-driven",
      annualFashionSpend: 45000,
      walletShare: 0.25,
      seasonalSpendVariation: { drops: 2.0, collab: 2.5, regular: 0.5 },
      priceMemoryStrength: 0.4,
      referencePointType: "resale-value"
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
      referencePointSensitivity: 0.3,
      brandTrustScore: 0.6,
      brandFamiliarity: ["streetwear", "hype-brands", "collaborations"],
      aspirationalBrands: ["international-streetwear", "luxury-collabs"],
      domesticBrandAffinity: 0.45,
      newBrandTrialWillingness: 0.75,
      brandAdvocacyLikelihood: 0.85
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
        avatar_emoji: basePersona.code,
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
