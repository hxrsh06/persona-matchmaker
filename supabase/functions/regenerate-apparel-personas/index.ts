import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enterprise-Grade Apparel Personas - 10 personas (5 female, 5 male) with 100+ attributes
const ENTERPRISE_PERSONAS = [
  // ======================== FEMALE PERSONAS (5) ========================
  {
    name: "Priya Sharma",
    code: "F-TRD-MIL",
    segment: "Trend-Conscious Millennial",
    segmentWeight: 0.18,
    gender: "female",
    description: "Urban professional female aged 25-32 who actively follows fashion trends through social media. Prioritizes wardrobe updates with contemporary casual wear including graphic tees, fitted jeans, and versatile pieces. High digital engagement with fashion content and peer-influenced purchasing behavior.",
    demographics: {
      ageRange: "25-32", ageMean: 28, gender: "Female",
      incomeRange: "40000-80000", incomeMean: 55000, incomePercentile: 65,
      cityTier: "Metro", region: "West/South", urbanRuralSplit: 0.95,
      relationship: "single/dating", household: "alone/roommates", householdSize: 1.5,
      occupation: "IT/Corporate Professional", education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried", workFromHome: 0.6, hasChildren: false, dependents: 0
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
      colorAdventurousness: 0.7, printOpenness: 0.65, sustainabilityPriority: 0.45
    },
    psychographics: {
      coreValues: ["style", "social-validation", "comfort", "self-expression"],
      valsSegment: "Experiencers", fashionOrientation: "trend-follower",
      socialMediaInfluence: 0.85, peerInfluence: 0.8, noveltySeekingScore: 0.8,
      impulsivityScore: 0.65, selfImageImportance: 0.85
    },
    shoppingPreferences: {
      primaryChannel: "online-apps", secondaryChannel: "mall-retail",
      onlineOfflineRatio: 0.7, averageBasketSize: 2.5, averageOrderValue: 2500,
      purchaseFrequencyMonthly: 1.2, returnRate: 0.18, reviewDependence: 0.75,
      paymentMethodUpi: 0.5, paymentMethodCod: 0.2, paymentMethodCard: 0.3
    },
    productPreferences: {
      categories: ["tshirts", "jeans", "dresses", "tops", "casual-wear", "co-ords"],
      categoryAffinities: { tshirts: 0.85, jeans: 0.8, dresses: 0.75, shirts: 0.5 },
      fabricPreferences: ["cotton", "denim", "linen", "jersey"],
      colorPreferences: ["pastels", "trending-colors", "neutrals", "prints"],
      fitPreference: "fitted-to-relaxed"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 800, comfortPriceTshirtsMax: 1500,
      comfortPriceJeansMin: 1500, comfortPriceJeansMax: 2500,
      maxWillingToPayMultiplier: 1.3, discountDependence: 0.7,
      priceElasticityIndicator: "medium", annualFashionSpend: 35000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.4, premiumWillingness: 0.5, qualityExpectation: 0.6,
      brandSwitchingTendency: 0.6, newBrandTrialWillingness: 0.7
    },
    digitalBehavior: {
      deviceAndroid: 0.6, deviceIos: 0.35, sessionTimePreference: "evening",
      personalizationResponse: 0.75, socialPlatformInstagram: 0.9
    }
  },
  {
    name: "Ananya Mehta",
    code: "F-QTY-PRO",
    segment: "Quality-Conscious Professional",
    segmentWeight: 0.12,
    gender: "female",
    description: "Established professional female aged 30-42 with discerning taste for premium fabrics and timeless silhouettes. Invests in well-constructed garments for professional and social contexts. Values longevity over trends.",
    demographics: {
      ageRange: "30-42", ageMean: 35, gender: "Female",
      incomeRange: "80000-150000", incomeMean: 110000, incomePercentile: 85,
      cityTier: "Metro/Tier1", region: "North/West", urbanRuralSplit: 0.98,
      relationship: "married/committed", household: "nuclear family", householdSize: 3.2,
      occupation: "Senior Professional/Manager", education: "Post-Graduate/MBA",
      employmentType: "Full-time salaried", workFromHome: 0.4, hasChildren: true, dependents: 1
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
      colorAdventurousness: 0.4, sustainabilityPriority: 0.6
    },
    psychographics: {
      coreValues: ["quality", "durability", "elegance", "professionalism"],
      valsSegment: "Achievers", fashionOrientation: "classic-premium",
      socialMediaInfluence: 0.4, peerInfluence: 0.5, noveltySeekingScore: 0.35,
      impulsivityScore: 0.2, selfImageImportance: 0.8
    },
    shoppingPreferences: {
      primaryChannel: "brand-stores", secondaryChannel: "premium-online",
      onlineOfflineRatio: 0.45, averageBasketSize: 3, averageOrderValue: 8000,
      purchaseFrequencyMonthly: 0.35, returnRate: 0.08, reviewDependence: 0.5,
      paymentMethodUpi: 0.35, paymentMethodCod: 0.05, paymentMethodCard: 0.6
    },
    productPreferences: {
      categories: ["formal-tops", "trousers", "blazers", "premium-tshirts", "workwear"],
      categoryAffinities: { trousers: 0.9, shirts: 0.85, dresses: 0.7, tshirts: 0.6 },
      fabricPreferences: ["premium-cotton", "linen", "silk-blend", "tencel"],
      colorPreferences: ["neutrals", "earth-tones", "classic-navy", "muted-tones"],
      fitPreference: "tailored"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1500, comfortPriceTshirtsMax: 3000,
      comfortPriceJeansMin: 2500, comfortPriceJeansMax: 4500,
      maxWillingToPayMultiplier: 1.5, discountDependence: 0.3,
      priceElasticityIndicator: "low", annualFashionSpend: 80000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.8, premiumWillingness: 0.85, qualityExpectation: 0.9,
      brandSwitchingTendency: 0.2, newBrandTrialWillingness: 0.25
    },
    digitalBehavior: {
      deviceAndroid: 0.3, deviceIos: 0.6, sessionTimePreference: "afternoon",
      personalizationResponse: 0.6, socialPlatformInstagram: 0.5
    }
  },
  {
    name: "Sneha Patel",
    code: "F-BDG-STU",
    segment: "Budget-Conscious Student",
    segmentWeight: 0.15,
    gender: "female",
    description: "Value-seeking female aged 20-26 in academic or early career phase. Maximizes wardrobe variety within constrained budget through strategic sale shopping. High price sensitivity with strong discount affinity.",
    demographics: {
      ageRange: "20-26", ageMean: 23, gender: "Female",
      incomeRange: "15000-35000", incomeMean: 22000, incomePercentile: 35,
      cityTier: "All cities", region: "All regions", urbanRuralSplit: 0.75,
      relationship: "single", household: "hostel/family", householdSize: 4,
      occupation: "Student/Entry-level", education: "Undergraduate/Graduate",
      employmentType: "Part-time/Intern", workFromHome: 0.7, hasChildren: false, dependents: 0
    },
    lifestyle: {
      dailyRoutine: "college/early-career", commuteStyle: "public-transport/walk",
      physicalActivity: "low-moderate", gymFrequency: 1, socialLifeIntensity: "high",
      weekendBehavior: "friends-cafes-home", travelFrequencyDomestic: 2, travelFrequencyInternational: 0,
      wardrobeMixFormal: 0.1, wardrobeMixCasual: 0.75, wardrobeMixAthleisure: 0.15
    },
    fashionOrientation: {
      styleIdentity: "casual-fusion", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "fast-follower", brandConsciousness: 0.4,
      toleranceBoldSilhouettes: 0.65, toleranceLogos: 0.7, toleranceExperimentalFits: 0.7,
      colorAdventurousness: 0.8, sustainabilityPriority: 0.25
    },
    psychographics: {
      coreValues: ["affordability", "variety", "trend-access", "peer-belonging"],
      valsSegment: "Strivers", fashionOrientation: "fast-fashion",
      socialMediaInfluence: 0.9, peerInfluence: 0.85, noveltySeekingScore: 0.85,
      impulsivityScore: 0.75, selfImageImportance: 0.8
    },
    shoppingPreferences: {
      primaryChannel: "online-marketplaces", secondaryChannel: "local-stores",
      onlineOfflineRatio: 0.75, averageBasketSize: 2, averageOrderValue: 800,
      purchaseFrequencyMonthly: 1.8, returnRate: 0.22, reviewDependence: 0.8,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.45, paymentMethodCard: 0.15
    },
    productPreferences: {
      categories: ["tshirts", "kurtis", "jeans", "casual-tops", "fusion-wear"],
      categoryAffinities: { tshirts: 0.9, jeans: 0.8, kurtas: 0.75, dresses: 0.6 },
      fabricPreferences: ["cotton", "polyester-blend", "rayon", "viscose"],
      colorPreferences: ["bright", "prints", "trendy-colors", "pastels"],
      fitPreference: "relaxed-trendy"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 300, comfortPriceTshirtsMax: 700,
      comfortPriceJeansMin: 600, comfortPriceJeansMax: 1200,
      maxWillingToPayMultiplier: 1.1, discountDependence: 0.9,
      priceElasticityIndicator: "high", annualFashionSpend: 15000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.2, premiumWillingness: 0.15, qualityExpectation: 0.4,
      brandSwitchingTendency: 0.9, newBrandTrialWillingness: 0.85
    },
    digitalBehavior: {
      deviceAndroid: 0.85, deviceIos: 0.1, sessionTimePreference: "evening-night",
      personalizationResponse: 0.8, socialPlatformInstagram: 0.95
    }
  },
  {
    name: "Meera Reddy",
    code: "F-ETH-FUS",
    segment: "Ethnic-Fusion Enthusiast",
    segmentWeight: 0.10,
    gender: "female",
    description: "Culture-conscious female aged 25-35 who blends traditional and contemporary styles. Peaks spending during festive seasons. Values versatile pieces that work for office and cultural occasions.",
    demographics: {
      ageRange: "25-35", ageMean: 30, gender: "Female",
      incomeRange: "50000-100000", incomeMean: 70000, incomePercentile: 70,
      cityTier: "Metro/Tier1", region: "South/West", urbanRuralSplit: 0.85,
      relationship: "married/committed", household: "joint/nuclear", householdSize: 4,
      occupation: "Professional/Teacher/Creative", education: "Graduate",
      employmentType: "Full-time", workFromHome: 0.35, hasChildren: false, dependents: 0
    },
    lifestyle: {
      dailyRoutine: "office-cultural-balance", commuteStyle: "two-wheeler/cab",
      physicalActivity: "moderate", gymFrequency: 2, socialLifeIntensity: "medium-high",
      weekendBehavior: "family-cultural-events", travelFrequencyDomestic: 3, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.2, wardrobeMixCasual: 0.4, wardrobeMixAthleisure: 0.1
    },
    fashionOrientation: {
      styleIdentity: "ethnic-fusion", fashionInvolvementScore: 0.7,
      trendAdoptionSpeed: "mainstream", brandConsciousness: 0.6,
      toleranceBoldSilhouettes: 0.5, toleranceLogos: 0.3, toleranceExperimentalFits: 0.4,
      colorAdventurousness: 0.7, sustainabilityPriority: 0.5
    },
    psychographics: {
      coreValues: ["cultural-pride", "versatility", "elegance", "family"],
      valsSegment: "Thinkers", fashionOrientation: "fusion-traditionalist",
      socialMediaInfluence: 0.6, peerInfluence: 0.65, noveltySeekingScore: 0.5,
      impulsivityScore: 0.4, selfImageImportance: 0.75
    },
    shoppingPreferences: {
      primaryChannel: "brand-stores", secondaryChannel: "online-apps",
      onlineOfflineRatio: 0.5, averageBasketSize: 2.5, averageOrderValue: 3500,
      purchaseFrequencyMonthly: 0.6, returnRate: 0.1, reviewDependence: 0.6,
      paymentMethodUpi: 0.45, paymentMethodCod: 0.15, paymentMethodCard: 0.4
    },
    productPreferences: {
      categories: ["kurtas", "fusion-tops", "ethnic-dresses", "palazzos", "indo-western"],
      categoryAffinities: { kurtas: 0.9, dresses: 0.7, trousers: 0.6, tshirts: 0.5 },
      fabricPreferences: ["cotton", "silk-blend", "chanderi", "linen"],
      colorPreferences: ["jewel-tones", "earth-tones", "traditional-prints", "pastels"],
      fitPreference: "comfortable-elegant"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 800, comfortPriceTshirtsMax: 1800,
      comfortPriceJeansMin: 1200, comfortPriceJeansMax: 2500,
      maxWillingToPayMultiplier: 1.4, discountDependence: 0.5,
      priceElasticityIndicator: "medium", annualFashionSpend: 45000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.6, premiumWillingness: 0.6, qualityExpectation: 0.7,
      brandSwitchingTendency: 0.4, newBrandTrialWillingness: 0.5
    },
    digitalBehavior: {
      deviceAndroid: 0.55, deviceIos: 0.4, sessionTimePreference: "afternoon-evening",
      personalizationResponse: 0.65, socialPlatformInstagram: 0.7
    }
  },
  {
    name: "Kavya Iyer",
    code: "F-ATH-LIF",
    segment: "Athleisure Lifestyle",
    segmentWeight: 0.08,
    gender: "female",
    description: "Fitness-focused female aged 22-35 who prioritizes performance fabrics and versatile athletic wear. Active lifestyle with gym and yoga as regular activities. Comfort-first with brand consciousness in activewear.",
    demographics: {
      ageRange: "22-35", ageMean: 28, gender: "Female",
      incomeRange: "50000-100000", incomeMean: 72000, incomePercentile: 72,
      cityTier: "Metro", region: "South/West/North", urbanRuralSplit: 0.95,
      relationship: "single/dating", household: "alone/nuclear", householdSize: 2,
      occupation: "Professional/Entrepreneur/Fitness", education: "Graduate",
      employmentType: "Full-time/Self-employed", workFromHome: 0.5, hasChildren: false, dependents: 0
    },
    lifestyle: {
      dailyRoutine: "gym-work-active", commuteStyle: "car/cab",
      physicalActivity: "high", gymFrequency: 5, socialLifeIntensity: "medium-high",
      weekendBehavior: "fitness-brunch-outdoors", travelFrequencyDomestic: 4, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.15, wardrobeMixCasual: 0.35, wardrobeMixAthleisure: 0.50
    },
    fashionOrientation: {
      styleIdentity: "athleisure-active", fashionInvolvementScore: 0.75,
      trendAdoptionSpeed: "early-adopter", brandConsciousness: 0.8,
      toleranceBoldSilhouettes: 0.7, toleranceLogos: 0.7, toleranceExperimentalFits: 0.6,
      colorAdventurousness: 0.6, sustainabilityPriority: 0.55
    },
    psychographics: {
      coreValues: ["fitness", "performance", "wellness", "self-improvement"],
      valsSegment: "Experiencers", fashionOrientation: "performance-lifestyle",
      socialMediaInfluence: 0.75, peerInfluence: 0.6, noveltySeekingScore: 0.7,
      impulsivityScore: 0.5, selfImageImportance: 0.85
    },
    shoppingPreferences: {
      primaryChannel: "brand-stores", secondaryChannel: "online-apps",
      onlineOfflineRatio: 0.55, averageBasketSize: 3, averageOrderValue: 4500,
      purchaseFrequencyMonthly: 0.8, returnRate: 0.12, reviewDependence: 0.7,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.1, paymentMethodCard: 0.5
    },
    productPreferences: {
      categories: ["sports-bras", "leggings", "joggers", "performance-tees", "hoodies"],
      categoryAffinities: { joggers: 0.9, tshirts: 0.85, hoodies: 0.8, shorts: 0.75 },
      fabricPreferences: ["performance-polyester", "spandex-blend", "moisture-wicking", "recycled"],
      colorPreferences: ["black", "navy", "neon-accents", "pastels"],
      fitPreference: "body-hugging-performance"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1200, comfortPriceTshirtsMax: 2500,
      comfortPriceJeansMin: 1800, comfortPriceJeansMax: 3500,
      maxWillingToPayMultiplier: 1.5, discountDependence: 0.4,
      priceElasticityIndicator: "low-medium", annualFashionSpend: 55000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.75, premiumWillingness: 0.8, qualityExpectation: 0.85,
      brandSwitchingTendency: 0.3, newBrandTrialWillingness: 0.6
    },
    digitalBehavior: {
      deviceAndroid: 0.35, deviceIos: 0.6, sessionTimePreference: "morning-evening",
      personalizationResponse: 0.75, socialPlatformInstagram: 0.85
    }
  },
  // ======================== MALE PERSONAS (5) ========================
  {
    name: "Rahul Kumar",
    code: "M-CMF-PRO",
    segment: "Comfort-Focused Professional",
    segmentWeight: 0.14,
    gender: "male",
    description: "Practical male professional aged 28-40 who prioritizes comfort and fit over trends. Loyal to brands that deliver consistent sizing. Workwear-to-casual transitions are key requirement.",
    demographics: {
      ageRange: "28-40", ageMean: 34, gender: "Male",
      incomeRange: "60000-120000", incomeMean: 85000, incomePercentile: 75,
      cityTier: "Metro/Tier1", region: "North/West", urbanRuralSplit: 0.9,
      relationship: "married", household: "nuclear", householdSize: 3.5,
      occupation: "Corporate Professional/Manager", education: "Graduate/Post-Graduate",
      employmentType: "Full-time salaried", workFromHome: 0.45, hasChildren: true, dependents: 2
    },
    lifestyle: {
      dailyRoutine: "office-family-balance", commuteStyle: "car/cab",
      physicalActivity: "low-moderate", gymFrequency: 1, socialLifeIntensity: "medium",
      weekendBehavior: "family-outings-home", travelFrequencyDomestic: 3, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.40, wardrobeMixCasual: 0.45, wardrobeMixAthleisure: 0.15
    },
    fashionOrientation: {
      styleIdentity: "smart-casual-classic", fashionInvolvementScore: 0.5,
      trendAdoptionSpeed: "late-mainstream", brandConsciousness: 0.6,
      toleranceBoldSilhouettes: 0.2, toleranceLogos: 0.3, toleranceExperimentalFits: 0.15,
      colorAdventurousness: 0.3, sustainabilityPriority: 0.4
    },
    psychographics: {
      coreValues: ["comfort", "reliability", "practicality", "family"],
      valsSegment: "Believers", fashionOrientation: "functional-classic",
      socialMediaInfluence: 0.3, peerInfluence: 0.4, noveltySeekingScore: 0.25,
      impulsivityScore: 0.2, selfImageImportance: 0.55
    },
    shoppingPreferences: {
      primaryChannel: "brand-stores", secondaryChannel: "online-apps",
      onlineOfflineRatio: 0.5, averageBasketSize: 3, averageOrderValue: 4000,
      purchaseFrequencyMonthly: 0.4, returnRate: 0.08, reviewDependence: 0.55,
      paymentMethodUpi: 0.4, paymentMethodCod: 0.15, paymentMethodCard: 0.45
    },
    productPreferences: {
      categories: ["formal-shirts", "chinos", "polo-tshirts", "jeans", "casual-shirts"],
      categoryAffinities: { shirts: 0.9, trousers: 0.85, tshirts: 0.7, jeans: 0.65 },
      fabricPreferences: ["cotton", "cotton-blend", "linen", "wrinkle-free"],
      colorPreferences: ["neutrals", "navy", "white", "pastels"],
      fitPreference: "regular-comfortable"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1000, comfortPriceTshirtsMax: 2000,
      comfortPriceJeansMin: 1800, comfortPriceJeansMax: 3000,
      maxWillingToPayMultiplier: 1.3, discountDependence: 0.45,
      priceElasticityIndicator: "medium", annualFashionSpend: 50000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.75, premiumWillingness: 0.55, qualityExpectation: 0.7,
      brandSwitchingTendency: 0.25, newBrandTrialWillingness: 0.3
    },
    digitalBehavior: {
      deviceAndroid: 0.65, deviceIos: 0.3, sessionTimePreference: "evening",
      personalizationResponse: 0.5, socialPlatformInstagram: 0.4
    }
  },
  {
    name: "Arjun Verma",
    code: "M-STY-EXE",
    segment: "Style-Forward Executive",
    segmentWeight: 0.08,
    gender: "male",
    description: "Image-conscious male executive aged 30-45 with high spend capacity. Invests in premium brands for professional impact. Quality and fit are non-negotiable. Curated wardrobe approach.",
    demographics: {
      ageRange: "30-45", ageMean: 38, gender: "Male",
      incomeRange: "150000-300000", incomeMean: 200000, incomePercentile: 95,
      cityTier: "Metro", region: "North/West/South", urbanRuralSplit: 0.98,
      relationship: "married", household: "nuclear", householdSize: 3,
      occupation: "Senior Executive/Director/Entrepreneur", education: "MBA/Post-Graduate",
      employmentType: "Full-time/Business Owner", workFromHome: 0.3, hasChildren: true, dependents: 2
    },
    lifestyle: {
      dailyRoutine: "executive-lifestyle", commuteStyle: "car/cab",
      physicalActivity: "moderate", gymFrequency: 3, socialLifeIntensity: "high",
      weekendBehavior: "golf-social-fine-dining", travelFrequencyDomestic: 5, travelFrequencyInternational: 3,
      wardrobeMixFormal: 0.55, wardrobeMixCasual: 0.30, wardrobeMixAthleisure: 0.15
    },
    fashionOrientation: {
      styleIdentity: "premium-sophisticated", fashionInvolvementScore: 0.8,
      trendAdoptionSpeed: "selective-adopter", brandConsciousness: 0.95,
      toleranceBoldSilhouettes: 0.3, toleranceLogos: 0.35, toleranceExperimentalFits: 0.2,
      colorAdventurousness: 0.35, sustainabilityPriority: 0.5
    },
    psychographics: {
      coreValues: ["status", "quality", "success", "image"],
      valsSegment: "Achievers", fashionOrientation: "premium-classic",
      socialMediaInfluence: 0.35, peerInfluence: 0.6, noveltySeekingScore: 0.4,
      impulsivityScore: 0.3, selfImageImportance: 0.9
    },
    shoppingPreferences: {
      primaryChannel: "luxury-stores", secondaryChannel: "premium-online",
      onlineOfflineRatio: 0.35, averageBasketSize: 3, averageOrderValue: 15000,
      purchaseFrequencyMonthly: 0.5, returnRate: 0.05, reviewDependence: 0.3,
      paymentMethodUpi: 0.2, paymentMethodCod: 0.02, paymentMethodCard: 0.78
    },
    productPreferences: {
      categories: ["premium-shirts", "suits", "blazers", "premium-chinos", "luxury-tshirts"],
      categoryAffinities: { shirts: 0.95, trousers: 0.9, blazers: 0.85, tshirts: 0.6 },
      fabricPreferences: ["egyptian-cotton", "linen", "wool-blend", "cashmere"],
      colorPreferences: ["classic-navy", "charcoal", "white", "subtle-patterns"],
      fitPreference: "tailored-slim"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 3000, comfortPriceTshirtsMax: 8000,
      comfortPriceJeansMin: 5000, comfortPriceJeansMax: 12000,
      maxWillingToPayMultiplier: 2.0, discountDependence: 0.15,
      priceElasticityIndicator: "very-low", annualFashionSpend: 200000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.85, premiumWillingness: 0.95, qualityExpectation: 0.95,
      brandSwitchingTendency: 0.15, newBrandTrialWillingness: 0.2
    },
    digitalBehavior: {
      deviceAndroid: 0.15, deviceIos: 0.8, sessionTimePreference: "afternoon",
      personalizationResponse: 0.45, socialPlatformInstagram: 0.5
    }
  },
  {
    name: "Vikram Joshi",
    code: "M-STW-GZ",
    segment: "Streetwear Enthusiast",
    segmentWeight: 0.09,
    gender: "male",
    description: "Drop-culture driven male aged 18-28 who seeks exclusivity and limited editions. Strong community orientation with sneaker and streetwear culture. Trend-setter in social circles.",
    demographics: {
      ageRange: "18-28", ageMean: 23, gender: "Male",
      incomeRange: "25000-60000", incomeMean: 40000, incomePercentile: 50,
      cityTier: "Metro/Tier1", region: "All regions", urbanRuralSplit: 0.9,
      relationship: "single", household: "family/roommates", householdSize: 3.5,
      occupation: "Student/Creative/Tech", education: "Undergraduate/Graduate",
      employmentType: "Student/Part-time/Fresh", workFromHome: 0.6, hasChildren: false, dependents: 0
    },
    lifestyle: {
      dailyRoutine: "flexible-creative", commuteStyle: "public-transport/bike",
      physicalActivity: "moderate", gymFrequency: 2, socialLifeIntensity: "very-high",
      weekendBehavior: "events-concerts-hangouts", travelFrequencyDomestic: 2, travelFrequencyInternational: 0.5,
      wardrobeMixFormal: 0.05, wardrobeMixCasual: 0.70, wardrobeMixAthleisure: 0.25
    },
    fashionOrientation: {
      styleIdentity: "streetwear-hypebeast", fashionInvolvementScore: 0.9,
      trendAdoptionSpeed: "innovator", brandConsciousness: 0.85,
      toleranceBoldSilhouettes: 0.9, toleranceLogos: 0.95, toleranceExperimentalFits: 0.9,
      colorAdventurousness: 0.85, sustainabilityPriority: 0.3
    },
    psychographics: {
      coreValues: ["exclusivity", "self-expression", "community", "authenticity"],
      valsSegment: "Experiencers", fashionOrientation: "streetwear-culture",
      socialMediaInfluence: 0.95, peerInfluence: 0.85, noveltySeekingScore: 0.95,
      impulsivityScore: 0.8, selfImageImportance: 0.9
    },
    shoppingPreferences: {
      primaryChannel: "online-drops", secondaryChannel: "sneaker-stores",
      onlineOfflineRatio: 0.8, averageBasketSize: 2, averageOrderValue: 3500,
      purchaseFrequencyMonthly: 1.2, returnRate: 0.1, reviewDependence: 0.7,
      paymentMethodUpi: 0.55, paymentMethodCod: 0.2, paymentMethodCard: 0.25
    },
    productPreferences: {
      categories: ["graphic-tees", "hoodies", "oversized-tshirts", "joggers", "sneakers"],
      categoryAffinities: { tshirts: 0.95, hoodies: 0.9, joggers: 0.85, shorts: 0.7 },
      fabricPreferences: ["heavyweight-cotton", "fleece", "canvas", "jersey"],
      colorPreferences: ["black", "earth-tones", "limited-edition-colors", "graphics"],
      fitPreference: "oversized-relaxed"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1500, comfortPriceTshirtsMax: 4000,
      comfortPriceJeansMin: 2000, comfortPriceJeansMax: 5000,
      maxWillingToPayMultiplier: 2.5, discountDependence: 0.2,
      priceElasticityIndicator: "low-for-hype", annualFashionSpend: 50000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.7, premiumWillingness: 0.8, qualityExpectation: 0.65,
      brandSwitchingTendency: 0.5, newBrandTrialWillingness: 0.8
    },
    digitalBehavior: {
      deviceAndroid: 0.55, deviceIos: 0.4, sessionTimePreference: "all-day",
      personalizationResponse: 0.8, socialPlatformInstagram: 0.95
    }
  },
  {
    name: "Aditya Singh",
    code: "M-VAL-T23",
    segment: "Value Maximizer",
    segmentWeight: 0.12,
    gender: "male",
    description: "Deal-hunter male aged 25-38 from Tier 2/3 cities. Bulk buyer during sales with strong COD preference. Price-first decision maker who researches extensively before purchase.",
    demographics: {
      ageRange: "25-38", ageMean: 31, gender: "Male",
      incomeRange: "30000-60000", incomeMean: 42000, incomePercentile: 45,
      cityTier: "Tier2/Tier3", region: "North/Central", urbanRuralSplit: 0.7,
      relationship: "married", household: "joint/nuclear", householdSize: 5,
      occupation: "Salaried/Business", education: "Graduate",
      employmentType: "Full-time", workFromHome: 0.25, hasChildren: true, dependents: 3
    },
    lifestyle: {
      dailyRoutine: "work-family-traditional", commuteStyle: "two-wheeler/public",
      physicalActivity: "low", gymFrequency: 0, socialLifeIntensity: "medium",
      weekendBehavior: "family-local-markets", travelFrequencyDomestic: 2, travelFrequencyInternational: 0,
      wardrobeMixFormal: 0.30, wardrobeMixCasual: 0.60, wardrobeMixAthleisure: 0.10
    },
    fashionOrientation: {
      styleIdentity: "practical-basic", fashionInvolvementScore: 0.35,
      trendAdoptionSpeed: "late-adopter", brandConsciousness: 0.35,
      toleranceBoldSilhouettes: 0.2, toleranceLogos: 0.4, toleranceExperimentalFits: 0.15,
      colorAdventurousness: 0.25, sustainabilityPriority: 0.2
    },
    psychographics: {
      coreValues: ["value-for-money", "family", "practicality", "savings"],
      valsSegment: "Makers", fashionOrientation: "budget-functional",
      socialMediaInfluence: 0.5, peerInfluence: 0.55, noveltySeekingScore: 0.3,
      impulsivityScore: 0.25, selfImageImportance: 0.4
    },
    shoppingPreferences: {
      primaryChannel: "online-marketplaces", secondaryChannel: "local-stores",
      onlineOfflineRatio: 0.6, averageBasketSize: 4, averageOrderValue: 1500,
      purchaseFrequencyMonthly: 0.5, returnRate: 0.15, reviewDependence: 0.85,
      paymentMethodUpi: 0.3, paymentMethodCod: 0.6, paymentMethodCard: 0.1
    },
    productPreferences: {
      categories: ["basic-tshirts", "formal-shirts", "jeans", "trousers", "combo-packs"],
      categoryAffinities: { tshirts: 0.85, shirts: 0.8, jeans: 0.75, trousers: 0.7 },
      fabricPreferences: ["cotton", "polyester-cotton", "basic-blends"],
      colorPreferences: ["neutrals", "basic-colors", "safe-choices"],
      fitPreference: "regular"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 300, comfortPriceTshirtsMax: 600,
      comfortPriceJeansMin: 600, comfortPriceJeansMax: 1000,
      maxWillingToPayMultiplier: 1.0, discountDependence: 0.95,
      priceElasticityIndicator: "very-high", annualFashionSpend: 18000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.25, premiumWillingness: 0.1, qualityExpectation: 0.45,
      brandSwitchingTendency: 0.85, newBrandTrialWillingness: 0.7
    },
    digitalBehavior: {
      deviceAndroid: 0.95, deviceIos: 0.02, sessionTimePreference: "evening",
      personalizationResponse: 0.6, socialPlatformInstagram: 0.45
    }
  },
  {
    name: "Rohan Kapoor",
    code: "M-HYB-WFH",
    segment: "Smart Casual Hybrid",
    segmentWeight: 0.14,
    gender: "male",
    description: "WFH professional male aged 26-38 who needs versatile wardrobe for work-weekend blend. Quality-conscious with comfort focus. Values pieces that transition from video calls to casual outings.",
    demographics: {
      ageRange: "26-38", ageMean: 32, gender: "Male",
      incomeRange: "70000-140000", incomeMean: 100000, incomePercentile: 80,
      cityTier: "Metro/Tier1", region: "All metros", urbanRuralSplit: 0.95,
      relationship: "married/committed", household: "nuclear", householdSize: 2.5,
      occupation: "Tech Professional/Creative", education: "Graduate/Post-Graduate",
      employmentType: "Full-time WFH/Hybrid", workFromHome: 0.8, hasChildren: false, dependents: 1
    },
    lifestyle: {
      dailyRoutine: "wfh-flexible", commuteStyle: "occasional-cab",
      physicalActivity: "moderate", gymFrequency: 3, socialLifeIntensity: "medium-high",
      weekendBehavior: "brunch-cafes-social", travelFrequencyDomestic: 4, travelFrequencyInternational: 1,
      wardrobeMixFormal: 0.20, wardrobeMixCasual: 0.50, wardrobeMixAthleisure: 0.30
    },
    fashionOrientation: {
      styleIdentity: "smart-casual-versatile", fashionInvolvementScore: 0.65,
      trendAdoptionSpeed: "early-mainstream", brandConsciousness: 0.7,
      toleranceBoldSilhouettes: 0.4, toleranceLogos: 0.35, toleranceExperimentalFits: 0.4,
      colorAdventurousness: 0.5, sustainabilityPriority: 0.55
    },
    psychographics: {
      coreValues: ["versatility", "quality", "comfort", "modern-living"],
      valsSegment: "Innovators", fashionOrientation: "smart-casual",
      socialMediaInfluence: 0.6, peerInfluence: 0.55, noveltySeekingScore: 0.6,
      impulsivityScore: 0.4, selfImageImportance: 0.7
    },
    shoppingPreferences: {
      primaryChannel: "online-apps", secondaryChannel: "brand-stores",
      onlineOfflineRatio: 0.7, averageBasketSize: 3, averageOrderValue: 5000,
      purchaseFrequencyMonthly: 0.6, returnRate: 0.1, reviewDependence: 0.65,
      paymentMethodUpi: 0.45, paymentMethodCod: 0.1, paymentMethodCard: 0.45
    },
    productPreferences: {
      categories: ["premium-tshirts", "chinos", "smart-joggers", "casual-shirts", "hoodies"],
      categoryAffinities: { tshirts: 0.85, chinos: 0.8, joggers: 0.75, shirts: 0.7 },
      fabricPreferences: ["premium-cotton", "stretch-blends", "linen", "tech-fabrics"],
      colorPreferences: ["neutrals", "muted-colors", "earth-tones", "navy"],
      fitPreference: "slim-comfortable"
    },
    priceBehavior: {
      comfortPriceTshirtsMin: 1200, comfortPriceTshirtsMax: 2500,
      comfortPriceJeansMin: 2000, comfortPriceJeansMax: 4000,
      maxWillingToPayMultiplier: 1.4, discountDependence: 0.4,
      priceElasticityIndicator: "medium-low", annualFashionSpend: 65000
    },
    brandPsychology: {
      brandLoyaltyScore: 0.65, premiumWillingness: 0.7, qualityExpectation: 0.8,
      brandSwitchingTendency: 0.35, newBrandTrialWillingness: 0.55
    },
    digitalBehavior: {
      deviceAndroid: 0.45, deviceIos: 0.5, sessionTimePreference: "afternoon-evening",
      personalizationResponse: 0.7, socialPlatformInstagram: 0.7
    }
  }
];

