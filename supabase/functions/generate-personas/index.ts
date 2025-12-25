import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enterprise-Grade Consumer Personas for Indian Apparel Market
// 10 Personas (5 Female, 5 Male) with 144+ structured attributes each
const BASE_PERSONAS = [
  // ======================== FEMALE PERSONAS (5) ========================
  {
    name: "Priya Sharma",
    code: "F-TRD-MIL",
    segment: "Trend-Conscious Millennial",
    gender: "female",
    baseDescription: "Urban professional female aged 25-32 who actively follows fashion trends through social media platforms. Prioritizes wardrobe updates with contemporary casual wear including graphic tees, fitted jeans, and versatile dresses. High digital engagement with fashion content and peer-influenced purchasing behavior.",
    demographics: {
      ageRange: "25-32", ageMean: 28, ageMedian: 27, gender: "Female",
      incomeRange: "40000-80000", incomeMean: 55000, incomePercentile: 65,
      cityTier: "Metro", region: "West/South", urbanRuralSplit: 0.95,
      relationship: "single/dating", household: "alone/roommates", householdSize: 1.5,
      occupation: "IT/Corporate Professional", education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried", workFromHome: 0.6,
      hasChildren: false, homeOwnership: "rented", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "office-9-6", commuteStyle: "metro/cab", physicalActivity: "moderate",
      gymFrequency: 3, socialLifeIntensity: "high", weekendBehavior: "mall-cafes-nightlife",
      travelFrequencyDomestic: 4, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.25, wardrobeMixCasual: 0.55, wardrobeMixAthleisure: 0.20
    },
    fashionOrientation: {
      styleIdentity: "casual-chic", fashionInvolvementScore: 0.75,
      trendAdoptionSpeed: "early-mainstream", brandConsciousness: 0.65,
      toleranceBoldSilhouettes: 0.6, toleranceLogos: 0.5, toleranceExperimentalFits: 0.55,
      colorAdventurousness: 0.7, printOpenness: 0.65, sustainabilityPriority: 0.45,
      localBrandPreference: 0.5, internationalBrandAspiration: 0.6
    },
    psychographics: {
      coreValues: ["style", "social-validation", "comfort", "self-expression", "peer-approval"],
      valsSegment: "Experiencers", lifestyle: "Urban trendy, active on social media",
      fashionOrientation: "trend-follower", fashionInvolvement: 0.75,
      socialMediaInfluence: 0.85, peerInfluence: 0.8, celebrityInfluence: 0.6,
      sustainabilityAwareness: 0.45, noveltySeekingScore: 0.8, riskTolerance: 0.6,
      impulsivityScore: 0.65, planningHorizon: "short-term", selfImageImportance: 0.85
    },
    shoppingPreferences: {
      channel: ["online-apps", "mall-retail", "instagram-shops"],
      primaryChannel: "online-apps", secondaryChannel: "mall-retail",
      onlineOfflineRatio: 0.7, channelSwitchingTendency: 0.7,
      triggers: ["trending-styles", "influencer-recommendations", "peer-reviews", "new-arrivals"],
      basketBehavior: "monthly-updates", averageBasketSize: 2.5, averageOrderValue: 2500,
      purchaseFrequencyMonthly: 1.2, browsingToConversion: 0.15, cartAbandonmentRate: 0.45,
      returnRate: 0.18, returnTolerance: "high", researchIntensity: 0.6,
      comparisonShoppingIntensity: 0.7, reviewDependence: 0.75, influencerInfluence: 0.7,
      sensitivityDeliveryTime: 0.7, sensitivityReturnFriction: 0.6,
      freeShippingThreshold: 1000, preferredPaymentMethods: ["UPI", "cards", "BNPL"],
      wishlistUsageScore: 0.8, notificationOptInScore: 0.7,
      paymentMethodUpi: 0.5, paymentMethodCod: 0.2, paymentMethodCard: 0.3
    },
    productPreferences: {
      categories: ["tshirts", "jeans", "dresses", "tops", "casual-wear", "co-ords"],
      categoryAffinityTshirts: 0.85, categoryAffinityShirts: 0.5, categoryAffinityJeans: 0.8,
      categoryAffinityTrousers: 0.5, categoryAffinityShorts: 0.6, categoryAffinityJoggers: 0.65,
      categoryAffinityHoodies: 0.6, categoryAffinityDresses: 0.75, categoryAffinityKurtas: 0.4,
      categoryAffinityLoungewear: 0.55,
      fabricPreferences: ["cotton", "denim", "linen", "blends", "jersey"],
      fabricRankingCotton: 0.9, fabricRankingLinen: 0.6, fabricRankingDenim: 0.85,
      fabricRankingPolyester: 0.4, fabricRankingFleece: 0.5, fabricRankingModal: 0.55,
      breathabilityImportance: 0.75, wrinkleResistanceImportance: 0.5,
      sustainabilityConcern: 0.45, seasonalFabricShiftTendency: 0.6,
      colorPreferences: ["pastels", "trending-colors", "neutrals", "prints"],
      colorNeutralsRatio: 0.35, colorEarthTonesRatio: 0.15, colorPastelsRatio: 0.25,
      colorBrightsRatio: 0.15, colorBoldRatio: 0.1, printSolidRatio: 0.55,
      patternStripes: 0.5, patternChecks: 0.3, patternGraphics: 0.6, statementPieceTolerance: 0.5,
      fitPreference: "fitted-to-relaxed", fitPreferenceOverall: "slim",
      fitPreferenceTops: "fitted", fitPreferenceBottoms: "slim",
      risePreference: "mid", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "ankle",
      sleevePreference: "half", necklinePreference: "crew/v-neck",
      waistbandPreference: "structured", comfortStructureRatio: 0.6,
      sizeConsistencyExpectation: 0.7, sizeInclusivityImportance: 0.6,
      occasionWorkwear: 0.25, occasionCasual: 0.6, occasionParty: 0.15, occasionTravel: 0.2, occasionHome: 0.15
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 800, comfortPriceTshirtsMax: 1500,
      comfortPriceShirtsMin: 1000, comfortPriceShirtsMax: 2000,
      comfortPriceJeansMin: 1500, comfortPriceJeansMax: 2500,
      comfortPriceTrousersMin: 1200, comfortPriceTrousersMax: 2200,
      comfortPriceShortsMin: 700, comfortPriceShortsMax: 1300,
      comfortPriceJoggersMin: 900, comfortPriceJoggersMax: 1600,
      comfortPriceHoodiesMin: 1200, comfortPriceHoodiesMax: 2200,
      comfortPriceDressesMin: 1200, comfortPriceDressesMax: 2500,
      maxWillingToPayMultiplier: 1.3, typicalDiscountExpectation: 0.2,
      discountDependenceScore: 0.7, priceElasticityIndicator: "medium",
      priceQualityAssociation: 0.55, elasticity: -0.5, crossElasticity: 0.3,
      discountDependence: "high", minimumDiscountThreshold: 0.2,
      seasonalSpendFestive: 1.4, seasonalSpendSale: 1.6, seasonalSpendRegular: 0.8,
      ltvOrientation: "frequent-moderate", annualFashionSpend: 35000, walletShare: 0.15
    },
    brandPsychology: {
      priceAnchor: "mid-range", expectedPricePoint: 1200,
      brandLoyaltyScore: 0.4, premiumWillingness: 0.5, valuePerceptionScore: 0.7,
      qualityExpectation: 0.6, brandSwitchingTendency: 0.6, priceMemoryStrength: 0.5,
      referencePointSensitivity: 0.6, brandTrustScore: 0.55,
      brandFamiliarity: ["mass-premium", "fast-fashion"], aspirationalBrands: ["international-fast-fashion"],
      domesticBrandAffinity: 0.5, newBrandTrialWillingness: 0.7, brandAdvocacyLikelihood: 0.5
    },
    digitalBehavior: {
      deviceAndroid: 0.6, deviceIos: 0.35, deviceDesktop: 0.05,
      sessionTimePreference: "evening", scrollDepthEngagement: 0.7,
      personalizationResponse: 0.75, socialPlatformInstagram: 0.9, socialPlatformYoutube: 0.6
    }
  },
  {
    name: "Ananya Mehta",
    code: "F-QTY-PRO",
    segment: "Quality-Conscious Professional",
    gender: "female",
    baseDescription: "Established professional female aged 30-42 with discerning taste for premium fabrics and timeless silhouettes. Invests in well-constructed garments for professional and social contexts. Values longevity and versatility over trend-driven purchases. Brand-loyal with high quality expectations.",
    demographics: {
      ageRange: "30-42", ageMean: 35, ageMedian: 34, gender: "Female",
      incomeRange: "80000-150000", incomeMean: 110000, incomePercentile: 85,
      cityTier: "Metro/Tier1", region: "North/West", urbanRuralSplit: 0.98,
      relationship: "married/committed", household: "nuclear family", householdSize: 3.2,
      occupation: "Senior Professional/Manager", education: "Post-Graduate/MBA",
      employmentType: "Full-time salaried", workFromHome: 0.4,
      hasChildren: true, homeOwnership: "owned", dependents: 1
    },
    lifestyle: {
      dailyRoutine: "office-flexible", commuteStyle: "car/cab", physicalActivity: "moderate",
      gymFrequency: 2, socialLifeIntensity: "medium", weekendBehavior: "family-social",
      travelFrequencyDomestic: 3, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.45, wardrobeMixCasual: 0.35, wardrobeMixAthleisure: 0.20
    },
    fashionOrientation: {
      styleIdentity: "classic-premium", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "mainstream", brandConsciousness: 0.85,
      toleranceBoldSilhouettes: 0.3, toleranceLogos: 0.25, toleranceExperimentalFits: 0.2,
      colorAdventurousness: 0.4, printOpenness: 0.35, sustainabilityPriority: 0.6,
      localBrandPreference: 0.4, internationalBrandAspiration: 0.7
    },
    psychographics: {
      coreValues: ["quality", "durability", "elegance", "professionalism", "self-investment"],
      valsSegment: "Achievers", lifestyle: "Corporate professional, health-conscious",
      fashionOrientation: "classic-premium", fashionInvolvement: 0.7,
      socialMediaInfluence: 0.4, peerInfluence: 0.5, celebrityInfluence: 0.25,
      sustainabilityAwareness: 0.6, noveltySeekingScore: 0.35, riskTolerance: 0.3,
      impulsivityScore: 0.2, planningHorizon: "long-term", selfImageImportance: 0.8
    },
    shoppingPreferences: {
      channel: ["brand-stores", "premium-online", "department-stores"],
      primaryChannel: "brand-stores", secondaryChannel: "premium-online",
      onlineOfflineRatio: 0.45, channelSwitchingTendency: 0.3,
      triggers: ["fabric-quality", "fit-excellence", "brand-reputation", "wardrobe-gaps"],
      basketBehavior: "quarterly-curated", averageBasketSize: 3, averageOrderValue: 8000,
      purchaseFrequencyMonthly: 0.35, browsingToConversion: 0.35, cartAbandonmentRate: 0.2,
      returnRate: 0.08, returnTolerance: "low", researchIntensity: 0.8,
      comparisonShoppingIntensity: 0.5, reviewDependence: 0.5, influencerInfluence: 0.25,
      sensitivityDeliveryTime: 0.4, sensitivityReturnFriction: 0.3,
      freeShippingThreshold: 3000, preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsageScore: 0.5, notificationOptInScore: 0.3,
      paymentMethodUpi: 0.35, paymentMethodCod: 0.05, paymentMethodCard: 0.6
    },
    productPreferences: {
      categories: ["formal-tops", "trousers", "blazers", "premium-tshirts", "smart-casual", "workwear"],
      categoryAffinityTshirts: 0.6, categoryAffinityShirts: 0.85, categoryAffinityJeans: 0.55,
      categoryAffinityTrousers: 0.9, categoryAffinityShorts: 0.3, categoryAffinityJoggers: 0.35,
      categoryAffinityHoodies: 0.3, categoryAffinityDresses: 0.7, categoryAffinityKurtas: 0.5,
      categoryAffinityLoungewear: 0.45,
      fabricPreferences: ["premium-cotton", "linen", "silk-blend", "wool-blend", "tencel"],
      fabricRankingCotton: 0.95, fabricRankingLinen: 0.85, fabricRankingDenim: 0.5,
      fabricRankingPolyester: 0.2, fabricRankingFleece: 0.3, fabricRankingModal: 0.7,
      breathabilityImportance: 0.8, wrinkleResistanceImportance: 0.75,
      sustainabilityConcern: 0.65, seasonalFabricShiftTendency: 0.7,
      colorPreferences: ["neutrals", "earth-tones", "classic-navy", "ivory", "muted-tones"],
      colorNeutralsRatio: 0.5, colorEarthTonesRatio: 0.25, colorPastelsRatio: 0.15,
      colorBrightsRatio: 0.05, colorBoldRatio: 0.05, printSolidRatio: 0.75,
      patternStripes: 0.4, patternChecks: 0.3, patternGraphics: 0.1, statementPieceTolerance: 0.25,
      fitPreference: "tailored", fitPreferenceOverall: "tailored",
      fitPreferenceTops: "fitted", fitPreferenceBottoms: "straight",
      risePreference: "mid-high", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "full",
      sleevePreference: "full/three-quarter", necklinePreference: "collar/boat",
      waistbandPreference: "structured", comfortStructureRatio: 0.4,
      sizeConsistencyExpectation: 0.85, sizeInclusivityImportance: 0.5,
      occasionWorkwear: 0.5, occasionCasual: 0.3, occasionParty: 0.15, occasionTravel: 0.15, occasionHome: 0.1
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1500, comfortPriceTshirtsMax: 3000,
      comfortPriceShirtsMin: 2000, comfortPriceShirtsMax: 4000,
      comfortPriceJeansMin: 2500, comfortPriceJeansMax: 4500,
      comfortPriceTrousersMin: 2500, comfortPriceTrousersMax: 5000,
      comfortPriceShortsMin: 1200, comfortPriceShortsMax: 2200,
      comfortPriceJoggersMin: 1500, comfortPriceJoggersMax: 2800,
      comfortPriceHoodiesMin: 2000, comfortPriceHoodiesMax: 4000,
      comfortPriceDressesMin: 3000, comfortPriceDressesMax: 6000,
      maxWillingToPayMultiplier: 1.5, typicalDiscountExpectation: 0.15,
      discountDependenceScore: 0.3, priceElasticityIndicator: "low",
      priceQualityAssociation: 0.85, elasticity: -0.25, crossElasticity: 0.15,
      discountDependence: "low", minimumDiscountThreshold: 0.3,
      seasonalSpendFestive: 1.2, seasonalSpendSale: 1.1, seasonalSpendRegular: 0.95,
      ltvOrientation: "infrequent-high", annualFashionSpend: 80000, walletShare: 0.08
    },
    brandPsychology: {
      priceAnchor: "premium", expectedPricePoint: 2500,
      brandLoyaltyScore: 0.8, premiumWillingness: 0.85, valuePerceptionScore: 0.5,
      qualityExpectation: 0.9, brandSwitchingTendency: 0.2, priceMemoryStrength: 0.7,
      referencePointSensitivity: 0.3, brandTrustScore: 0.85,
      brandFamiliarity: ["premium-domestic", "accessible-luxury"], aspirationalBrands: ["international-premium"],
      domesticBrandAffinity: 0.6, newBrandTrialWillingness: 0.25, brandAdvocacyLikelihood: 0.75
    },
    digitalBehavior: {
      deviceAndroid: 0.3, deviceIos: 0.6, deviceDesktop: 0.1,
      sessionTimePreference: "afternoon", scrollDepthEngagement: 0.5,
      personalizationResponse: 0.6, socialPlatformInstagram: 0.5, socialPlatformYoutube: 0.4
    }
  },
  {
    name: "Sneha Patel",
    code: "F-BDG-STU",
    segment: "Budget-Conscious Student",
    gender: "female",
    baseDescription: "Value-seeking female aged 20-26 in academic or early career phase. Maximizes wardrobe variety within constrained budget through strategic sale shopping and marketplace browsing. High price sensitivity with strong discount affinity. Prioritizes quantity and trend-alignment over longevity.",
    demographics: {
      ageRange: "20-26", ageMean: 23, ageMedian: 22, gender: "Female",
      incomeRange: "15000-35000", incomeMean: 22000, incomePercentile: 35,
      cityTier: "All cities", region: "All regions", urbanRuralSplit: 0.75,
      relationship: "single", household: "hostel/family", householdSize: 4,
      occupation: "Student/Entry-level", education: "Undergraduate/Graduate",
      employmentType: "Part-time/Intern/Fresh", workFromHome: 0.7,
      hasChildren: false, homeOwnership: "family/rented", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "college/early-career", commuteStyle: "public-transport/walk", physicalActivity: "low-moderate",
      gymFrequency: 1, socialLifeIntensity: "high", weekendBehavior: "friends-cafes-home",
      travelFrequencyDomestic: 2, travelFrequencyInternational: 0,
      wardrobeMixFormal: 0.1, wardrobeMixCasual: 0.75, wardrobeMixAthleisure: 0.15
    },
    fashionOrientation: {
      styleIdentity: "casual-fusion", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "fast-follower", brandConsciousness: 0.4,
      toleranceBoldSilhouettes: 0.65, toleranceLogos: 0.7, toleranceExperimentalFits: 0.7,
      colorAdventurousness: 0.8, printOpenness: 0.75, sustainabilityPriority: 0.25,
      localBrandPreference: 0.8, internationalBrandAspiration: 0.4
    },
    psychographics: {
      coreValues: ["affordability", "variety", "trend-access", "peer-belonging", "experimentation"],
      valsSegment: "Strivers", lifestyle: "College/early career, budget-conscious",
      fashionOrientation: "fast-fashion", fashionInvolvement: 0.7,
      socialMediaInfluence: 0.9, peerInfluence: 0.85, celebrityInfluence: 0.7,
      sustainabilityAwareness: 0.25, noveltySeekingScore: 0.85, riskTolerance: 0.7,
      impulsivityScore: 0.75, planningHorizon: "immediate", selfImageImportance: 0.8
    },
    shoppingPreferences: {
      channel: ["online-marketplaces", "local-stores", "social-commerce"],
      primaryChannel: "online-marketplaces", secondaryChannel: "local-stores",
      onlineOfflineRatio: 0.75, channelSwitchingTendency: 0.85,
      triggers: ["discounts", "flash-sales", "variety", "social-trends", "FOMO"],
      basketBehavior: "frequent-small", averageBasketSize: 2, averageOrderValue: 800,
      purchaseFrequencyMonthly: 1.8, browsingToConversion: 0.12, cartAbandonmentRate: 0.55,
      returnRate: 0.22, returnTolerance: "high", researchIntensity: 0.7,
      comparisonShoppingIntensity: 0.9, reviewDependence: 0.8, influencerInfluence: 0.8,
      sensitivityDeliveryTime: 0.5, sensitivityReturnFriction: 0.4,
      freeShippingThreshold: 300, preferredPaymentMethods: ["COD", "UPI", "BNPL"],
      wishlistUsageScore: 0.85, notificationOptInScore: 0.9,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.45, paymentMethodCard: 0.15
    },
    productPreferences: {
      categories: ["tshirts", "kurtis", "jeans", "casual-tops", "fusion-wear", "co-ords"],
      categoryAffinityTshirts: 0.9, categoryAffinityShirts: 0.4, categoryAffinityJeans: 0.8,
      categoryAffinityTrousers: 0.35, categoryAffinityShorts: 0.5, categoryAffinityJoggers: 0.6,
      categoryAffinityHoodies: 0.5, categoryAffinityDresses: 0.6, categoryAffinityKurtas: 0.75,
      categoryAffinityLoungewear: 0.65,
      fabricPreferences: ["cotton", "polyester-blend", "rayon", "viscose"],
      fabricRankingCotton: 0.8, fabricRankingLinen: 0.3, fabricRankingDenim: 0.7,
      fabricRankingPolyester: 0.6, fabricRankingFleece: 0.4, fabricRankingModal: 0.35,
      breathabilityImportance: 0.6, wrinkleResistanceImportance: 0.3,
      sustainabilityConcern: 0.2, seasonalFabricShiftTendency: 0.5,
      colorPreferences: ["bright", "prints", "trendy-colors", "pastels"],
      colorNeutralsRatio: 0.2, colorEarthTonesRatio: 0.1, colorPastelsRatio: 0.25,
      colorBrightsRatio: 0.3, colorBoldRatio: 0.15, printSolidRatio: 0.4,
      patternStripes: 0.5, patternChecks: 0.4, patternGraphics: 0.7, statementPieceTolerance: 0.7,
      fitPreference: "regular-to-oversized", fitPreferenceOverall: "regular",
      fitPreferenceTops: "relaxed", fitPreferenceBottoms: "regular",
      risePreference: "mid", lengthPreferenceTops: "cropped/regular", lengthPreferenceBottoms: "ankle",
      sleevePreference: "half/sleeveless", necklinePreference: "round/square",
      waistbandPreference: "elastic/drawstring", comfortStructureRatio: 0.7,
      sizeConsistencyExpectation: 0.55, sizeInclusivityImportance: 0.7,
      occasionWorkwear: 0.1, occasionCasual: 0.7, occasionParty: 0.1, occasionTravel: 0.15, occasionHome: 0.25
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 300, comfortPriceTshirtsMax: 700,
      comfortPriceShirtsMin: 400, comfortPriceShirtsMax: 900,
      comfortPriceJeansMin: 600, comfortPriceJeansMax: 1200,
      comfortPriceTrousersMin: 500, comfortPriceTrousersMax: 1000,
      comfortPriceShortsMin: 300, comfortPriceShortsMax: 600,
      comfortPriceJoggersMin: 400, comfortPriceJoggersMax: 800,
      comfortPriceHoodiesMin: 500, comfortPriceHoodiesMax: 1000,
      comfortPriceDressesMin: 500, comfortPriceDressesMax: 1200,
      maxWillingToPayMultiplier: 1.1, typicalDiscountExpectation: 0.35,
      discountDependenceScore: 0.9, priceElasticityIndicator: "high",
      priceQualityAssociation: 0.35, elasticity: -0.8, crossElasticity: 0.5,
      discountDependence: "very-high", minimumDiscountThreshold: 0.1,
      seasonalSpendFestive: 1.5, seasonalSpendSale: 2.0, seasonalSpendRegular: 0.6,
      ltvOrientation: "frequent-low", annualFashionSpend: 15000, walletShare: 0.2
    },
    brandPsychology: {
      priceAnchor: "budget", expectedPricePoint: 500,
      brandLoyaltyScore: 0.2, premiumWillingness: 0.15, valuePerceptionScore: 0.9,
      qualityExpectation: 0.4, brandSwitchingTendency: 0.9, priceMemoryStrength: 0.9,
      referencePointSensitivity: 0.85, brandTrustScore: 0.3,
      brandFamiliarity: ["value-brands", "marketplace-labels"], aspirationalBrands: ["mass-premium"],
      domesticBrandAffinity: 0.75, newBrandTrialWillingness: 0.9, brandAdvocacyLikelihood: 0.3
    },
    digitalBehavior: {
      deviceAndroid: 0.85, deviceIos: 0.1, deviceDesktop: 0.05,
      sessionTimePreference: "night", scrollDepthEngagement: 0.85,
      personalizationResponse: 0.8, socialPlatformInstagram: 0.95, socialPlatformYoutube: 0.7
    }
  },
  {
    name: "Meera Reddy",
    code: "F-ETH-FUS",
    segment: "Ethnic-Fusion Enthusiast",
    gender: "female",
    baseDescription: "Fashion-forward female aged 25-38 who seamlessly blends traditional Indian elements with contemporary Western silhouettes. Curates a versatile wardrobe for diverse occasions from office to festivals. Values cultural expression while maintaining modern sensibilities. Occasion-driven purchasing with strong festive seasonality.",
    demographics: {
      ageRange: "25-38", ageMean: 31, ageMedian: 30, gender: "Female",
      incomeRange: "50000-100000", incomeMean: 72000, incomePercentile: 72,
      cityTier: "Metro/Tier1", region: "South/West", urbanRuralSplit: 0.9,
      relationship: "married/committed", household: "joint/nuclear", householdSize: 3.5,
      occupation: "Professional/Entrepreneur", education: "Graduate",
      employmentType: "Full-time/Self-employed", workFromHome: 0.45,
      hasChildren: true, homeOwnership: "owned/rented", dependents: 1
    },
    lifestyle: {
      dailyRoutine: "mixed-professional", commuteStyle: "car/cab", physicalActivity: "low-moderate",
      gymFrequency: 1, socialLifeIntensity: "medium-high", weekendBehavior: "family-social-cultural",
      travelFrequencyDomestic: 4, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.2, wardrobeMixCasual: 0.35, wardrobeMixAthleisure: 0.1
    },
    fashionOrientation: {
      styleIdentity: "ethnic-fusion", fashionInvolvementScore: 0.75,
      trendAdoptionSpeed: "mainstream", brandConsciousness: 0.6,
      toleranceBoldSilhouettes: 0.55, toleranceLogos: 0.3, toleranceExperimentalFits: 0.5,
      colorAdventurousness: 0.7, printOpenness: 0.8, sustainabilityPriority: 0.55,
      localBrandPreference: 0.7, internationalBrandAspiration: 0.45
    },
    psychographics: {
      coreValues: ["tradition", "modernity", "versatility", "cultural-pride", "practicality"],
      valsSegment: "Believers/Achievers", lifestyle: "Culturally-rooted, modern professional",
      fashionOrientation: "ethnic-fusion", fashionInvolvement: 0.75,
      socialMediaInfluence: 0.6, peerInfluence: 0.65, celebrityInfluence: 0.5,
      sustainabilityAwareness: 0.55, noveltySeekingScore: 0.55, riskTolerance: 0.45,
      impulsivityScore: 0.4, planningHorizon: "occasion-driven", selfImageImportance: 0.75
    },
    shoppingPreferences: {
      channel: ["brand-stores", "online-ethnic", "local-boutiques"],
      primaryChannel: "brand-stores", secondaryChannel: "online-ethnic",
      onlineOfflineRatio: 0.5, channelSwitchingTendency: 0.5,
      triggers: ["occasions", "festivals", "quality-fabric", "unique-designs"],
      basketBehavior: "occasion-driven", averageBasketSize: 2.5, averageOrderValue: 3500,
      purchaseFrequencyMonthly: 0.6, browsingToConversion: 0.25, cartAbandonmentRate: 0.35,
      returnRate: 0.12, returnTolerance: "medium", researchIntensity: 0.7,
      comparisonShoppingIntensity: 0.6, reviewDependence: 0.6, influencerInfluence: 0.5,
      sensitivityDeliveryTime: 0.5, sensitivityReturnFriction: 0.4,
      freeShippingThreshold: 1500, preferredPaymentMethods: ["UPI", "cards"],
      wishlistUsageScore: 0.7, notificationOptInScore: 0.6,
      paymentMethodUpi: 0.5, paymentMethodCod: 0.15, paymentMethodCard: 0.35
    },
    productPreferences: {
      categories: ["kurtis", "fusion-wear", "co-ords", "ethnic-dresses", "palazzos", "tshirts"],
      categoryAffinityTshirts: 0.5, categoryAffinityShirts: 0.4, categoryAffinityJeans: 0.5,
      categoryAffinityTrousers: 0.55, categoryAffinityShorts: 0.25, categoryAffinityJoggers: 0.35,
      categoryAffinityHoodies: 0.3, categoryAffinityDresses: 0.7, categoryAffinityKurtas: 0.9,
      categoryAffinityLoungewear: 0.5,
      fabricPreferences: ["cotton", "silk-blend", "chanderi", "linen", "rayon"],
      fabricRankingCotton: 0.9, fabricRankingLinen: 0.75, fabricRankingDenim: 0.4,
      fabricRankingPolyester: 0.3, fabricRankingFleece: 0.2, fabricRankingModal: 0.5,
      breathabilityImportance: 0.8, wrinkleResistanceImportance: 0.6,
      sustainabilityConcern: 0.55, seasonalFabricShiftTendency: 0.65,
      colorPreferences: ["vibrant", "traditional", "earth-tones", "pastels", "jewel-tones"],
      colorNeutralsRatio: 0.2, colorEarthTonesRatio: 0.25, colorPastelsRatio: 0.2,
      colorBrightsRatio: 0.2, colorBoldRatio: 0.15, printSolidRatio: 0.35,
      patternStripes: 0.3, patternChecks: 0.25, patternGraphics: 0.3, statementPieceTolerance: 0.6,
      fitPreference: "regular-flowy", fitPreferenceOverall: "relaxed",
      fitPreferenceTops: "relaxed", fitPreferenceBottoms: "flowy",
      risePreference: "mid", lengthPreferenceTops: "long/tunic", lengthPreferenceBottoms: "full",
      sleevePreference: "three-quarter/full", necklinePreference: "mandarin/keyhole",
      waistbandPreference: "elastic/drawstring", comfortStructureRatio: 0.65,
      sizeConsistencyExpectation: 0.65, sizeInclusivityImportance: 0.6,
      occasionWorkwear: 0.25, occasionCasual: 0.3, occasionParty: 0.25, occasionTravel: 0.15, occasionHome: 0.15
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 700, comfortPriceTshirtsMax: 1400,
      comfortPriceShirtsMin: 900, comfortPriceShirtsMax: 1800,
      comfortPriceJeansMin: 1200, comfortPriceJeansMax: 2200,
      comfortPriceTrousersMin: 1000, comfortPriceTrousersMax: 2000,
      comfortPriceShortsMin: 600, comfortPriceShortsMax: 1200,
      comfortPriceJoggersMin: 800, comfortPriceJoggersMax: 1500,
      comfortPriceHoodiesMin: 1000, comfortPriceHoodiesMax: 2000,
      comfortPriceDressesMin: 1500, comfortPriceDressesMax: 3500,
      maxWillingToPayMultiplier: 1.4, typicalDiscountExpectation: 0.2,
      discountDependenceScore: 0.5, priceElasticityIndicator: "medium",
      priceQualityAssociation: 0.65, elasticity: -0.4, crossElasticity: 0.25,
      discountDependence: "moderate", minimumDiscountThreshold: 0.2,
      seasonalSpendFestive: 1.8, seasonalSpendSale: 1.3, seasonalSpendRegular: 0.7,
      ltvOrientation: "occasion-high", annualFashionSpend: 45000, walletShare: 0.1
    },
    brandPsychology: {
      priceAnchor: "mid-premium", expectedPricePoint: 1500,
      brandLoyaltyScore: 0.55, premiumWillingness: 0.6, valuePerceptionScore: 0.65,
      qualityExpectation: 0.7, brandSwitchingTendency: 0.45, priceMemoryStrength: 0.55,
      referencePointSensitivity: 0.5, brandTrustScore: 0.65,
      brandFamiliarity: ["ethnic-brands", "fusion-labels"], aspirationalBrands: ["designer-ethnic"],
      domesticBrandAffinity: 0.8, newBrandTrialWillingness: 0.5, brandAdvocacyLikelihood: 0.6
    },
    digitalBehavior: {
      deviceAndroid: 0.5, deviceIos: 0.4, deviceDesktop: 0.1,
      sessionTimePreference: "evening", scrollDepthEngagement: 0.6,
      personalizationResponse: 0.65, socialPlatformInstagram: 0.7, socialPlatformYoutube: 0.5
    }
  },
  {
    name: "Kavya Iyer",
    code: "F-ATH-LIF",
    segment: "Athleisure Lifestyle",
    gender: "female",
    baseDescription: "Fitness-focused female aged 22-35 who prioritizes comfort-performance blend in everyday wardrobe. Active gym-goer and wellness enthusiast who seamlessly transitions athletic wear to casual settings. Values functionality, moisture management, and versatile styling. Brand-conscious in activewear segment.",
    demographics: {
      ageRange: "22-35", ageMean: 28, ageMedian: 27, gender: "Female",
      incomeRange: "45000-90000", incomeMean: 65000, incomePercentile: 70,
      cityTier: "Metro", region: "South/West", urbanRuralSplit: 0.95,
      relationship: "single/dating", household: "alone/roommates", householdSize: 1.8,
      occupation: "Fitness/Corporate/Creative Professional", education: "Graduate",
      employmentType: "Full-time/Freelance", workFromHome: 0.55,
      hasChildren: false, homeOwnership: "rented", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "gym-work-active", commuteStyle: "walk/bike/cab", physicalActivity: "high",
      gymFrequency: 5, socialLifeIntensity: "medium-high", weekendBehavior: "fitness-brunch-outdoors",
      travelFrequencyDomestic: 3, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.15, wardrobeMixCasual: 0.35, wardrobeMixAthleisure: 0.5
    },
    fashionOrientation: {
      styleIdentity: "athleisure-casual", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "early-mainstream", brandConsciousness: 0.75,
      toleranceBoldSilhouettes: 0.5, toleranceLogos: 0.65, toleranceExperimentalFits: 0.55,
      colorAdventurousness: 0.6, printOpenness: 0.5, sustainabilityPriority: 0.6,
      localBrandPreference: 0.45, internationalBrandAspiration: 0.7
    },
    psychographics: {
      coreValues: ["fitness", "comfort", "performance", "wellness", "functionality"],
      valsSegment: "Achievers/Experiencers", lifestyle: "Health-conscious, active lifestyle",
      fashionOrientation: "athleisure-first", fashionInvolvement: 0.7,
      socialMediaInfluence: 0.7, peerInfluence: 0.6, celebrityInfluence: 0.5,
      sustainabilityAwareness: 0.6, noveltySeekingScore: 0.6, riskTolerance: 0.5,
      impulsivityScore: 0.45, planningHorizon: "medium-term", selfImageImportance: 0.8
    },
    shoppingPreferences: {
      channel: ["brand-websites", "sports-stores", "online-apps"],
      primaryChannel: "brand-websites", secondaryChannel: "sports-stores",
      onlineOfflineRatio: 0.65, channelSwitchingTendency: 0.45,
      triggers: ["performance-features", "new-tech", "brand-launches", "fitness-goals"],
      basketBehavior: "regular-purposeful", averageBasketSize: 2.5, averageOrderValue: 3200,
      purchaseFrequencyMonthly: 0.8, browsingToConversion: 0.28, cartAbandonmentRate: 0.3,
      returnRate: 0.1, returnTolerance: "medium", researchIntensity: 0.75,
      comparisonShoppingIntensity: 0.65, reviewDependence: 0.7, influencerInfluence: 0.6,
      sensitivityDeliveryTime: 0.6, sensitivityReturnFriction: 0.45,
      freeShippingThreshold: 1500, preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsageScore: 0.65, notificationOptInScore: 0.7,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.1, paymentMethodCard: 0.5
    },
    productPreferences: {
      categories: ["sports-bras", "leggings", "joggers", "tshirts", "hoodies", "shorts"],
      categoryAffinityTshirts: 0.8, categoryAffinityShirts: 0.3, categoryAffinityJeans: 0.45,
      categoryAffinityTrousers: 0.35, categoryAffinityShorts: 0.75, categoryAffinityJoggers: 0.9,
      categoryAffinityHoodies: 0.8, categoryAffinityDresses: 0.35, categoryAffinityKurtas: 0.2,
      categoryAffinityLoungewear: 0.75,
      fabricPreferences: ["performance-poly", "moisture-wicking", "cotton-stretch", "fleece"],
      fabricRankingCotton: 0.7, fabricRankingLinen: 0.2, fabricRankingDenim: 0.35,
      fabricRankingPolyester: 0.85, fabricRankingFleece: 0.75, fabricRankingModal: 0.6,
      breathabilityImportance: 0.95, wrinkleResistanceImportance: 0.7,
      sustainabilityConcern: 0.6, seasonalFabricShiftTendency: 0.55,
      colorPreferences: ["black", "navy", "bold-accents", "neutrals", "neons"],
      colorNeutralsRatio: 0.4, colorEarthTonesRatio: 0.1, colorPastelsRatio: 0.1,
      colorBrightsRatio: 0.25, colorBoldRatio: 0.15, printSolidRatio: 0.65,
      patternStripes: 0.3, patternChecks: 0.1, patternGraphics: 0.5, statementPieceTolerance: 0.45,
      fitPreference: "fitted-compressive", fitPreferenceOverall: "fitted",
      fitPreferenceTops: "fitted", fitPreferenceBottoms: "fitted/tapered",
      risePreference: "high", lengthPreferenceTops: "cropped/regular", lengthPreferenceBottoms: "full/cropped",
      sleevePreference: "sleeveless/half", necklinePreference: "crew/racerback",
      waistbandPreference: "high-elastic", comfortStructureRatio: 0.75,
      sizeConsistencyExpectation: 0.8, sizeInclusivityImportance: 0.65,
      occasionWorkwear: 0.15, occasionCasual: 0.35, occasionParty: 0.1, occasionTravel: 0.2, occasionHome: 0.3
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 900, comfortPriceTshirtsMax: 1800,
      comfortPriceShirtsMin: 1000, comfortPriceShirtsMax: 2000,
      comfortPriceJeansMin: 1500, comfortPriceJeansMax: 2800,
      comfortPriceTrousersMin: 1200, comfortPriceTrousersMax: 2400,
      comfortPriceShortsMin: 800, comfortPriceShortsMax: 1500,
      comfortPriceJoggersMin: 1200, comfortPriceJoggersMax: 2200,
      comfortPriceHoodiesMin: 1500, comfortPriceHoodiesMax: 3000,
      comfortPriceDressesMin: 1200, comfortPriceDressesMax: 2500,
      maxWillingToPayMultiplier: 1.4, typicalDiscountExpectation: 0.18,
      discountDependenceScore: 0.45, priceElasticityIndicator: "medium-low",
      priceQualityAssociation: 0.7, elasticity: -0.35, crossElasticity: 0.2,
      discountDependence: "moderate", minimumDiscountThreshold: 0.2,
      seasonalSpendFestive: 1.1, seasonalSpendSale: 1.4, seasonalSpendRegular: 0.9,
      ltvOrientation: "regular-moderate", annualFashionSpend: 42000, walletShare: 0.12
    },
    brandPsychology: {
      priceAnchor: "mid-premium", expectedPricePoint: 1400,
      brandLoyaltyScore: 0.65, premiumWillingness: 0.7, valuePerceptionScore: 0.6,
      qualityExpectation: 0.75, brandSwitchingTendency: 0.35, priceMemoryStrength: 0.55,
      referencePointSensitivity: 0.45, brandTrustScore: 0.7,
      brandFamiliarity: ["sports-brands", "athleisure-labels"], aspirationalBrands: ["premium-sports"],
      domesticBrandAffinity: 0.5, newBrandTrialWillingness: 0.55, brandAdvocacyLikelihood: 0.65
    },
    digitalBehavior: {
      deviceAndroid: 0.45, deviceIos: 0.5, deviceDesktop: 0.05,
      sessionTimePreference: "morning/evening", scrollDepthEngagement: 0.65,
      personalizationResponse: 0.7, socialPlatformInstagram: 0.85, socialPlatformYoutube: 0.7
    }
  },

  // ======================== MALE PERSONAS (5) ========================
  {
    name: "Rahul Kumar",
    code: "M-CMF-PRO",
    segment: "Comfort-Focused Professional",
    gender: "male",
    baseDescription: "Pragmatic male professional aged 25-35 who prioritizes functional comfort over fashion statements. Builds wardrobe around versatile basics including plain tees, chinos, and casual shirts. Low-maintenance approach to fashion with brand loyalty driven by fit consistency and fabric comfort.",
    demographics: {
      ageRange: "25-35", ageMean: 30, ageMedian: 29, gender: "Male",
      incomeRange: "40000-80000", incomeMean: 58000, incomePercentile: 68,
      cityTier: "Metro/Tier1", region: "North/South", urbanRuralSplit: 0.9,
      relationship: "varies", household: "alone/family", householdSize: 2.5,
      occupation: "IT/Corporate Professional", education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried", workFromHome: 0.65,
      hasChildren: false, homeOwnership: "rented", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "WFH/office-flexible", commuteStyle: "cab/metro", physicalActivity: "moderate",
      gymFrequency: 2, socialLifeIntensity: "medium", weekendBehavior: "relaxed-friends-gaming",
      travelFrequencyDomestic: 2, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.2, wardrobeMixCasual: 0.55, wardrobeMixAthleisure: 0.25
    },
    fashionOrientation: {
      styleIdentity: "casual-basics", fashionInvolvementScore: 0.35,
      trendAdoptionSpeed: "late-mainstream", brandConsciousness: 0.5,
      toleranceBoldSilhouettes: 0.2, toleranceLogos: 0.35, toleranceExperimentalFits: 0.2,
      colorAdventurousness: 0.3, printOpenness: 0.25, sustainabilityPriority: 0.4,
      localBrandPreference: 0.6, internationalBrandAspiration: 0.4
    },
    psychographics: {
      coreValues: ["comfort", "simplicity", "versatility", "efficiency", "reliability"],
      valsSegment: "Makers", lifestyle: "Practical, fitness-focused, technology-savvy",
      fashionOrientation: "basics-focused", fashionInvolvement: 0.35,
      socialMediaInfluence: 0.3, peerInfluence: 0.4, celebrityInfluence: 0.15,
      sustainabilityAwareness: 0.4, noveltySeekingScore: 0.2, riskTolerance: 0.25,
      impulsivityScore: 0.2, planningHorizon: "medium-term", selfImageImportance: 0.5
    },
    shoppingPreferences: {
      channel: ["online", "quick-commerce", "brand-outlets"],
      primaryChannel: "online", secondaryChannel: "brand-outlets",
      onlineOfflineRatio: 0.75, channelSwitchingTendency: 0.35,
      triggers: ["wardrobe-replacement", "comfort", "fit-consistency", "convenience"],
      basketBehavior: "quarterly-bulk", averageBasketSize: 4, averageOrderValue: 3500,
      purchaseFrequencyMonthly: 0.35, browsingToConversion: 0.4, cartAbandonmentRate: 0.25,
      returnRate: 0.1, returnTolerance: "medium", researchIntensity: 0.5,
      comparisonShoppingIntensity: 0.4, reviewDependence: 0.6, influencerInfluence: 0.2,
      sensitivityDeliveryTime: 0.6, sensitivityReturnFriction: 0.5,
      freeShippingThreshold: 1500, preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsageScore: 0.3, notificationOptInScore: 0.4,
      paymentMethodUpi: 0.45, paymentMethodCod: 0.15, paymentMethodCard: 0.4
    },
    productPreferences: {
      categories: ["tshirts", "polo-shirts", "chinos", "joggers", "casual-shirts"],
      categoryAffinityTshirts: 0.9, categoryAffinityShirts: 0.65, categoryAffinityJeans: 0.7,
      categoryAffinityTrousers: 0.75, categoryAffinityShorts: 0.6, categoryAffinityJoggers: 0.7,
      categoryAffinityHoodies: 0.55, categoryAffinityDresses: 0, categoryAffinityKurtas: 0.25,
      categoryAffinityLoungewear: 0.6,
      fabricPreferences: ["cotton", "cotton-stretch", "jersey", "modal"],
      fabricRankingCotton: 0.95, fabricRankingLinen: 0.45, fabricRankingDenim: 0.65,
      fabricRankingPolyester: 0.4, fabricRankingFleece: 0.5, fabricRankingModal: 0.6,
      breathabilityImportance: 0.85, wrinkleResistanceImportance: 0.6,
      sustainabilityConcern: 0.35, seasonalFabricShiftTendency: 0.5,
      colorPreferences: ["navy", "black", "grey", "white", "earth-tones"],
      colorNeutralsRatio: 0.6, colorEarthTonesRatio: 0.2, colorPastelsRatio: 0.1,
      colorBrightsRatio: 0.05, colorBoldRatio: 0.05, printSolidRatio: 0.85,
      patternStripes: 0.3, patternChecks: 0.25, patternGraphics: 0.2, statementPieceTolerance: 0.15,
      fitPreference: "regular-to-relaxed", fitPreferenceOverall: "regular",
      fitPreferenceTops: "regular", fitPreferenceBottoms: "regular",
      risePreference: "mid", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "full",
      sleevePreference: "half/full", necklinePreference: "crew/polo",
      waistbandPreference: "structured/elastic", comfortStructureRatio: 0.65,
      sizeConsistencyExpectation: 0.8, sizeInclusivityImportance: 0.5,
      occasionWorkwear: 0.35, occasionCasual: 0.5, occasionParty: 0.05, occasionTravel: 0.15, occasionHome: 0.2
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 600, comfortPriceTshirtsMax: 1200,
      comfortPriceShirtsMin: 800, comfortPriceShirtsMax: 1500,
      comfortPriceJeansMin: 1200, comfortPriceJeansMax: 2000,
      comfortPriceTrousersMin: 1000, comfortPriceTrousersMax: 1800,
      comfortPriceShortsMin: 500, comfortPriceShortsMax: 1000,
      comfortPriceJoggersMin: 700, comfortPriceJoggersMax: 1400,
      comfortPriceHoodiesMin: 1000, comfortPriceHoodiesMax: 2000,
      comfortPriceDressesMin: 0, comfortPriceDressesMax: 0,
      maxWillingToPayMultiplier: 1.25, typicalDiscountExpectation: 0.2,
      discountDependenceScore: 0.5, priceElasticityIndicator: "medium",
      priceQualityAssociation: 0.6, elasticity: -0.45, crossElasticity: 0.25,
      discountDependence: "moderate", minimumDiscountThreshold: 0.2,
      seasonalSpendFestive: 1.1, seasonalSpendSale: 1.3, seasonalSpendRegular: 0.9,
      ltvOrientation: "moderate-frequency", annualFashionSpend: 28000, walletShare: 0.06
    },
    brandPsychology: {
      priceAnchor: "mid-range", expectedPricePoint: 999,
      brandLoyaltyScore: 0.6, premiumWillingness: 0.4, valuePerceptionScore: 0.75,
      qualityExpectation: 0.6, brandSwitchingTendency: 0.4, priceMemoryStrength: 0.6,
      referencePointSensitivity: 0.5, brandTrustScore: 0.65,
      brandFamiliarity: ["mass-market", "basics-specialists"], aspirationalBrands: ["quality-basics"],
      domesticBrandAffinity: 0.7, newBrandTrialWillingness: 0.35, brandAdvocacyLikelihood: 0.55
    },
    digitalBehavior: {
      deviceAndroid: 0.7, deviceIos: 0.25, deviceDesktop: 0.05,
      sessionTimePreference: "night", scrollDepthEngagement: 0.45,
      personalizationResponse: 0.55, socialPlatformInstagram: 0.4, socialPlatformYoutube: 0.6
    }
  },
  {
    name: "Arjun Verma",
    code: "M-STY-EXC",
    segment: "Style-Forward Executive",
    gender: "male",
    baseDescription: "Image-conscious male executive aged 28-40 who views clothing as professional currency. Invests significantly in premium brands for formal and smart-casual contexts. High quality expectations with strong brand loyalty. Values craftsmanship, fit precision, and understated sophistication.",
    demographics: {
      ageRange: "28-40", ageMean: 34, ageMedian: 33, gender: "Male",
      incomeRange: "100000-200000", incomeMean: 145000, incomePercentile: 92,
      cityTier: "Metro", region: "North/West", urbanRuralSplit: 0.98,
      relationship: "married/committed", household: "DINK/small family", householdSize: 2.8,
      occupation: "Senior Manager/Business Owner", education: "MBA/Professional Degree",
      employmentType: "Senior salaried/Self-employed", workFromHome: 0.3,
      hasChildren: true, homeOwnership: "owned", dependents: 1
    },
    lifestyle: {
      dailyRoutine: "office-client-meetings", commuteStyle: "car", physicalActivity: "moderate",
      gymFrequency: 3, socialLifeIntensity: "high", weekendBehavior: "family-social-golf",
      travelFrequencyDomestic: 6, travelFrequencyInternational: 2,
      wardrobeMixFormal: 0.5, wardrobeMixCasual: 0.35, wardrobeMixAthleisure: 0.15
    },
    fashionOrientation: {
      styleIdentity: "premium-smart-casual", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "selective", brandConsciousness: 0.95,
      toleranceBoldSilhouettes: 0.2, toleranceLogos: 0.3, toleranceExperimentalFits: 0.15,
      colorAdventurousness: 0.35, printOpenness: 0.25, sustainabilityPriority: 0.5,
      localBrandPreference: 0.35, internationalBrandAspiration: 0.85
    },
    psychographics: {
      coreValues: ["status", "quality", "style", "professionalism", "success-signaling"],
      valsSegment: "Achievers", lifestyle: "Ambitious, networking-focused, brand-conscious",
      fashionOrientation: "premium-fashion", fashionInvolvement: 0.7,
      socialMediaInfluence: 0.25, peerInfluence: 0.6, celebrityInfluence: 0.3,
      sustainabilityAwareness: 0.5, noveltySeekingScore: 0.4, riskTolerance: 0.2,
      impulsivityScore: 0.15, planningHorizon: "long-term", selfImageImportance: 0.9
    },
    shoppingPreferences: {
      channel: ["brand-stores", "premium-online", "luxury-retail"],
      primaryChannel: "brand-stores", secondaryChannel: "premium-online",
      onlineOfflineRatio: 0.4, channelSwitchingTendency: 0.2,
      triggers: ["brand-reputation", "fit-excellence", "style-quotient", "professional-need"],
      basketBehavior: "considered-premium", averageBasketSize: 2.5, averageOrderValue: 12000,
      purchaseFrequencyMonthly: 0.5, browsingToConversion: 0.5, cartAbandonmentRate: 0.15,
      returnRate: 0.05, returnTolerance: "low", researchIntensity: 0.6,
      comparisonShoppingIntensity: 0.3, reviewDependence: 0.35, influencerInfluence: 0.15,
      sensitivityDeliveryTime: 0.3, sensitivityReturnFriction: 0.25,
      freeShippingThreshold: 5000, preferredPaymentMethods: ["cards", "premium-cards"],
      wishlistUsageScore: 0.4, notificationOptInScore: 0.25,
      paymentMethodUpi: 0.2, paymentMethodCod: 0.02, paymentMethodCard: 0.78
    },
    productPreferences: {
      categories: ["formal-shirts", "trousers", "blazers", "premium-tshirts", "jackets"],
      categoryAffinityTshirts: 0.65, categoryAffinityShirts: 0.95, categoryAffinityJeans: 0.55,
      categoryAffinityTrousers: 0.9, categoryAffinityShorts: 0.35, categoryAffinityJoggers: 0.4,
      categoryAffinityHoodies: 0.35, categoryAffinityDresses: 0, categoryAffinityKurtas: 0.4,
      categoryAffinityLoungewear: 0.35,
      fabricPreferences: ["premium-cotton", "linen", "wool-blend", "luxury-blends", "egyptian-cotton"],
      fabricRankingCotton: 0.95, fabricRankingLinen: 0.85, fabricRankingDenim: 0.45,
      fabricRankingPolyester: 0.2, fabricRankingFleece: 0.25, fabricRankingModal: 0.5,
      breathabilityImportance: 0.75, wrinkleResistanceImportance: 0.85,
      sustainabilityConcern: 0.5, seasonalFabricShiftTendency: 0.6,
      colorPreferences: ["classic-navy", "charcoal", "white", "subtle-patterns", "muted-tones"],
      colorNeutralsRatio: 0.65, colorEarthTonesRatio: 0.2, colorPastelsRatio: 0.1,
      colorBrightsRatio: 0.03, colorBoldRatio: 0.02, printSolidRatio: 0.8,
      patternStripes: 0.4, patternChecks: 0.35, patternGraphics: 0.05, statementPieceTolerance: 0.15,
      fitPreference: "slim-tailored", fitPreferenceOverall: "slim",
      fitPreferenceTops: "fitted", fitPreferenceBottoms: "slim",
      risePreference: "mid", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "full",
      sleevePreference: "full", necklinePreference: "collar/crew",
      waistbandPreference: "structured", comfortStructureRatio: 0.35,
      sizeConsistencyExpectation: 0.9, sizeInclusivityImportance: 0.4,
      occasionWorkwear: 0.5, occasionCasual: 0.25, occasionParty: 0.15, occasionTravel: 0.15, occasionHome: 0.1
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 2000, comfortPriceTshirtsMax: 4000,
      comfortPriceShirtsMin: 3000, comfortPriceShirtsMax: 6000,
      comfortPriceJeansMin: 3000, comfortPriceJeansMax: 5500,
      comfortPriceTrousersMin: 3500, comfortPriceTrousersMax: 7000,
      comfortPriceShortsMin: 1500, comfortPriceShortsMax: 3000,
      comfortPriceJoggersMin: 2000, comfortPriceJoggersMax: 4000,
      comfortPriceHoodiesMin: 3000, comfortPriceHoodiesMax: 6000,
      comfortPriceDressesMin: 0, comfortPriceDressesMax: 0,
      maxWillingToPayMultiplier: 1.6, typicalDiscountExpectation: 0.1,
      discountDependenceScore: 0.2, priceElasticityIndicator: "low",
      priceQualityAssociation: 0.9, elasticity: -0.2, crossElasticity: 0.1,
      discountDependence: "low", minimumDiscountThreshold: 0.35,
      seasonalSpendFestive: 1.15, seasonalSpendSale: 0.95, seasonalSpendRegular: 1.0,
      ltvOrientation: "infrequent-high", annualFashionSpend: 150000, walletShare: 0.12
    },
    brandPsychology: {
      priceAnchor: "premium", expectedPricePoint: 3500,
      brandLoyaltyScore: 0.85, premiumWillingness: 0.9, valuePerceptionScore: 0.4,
      qualityExpectation: 0.95, brandSwitchingTendency: 0.15, priceMemoryStrength: 0.6,
      referencePointSensitivity: 0.25, brandTrustScore: 0.9,
      brandFamiliarity: ["premium-domestic", "accessible-luxury", "international"],
      aspirationalBrands: ["luxury-international"],
      domesticBrandAffinity: 0.5, newBrandTrialWillingness: 0.2, brandAdvocacyLikelihood: 0.8
    },
    digitalBehavior: {
      deviceAndroid: 0.25, deviceIos: 0.7, deviceDesktop: 0.05,
      sessionTimePreference: "afternoon", scrollDepthEngagement: 0.4,
      personalizationResponse: 0.5, socialPlatformInstagram: 0.45, socialPlatformYoutube: 0.35
    }
  },
  {
    name: "Vikram Joshi",
    code: "M-STW-GNZ",
    segment: "Streetwear Enthusiast",
    gender: "male",
    baseDescription: "Gen-Z male aged 18-28 deeply immersed in streetwear and urban fashion culture. Purchasing behavior driven by exclusivity, drops, and cultural relevance. Willing to pay premium for limited editions and brand collaborations. High engagement with streetwear communities and sneaker culture.",
    demographics: {
      ageRange: "18-28", ageMean: 23, ageMedian: 22, gender: "Male",
      incomeRange: "20000-60000", incomeMean: 38000, incomePercentile: 55,
      cityTier: "Metro", region: "West/South", urbanRuralSplit: 0.95,
      relationship: "single", household: "hostel/family", householdSize: 3.5,
      occupation: "Student/Creative Professional", education: "Undergraduate/Graduate",
      employmentType: "Student/Freelance/Startup", workFromHome: 0.6,
      hasChildren: false, homeOwnership: "family/rented", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "flexible-creative", commuteStyle: "metro/bike", physicalActivity: "moderate",
      gymFrequency: 2, socialLifeIntensity: "high", weekendBehavior: "events-cafes-community",
      travelFrequencyDomestic: 2, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.05, wardrobeMixCasual: 0.55, wardrobeMixAthleisure: 0.4
    },
    fashionOrientation: {
      styleIdentity: "streetwear-urban", fashionInvolvementScore: 0.9,
      trendAdoptionSpeed: "early-adopter", brandConsciousness: 0.85,
      toleranceBoldSilhouettes: 0.85, toleranceLogos: 0.9, toleranceExperimentalFits: 0.9,
      colorAdventurousness: 0.75, printOpenness: 0.85, sustainabilityPriority: 0.3,
      localBrandPreference: 0.5, internationalBrandAspiration: 0.85
    },
    psychographics: {
      coreValues: ["self-expression", "uniqueness", "cool-factor", "authenticity", "cultural-capital"],
      valsSegment: "Experiencers", lifestyle: "Urban creative, social media native, trend-setter",
      fashionOrientation: "streetwear-hype", fashionInvolvement: 0.9,
      socialMediaInfluence: 0.95, peerInfluence: 0.75, celebrityInfluence: 0.7,
      sustainabilityAwareness: 0.3, noveltySeekingScore: 0.95, riskTolerance: 0.8,
      impulsivityScore: 0.7, planningHorizon: "drop-based", selfImageImportance: 0.95
    },
    shoppingPreferences: {
      channel: ["online-drops", "streetwear-stores", "instagram", "resale-platforms"],
      primaryChannel: "online-drops", secondaryChannel: "instagram",
      onlineOfflineRatio: 0.8, channelSwitchingTendency: 0.6,
      triggers: ["exclusivity", "drops", "brand-hype", "cultural-relevance", "limited-editions"],
      basketBehavior: "impulse-hype", averageBasketSize: 1.5, averageOrderValue: 3500,
      purchaseFrequencyMonthly: 0.7, browsingToConversion: 0.25, cartAbandonmentRate: 0.3,
      returnRate: 0.05, returnTolerance: "low-for-hyped", researchIntensity: 0.85,
      comparisonShoppingIntensity: 0.4, reviewDependence: 0.5, influencerInfluence: 0.85,
      sensitivityDeliveryTime: 0.5, sensitivityReturnFriction: 0.3,
      freeShippingThreshold: 2000, preferredPaymentMethods: ["UPI", "cards", "BNPL"],
      wishlistUsageScore: 0.7, notificationOptInScore: 0.95,
      paymentMethodUpi: 0.55, paymentMethodCod: 0.1, paymentMethodCard: 0.35
    },
    productPreferences: {
      categories: ["graphic-tees", "hoodies", "cargo-pants", "oversized-tshirts", "joggers", "sneakers"],
      categoryAffinityTshirts: 0.95, categoryAffinityShirts: 0.25, categoryAffinityJeans: 0.6,
      categoryAffinityTrousers: 0.35, categoryAffinityShorts: 0.55, categoryAffinityJoggers: 0.75,
      categoryAffinityHoodies: 0.9, categoryAffinityDresses: 0, categoryAffinityKurtas: 0.1,
      categoryAffinityLoungewear: 0.5,
      fabricPreferences: ["heavy-cotton", "fleece", "canvas", "premium-jersey"],
      fabricRankingCotton: 0.85, fabricRankingLinen: 0.2, fabricRankingDenim: 0.6,
      fabricRankingPolyester: 0.5, fabricRankingFleece: 0.85, fabricRankingModal: 0.35,
      breathabilityImportance: 0.6, wrinkleResistanceImportance: 0.25,
      sustainabilityConcern: 0.3, seasonalFabricShiftTendency: 0.45,
      colorPreferences: ["black", "earth-tones", "bold-graphics", "limited-edition-colors"],
      colorNeutralsRatio: 0.45, colorEarthTonesRatio: 0.2, colorPastelsRatio: 0.05,
      colorBrightsRatio: 0.15, colorBoldRatio: 0.15, printSolidRatio: 0.35,
      patternStripes: 0.2, patternChecks: 0.1, patternGraphics: 0.9, statementPieceTolerance: 0.85,
      fitPreference: "oversized-relaxed", fitPreferenceOverall: "oversized",
      fitPreferenceTops: "oversized", fitPreferenceBottoms: "relaxed/tapered",
      risePreference: "low-mid", lengthPreferenceTops: "long/oversized", lengthPreferenceBottoms: "full/stacked",
      sleevePreference: "half/oversized", necklinePreference: "crew/mock",
      waistbandPreference: "drawstring/elastic", comfortStructureRatio: 0.75,
      sizeConsistencyExpectation: 0.6, sizeInclusivityImportance: 0.7,
      occasionWorkwear: 0.1, occasionCasual: 0.65, occasionParty: 0.15, occasionTravel: 0.15, occasionHome: 0.15
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1000, comfortPriceTshirtsMax: 3000,
      comfortPriceShirtsMin: 1200, comfortPriceShirtsMax: 2500,
      comfortPriceJeansMin: 1500, comfortPriceJeansMax: 3500,
      comfortPriceTrousersMin: 1500, comfortPriceTrousersMax: 4000,
      comfortPriceShortsMin: 800, comfortPriceShortsMax: 2000,
      comfortPriceJoggersMin: 1200, comfortPriceJoggersMax: 3000,
      comfortPriceHoodiesMin: 2000, comfortPriceHoodiesMax: 5000,
      comfortPriceDressesMin: 0, comfortPriceDressesMax: 0,
      maxWillingToPayMultiplier: 2.0, typicalDiscountExpectation: 0.1,
      discountDependenceScore: 0.2, priceElasticityIndicator: "varies-by-hype",
      priceQualityAssociation: 0.5, elasticity: -0.3, crossElasticity: 0.2,
      discountDependence: "low-for-exclusives", minimumDiscountThreshold: 0.4,
      seasonalSpendFestive: 0.8, seasonalSpendSale: 0.7, seasonalSpendRegular: 0.9,
      ltvOrientation: "variable-hype-driven", annualFashionSpend: 45000, walletShare: 0.25
    },
    brandPsychology: {
      priceAnchor: "hype-driven", expectedPricePoint: 2000,
      brandLoyaltyScore: 0.5, premiumWillingness: 0.8, valuePerceptionScore: 0.3,
      qualityExpectation: 0.5, brandSwitchingTendency: 0.7, priceMemoryStrength: 0.4,
      referencePointSensitivity: 0.3, brandTrustScore: 0.6,
      brandFamiliarity: ["streetwear", "hype-brands", "collaborations"],
      aspirationalBrands: ["international-streetwear", "luxury-collabs"],
      domesticBrandAffinity: 0.45, newBrandTrialWillingness: 0.75, brandAdvocacyLikelihood: 0.85
    },
    digitalBehavior: {
      deviceAndroid: 0.55, deviceIos: 0.4, deviceDesktop: 0.05,
      sessionTimePreference: "night", scrollDepthEngagement: 0.9,
      personalizationResponse: 0.75, socialPlatformInstagram: 0.95, socialPlatformYoutube: 0.8
    }
  },
  {
    name: "Aditya Singh",
    code: "M-VAL-T23",
    segment: "Value Maximizer",
    gender: "male",
    baseDescription: "Deal-hunting male aged 22-35 from Tier 2/3 cities who optimizes value through strategic marketplace shopping. Highly price-conscious with strong discount affinity. Prioritizes functionality and durability over brand prestige. Builds practical wardrobe through calculated bulk purchases during sales.",
    demographics: {
      ageRange: "22-35", ageMean: 28, ageMedian: 27, gender: "Male",
      incomeRange: "25000-50000", incomeMean: 35000, incomePercentile: 45,
      cityTier: "Tier2/Tier3", region: "North/East/Central", urbanRuralSplit: 0.7,
      relationship: "varies", household: "joint family", householdSize: 5,
      occupation: "Salaried/Small Business", education: "Graduate",
      employmentType: "Full-time/Self-employed", workFromHome: 0.3,
      hasChildren: false, homeOwnership: "family-owned", dependents: 2
    },
    lifestyle: {
      dailyRoutine: "office/shop-9-6", commuteStyle: "bike/public", physicalActivity: "low-moderate",
      gymFrequency: 0, socialLifeIntensity: "medium", weekendBehavior: "family-local-market",
      travelFrequencyDomestic: 1, travelFrequencyInternational: 0,
      wardrobeMixFormal: 0.25, wardrobeMixCasual: 0.65, wardrobeMixAthleisure: 0.1
    },
    fashionOrientation: {
      styleIdentity: "practical-basic", fashionInvolvementScore: 0.3,
      trendAdoptionSpeed: "late-adopter", brandConsciousness: 0.3,
      toleranceBoldSilhouettes: 0.2, toleranceLogos: 0.4, toleranceExperimentalFits: 0.15,
      colorAdventurousness: 0.25, printOpenness: 0.3, sustainabilityPriority: 0.2,
      localBrandPreference: 0.85, internationalBrandAspiration: 0.25
    },
    psychographics: {
      coreValues: ["value", "durability", "practicality", "family", "savings"],
      valsSegment: "Believers/Strivers", lifestyle: "Family-oriented, practical, value-conscious",
      fashionOrientation: "functional", fashionInvolvement: 0.3,
      socialMediaInfluence: 0.5, peerInfluence: 0.6, celebrityInfluence: 0.35,
      sustainabilityAwareness: 0.2, noveltySeekingScore: 0.2, riskTolerance: 0.2,
      impulsivityScore: 0.3, planningHorizon: "sale-driven", selfImageImportance: 0.45
    },
    shoppingPreferences: {
      channel: ["online-marketplaces", "local-stores", "wholesale"],
      primaryChannel: "online-marketplaces", secondaryChannel: "local-stores",
      onlineOfflineRatio: 0.6, channelSwitchingTendency: 0.7,
      triggers: ["discounts", "bulk-deals", "necessity", "seasonal-sales", "durability"],
      basketBehavior: "bulk-sale-driven", averageBasketSize: 5, averageOrderValue: 1500,
      purchaseFrequencyMonthly: 0.25, browsingToConversion: 0.2, cartAbandonmentRate: 0.5,
      returnRate: 0.15, returnTolerance: "high", researchIntensity: 0.8,
      comparisonShoppingIntensity: 0.95, reviewDependence: 0.85, influencerInfluence: 0.35,
      sensitivityDeliveryTime: 0.4, sensitivityReturnFriction: 0.6,
      freeShippingThreshold: 200, preferredPaymentMethods: ["COD", "UPI"],
      wishlistUsageScore: 0.75, notificationOptInScore: 0.85,
      paymentMethodUpi: 0.35, paymentMethodCod: 0.55, paymentMethodCard: 0.1
    },
    productPreferences: {
      categories: ["tshirts", "shirts", "jeans", "trousers", "multipacks"],
      categoryAffinityTshirts: 0.85, categoryAffinityShirts: 0.75, categoryAffinityJeans: 0.8,
      categoryAffinityTrousers: 0.75, categoryAffinityShorts: 0.5, categoryAffinityJoggers: 0.4,
      categoryAffinityHoodies: 0.35, categoryAffinityDresses: 0, categoryAffinityKurtas: 0.55,
      categoryAffinityLoungewear: 0.45,
      fabricPreferences: ["cotton", "cotton-polyester", "denim"],
      fabricRankingCotton: 0.9, fabricRankingLinen: 0.3, fabricRankingDenim: 0.75,
      fabricRankingPolyester: 0.6, fabricRankingFleece: 0.35, fabricRankingModal: 0.25,
      breathabilityImportance: 0.7, wrinkleResistanceImportance: 0.5,
      sustainabilityConcern: 0.15, seasonalFabricShiftTendency: 0.4,
      colorPreferences: ["navy", "black", "white", "grey", "light-blue"],
      colorNeutralsRatio: 0.7, colorEarthTonesRatio: 0.15, colorPastelsRatio: 0.1,
      colorBrightsRatio: 0.03, colorBoldRatio: 0.02, printSolidRatio: 0.8,
      patternStripes: 0.35, patternChecks: 0.4, patternGraphics: 0.15, statementPieceTolerance: 0.1,
      fitPreference: "regular", fitPreferenceOverall: "regular",
      fitPreferenceTops: "regular", fitPreferenceBottoms: "regular",
      risePreference: "mid", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "full",
      sleevePreference: "half/full", necklinePreference: "collar/crew",
      waistbandPreference: "structured", comfortStructureRatio: 0.5,
      sizeConsistencyExpectation: 0.6, sizeInclusivityImportance: 0.55,
      occasionWorkwear: 0.35, occasionCasual: 0.5, occasionParty: 0.05, occasionTravel: 0.1, occasionHome: 0.2
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 250, comfortPriceTshirtsMax: 500,
      comfortPriceShirtsMin: 350, comfortPriceShirtsMax: 700,
      comfortPriceJeansMin: 500, comfortPriceJeansMax: 1000,
      comfortPriceTrousersMin: 400, comfortPriceTrousersMax: 800,
      comfortPriceShortsMin: 200, comfortPriceShortsMax: 450,
      comfortPriceJoggersMin: 300, comfortPriceJoggersMax: 600,
      comfortPriceHoodiesMin: 400, comfortPriceHoodiesMax: 900,
      comfortPriceDressesMin: 0, comfortPriceDressesMax: 0,
      maxWillingToPayMultiplier: 1.05, typicalDiscountExpectation: 0.4,
      discountDependenceScore: 0.95, priceElasticityIndicator: "very-high",
      priceQualityAssociation: 0.35, elasticity: -0.85, crossElasticity: 0.55,
      discountDependence: "very-high", minimumDiscountThreshold: 0.1,
      seasonalSpendFestive: 1.6, seasonalSpendSale: 2.2, seasonalSpendRegular: 0.5,
      ltvOrientation: "infrequent-bulk", annualFashionSpend: 12000, walletShare: 0.08
    },
    brandPsychology: {
      priceAnchor: "budget", expectedPricePoint: 400,
      brandLoyaltyScore: 0.25, premiumWillingness: 0.1, valuePerceptionScore: 0.95,
      qualityExpectation: 0.45, brandSwitchingTendency: 0.85, priceMemoryStrength: 0.95,
      referencePointSensitivity: 0.9, brandTrustScore: 0.35,
      brandFamiliarity: ["value-brands", "unbranded", "marketplace-labels"],
      aspirationalBrands: ["mass-market"],
      domesticBrandAffinity: 0.9, newBrandTrialWillingness: 0.8, brandAdvocacyLikelihood: 0.25
    },
    digitalBehavior: {
      deviceAndroid: 0.95, deviceIos: 0.03, deviceDesktop: 0.02,
      sessionTimePreference: "night", scrollDepthEngagement: 0.75,
      personalizationResponse: 0.6, socialPlatformInstagram: 0.5, socialPlatformYoutube: 0.7
    }
  },
  {
    name: "Rohan Kapoor",
    code: "M-SCS-HYB",
    segment: "Smart Casual Hybrid",
    gender: "male",
    baseDescription: "Versatile WFH professional aged 26-38 who curates a flexible wardrobe for seamless work-to-casual transitions. Values pieces that perform across contexts from video calls to weekend outings. Moderate fashion involvement with preference for smart-casual versatility and comfort-style balance.",
    demographics: {
      ageRange: "26-38", ageMean: 31, ageMedian: 30, gender: "Male",
      incomeRange: "60000-120000", incomeMean: 85000, incomePercentile: 78,
      cityTier: "Metro/Tier1", region: "All metros", urbanRuralSplit: 0.95,
      relationship: "married/committed", household: "nuclear/DINK", householdSize: 2.2,
      occupation: "Tech/Media Professional", education: "Graduate/Post-Graduate",
      employmentType: "Full-time hybrid", workFromHome: 0.7,
      hasChildren: false, homeOwnership: "rented/owned", dependents: 0
    },
    lifestyle: {
      dailyRoutine: "WFH-with-office-days", commuteStyle: "cab/car", physicalActivity: "moderate",
      gymFrequency: 3, socialLifeIntensity: "medium-high", weekendBehavior: "brunch-socializing-relaxing",
      travelFrequencyDomestic: 4, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.2, wardrobeMixCasual: 0.5, wardrobeMixAthleisure: 0.3
    },
    fashionOrientation: {
      styleIdentity: "smart-casual-hybrid", fashionInvolvementScore: 0.6,
      trendAdoptionSpeed: "mainstream", brandConsciousness: 0.65,
      toleranceBoldSilhouettes: 0.35, toleranceLogos: 0.4, toleranceExperimentalFits: 0.35,
      colorAdventurousness: 0.5, printOpenness: 0.4, sustainabilityPriority: 0.55,
      localBrandPreference: 0.55, internationalBrandAspiration: 0.55
    },
    psychographics: {
      coreValues: ["versatility", "comfort", "practicality", "style", "quality"],
      valsSegment: "Achievers/Makers", lifestyle: "Balanced professional, quality-conscious",
      fashionOrientation: "smart-casual", fashionInvolvement: 0.6,
      socialMediaInfluence: 0.5, peerInfluence: 0.55, celebrityInfluence: 0.25,
      sustainabilityAwareness: 0.55, noveltySeekingScore: 0.45, riskTolerance: 0.4,
      impulsivityScore: 0.35, planningHorizon: "medium-term", selfImageImportance: 0.7
    },
    shoppingPreferences: {
      channel: ["brand-websites", "online-apps", "mall-stores"],
      primaryChannel: "brand-websites", secondaryChannel: "online-apps",
      onlineOfflineRatio: 0.7, channelSwitchingTendency: 0.5,
      triggers: ["versatility", "quality", "fit", "brand-value", "reviews"],
      basketBehavior: "regular-curated", averageBasketSize: 3, averageOrderValue: 4500,
      purchaseFrequencyMonthly: 0.6, browsingToConversion: 0.32, cartAbandonmentRate: 0.28,
      returnRate: 0.1, returnTolerance: "medium", researchIntensity: 0.7,
      comparisonShoppingIntensity: 0.6, reviewDependence: 0.7, influencerInfluence: 0.35,
      sensitivityDeliveryTime: 0.55, sensitivityReturnFriction: 0.45,
      freeShippingThreshold: 2000, preferredPaymentMethods: ["cards", "UPI"],
      wishlistUsageScore: 0.6, notificationOptInScore: 0.55,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.1, paymentMethodCard: 0.5
    },
    productPreferences: {
      categories: ["polo-shirts", "chinos", "casual-shirts", "tshirts", "joggers", "smart-jackets"],
      categoryAffinityTshirts: 0.8, categoryAffinityShirts: 0.8, categoryAffinityJeans: 0.7,
      categoryAffinityTrousers: 0.8, categoryAffinityShorts: 0.55, categoryAffinityJoggers: 0.65,
      categoryAffinityHoodies: 0.55, categoryAffinityDresses: 0, categoryAffinityKurtas: 0.35,
      categoryAffinityLoungewear: 0.55,
      fabricPreferences: ["cotton", "linen-blend", "tech-fabrics", "jersey"],
      fabricRankingCotton: 0.9, fabricRankingLinen: 0.7, fabricRankingDenim: 0.6,
      fabricRankingPolyester: 0.5, fabricRankingFleece: 0.5, fabricRankingModal: 0.65,
      breathabilityImportance: 0.8, wrinkleResistanceImportance: 0.75,
      sustainabilityConcern: 0.55, seasonalFabricShiftTendency: 0.55,
      colorPreferences: ["navy", "grey", "olive", "white", "pastels"],
      colorNeutralsRatio: 0.5, colorEarthTonesRatio: 0.25, colorPastelsRatio: 0.15,
      colorBrightsRatio: 0.05, colorBoldRatio: 0.05, printSolidRatio: 0.75,
      patternStripes: 0.35, patternChecks: 0.3, patternGraphics: 0.2, statementPieceTolerance: 0.3,
      fitPreference: "slim-regular", fitPreferenceOverall: "slim",
      fitPreferenceTops: "slim", fitPreferenceBottoms: "slim",
      risePreference: "mid", lengthPreferenceTops: "regular", lengthPreferenceBottoms: "full",
      sleevePreference: "half/full", necklinePreference: "polo/collar/crew",
      waistbandPreference: "structured/stretch", comfortStructureRatio: 0.55,
      sizeConsistencyExpectation: 0.8, sizeInclusivityImportance: 0.5,
      occasionWorkwear: 0.35, occasionCasual: 0.4, occasionParty: 0.1, occasionTravel: 0.2, occasionHome: 0.15
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1000, comfortPriceTshirtsMax: 1800,
      comfortPriceShirtsMin: 1500, comfortPriceShirtsMax: 2800,
      comfortPriceJeansMin: 1800, comfortPriceJeansMax: 3200,
      comfortPriceTrousersMin: 1500, comfortPriceTrousersMax: 3000,
      comfortPriceShortsMin: 800, comfortPriceShortsMax: 1500,
      comfortPriceJoggersMin: 1000, comfortPriceJoggersMax: 2000,
      comfortPriceHoodiesMin: 1500, comfortPriceHoodiesMax: 3000,
      comfortPriceDressesMin: 0, comfortPriceDressesMax: 0,
      maxWillingToPayMultiplier: 1.35, typicalDiscountExpectation: 0.18,
      discountDependenceScore: 0.45, priceElasticityIndicator: "medium",
      priceQualityAssociation: 0.7, elasticity: -0.4, crossElasticity: 0.25,
      discountDependence: "moderate", minimumDiscountThreshold: 0.2,
      seasonalSpendFestive: 1.15, seasonalSpendSale: 1.35, seasonalSpendRegular: 0.9,
      ltvOrientation: "regular-moderate", annualFashionSpend: 55000, walletShare: 0.09
    },
    brandPsychology: {
      priceAnchor: "mid-premium", expectedPricePoint: 1600,
      brandLoyaltyScore: 0.6, premiumWillingness: 0.6, valuePerceptionScore: 0.65,
      qualityExpectation: 0.75, brandSwitchingTendency: 0.4, priceMemoryStrength: 0.6,
      referencePointSensitivity: 0.5, brandTrustScore: 0.7,
      brandFamiliarity: ["smart-casual-brands", "premium-basics"],
      aspirationalBrands: ["international-smart-casual"],
      domesticBrandAffinity: 0.6, newBrandTrialWillingness: 0.5, brandAdvocacyLikelihood: 0.6
    },
    digitalBehavior: {
      deviceAndroid: 0.5, deviceIos: 0.45, deviceDesktop: 0.05,
      sessionTimePreference: "evening", scrollDepthEngagement: 0.6,
      personalizationResponse: 0.65, socialPlatformInstagram: 0.6, socialPlatformYoutube: 0.55
    }
  }
];