function generateAttributeVector(persona: typeof ENTERPRISE_PERSONAS[0]) {
  const vector: { name: string; value: number; category: string }[] = [];
  
  // Demographics (15 attributes)
  vector.push({ name: "age_normalized", value: (persona.demographics.ageMean - 18) / 30, category: "demographics" });
  vector.push({ name: "income_normalized", value: persona.demographics.incomeMean / 200000, category: "demographics" });
  vector.push({ name: "is_female", value: persona.gender === "female" ? 1 : 0, category: "demographics" });
  vector.push({ name: "is_metro", value: persona.demographics.cityTier.includes("Metro") ? 0.9 : 0.4, category: "demographics" });
  vector.push({ name: "urban_rural", value: persona.demographics.urbanRuralSplit, category: "demographics" });
  vector.push({ name: "household_size_norm", value: persona.demographics.householdSize / 6, category: "demographics" });
  vector.push({ name: "has_children", value: persona.demographics.hasChildren ? 1 : 0, category: "demographics" });
  vector.push({ name: "work_from_home", value: persona.demographics.workFromHome, category: "demographics" });
  vector.push({ name: "income_percentile", value: persona.demographics.incomePercentile / 100, category: "demographics" });
  
  // Lifestyle (12 attributes)
  vector.push({ name: "physical_activity", value: persona.lifestyle.physicalActivity === "high" ? 0.9 : persona.lifestyle.physicalActivity === "moderate" ? 0.5 : 0.2, category: "lifestyle" });
  vector.push({ name: "gym_frequency_norm", value: persona.lifestyle.gymFrequency / 6, category: "lifestyle" });
  vector.push({ name: "social_intensity", value: persona.lifestyle.socialLifeIntensity.includes("high") ? 0.85 : 0.5, category: "lifestyle" });
  vector.push({ name: "travel_domestic", value: persona.lifestyle.travelFrequencyDomestic / 6, category: "lifestyle" });
  vector.push({ name: "travel_international", value: persona.lifestyle.travelFrequencyInternational / 3, category: "lifestyle" });
  vector.push({ name: "wardrobe_formal", value: persona.lifestyle.wardrobeMixFormal, category: "lifestyle" });
  vector.push({ name: "wardrobe_casual", value: persona.lifestyle.wardrobeMixCasual, category: "lifestyle" });
  vector.push({ name: "wardrobe_athleisure", value: persona.lifestyle.wardrobeMixAthleisure, category: "lifestyle" });
  
  // Fashion Orientation (12 attributes)
  vector.push({ name: "fashion_involvement", value: persona.fashionOrientation.fashionInvolvementScore, category: "fashion_orientation" });
  vector.push({ name: "brand_consciousness", value: persona.fashionOrientation.brandConsciousness, category: "fashion_orientation" });
  vector.push({ name: "tolerance_bold", value: persona.fashionOrientation.toleranceBoldSilhouettes, category: "fashion_orientation" });
  vector.push({ name: "tolerance_logos", value: persona.fashionOrientation.toleranceLogos, category: "fashion_orientation" });
  vector.push({ name: "tolerance_experimental", value: persona.fashionOrientation.toleranceExperimentalFits, category: "fashion_orientation" });
  vector.push({ name: "color_adventurousness", value: persona.fashionOrientation.colorAdventurousness, category: "fashion_orientation" });
  vector.push({ name: "sustainability_priority", value: persona.fashionOrientation.sustainabilityPriority, category: "fashion_orientation" });
  vector.push({ name: "trend_early", value: persona.fashionOrientation.trendAdoptionSpeed.includes("early") ? 0.85 : 0.4, category: "fashion_orientation" });
  
  // Psychographics (10 attributes)
  vector.push({ name: "social_media_influence", value: persona.psychographics.socialMediaInfluence, category: "psychographics" });
  vector.push({ name: "peer_influence", value: persona.psychographics.peerInfluence, category: "psychographics" });
  vector.push({ name: "novelty_seeking", value: persona.psychographics.noveltySeekingScore, category: "psychographics" });
  vector.push({ name: "impulsivity", value: persona.psychographics.impulsivityScore, category: "psychographics" });
  vector.push({ name: "self_image_importance", value: persona.psychographics.selfImageImportance, category: "psychographics" });
  
  // Shopping Preferences (15 attributes)
  vector.push({ name: "online_offline_ratio", value: persona.shoppingPreferences.onlineOfflineRatio, category: "shopping_preferences" });
  vector.push({ name: "avg_basket_size_norm", value: persona.shoppingPreferences.averageBasketSize / 5, category: "shopping_preferences" });
  vector.push({ name: "avg_order_value_norm", value: Math.min(persona.shoppingPreferences.averageOrderValue / 10000, 1), category: "shopping_preferences" });
  vector.push({ name: "purchase_frequency", value: persona.shoppingPreferences.purchaseFrequencyMonthly / 2, category: "shopping_preferences" });
  vector.push({ name: "return_rate", value: persona.shoppingPreferences.returnRate, category: "shopping_preferences" });
  vector.push({ name: "review_dependence", value: persona.shoppingPreferences.reviewDependence, category: "shopping_preferences" });
  vector.push({ name: "payment_upi", value: persona.shoppingPreferences.paymentMethodUpi, category: "shopping_preferences" });
  vector.push({ name: "payment_cod", value: persona.shoppingPreferences.paymentMethodCod, category: "shopping_preferences" });
  vector.push({ name: "payment_card", value: persona.shoppingPreferences.paymentMethodCard, category: "shopping_preferences" });
  
  // Category Affinities (10 attributes)
  const affinities = persona.productPreferences.categoryAffinities;
  vector.push({ name: "affinity_tshirts", value: affinities.tshirts || 0.5, category: "category_preferences" });
  vector.push({ name: "affinity_shirts", value: affinities.shirts || 0.5, category: "category_preferences" });
  vector.push({ name: "affinity_jeans", value: affinities.jeans || 0.5, category: "category_preferences" });
  vector.push({ name: "affinity_trousers", value: affinities.trousers || 0.5, category: "category_preferences" });
  vector.push({ name: "affinity_dresses", value: affinities.dresses || 0, category: "category_preferences" });
  vector.push({ name: "affinity_kurtas", value: affinities.kurtas || 0, category: "category_preferences" });
  vector.push({ name: "affinity_hoodies", value: affinities.hoodies || 0.4, category: "category_preferences" });
  vector.push({ name: "affinity_joggers", value: affinities.joggers || 0.4, category: "category_preferences" });
  vector.push({ name: "affinity_shorts", value: affinities.shorts || 0.4, category: "category_preferences" });
  
  // Price Behavior (12 attributes)
  vector.push({ name: "price_tshirt_min_norm", value: persona.priceBehavior.comfortPriceTshirtsMin / 3000, category: "price_behavior" });
  vector.push({ name: "price_tshirt_max_norm", value: persona.priceBehavior.comfortPriceTshirtsMax / 8000, category: "price_behavior" });
  vector.push({ name: "price_jeans_min_norm", value: persona.priceBehavior.comfortPriceJeansMin / 5000, category: "price_behavior" });
  vector.push({ name: "price_jeans_max_norm", value: persona.priceBehavior.comfortPriceJeansMax / 12000, category: "price_behavior" });
  vector.push({ name: "max_pay_multiplier", value: persona.priceBehavior.maxWillingToPayMultiplier / 2.5, category: "price_behavior" });
  vector.push({ name: "discount_dependence", value: persona.priceBehavior.discountDependence, category: "price_behavior" });
  vector.push({ name: "price_elasticity_high", value: persona.priceBehavior.priceElasticityIndicator.includes("high") ? 0.9 : 0.3, category: "price_behavior" });
  vector.push({ name: "annual_spend_norm", value: Math.min(persona.priceBehavior.annualFashionSpend / 200000, 1), category: "price_behavior" });
  
  // Brand Psychology (10 attributes)
  vector.push({ name: "brand_loyalty", value: persona.brandPsychology.brandLoyaltyScore, category: "brand_psychology" });
  vector.push({ name: "premium_willingness", value: persona.brandPsychology.premiumWillingness, category: "brand_psychology" });
  vector.push({ name: "quality_expectation", value: persona.brandPsychology.qualityExpectation, category: "brand_psychology" });
  vector.push({ name: "brand_switching", value: persona.brandPsychology.brandSwitchingTendency, category: "brand_psychology" });
  vector.push({ name: "new_brand_trial", value: persona.brandPsychology.newBrandTrialWillingness, category: "brand_psychology" });
  
  // Digital Behavior (8 attributes)
  vector.push({ name: "device_android", value: persona.digitalBehavior.deviceAndroid, category: "digital_behavior" });
  vector.push({ name: "device_ios", value: persona.digitalBehavior.deviceIos, category: "digital_behavior" });
  vector.push({ name: "personalization_response", value: persona.digitalBehavior.personalizationResponse, category: "digital_behavior" });
  vector.push({ name: "instagram_usage", value: persona.digitalBehavior.socialPlatformInstagram, category: "digital_behavior" });
  vector.push({ name: "evening_session", value: persona.digitalBehavior.sessionTimePreference.includes("evening") ? 0.8 : 0.4, category: "digital_behavior" });
  
  return vector;
}

function calculatePersonaAnalytics(persona: typeof ENTERPRISE_PERSONAS[0]) {
  return {
    online_offline_ratio: persona.shoppingPreferences.onlineOfflineRatio,
    marketplace_brand_ratio: persona.shoppingPreferences.primaryChannel.includes("marketplace") ? 0.7 : 0.3,
    mobile_desktop_ratio: 1 - persona.digitalBehavior.deviceAndroid - persona.digitalBehavior.deviceIos > 0.1 ? 0.85 : 0.95,
    category_contributions: persona.productPreferences.categoryAffinities,
    category_frequency: {
      tshirts: persona.productPreferences.categories.includes("tshirts") ? 0.3 : 0.1,
      jeans: persona.productPreferences.categories.includes("jeans") ? 0.2 : 0.1,
      shirts: persona.productPreferences.categories.includes("shirts") || persona.productPreferences.categories.includes("formal-shirts") ? 0.2 : 0.1
    },
    repeat_purchase_rate: 1 - persona.brandPsychology.brandSwitchingTendency,
    full_price_discount_ratio: 1 - persona.priceBehavior.discountDependence,
    avg_discount_availed: persona.priceBehavior.discountDependence * 0.3,
    price_elasticity_segment: persona.priceBehavior.priceElasticityIndicator,
    neutral_color_bold_ratio: persona.fashionOrientation.colorAdventurousness < 0.5 ? 0.7 : 0.4,
    solid_prints_ratio: 1 - persona.fashionOrientation.colorAdventurousness * 0.5,
    browse_to_cart_ratio: 0.15 + (1 - persona.psychographics.impulsivityScore) * 0.1,
    cart_to_purchase_ratio: 0.6 + persona.brandPsychology.brandLoyaltyScore * 0.2,
    wishlist_to_purchase_ratio: 0.3 + persona.shoppingPreferences.reviewDependence * 0.2,
    return_rate: persona.shoppingPreferences.returnRate,
    avg_lifetime_value: persona.priceBehavior.annualFashionSpend * 3,
    cross_category_adoption: persona.productPreferences.categories.length / 8
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenantId, action } = await req.json();
    console.log("Regenerating apparel personas for tenant:", tenantId, "action:", action);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Delete existing personas and related data
    console.log("Deleting existing analysis results...");
    await supabase.from("analysis_results").delete().eq("tenant_id", tenantId);
    
    console.log("Deleting existing persona analytics...");
    await supabase.from("persona_analytics").delete().eq("tenant_id", tenantId);
    
    console.log("Deleting existing personas...");
    await supabase.from("personas").delete().eq("tenant_id", tenantId);

    // Create new personas
    const createdPersonas = [];
    for (const personaData of ENTERPRISE_PERSONAS) {
      const attributeVector = generateAttributeVector(personaData);
      
      const personaRecord = {
        tenant_id: tenantId,
        name: personaData.name,
        description: personaData.description,
        avatar_emoji: personaData.gender === "female" ? "👩" : "👨",
        segment_code: personaData.code,
        segment_name: personaData.segment,
        segment_weight: personaData.segmentWeight,
        gender: personaData.gender,
        demographics: personaData.demographics,
        lifestyle: personaData.lifestyle,
        fashion_orientation: personaData.fashionOrientation,
        psychographics: personaData.psychographics,
        shopping_preferences: personaData.shoppingPreferences,
        product_preferences: personaData.productPreferences,
        price_behavior: personaData.priceBehavior,
        brand_psychology: personaData.brandPsychology,
        digital_behavior: personaData.digitalBehavior,
        category_affinities: personaData.productPreferences.categoryAffinities,
        attribute_vector: attributeVector,
        is_active: true
      };

      const { data: persona, error } = await supabase
        .from("personas")
        .insert(personaRecord)
        .select()
        .single();

      if (error) {
        console.error(`Failed to create persona ${personaData.name}:`, error);
        continue;
      }

      console.log(`Created persona: ${personaData.name}`);
      createdPersonas.push(persona);

      // Create persona analytics
      const analytics = calculatePersonaAnalytics(personaData);
      await supabase.from("persona_analytics").insert({
        tenant_id: tenantId,
        persona_id: persona.id,
        ...analytics
      });
    }

    // Create aggregate analytics
    const totalWeight = ENTERPRISE_PERSONAS.reduce((sum, p) => sum + p.segmentWeight, 0);
    const femalePersonas = ENTERPRISE_PERSONAS.filter(p => p.gender === "female");
    const femaleWeight = femalePersonas.reduce((sum, p) => sum + p.segmentWeight, 0);
    
    const aggregateAnalytics = {
      tenant_id: tenantId,
      female_revenue_ratio: femaleWeight / totalWeight,
      metro_non_metro_ratio: 0.75,
      regional_style_divergence: {
        north: { kurtas: 0.3, formal: 0.4 },
        south: { athleisure: 0.35, casual: 0.45 },
        west: { premium: 0.4, streetwear: 0.25 }
      },
      total_online_ratio: ENTERPRISE_PERSONAS.reduce((sum, p) => sum + p.shoppingPreferences.onlineOfflineRatio * p.segmentWeight, 0) / totalWeight,
      top_channel_breakdown: {
        online_apps: 0.35,
        brand_stores: 0.25,
        marketplaces: 0.25,
        local_stores: 0.15
      },
      price_elasticity_distribution: {
        high: 0.27,
        medium: 0.38,
        low: 0.35
      },
      avg_discount_rate: 0.22,
      premium_segment_share: 0.28,
      top_personas_by_revenue: createdPersonas.slice(0, 5).map(p => ({
        id: p.id,
        name: p.name,
        segment: p.segment_name
      })),
      persona_segment_weights: Object.fromEntries(
        ENTERPRISE_PERSONAS.map(p => [p.code, p.segmentWeight])
      )
    };

    await supabase.from("aggregate_analytics").upsert(aggregateAnalytics);

    console.log(`Successfully created ${createdPersonas.length} personas with analytics`);

    return new Response(
      JSON.stringify({
        success: true,
        personasCreated: createdPersonas.length,
        personas: createdPersonas.map(p => ({
          id: p.id,
          name: p.name,
          segment: p.segment_name,
          gender: p.gender,
          segmentWeight: p.segment_weight
        }))
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error regenerating personas:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