// T-Shirt and Pants Only Demo Products
const DEMO_PRODUCTS = [
  {
    name: "Classic Cotton Crew Tee",
    category: "tshirt",
    subcategory: "basics",
    price: 799,
    original_price: 999,
    description: "Essential cotton crew neck t-shirt with regular fit. Soft ring-spun cotton for everyday comfort.",
    tags: ["cotton", "basics", "everyday", "crew-neck", "regular-fit"],
    brand: "Lovable Apparel",
    sku: "DEMO-TSH-001",
    status: "analyzed",
    extracted_features: {
      material: "cotton",
      style: "casual",
      fit: "regular",
      neckline: "crew",
      sleeve: "half",
      color: "navy",
      pattern: "solid",
      occasion: "everyday"
    }
  },
  {
    name: "Graphic Print Tee",
    category: "tshirt",
    subcategory: "graphic",
    price: 899,
    original_price: 1199,
    description: "Bold graphic print t-shirt with relaxed fit. Premium cotton blend for statement style.",
    tags: ["graphic", "print", "relaxed-fit", "statement", "casual"],
    brand: "Lovable Apparel",
    sku: "DEMO-TSH-002",
    status: "analyzed",
    extracted_features: {
      material: "cotton-blend",
      style: "casual",
      fit: "relaxed",
      neckline: "crew",
      sleeve: "half",
      color: "black",
      pattern: "graphic",
      occasion: "casual"
    }
  },
  {
    name: "V-Neck Essential Tee",
    category: "tshirt",
    subcategory: "basics",
    price: 699,
    original_price: 899,
    description: "Classic v-neck t-shirt in soft cotton. Slim fit for a modern silhouette.",
    tags: ["v-neck", "slim-fit", "basics", "cotton", "essential"],
    brand: "Lovable Apparel",
    sku: "DEMO-TSH-003",
    status: "analyzed",
    extracted_features: {
      material: "cotton",
      style: "casual",
      fit: "slim",
      neckline: "v-neck",
      sleeve: "half",
      color: "white",
      pattern: "solid",
      occasion: "everyday"
    }
  },
  {
    name: "Oversized Street Tee",
    category: "tshirt",
    subcategory: "streetwear",
    price: 1099,
    original_price: 1399,
    description: "Oversized drop-shoulder t-shirt for streetwear style. Heavy cotton construction.",
    tags: ["oversized", "streetwear", "drop-shoulder", "heavy-cotton", "urban"],
    brand: "Lovable Apparel",
    sku: "DEMO-TSH-004",
    status: "analyzed",
    extracted_features: {
      material: "heavy-cotton",
      style: "streetwear",
      fit: "oversized",
      neckline: "crew",
      sleeve: "half",
      color: "grey",
      pattern: "solid",
      occasion: "casual"
    }
  },
  {
    name: "Stretch Slim Jeans",
    category: "pants",
    subcategory: "jeans",
    price: 2299,
    original_price: 2799,
    description: "Mid-rise slim-fit jeans with 2% stretch for comfort. Dark indigo wash with classic 5-pocket styling.",
    tags: ["denim", "stretch", "slim-fit", "mid-rise", "jeans"],
    brand: "Lovable Apparel",
    sku: "DEMO-PNT-001",
    status: "analyzed",
    extracted_features: {
      material: "stretch-denim",
      style: "casual",
      fit: "slim",
      rise: "mid",
      color: "dark-indigo",
      pattern: "solid",
      occasion: "everyday"
    }
  },
  {
    name: "Comfort Chinos",
    category: "pants",
    subcategory: "chinos",
    price: 1699,
    original_price: 1999,
    description: "Stretch cotton chinos with regular fit. Versatile smart-casual option for work-to-weekend wear.",
    tags: ["chino", "stretch", "regular-fit", "smart-casual", "versatile"],
    brand: "Lovable Apparel",
    sku: "DEMO-PNT-002",
    status: "analyzed",
    extracted_features: {
      material: "cotton-stretch",
      style: "smart-casual",
      fit: "regular",
      rise: "mid",
      color: "khaki",
      pattern: "solid",
      occasion: "work-weekend"
    }
  },
  {
    name: "Relaxed Fit Trousers",
    category: "pants",
    subcategory: "trousers",
    price: 1899,
    original_price: 2299,
    description: "Relaxed fit cotton trousers with pleated front. Perfect for formal and semi-formal occasions.",
    tags: ["trousers", "relaxed-fit", "pleated", "formal", "cotton"],
    brand: "Lovable Apparel",
    sku: "DEMO-PNT-003",
    status: "analyzed",
    extracted_features: {
      material: "cotton",
      style: "formal",
      fit: "relaxed",
      rise: "high",
      color: "charcoal",
      pattern: "solid",
      occasion: "formal"
    }
  },
  {
    name: "Athletic Joggers",
    category: "pants",
    subcategory: "joggers",
    price: 1299,
    original_price: 1599,
    description: "Moisture-wicking joggers with tapered fit. Zippered pockets and elastic cuffs for active lifestyle.",
    tags: ["joggers", "athleisure", "moisture-wicking", "tapered", "active"],
    brand: "Lovable Apparel",
    sku: "DEMO-PNT-004",
    status: "analyzed",
    extracted_features: {
      material: "polyester-blend",
      style: "athleisure",
      fit: "tapered",
      rise: "mid",
      color: "charcoal",
      pattern: "solid",
      occasion: "active-casual"
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

    const brandContext = {
      name: customizeForBrand || "Generic Brand",
      segment: brandSegment || "premium",
      priceRange: priceRange || { min: 500, max: 1500 },
    };

    console.log(`Generating 10 personas for tenant ${tenantId} (${brandContext.segment} segment)`);

    const generatedPersonas = [];

    for (const basePersona of BASE_PERSONAS) {
      const expandedAttributes = await expandPersonaAttributes(
        basePersona, 
        brandContext,
        lovableApiKey
      );

      const fullPersona = {
        tenant_id: tenantId,
        name: basePersona.name,
        description: basePersona.baseDescription,
        avatar_emoji: basePersona.gender === "female" ? "👩" : "👨",
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
          ...basePersona.lifestyle,
          ...basePersona.fashionOrientation,
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
          ...basePersona.digitalBehavior,
          ...expandedAttributes.brandPsychology
        },
        attribute_vector: expandedAttributes.attributeVector,
        is_active: true
      };

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
      console.log(`Created persona: ${basePersona.name} (${basePersona.gender}) with ${expandedAttributes.attributeVector.length} attributes`);
    }

    console.log("Creating demo products...");
    const demoProducts = await createDemoProducts(supabase, tenantId);
    console.log(`Created ${demoProducts.length} demo products`);

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
          gender: BASE_PERSONAS.find(bp => bp.name === p.name)?.gender || "unknown",
          segment: BASE_PERSONAS.find(bp => bp.name === p.name)?.segment || "unknown",
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
Generate rich, realistic attributes based on VALS framework and AIO methodology.
Focus on general apparel: tshirts, shirts, jeans, trousers, shorts, joggers, hoodies, dresses (for women), kurtas.
Return normalized attribute vectors (0-1 scale) for ML compatibility with 100+ attributes.`;

  const userPrompt = `Expand this ${basePersona.gender} persona into 100+ detailed ML-ready attributes:

BASE PERSONA: ${basePersona.name} (${basePersona.segment})
Gender: ${basePersona.gender}
Description: ${basePersona.baseDescription}
Demographics: ${JSON.stringify(basePersona.demographics)}
Psychographics: ${JSON.stringify(basePersona.psychographics)}
Lifestyle: ${JSON.stringify(basePersona.lifestyle)}
Fashion Orientation: ${JSON.stringify(basePersona.fashionOrientation)}
Shopping: ${JSON.stringify(basePersona.shoppingPreferences)}
Products: ${JSON.stringify(basePersona.productPreferences)}
Pricing: ${JSON.stringify(basePersona.priceBehavior)}
Brand Psychology: ${JSON.stringify(basePersona.brandPsychology)}
Digital Behavior: ${JSON.stringify(basePersona.digitalBehavior)}

BRAND CONTEXT:
- Brand Segment: ${brandContext.segment}
- Price Range: ₹${brandContext.priceRange.min} - ₹${brandContext.priceRange.max}

Generate 144+ normalized attributes (0-1 scale) across these categories:
1. DEMOGRAPHICS (15+ attrs): age distribution, income percentiles, education scores, urban index
2. LIFESTYLE (12+ attrs): activity levels, social engagement, routine patterns
3. FASHION_ORIENTATION (12+ attrs): trend adoption, brand consciousness, style preferences
4. PSYCHOGRAPHICS (15+ attrs): values, personality traits, influence susceptibility
5. SHOPPING_BEHAVIOR (18+ attrs): channel preferences, conversion metrics, payment preferences
6. PRICE_SENSITIVITY (20+ attrs): price ranges by category, elasticity scores, discount response
7. CATEGORY_PREFERENCES (15+ attrs): affinity scores per apparel category
8. FIT_SILHOUETTE (12+ attrs): fit preferences, rise, length preferences
9. FABRIC_MATERIAL (10+ attrs): fabric rankings, comfort priorities
10. COLOR_PATTERN (10+ attrs): color palette ratios, pattern preferences
11. DIGITAL_BEHAVIOR (8+ attrs): device usage, engagement scores
12. BRAND_PSYCHOLOGY (12+ attrs): loyalty, premium willingness, trust scores`;

  try {
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
            description: "Return expanded persona attributes with 144+ normalized values",
            parameters: {
              type: "object",
              properties: {
                demographics: { type: "object" },
                psychographics: { type: "object" },
                shoppingPreferences: { type: "object" },
                productPreferences: { type: "object" },
                priceBehavior: { type: "object" },
                brandPsychology: { type: "object" },
                attributeVector: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value: { type: "number", minimum: 0, maximum: 1 },
                      category: { type: "string" }
                    }
                  }
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
      console.error("AI expansion failed, using comprehensive defaults");
      return {
        demographics: {},
        psychographics: {},
        shoppingPreferences: {},
        productPreferences: {},
        priceBehavior: {},
        brandPsychology: {},
        attributeVector: generateComprehensiveAttributeVector(basePersona)
      };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      const aiVector = parsed.attributeVector || [];
      const defaultVector = generateComprehensiveAttributeVector(basePersona);
      
      // Merge AI-generated with defaults to ensure 100+ attributes
      const mergedVector = aiVector.length >= 100 ? aiVector : [...aiVector, ...defaultVector.slice(aiVector.length)];
      
      return {
        demographics: parsed.demographics || {},
        psychographics: parsed.psychographics || {},
        shoppingPreferences: parsed.shoppingPreferences || {},
        productPreferences: parsed.productPreferences || {},
        priceBehavior: parsed.priceBehavior || {},
        brandPsychology: parsed.brandPsychology || {},
        attributeVector: mergedVector
      };
    }
  } catch (error) {
    console.error("AI expansion error:", error);
  }

  return {
    demographics: {},
    psychographics: {},
    shoppingPreferences: {},
    productPreferences: {},
    priceBehavior: {},
    brandPsychology: {},
    attributeVector: generateComprehensiveAttributeVector(basePersona)
  };
}

function generateComprehensiveAttributeVector(basePersona: typeof BASE_PERSONAS[0]) {
  const vector: { name: string; value: number; category: string }[] = [];
  
  // Demographics (15 attributes)
  const ageMin = parseInt(basePersona.demographics.ageRange.split("-")[0]);
  vector.push({ name: "age_18_24", value: ageMin <= 22 ? 0.8 : ageMin <= 26 ? 0.5 : 0.2, category: "demographics" });
  vector.push({ name: "age_25_34", value: ageMin >= 25 && ageMin < 35 ? 0.8 : 0.3, category: "demographics" });
  vector.push({ name: "age_35_plus", value: ageMin >= 35 ? 0.8 : 0.2, category: "demographics" });
  vector.push({ name: "income_high", value: basePersona.demographics.incomePercentile / 100, category: "demographics" });
  vector.push({ name: "metro_city", value: basePersona.demographics.cityTier.includes("Metro") ? 0.9 : 0.4, category: "demographics" });
  vector.push({ name: "urban_index", value: basePersona.demographics.urbanRuralSplit, category: "demographics" });
  vector.push({ name: "education_high", value: basePersona.demographics.education.includes("Post") || basePersona.demographics.education.includes("MBA") ? 0.9 : 0.6, category: "demographics" });
  vector.push({ name: "professional_occupation", value: basePersona.demographics.occupation.includes("Professional") ? 0.8 : 0.5, category: "demographics" });
  vector.push({ name: "wfh_ratio", value: basePersona.demographics.workFromHome, category: "demographics" });
  vector.push({ name: "has_dependents", value: basePersona.demographics.dependents > 0 ? 0.8 : 0.2, category: "demographics" });
  vector.push({ name: "home_owner", value: basePersona.demographics.homeOwnership === "owned" ? 0.9 : 0.3, category: "demographics" });
  vector.push({ name: "household_size_norm", value: Math.min(basePersona.demographics.householdSize / 5, 1), category: "demographics" });
  vector.push({ name: "is_female", value: basePersona.gender === "female" ? 1 : 0, category: "demographics" });
  vector.push({ name: "is_male", value: basePersona.gender === "male" ? 1 : 0, category: "demographics" });
  vector.push({ name: "single_status", value: basePersona.demographics.relationship.includes("single") ? 0.8 : 0.2, category: "demographics" });

  // Lifestyle (12 attributes)
  vector.push({ name: "gym_frequency_norm", value: Math.min(basePersona.lifestyle.gymFrequency / 5, 1), category: "lifestyle" });
  vector.push({ name: "social_life_high", value: basePersona.lifestyle.socialLifeIntensity === "high" ? 0.9 : basePersona.lifestyle.socialLifeIntensity === "medium" ? 0.5 : 0.3, category: "lifestyle" });
  vector.push({ name: "travel_frequency_domestic", value: Math.min(basePersona.lifestyle.travelFrequencyDomestic / 6, 1), category: "lifestyle" });
  vector.push({ name: "travel_frequency_intl", value: Math.min(basePersona.lifestyle.travelFrequencyInternational / 2, 1), category: "lifestyle" });
  vector.push({ name: "wardrobe_formal_ratio", value: basePersona.lifestyle.wardrobeMixFormal, category: "lifestyle" });
  vector.push({ name: "wardrobe_casual_ratio", value: basePersona.lifestyle.wardrobeMixCasual, category: "lifestyle" });
  vector.push({ name: "wardrobe_athleisure_ratio", value: basePersona.lifestyle.wardrobeMixAthleisure, category: "lifestyle" });
  vector.push({ name: "physical_activity_high", value: basePersona.lifestyle.physicalActivity === "high" ? 0.9 : basePersona.lifestyle.physicalActivity === "moderate" ? 0.5 : 0.2, category: "lifestyle" });
  vector.push({ name: "car_commuter", value: basePersona.lifestyle.commuteStyle.includes("car") ? 0.8 : 0.3, category: "lifestyle" });
  vector.push({ name: "public_transport_user", value: basePersona.lifestyle.commuteStyle.includes("metro") || basePersona.lifestyle.commuteStyle.includes("public") ? 0.8 : 0.3, category: "lifestyle" });
  vector.push({ name: "weekend_social", value: basePersona.lifestyle.weekendBehavior.includes("social") || basePersona.lifestyle.weekendBehavior.includes("cafes") ? 0.8 : 0.4, category: "lifestyle" });
  vector.push({ name: "weekend_family", value: basePersona.lifestyle.weekendBehavior.includes("family") ? 0.8 : 0.3, category: "lifestyle" });

  // Fashion Orientation (12 attributes)
  vector.push({ name: "fashion_involvement", value: basePersona.fashionOrientation.fashionInvolvementScore, category: "fashion_orientation" });
  vector.push({ name: "trend_early_adopter", value: basePersona.fashionOrientation.trendAdoptionSpeed.includes("early") ? 0.9 : 0.4, category: "fashion_orientation" });
  vector.push({ name: "brand_consciousness", value: basePersona.fashionOrientation.brandConsciousness, category: "fashion_orientation" });
  vector.push({ name: "bold_silhouette_tolerance", value: basePersona.fashionOrientation.toleranceBoldSilhouettes, category: "fashion_orientation" });
  vector.push({ name: "logo_tolerance", value: basePersona.fashionOrientation.toleranceLogos, category: "fashion_orientation" });
  vector.push({ name: "experimental_fit_tolerance", value: basePersona.fashionOrientation.toleranceExperimentalFits, category: "fashion_orientation" });
  vector.push({ name: "color_adventurousness", value: basePersona.fashionOrientation.colorAdventurousness, category: "fashion_orientation" });
  vector.push({ name: "print_openness", value: basePersona.fashionOrientation.printOpenness, category: "fashion_orientation" });
  vector.push({ name: "sustainability_priority", value: basePersona.fashionOrientation.sustainabilityPriority, category: "fashion_orientation" });
  vector.push({ name: "local_brand_pref", value: basePersona.fashionOrientation.localBrandPreference, category: "fashion_orientation" });
  vector.push({ name: "intl_brand_aspiration", value: basePersona.fashionOrientation.internationalBrandAspiration, category: "fashion_orientation" });
  vector.push({ name: "style_casual", value: basePersona.fashionOrientation.styleIdentity.includes("casual") ? 0.8 : 0.4, category: "fashion_orientation" });

  // Shopping Behavior (18 attributes)
  vector.push({ name: "online_preference", value: basePersona.shoppingPreferences.onlineOfflineRatio, category: "shopping_behavior" });
  vector.push({ name: "channel_switching", value: basePersona.shoppingPreferences.channelSwitchingTendency, category: "shopping_behavior" });
  vector.push({ name: "basket_size_norm", value: Math.min(basePersona.shoppingPreferences.averageBasketSize / 5, 1), category: "shopping_behavior" });
  vector.push({ name: "aov_norm", value: Math.min(basePersona.shoppingPreferences.averageOrderValue / 10000, 1), category: "shopping_behavior" });
  vector.push({ name: "purchase_freq_norm", value: Math.min(basePersona.shoppingPreferences.purchaseFrequencyMonthly / 2, 1), category: "shopping_behavior" });
  vector.push({ name: "conversion_rate", value: basePersona.shoppingPreferences.browsingToConversion, category: "shopping_behavior" });
  vector.push({ name: "cart_abandonment", value: basePersona.shoppingPreferences.cartAbandonmentRate, category: "shopping_behavior" });
  vector.push({ name: "return_rate", value: basePersona.shoppingPreferences.returnRate, category: "shopping_behavior" });
  vector.push({ name: "research_intensity", value: basePersona.shoppingPreferences.researchIntensity, category: "shopping_behavior" });
  vector.push({ name: "comparison_shopping", value: basePersona.shoppingPreferences.comparisonShoppingIntensity, category: "shopping_behavior" });
  vector.push({ name: "review_dependence", value: basePersona.shoppingPreferences.reviewDependence, category: "shopping_behavior" });
  vector.push({ name: "influencer_influence", value: basePersona.shoppingPreferences.influencerInfluence, category: "shopping_behavior" });
  vector.push({ name: "delivery_speed_sensitivity", value: basePersona.shoppingPreferences.sensitivityDeliveryTime, category: "shopping_behavior" });
  vector.push({ name: "return_friction_sensitivity", value: basePersona.shoppingPreferences.sensitivityReturnFriction, category: "shopping_behavior" });
  vector.push({ name: "wishlist_usage", value: basePersona.shoppingPreferences.wishlistUsageScore, category: "shopping_behavior" });
  vector.push({ name: "notification_opt_in", value: basePersona.shoppingPreferences.notificationOptInScore, category: "shopping_behavior" });
  vector.push({ name: "upi_preference", value: basePersona.shoppingPreferences.paymentMethodUpi, category: "shopping_behavior" });
  vector.push({ name: "cod_preference", value: basePersona.shoppingPreferences.paymentMethodCod, category: "shopping_behavior" });

  // Price Behavior (20 attributes)
  vector.push({ name: "price_sensitive", value: Math.abs(basePersona.priceBehavior.elasticity), category: "price_behavior" });
  vector.push({ name: "discount_dependence", value: basePersona.priceBehavior.discountDependenceScore, category: "price_behavior" });
  vector.push({ name: "price_quality_association", value: basePersona.priceBehavior.priceQualityAssociation, category: "price_behavior" });
  vector.push({ name: "festive_spend_multiplier", value: Math.min(basePersona.priceBehavior.seasonalSpendFestive / 2, 1), category: "price_behavior" });
  vector.push({ name: "sale_spend_multiplier", value: Math.min(basePersona.priceBehavior.seasonalSpendSale / 2.5, 1), category: "price_behavior" });
  vector.push({ name: "annual_spend_norm", value: Math.min(basePersona.priceBehavior.annualFashionSpend / 100000, 1), category: "price_behavior" });
  vector.push({ name: "wallet_share", value: basePersona.priceBehavior.walletShare, category: "price_behavior" });
  vector.push({ name: "tshirt_price_norm", value: (basePersona.priceBehavior.comfortPriceTshirtsMax - 300) / 3700, category: "price_behavior" });
  vector.push({ name: "shirt_price_norm", value: (basePersona.priceBehavior.comfortPriceShirtsMax - 400) / 5600, category: "price_behavior" });
  vector.push({ name: "jeans_price_norm", value: (basePersona.priceBehavior.comfortPriceJeansMax - 500) / 5000, category: "price_behavior" });
  vector.push({ name: "trousers_price_norm", value: (basePersona.priceBehavior.comfortPriceTrousersMax - 400) / 6600, category: "price_behavior" });
  vector.push({ name: "shorts_price_norm", value: (basePersona.priceBehavior.comfortPriceShortsMax - 200) / 2800, category: "price_behavior" });
  vector.push({ name: "joggers_price_norm", value: (basePersona.priceBehavior.comfortPriceJoggersMax - 300) / 3700, category: "price_behavior" });
  vector.push({ name: "hoodies_price_norm", value: (basePersona.priceBehavior.comfortPriceHoodiesMax - 400) / 5600, category: "price_behavior" });
  vector.push({ name: "max_willing_multiplier", value: (basePersona.priceBehavior.maxWillingToPayMultiplier - 1) / 1, category: "price_behavior" });
  vector.push({ name: "discount_expectation", value: basePersona.priceBehavior.typicalDiscountExpectation, category: "price_behavior" });
  vector.push({ name: "elasticity_high", value: basePersona.priceBehavior.priceElasticityIndicator.includes("high") ? 0.9 : 0.4, category: "price_behavior" });
  vector.push({ name: "elasticity_low", value: basePersona.priceBehavior.priceElasticityIndicator.includes("low") ? 0.9 : 0.3, category: "price_behavior" });
  vector.push({ name: "cross_elasticity", value: basePersona.priceBehavior.crossElasticity, category: "price_behavior" });
  vector.push({ name: "min_discount_threshold", value: basePersona.priceBehavior.minimumDiscountThreshold, category: "price_behavior" });

  // Category Preferences (15 attributes)
  vector.push({ name: "affinity_tshirts", value: basePersona.productPreferences.categoryAffinityTshirts, category: "category_preferences" });
  vector.push({ name: "affinity_shirts", value: basePersona.productPreferences.categoryAffinityShirts, category: "category_preferences" });
  vector.push({ name: "affinity_jeans", value: basePersona.productPreferences.categoryAffinityJeans, category: "category_preferences" });
  vector.push({ name: "affinity_trousers", value: basePersona.productPreferences.categoryAffinityTrousers, category: "category_preferences" });
  vector.push({ name: "affinity_shorts", value: basePersona.productPreferences.categoryAffinityShorts, category: "category_preferences" });
  vector.push({ name: "affinity_joggers", value: basePersona.productPreferences.categoryAffinityJoggers, category: "category_preferences" });
  vector.push({ name: "affinity_hoodies", value: basePersona.productPreferences.categoryAffinityHoodies, category: "category_preferences" });
  vector.push({ name: "affinity_dresses", value: basePersona.productPreferences.categoryAffinityDresses, category: "category_preferences" });
  vector.push({ name: "affinity_kurtas", value: basePersona.productPreferences.categoryAffinityKurtas, category: "category_preferences" });
  vector.push({ name: "affinity_loungewear", value: basePersona.productPreferences.categoryAffinityLoungewear, category: "category_preferences" });
  vector.push({ name: "occasion_workwear", value: basePersona.productPreferences.occasionWorkwear, category: "category_preferences" });
  vector.push({ name: "occasion_casual", value: basePersona.productPreferences.occasionCasual, category: "category_preferences" });
  vector.push({ name: "occasion_party", value: basePersona.productPreferences.occasionParty, category: "category_preferences" });
  vector.push({ name: "occasion_travel", value: basePersona.productPreferences.occasionTravel, category: "category_preferences" });
  vector.push({ name: "occasion_home", value: basePersona.productPreferences.occasionHome, category: "category_preferences" });

  // Fit & Silhouette (12 attributes)
  vector.push({ name: "fit_slim", value: basePersona.productPreferences.fitPreferenceOverall === "slim" ? 0.9 : 0.3, category: "fit_silhouette" });
  vector.push({ name: "fit_regular", value: basePersona.productPreferences.fitPreferenceOverall === "regular" ? 0.9 : 0.4, category: "fit_silhouette" });
  vector.push({ name: "fit_relaxed", value: basePersona.productPreferences.fitPreferenceOverall.includes("relaxed") ? 0.9 : 0.3, category: "fit_silhouette" });
  vector.push({ name: "fit_oversized", value: basePersona.productPreferences.fitPreferenceOverall.includes("oversized") ? 0.9 : 0.2, category: "fit_silhouette" });
  vector.push({ name: "rise_high", value: basePersona.productPreferences.risePreference.includes("high") ? 0.8 : 0.3, category: "fit_silhouette" });
  vector.push({ name: "rise_mid", value: basePersona.productPreferences.risePreference.includes("mid") ? 0.8 : 0.4, category: "fit_silhouette" });
  vector.push({ name: "length_cropped", value: basePersona.productPreferences.lengthPreferenceTops.includes("cropped") ? 0.8 : 0.3, category: "fit_silhouette" });
  vector.push({ name: "length_full", value: basePersona.productPreferences.lengthPreferenceBottoms.includes("full") ? 0.8 : 0.4, category: "fit_silhouette" });
  vector.push({ name: "sleeve_half", value: basePersona.productPreferences.sleevePreference.includes("half") ? 0.8 : 0.4, category: "fit_silhouette" });
  vector.push({ name: "sleeve_full", value: basePersona.productPreferences.sleevePreference.includes("full") ? 0.8 : 0.4, category: "fit_silhouette" });
  vector.push({ name: "comfort_structure_ratio", value: basePersona.productPreferences.comfortStructureRatio, category: "fit_silhouette" });
  vector.push({ name: "size_consistency_exp", value: basePersona.productPreferences.sizeConsistencyExpectation, category: "fit_silhouette" });

  // Fabric & Material (10 attributes)
  vector.push({ name: "fabric_cotton", value: basePersona.productPreferences.fabricRankingCotton, category: "fabric_material" });
  vector.push({ name: "fabric_linen", value: basePersona.productPreferences.fabricRankingLinen, category: "fabric_material" });
  vector.push({ name: "fabric_denim", value: basePersona.productPreferences.fabricRankingDenim, category: "fabric_material" });
  vector.push({ name: "fabric_polyester", value: basePersona.productPreferences.fabricRankingPolyester, category: "fabric_material" });
  vector.push({ name: "fabric_fleece", value: basePersona.productPreferences.fabricRankingFleece, category: "fabric_material" });
  vector.push({ name: "fabric_modal", value: basePersona.productPreferences.fabricRankingModal, category: "fabric_material" });
  vector.push({ name: "breathability_importance", value: basePersona.productPreferences.breathabilityImportance, category: "fabric_material" });
  vector.push({ name: "wrinkle_resistance_imp", value: basePersona.productPreferences.wrinkleResistanceImportance, category: "fabric_material" });
  vector.push({ name: "sustainability_concern", value: basePersona.productPreferences.sustainabilityConcern, category: "fabric_material" });
  vector.push({ name: "seasonal_fabric_shift", value: basePersona.productPreferences.seasonalFabricShiftTendency, category: "fabric_material" });

  // Color & Pattern (10 attributes)
  vector.push({ name: "color_neutrals", value: basePersona.productPreferences.colorNeutralsRatio, category: "color_pattern" });
  vector.push({ name: "color_earth_tones", value: basePersona.productPreferences.colorEarthTonesRatio, category: "color_pattern" });
  vector.push({ name: "color_pastels", value: basePersona.productPreferences.colorPastelsRatio, category: "color_pattern" });
  vector.push({ name: "color_brights", value: basePersona.productPreferences.colorBrightsRatio, category: "color_pattern" });
  vector.push({ name: "color_bold", value: basePersona.productPreferences.colorBoldRatio, category: "color_pattern" });
  vector.push({ name: "print_solid_ratio", value: basePersona.productPreferences.printSolidRatio, category: "color_pattern" });
  vector.push({ name: "pattern_stripes", value: basePersona.productPreferences.patternStripes, category: "color_pattern" });
  vector.push({ name: "pattern_checks", value: basePersona.productPreferences.patternChecks, category: "color_pattern" });
  vector.push({ name: "pattern_graphics", value: basePersona.productPreferences.patternGraphics, category: "color_pattern" });
  vector.push({ name: "statement_piece_tolerance", value: basePersona.productPreferences.statementPieceTolerance, category: "color_pattern" });

  // Digital Behavior (8 attributes)
  vector.push({ name: "device_android", value: basePersona.digitalBehavior.deviceAndroid, category: "digital_behavior" });
  vector.push({ name: "device_ios", value: basePersona.digitalBehavior.deviceIos, category: "digital_behavior" });
  vector.push({ name: "device_desktop", value: basePersona.digitalBehavior.deviceDesktop, category: "digital_behavior" });
  vector.push({ name: "scroll_engagement", value: basePersona.digitalBehavior.scrollDepthEngagement, category: "digital_behavior" });
  vector.push({ name: "personalization_response", value: basePersona.digitalBehavior.personalizationResponse, category: "digital_behavior" });
  vector.push({ name: "instagram_usage", value: basePersona.digitalBehavior.socialPlatformInstagram, category: "digital_behavior" });
  vector.push({ name: "youtube_usage", value: basePersona.digitalBehavior.socialPlatformYoutube, category: "digital_behavior" });
  vector.push({ name: "evening_session", value: basePersona.digitalBehavior.sessionTimePreference.includes("evening") ? 0.8 : 0.4, category: "digital_behavior" });

  // Brand Psychology (12 attributes)
  vector.push({ name: "brand_loyalty", value: basePersona.brandPsychology.brandLoyaltyScore, category: "brand_psychology" });
  vector.push({ name: "premium_willingness", value: basePersona.brandPsychology.premiumWillingness, category: "brand_psychology" });
  vector.push({ name: "value_perception", value: basePersona.brandPsychology.valuePerceptionScore, category: "brand_psychology" });
  vector.push({ name: "quality_expectation", value: basePersona.brandPsychology.qualityExpectation, category: "brand_psychology" });
  vector.push({ name: "brand_switching", value: basePersona.brandPsychology.brandSwitchingTendency, category: "brand_psychology" });
  vector.push({ name: "price_memory", value: basePersona.brandPsychology.priceMemoryStrength, category: "brand_psychology" });
  vector.push({ name: "reference_sensitivity", value: basePersona.brandPsychology.referencePointSensitivity, category: "brand_psychology" });
  vector.push({ name: "brand_trust", value: basePersona.brandPsychology.brandTrustScore, category: "brand_psychology" });
  vector.push({ name: "domestic_brand_affinity", value: basePersona.brandPsychology.domesticBrandAffinity, category: "brand_psychology" });
  vector.push({ name: "new_brand_trial", value: basePersona.brandPsychology.newBrandTrialWillingness, category: "brand_psychology" });
  vector.push({ name: "brand_advocacy", value: basePersona.brandPsychology.brandAdvocacyLikelihood, category: "brand_psychology" });
  vector.push({ name: "expected_price_norm", value: Math.min(basePersona.brandPsychology.expectedPricePoint / 3500, 1), category: "brand_psychology" });

  return vector;
}

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
      const baseScore = 40 + Math.random() * 40;
      const likeProbability = Math.round(baseScore + (Math.random() * 20 - 10));
      
      const priceMultiplier = 0.8 + Math.random() * 0.4;
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
          explanation: `This ${product.category} shows ${likeProbability > 60 ? 'strong' : 'moderate'} alignment with ${persona.name}'s preferences based on material, style, and price sensitivity.`
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
