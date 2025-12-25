import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// =============================================================================
// CANONICAL PERSONAS - 10 Fixed Apparel Personas (5 Female, 5 Male)
// All data is modeled_v0 (synthetic, hypothesis-driven)
// =============================================================================

const CANONICAL_PERSONAS = [
  // ======================== FEMALE PERSONAS (5) ========================
  {
    canonical_persona_id: "urban_comfort_creator_f_24_32",
    name: "Urban Comfort Creator",
    avatar_emoji: "👩‍💼",
    segment_code: "F-UCC-2432",
    segment_name: "Urban Comfort Creator",
    segment_weight: 0.14,
    gender: "female",
    age_band: "24-32",
    narrative_summary: "Metro/large city working professional who balances office, social life, and light fitness. Prefers comfortable, polished casuals and smart basics. Values versatility and style that transitions from desk to dinner.",
    
    demographics: {
      age_band: "24-32",
      age_mean: 28,
      gender: "female",
      city_tier: "metro",
      region: "west",
      monthly_income_band_in_inr: "50000-90000",
      income_mean: 68000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "single",
      household_type: "nuclear_family",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "office_9_6",
      commute_mode_primary: "public_transport",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 3,
      social_life_intensity: "high",
      weekend_behavior_profile: "mall_cafes",
      domestic_travel_frequency: 4,
      international_travel_frequency: 0.5,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "minimalist",
      fashion_involvement_level: 4,
      trend_adoption_speed: "mainstream",
      brand_consciousness_level: 3,
      logo_visibility_tolerance: "medium",
      silhouette_experimentation_tolerance: "medium",
      statement_piece_frequency: "occasional",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "self_expression",
      risk_appetite_in_style: "medium",
      perception_of_value: "versatility",
      core_values: ["comfort", "style", "practicality", "self-expression"],
      vals_segment: "Experiencers",
      social_media_influence: 0.75,
      peer_influence: 0.7,
      novelty_seeking_score: 0.6,
      impulsivity_score: 0.5,
      self_image_importance: 0.8,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "marketplace",
      secondary_purchase_channel: "brand_website",
      online_offline_purchase_ratio: "70_30",
      purchase_frequency_per_quarter: 4,
      avg_items_per_order: 2.5,
      avg_order_value_in_inr: 2800,
      returns_frequency_rate: 0.12,
      preferred_payment_methods: ["upi", "card"],
      delivery_speed_sensitivity: "medium",
      returns_friction_sensitivity: "medium",
      wishlist_usage_frequency: "regular",
      coupon_or_offer_usage_rate: 0.6,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["tshirts", "jeans", "casual_tops", "dresses", "joggers"],
      category_priority_ranking: ["tshirts", "jeans", "dresses", "joggers", "kurta", "shorts"],
      purchase_frequency_by_category_per_quarter: { tshirts: 2, jeans: 1, dresses: 1, joggers: 0.5 },
      workwear_share_of_wardrobe: 0.35,
      casual_share_of_wardrobe: 0.45,
      party_share_of_wardrobe: 0.15,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 800, max: 1600 },
      comfort_price_band_shirt: { min: 1200, max: 2200 },
      comfort_price_band_jeans: { min: 1500, max: 2800 },
      comfort_price_band_pants_chinos: { min: 1400, max: 2500 },
      comfort_price_band_shorts: { min: 600, max: 1200 },
      comfort_price_band_joggers: { min: 1000, max: 2000 },
      comfort_price_band_hoodie_sweatshirt: { min: 1500, max: 2800 },
      comfort_price_band_dress: { min: 1800, max: 3500 },
      comfort_price_band_kurta: { min: 1200, max: 2500 },
      max_willing_to_pay_tshirt: 2000,
      typical_discount_expectation_percentage: 20,
      discount_dependence_level: "flexible",
      price_elasticity_category: "medium",
      tradeoff_priority_order: ["comfort", "design", "price", "brand"],
      annual_fashion_spend: 42000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "relaxed",
      jeans_fit_preference: "slim",
      pants_fit_preference: "tapered",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "above_knee",
      sleeve_length_preference: "half",
      neckline_preference: "crew",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "60_40",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "cotton_blend", "linen", "denim_stretch"],
      breathability_importance_level: 4,
      wrinkle_resistance_importance_level: 3,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 3,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.4,
      color_palette_earth_tones_share: 0.2,
      color_palette_pastels_share: 0.25,
      color_palette_bright_solids_share: 0.1,
      color_palette_bold_colors_share: 0.05,
      print_vs_solid_ratio: "30_70",
      preference_for_stripes: 0.4,
      preference_for_checks: 0.2,
      preference_for_minimal_prints: 0.5,
      preference_for_graphic_prints: 0.3,
      preference_for_logo_prints: 0.2,
      preference_for_all_over_prints: 0.15,
      tolerance_for_high_contrast_outfits: 0.4,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.6,
      lovable_brand_primary_associations: ["comfort", "quality", "style"],
      brand_loyalty_strength_to_lovable: 0.5,
      number_of_competing_brands_used_regularly: 4,
      influence_of_brand_storytelling: 0.5,
      influence_of_reviews_and_ratings: 0.7,
      influence_of_influencers_celebrities: 0.6,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "evening",
      average_session_duration_minutes: 12,
      average_products_viewed_per_session: 15,
      filter_and_sort_usage_level: 0.7,
      responsiveness_to_personalized_recos: 0.7,
      responsiveness_to_push_notifications_or_emails: 0.5,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "new_to_brand",
      lifetime_value_band: "medium",
      cross_category_adoption_count: 3,
      upsell_potential_to_premium_lines: 0.6,
      churn_risk_level: "medium",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "trend_first_campus_styler_f_18_24",
    name: "Trend-First Campus Styler",
    avatar_emoji: "👩‍🎓",
    segment_code: "F-TCS-1824",
    segment_name: "Trend-First Campus Styler",
    segment_weight: 0.12,
    gender: "female",
    age_band: "18-24",
    narrative_summary: "College/early career in metro/tier 1. Highly active on social media, follows creators, loves expressive, experimental fashion and quick trend cycles. Budget-conscious but trend-driven.",
    
    demographics: {
      age_band: "18-24",
      age_mean: 21,
      gender: "female",
      city_tier: "tier_1",
      region: "all",
      monthly_income_band_in_inr: "15000-35000",
      income_mean: 22000,
      education_level: "undergraduate",
      occupation_type: "student",
      relationship_status: "single",
      household_type: "with_parents",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "college",
      commute_mode_primary: "public_transport",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 2,
      social_life_intensity: "high",
      weekend_behavior_profile: "mall_cafes",
      domestic_travel_frequency: 2,
      international_travel_frequency: 0,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "experimental",
      fashion_involvement_level: 5,
      trend_adoption_speed: "early_adopter",
      brand_consciousness_level: 3,
      logo_visibility_tolerance: "high",
      silhouette_experimentation_tolerance: "high",
      statement_piece_frequency: "regular",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "style_first",
      attitude_to_clothing: "self_expression",
      risk_appetite_in_style: "high",
      perception_of_value: "uniqueness",
      core_values: ["self-expression", "trend", "peer-validation", "affordability"],
      vals_segment: "Experiencers",
      social_media_influence: 0.95,
      peer_influence: 0.9,
      novelty_seeking_score: 0.9,
      impulsivity_score: 0.75,
      self_image_importance: 0.9,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "marketplace",
      secondary_purchase_channel: "brand_website",
      online_offline_purchase_ratio: "80_20",
      purchase_frequency_per_quarter: 6,
      avg_items_per_order: 2,
      avg_order_value_in_inr: 1200,
      returns_frequency_rate: 0.18,
      preferred_payment_methods: ["upi", "cod"],
      delivery_speed_sensitivity: "low",
      returns_friction_sensitivity: "low",
      wishlist_usage_frequency: "frequent",
      coupon_or_offer_usage_rate: 0.85,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["tshirts", "jeans", "dresses", "co_ords", "crop_tops"],
      category_priority_ranking: ["tshirts", "dresses", "jeans", "shorts", "joggers"],
      purchase_frequency_by_category_per_quarter: { tshirts: 3, dresses: 2, jeans: 1.5 },
      workwear_share_of_wardrobe: 0.1,
      casual_share_of_wardrobe: 0.6,
      party_share_of_wardrobe: 0.25,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 400, max: 900 },
      comfort_price_band_shirt: { min: 600, max: 1200 },
      comfort_price_band_jeans: { min: 800, max: 1500 },
      comfort_price_band_pants_chinos: { min: 700, max: 1400 },
      comfort_price_band_shorts: { min: 400, max: 800 },
      comfort_price_band_joggers: { min: 600, max: 1200 },
      comfort_price_band_hoodie_sweatshirt: { min: 800, max: 1600 },
      comfort_price_band_dress: { min: 900, max: 2000 },
      comfort_price_band_kurta: { min: 700, max: 1500 },
      max_willing_to_pay_tshirt: 1200,
      typical_discount_expectation_percentage: 35,
      discount_dependence_level: "always_waits_for_sale",
      price_elasticity_category: "high",
      tradeoff_priority_order: ["design", "price", "comfort", "brand"],
      annual_fashion_spend: 24000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "oversized",
      shirt_fit_preference: "relaxed",
      jeans_fit_preference: "straight",
      pants_fit_preference: "relaxed",
      rise_preference_for_bottoms: "high",
      shorts_length_preference: "above_knee",
      sleeve_length_preference: "half",
      neckline_preference: "crew",
      waistband_preference: "elastic",
      comfort_vs_structure_ratio: "70_30",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "polyester_blend", "denim_stretch", "jersey"],
      breathability_importance_level: 3,
      wrinkle_resistance_importance_level: 2,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 2,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.2,
      color_palette_earth_tones_share: 0.15,
      color_palette_pastels_share: 0.25,
      color_palette_bright_solids_share: 0.25,
      color_palette_bold_colors_share: 0.15,
      print_vs_solid_ratio: "45_55",
      preference_for_stripes: 0.4,
      preference_for_checks: 0.3,
      preference_for_minimal_prints: 0.4,
      preference_for_graphic_prints: 0.7,
      preference_for_logo_prints: 0.6,
      preference_for_all_over_prints: 0.45,
      tolerance_for_high_contrast_outfits: 0.7,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.4,
      lovable_brand_primary_associations: ["style", "youthfulness", "price"],
      brand_loyalty_strength_to_lovable: 0.3,
      number_of_competing_brands_used_regularly: 6,
      influence_of_brand_storytelling: 0.4,
      influence_of_reviews_and_ratings: 0.8,
      influence_of_influencers_celebrities: 0.85,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "late_night",
      average_session_duration_minutes: 18,
      average_products_viewed_per_session: 25,
      filter_and_sort_usage_level: 0.6,
      responsiveness_to_personalized_recos: 0.8,
      responsiveness_to_push_notifications_or_emails: 0.7,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "new_to_brand",
      lifetime_value_band: "low",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.3,
      churn_risk_level: "high",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "premium_office_minimalist_f_28_38",
    name: "Premium Office Minimalist",
    avatar_emoji: "👩‍💻",
    segment_code: "F-POM-2838",
    segment_name: "Premium Office Minimalist",
    segment_weight: 0.10,
    gender: "female",
    age_band: "28-38",
    narrative_summary: "Mid/senior corporate professional with higher income. Prefers minimalist, premium basics for office and subtle, elevated casual wear. Values quality over quantity, invests in timeless pieces.",
    
    demographics: {
      age_band: "28-38",
      age_mean: 33,
      gender: "female",
      city_tier: "metro",
      region: "north",
      monthly_income_band_in_inr: "100000-180000",
      income_mean: 135000,
      education_level: "post_graduate",
      occupation_type: "salaried",
      relationship_status: "married",
      household_type: "nuclear_family",
      dependents_count: 1,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "office_9_6",
      commute_mode_primary: "car",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 3,
      social_life_intensity: "medium",
      weekend_behavior_profile: "home_focused",
      domestic_travel_frequency: 3,
      international_travel_frequency: 1,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "minimalist",
      fashion_involvement_level: 4,
      trend_adoption_speed: "mainstream",
      brand_consciousness_level: 5,
      logo_visibility_tolerance: "low",
      silhouette_experimentation_tolerance: "low",
      statement_piece_frequency: "occasional",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "identity",
      risk_appetite_in_style: "low",
      perception_of_value: "durability",
      core_values: ["quality", "elegance", "professionalism", "minimalism"],
      vals_segment: "Achievers",
      social_media_influence: 0.4,
      peer_influence: 0.5,
      novelty_seeking_score: 0.35,
      impulsivity_score: 0.2,
      self_image_importance: 0.85,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "brand_website",
      secondary_purchase_channel: "offline_brand_store",
      online_offline_purchase_ratio: "50_50",
      purchase_frequency_per_quarter: 3,
      avg_items_per_order: 2,
      avg_order_value_in_inr: 7500,
      returns_frequency_rate: 0.08,
      preferred_payment_methods: ["card", "upi"],
      delivery_speed_sensitivity: "medium",
      returns_friction_sensitivity: "high",
      wishlist_usage_frequency: "occasional",
      coupon_or_offer_usage_rate: 0.3,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["shirts", "trousers", "blazers", "premium_tshirts", "workwear"],
      category_priority_ranking: ["shirts", "trousers", "tshirts", "dresses", "kurta"],
      purchase_frequency_by_category_per_quarter: { shirts: 1.5, trousers: 1, tshirts: 1 },
      workwear_share_of_wardrobe: 0.55,
      casual_share_of_wardrobe: 0.30,
      party_share_of_wardrobe: 0.10,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 1800, max: 3500 },
      comfort_price_band_shirt: { min: 2500, max: 4500 },
      comfort_price_band_jeans: { min: 3000, max: 5500 },
      comfort_price_band_pants_chinos: { min: 2800, max: 5000 },
      comfort_price_band_shorts: { min: 1200, max: 2500 },
      comfort_price_band_joggers: { min: 2000, max: 3500 },
      comfort_price_band_hoodie_sweatshirt: { min: 2500, max: 4500 },
      comfort_price_band_dress: { min: 3500, max: 7000 },
      comfort_price_band_kurta: { min: 2500, max: 5000 },
      max_willing_to_pay_tshirt: 5000,
      typical_discount_expectation_percentage: 15,
      discount_dependence_level: "buys_full_price_if_likes",
      price_elasticity_category: "low",
      tradeoff_priority_order: ["quality", "comfort", "brand", "design"],
      annual_fashion_spend: 95000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "slim",
      jeans_fit_preference: "slim",
      pants_fit_preference: "tapered",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "at_knee",
      sleeve_length_preference: "full",
      neckline_preference: "v_neck",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "40_60",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["organic_cotton", "linen", "modal_bamboo", "cotton"],
      breathability_importance_level: 4,
      wrinkle_resistance_importance_level: 5,
      fabric_softness_importance_level: 5,
      sustainability_concern_level: 4,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: ["polyester"],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.55,
      color_palette_earth_tones_share: 0.25,
      color_palette_pastels_share: 0.15,
      color_palette_bright_solids_share: 0.05,
      color_palette_bold_colors_share: 0.0,
      print_vs_solid_ratio: "15_85",
      preference_for_stripes: 0.3,
      preference_for_checks: 0.2,
      preference_for_minimal_prints: 0.4,
      preference_for_graphic_prints: 0.1,
      preference_for_logo_prints: 0.05,
      preference_for_all_over_prints: 0.05,
      tolerance_for_high_contrast_outfits: 0.2,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.7,
      lovable_brand_primary_associations: ["quality", "comfort", "reliability"],
      brand_loyalty_strength_to_lovable: 0.75,
      number_of_competing_brands_used_regularly: 3,
      influence_of_brand_storytelling: 0.6,
      influence_of_reviews_and_ratings: 0.5,
      influence_of_influencers_celebrities: 0.25,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "ios",
      session_time_of_day_preference: "afternoon",
      average_session_duration_minutes: 10,
      average_products_viewed_per_session: 12,
      filter_and_sort_usage_level: 0.8,
      responsiveness_to_personalized_recos: 0.6,
      responsiveness_to_push_notifications_or_emails: 0.4,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "1_3_years",
      lifetime_value_band: "high",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.8,
      churn_risk_level: "low",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "value_focused_tier2_explorer_f_20_30",
    name: "Value-Focused Tier 2 Explorer",
    avatar_emoji: "👩‍🌾",
    segment_code: "F-VFT-2030",
    segment_name: "Value-Focused Tier 2 Explorer",
    segment_weight: 0.11,
    gender: "female",
    age_band: "20-30",
    narrative_summary: "Lives in Tier 2/3 cities, budget-constrained but aspirational. Looks for value, durability, and trusted brands, with growing comfort buying fashion online. Price-first decision maker.",
    
    demographics: {
      age_band: "20-30",
      age_mean: 25,
      gender: "female",
      city_tier: "tier_2",
      region: "central",
      monthly_income_band_in_inr: "20000-45000",
      income_mean: 32000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "single",
      household_type: "with_parents",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "office_9_6",
      commute_mode_primary: "two_wheeler",
      physical_activity_level: "sedentary",
      gym_sports_frequency_per_week: 0,
      social_life_intensity: "medium",
      weekend_behavior_profile: "home_focused",
      domestic_travel_frequency: 2,
      international_travel_frequency: 0,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "classic",
      fashion_involvement_level: 3,
      trend_adoption_speed: "late_adopter",
      brand_consciousness_level: 3,
      logo_visibility_tolerance: "medium",
      silhouette_experimentation_tolerance: "low",
      statement_piece_frequency: "never",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "value_for_money",
      attitude_to_clothing: "functional",
      risk_appetite_in_style: "low",
      perception_of_value: "durability",
      core_values: ["value", "durability", "practicality", "trust"],
      vals_segment: "Believers",
      social_media_influence: 0.55,
      peer_influence: 0.6,
      novelty_seeking_score: 0.3,
      impulsivity_score: 0.25,
      self_image_importance: 0.5,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "marketplace",
      secondary_purchase_channel: "offline_mbo",
      online_offline_purchase_ratio: "55_45",
      purchase_frequency_per_quarter: 3,
      avg_items_per_order: 2.5,
      avg_order_value_in_inr: 1100,
      returns_frequency_rate: 0.15,
      preferred_payment_methods: ["cod", "upi"],
      delivery_speed_sensitivity: "low",
      returns_friction_sensitivity: "high",
      wishlist_usage_frequency: "regular",
      coupon_or_offer_usage_rate: 0.9,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["kurta", "tshirts", "jeans", "casual_tops"],
      category_priority_ranking: ["kurta", "tshirts", "jeans", "lounge"],
      purchase_frequency_by_category_per_quarter: { kurta: 1.5, tshirts: 1.5, jeans: 0.5 },
      workwear_share_of_wardrobe: 0.35,
      casual_share_of_wardrobe: 0.50,
      party_share_of_wardrobe: 0.05,
      home_loungewear_share_of_wardrobe: 0.10,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 350, max: 700 },
      comfort_price_band_shirt: { min: 500, max: 1000 },
      comfort_price_band_jeans: { min: 700, max: 1300 },
      comfort_price_band_pants_chinos: { min: 600, max: 1200 },
      comfort_price_band_shorts: { min: 350, max: 700 },
      comfort_price_band_joggers: { min: 500, max: 1000 },
      comfort_price_band_hoodie_sweatshirt: { min: 700, max: 1400 },
      comfort_price_band_dress: { min: 800, max: 1600 },
      comfort_price_band_kurta: { min: 600, max: 1200 },
      max_willing_to_pay_tshirt: 900,
      typical_discount_expectation_percentage: 40,
      discount_dependence_level: "always_waits_for_sale",
      price_elasticity_category: "high",
      tradeoff_priority_order: ["price", "durability", "comfort", "design"],
      annual_fashion_spend: 16000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "regular",
      jeans_fit_preference: "straight",
      pants_fit_preference: "straight",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "at_knee",
      sleeve_length_preference: "half",
      neckline_preference: "crew",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "50_50",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "cotton_blend", "polyester_blend"],
      breathability_importance_level: 4,
      wrinkle_resistance_importance_level: 3,
      fabric_softness_importance_level: 3,
      sustainability_concern_level: 2,
      thermal_preference_for_winter: "heavy_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.35,
      color_palette_earth_tones_share: 0.25,
      color_palette_pastels_share: 0.20,
      color_palette_bright_solids_share: 0.15,
      color_palette_bold_colors_share: 0.05,
      print_vs_solid_ratio: "35_65",
      preference_for_stripes: 0.3,
      preference_for_checks: 0.35,
      preference_for_minimal_prints: 0.4,
      preference_for_graphic_prints: 0.25,
      preference_for_logo_prints: 0.2,
      preference_for_all_over_prints: 0.3,
      tolerance_for_high_contrast_outfits: 0.35,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.45,
      lovable_brand_primary_associations: ["price", "reliability"],
      brand_loyalty_strength_to_lovable: 0.4,
      number_of_competing_brands_used_regularly: 5,
      influence_of_brand_storytelling: 0.35,
      influence_of_reviews_and_ratings: 0.85,
      influence_of_influencers_celebrities: 0.4,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "evening",
      average_session_duration_minutes: 15,
      average_products_viewed_per_session: 20,
      filter_and_sort_usage_level: 0.75,
      responsiveness_to_personalized_recos: 0.6,
      responsiveness_to_push_notifications_or_emails: 0.55,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "new_to_brand",
      lifetime_value_band: "low",
      cross_category_adoption_count: 3,
      upsell_potential_to_premium_lines: 0.25,
      churn_risk_level: "medium",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "ethnic_fusion_weekender_f_25_35",
    name: "Ethnic-Fusion Weekender",
    avatar_emoji: "👩‍🎨",
    segment_code: "F-EFW-2535",
    segment_name: "Ethnic-Fusion Weekender",
    segment_weight: 0.09,
    gender: "female",
    age_band: "25-35",
    narrative_summary: "Mixes ethnic and western wear for work, family, and social settings. Loves kurtas, fusion tops, jeans, and versatile pieces that work across multiple occasions. Festive season peaks spending.",
    
    demographics: {
      age_band: "25-35",
      age_mean: 30,
      gender: "female",
      city_tier: "tier_1",
      region: "south",
      monthly_income_band_in_inr: "55000-100000",
      income_mean: 75000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "married",
      household_type: "nuclear_family",
      dependents_count: 1,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "mixed",
      commute_mode_primary: "two_wheeler",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 2,
      social_life_intensity: "medium",
      weekend_behavior_profile: "home_focused",
      domestic_travel_frequency: 3,
      international_travel_frequency: 0.5,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "ethnic_fusion",
      fashion_involvement_level: 4,
      trend_adoption_speed: "mainstream",
      brand_consciousness_level: 3,
      logo_visibility_tolerance: "low",
      silhouette_experimentation_tolerance: "medium",
      statement_piece_frequency: "occasional",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "identity",
      risk_appetite_in_style: "medium",
      perception_of_value: "versatility",
      core_values: ["cultural-pride", "versatility", "elegance", "family"],
      vals_segment: "Thinkers",
      social_media_influence: 0.55,
      peer_influence: 0.6,
      novelty_seeking_score: 0.45,
      impulsivity_score: 0.35,
      self_image_importance: 0.7,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "brand_website",
      secondary_purchase_channel: "offline_brand_store",
      online_offline_purchase_ratio: "55_45",
      purchase_frequency_per_quarter: 4,
      avg_items_per_order: 2,
      avg_order_value_in_inr: 3200,
      returns_frequency_rate: 0.10,
      preferred_payment_methods: ["upi", "card"],
      delivery_speed_sensitivity: "medium",
      returns_friction_sensitivity: "medium",
      wishlist_usage_frequency: "regular",
      coupon_or_offer_usage_rate: 0.55,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["kurta", "fusion_tops", "jeans", "palazzos", "indo_western"],
      category_priority_ranking: ["kurta", "jeans", "dresses", "tshirts", "lounge"],
      purchase_frequency_by_category_per_quarter: { kurta: 2, jeans: 1, fusion_tops: 1.5 },
      workwear_share_of_wardrobe: 0.30,
      casual_share_of_wardrobe: 0.40,
      party_share_of_wardrobe: 0.20,
      home_loungewear_share_of_wardrobe: 0.10,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 800, max: 1600 },
      comfort_price_band_shirt: { min: 1200, max: 2200 },
      comfort_price_band_jeans: { min: 1400, max: 2600 },
      comfort_price_band_pants_chinos: { min: 1200, max: 2200 },
      comfort_price_band_shorts: { min: 600, max: 1200 },
      comfort_price_band_joggers: { min: 1000, max: 1800 },
      comfort_price_band_hoodie_sweatshirt: { min: 1400, max: 2600 },
      comfort_price_band_dress: { min: 2000, max: 4000 },
      comfort_price_band_kurta: { min: 1500, max: 3500 },
      max_willing_to_pay_tshirt: 2000,
      typical_discount_expectation_percentage: 25,
      discount_dependence_level: "flexible",
      price_elasticity_category: "medium",
      tradeoff_priority_order: ["design", "comfort", "price", "brand"],
      annual_fashion_spend: 52000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "relaxed",
      jeans_fit_preference: "straight",
      pants_fit_preference: "relaxed",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "at_knee",
      sleeve_length_preference: "three_quarter",
      neckline_preference: "boat",
      waistband_preference: "elastic",
      comfort_vs_structure_ratio: "65_35",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "linen", "cotton_blend", "modal_bamboo"],
      breathability_importance_level: 5,
      wrinkle_resistance_importance_level: 3,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 3,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.25,
      color_palette_earth_tones_share: 0.30,
      color_palette_pastels_share: 0.20,
      color_palette_bright_solids_share: 0.15,
      color_palette_bold_colors_share: 0.10,
      print_vs_solid_ratio: "45_55",
      preference_for_stripes: 0.25,
      preference_for_checks: 0.2,
      preference_for_minimal_prints: 0.5,
      preference_for_graphic_prints: 0.2,
      preference_for_logo_prints: 0.1,
      preference_for_all_over_prints: 0.4,
      tolerance_for_high_contrast_outfits: 0.5,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.55,
      lovable_brand_primary_associations: ["comfort", "style", "quality"],
      brand_loyalty_strength_to_lovable: 0.55,
      number_of_competing_brands_used_regularly: 4,
      influence_of_brand_storytelling: 0.5,
      influence_of_reviews_and_ratings: 0.65,
      influence_of_influencers_celebrities: 0.45,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "evening",
      average_session_duration_minutes: 14,
      average_products_viewed_per_session: 18,
      filter_and_sort_usage_level: 0.7,
      responsiveness_to_personalized_recos: 0.65,
      responsiveness_to_push_notifications_or_emails: 0.5,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "<1_year",
      lifetime_value_band: "medium",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.55,
      churn_risk_level: "medium",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  // ======================== MALE PERSONAS (5) ========================
  
  {
    canonical_persona_id: "metro_smart_casualist_m_24_34",
    name: "Metro Smart Casualist",
    avatar_emoji: "👨‍💼",
    segment_code: "M-MSC-2434",
    segment_name: "Metro Smart Casualist",
    segment_weight: 0.12,
    gender: "male",
    age_band: "24-34",
    narrative_summary: "Urban professional with hybrid work. Wears polos, chinos, clean sneakers, smart casual shirts, minimal branding. Values versatility between office and casual settings.",
    
    demographics: {
      age_band: "24-34",
      age_mean: 29,
      gender: "male",
      city_tier: "metro",
      region: "west",
      monthly_income_band_in_inr: "60000-120000",
      income_mean: 88000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "single",
      household_type: "shared",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "wfh",
      commute_mode_primary: "car",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 3,
      social_life_intensity: "high",
      weekend_behavior_profile: "mall_cafes",
      domestic_travel_frequency: 4,
      international_travel_frequency: 1,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "minimalist",
      fashion_involvement_level: 4,
      trend_adoption_speed: "mainstream",
      brand_consciousness_level: 4,
      logo_visibility_tolerance: "low",
      silhouette_experimentation_tolerance: "medium",
      statement_piece_frequency: "occasional",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "self_expression",
      risk_appetite_in_style: "medium",
      perception_of_value: "versatility",
      core_values: ["versatility", "quality", "comfort", "modern-living"],
      vals_segment: "Innovators",
      social_media_influence: 0.6,
      peer_influence: 0.55,
      novelty_seeking_score: 0.55,
      impulsivity_score: 0.4,
      self_image_importance: 0.7,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "brand_website",
      secondary_purchase_channel: "marketplace",
      online_offline_purchase_ratio: "70_30",
      purchase_frequency_per_quarter: 4,
      avg_items_per_order: 2.5,
      avg_order_value_in_inr: 4200,
      returns_frequency_rate: 0.10,
      preferred_payment_methods: ["upi", "card"],
      delivery_speed_sensitivity: "medium",
      returns_friction_sensitivity: "medium",
      wishlist_usage_frequency: "regular",
      coupon_or_offer_usage_rate: 0.45,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["tshirts", "chinos", "casual_shirts", "joggers", "hoodies"],
      category_priority_ranking: ["tshirts", "chinos", "shirts", "joggers", "jeans"],
      purchase_frequency_by_category_per_quarter: { tshirts: 2, chinos: 1, shirts: 1, joggers: 0.5 },
      workwear_share_of_wardrobe: 0.35,
      casual_share_of_wardrobe: 0.45,
      party_share_of_wardrobe: 0.10,
      home_loungewear_share_of_wardrobe: 0.10,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 1000, max: 2200 },
      comfort_price_band_shirt: { min: 1500, max: 2800 },
      comfort_price_band_jeans: { min: 2000, max: 3800 },
      comfort_price_band_pants_chinos: { min: 1800, max: 3500 },
      comfort_price_band_shorts: { min: 800, max: 1600 },
      comfort_price_band_joggers: { min: 1200, max: 2500 },
      comfort_price_band_hoodie_sweatshirt: { min: 1800, max: 3500 },
      comfort_price_band_dress: null,
      comfort_price_band_kurta: { min: 1200, max: 2500 },
      max_willing_to_pay_tshirt: 3000,
      typical_discount_expectation_percentage: 20,
      discount_dependence_level: "flexible",
      price_elasticity_category: "medium",
      tradeoff_priority_order: ["comfort", "quality", "design", "brand"],
      annual_fashion_spend: 58000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "slim",
      shirt_fit_preference: "slim",
      jeans_fit_preference: "slim",
      pants_fit_preference: "tapered",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "above_knee",
      sleeve_length_preference: "half",
      neckline_preference: "polo",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "55_45",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "cotton_blend", "linen", "denim_stretch"],
      breathability_importance_level: 4,
      wrinkle_resistance_importance_level: 4,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 3,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.45,
      color_palette_earth_tones_share: 0.25,
      color_palette_pastels_share: 0.15,
      color_palette_bright_solids_share: 0.10,
      color_palette_bold_colors_share: 0.05,
      print_vs_solid_ratio: "20_80",
      preference_for_stripes: 0.35,
      preference_for_checks: 0.25,
      preference_for_minimal_prints: 0.4,
      preference_for_graphic_prints: 0.25,
      preference_for_logo_prints: 0.15,
      preference_for_all_over_prints: 0.1,
      tolerance_for_high_contrast_outfits: 0.3,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.65,
      lovable_brand_primary_associations: ["quality", "comfort", "style"],
      brand_loyalty_strength_to_lovable: 0.6,
      number_of_competing_brands_used_regularly: 4,
      influence_of_brand_storytelling: 0.5,
      influence_of_reviews_and_ratings: 0.65,
      influence_of_influencers_celebrities: 0.4,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "evening",
      average_session_duration_minutes: 12,
      average_products_viewed_per_session: 16,
      filter_and_sort_usage_level: 0.75,
      responsiveness_to_personalized_recos: 0.65,
      responsiveness_to_push_notifications_or_emails: 0.5,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "<1_year",
      lifetime_value_band: "medium",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.65,
      churn_risk_level: "medium",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "genz_streetwear_seeker_m_18_24",
    name: "Gen Z Streetwear Seeker",
    avatar_emoji: "🧑‍🎤",
    segment_code: "M-GSS-1824",
    segment_name: "Gen Z Streetwear Seeker",
    segment_weight: 0.10,
    gender: "male",
    age_band: "18-24",
    narrative_summary: "College/early career in metro/tier 1. Drawn to oversized tees, joggers, hoodies, graphics, streetwear brands, and drops culture. Trend-setter in social circles, highly brand-conscious.",
    
    demographics: {
      age_band: "18-24",
      age_mean: 21,
      gender: "male",
      city_tier: "metro",
      region: "all",
      monthly_income_band_in_inr: "20000-50000",
      income_mean: 35000,
      education_level: "undergraduate",
      occupation_type: "student",
      relationship_status: "single",
      household_type: "with_parents",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "college",
      commute_mode_primary: "public_transport",
      physical_activity_level: "moderate",
      gym_sports_frequency_per_week: 2,
      social_life_intensity: "high",
      weekend_behavior_profile: "nightlife",
      domestic_travel_frequency: 3,
      international_travel_frequency: 0.5,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "streetwear",
      fashion_involvement_level: 5,
      trend_adoption_speed: "early_adopter",
      brand_consciousness_level: 5,
      logo_visibility_tolerance: "high",
      silhouette_experimentation_tolerance: "high",
      statement_piece_frequency: "regular",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "style_first",
      attitude_to_clothing: "social_signal",
      risk_appetite_in_style: "high",
      perception_of_value: "uniqueness",
      core_values: ["exclusivity", "self-expression", "community", "authenticity"],
      vals_segment: "Experiencers",
      social_media_influence: 0.95,
      peer_influence: 0.85,
      novelty_seeking_score: 0.9,
      impulsivity_score: 0.75,
      self_image_importance: 0.9,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "brand_website",
      secondary_purchase_channel: "marketplace",
      online_offline_purchase_ratio: "80_20",
      purchase_frequency_per_quarter: 5,
      avg_items_per_order: 2,
      avg_order_value_in_inr: 2800,
      returns_frequency_rate: 0.12,
      preferred_payment_methods: ["upi", "cod"],
      delivery_speed_sensitivity: "high",
      returns_friction_sensitivity: "low",
      wishlist_usage_frequency: "frequent",
      coupon_or_offer_usage_rate: 0.35,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["graphic_tees", "hoodies", "joggers", "oversized_tshirts", "shorts"],
      category_priority_ranking: ["tshirts", "hoodies", "joggers", "shorts", "jeans"],
      purchase_frequency_by_category_per_quarter: { tshirts: 3, hoodies: 1, joggers: 1 },
      workwear_share_of_wardrobe: 0.05,
      casual_share_of_wardrobe: 0.70,
      party_share_of_wardrobe: 0.20,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 1200, max: 3500 },
      comfort_price_band_shirt: { min: 1500, max: 3000 },
      comfort_price_band_jeans: { min: 2000, max: 4500 },
      comfort_price_band_pants_chinos: { min: 1800, max: 3500 },
      comfort_price_band_shorts: { min: 1000, max: 2200 },
      comfort_price_band_joggers: { min: 1500, max: 3500 },
      comfort_price_band_hoodie_sweatshirt: { min: 2000, max: 5000 },
      comfort_price_band_dress: null,
      comfort_price_band_kurta: null,
      max_willing_to_pay_tshirt: 5000,
      typical_discount_expectation_percentage: 15,
      discount_dependence_level: "buys_full_price_if_likes",
      price_elasticity_category: "low",
      tradeoff_priority_order: ["design", "brand", "comfort", "price"],
      annual_fashion_spend: 48000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "oversized",
      shirt_fit_preference: "oversized",
      jeans_fit_preference: "baggy",
      pants_fit_preference: "relaxed",
      rise_preference_for_bottoms: "low",
      shorts_length_preference: "below_knee",
      sleeve_length_preference: "half",
      neckline_preference: "crew",
      waistband_preference: "drawstring",
      comfort_vs_structure_ratio: "80_20",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "fleece", "cotton_blend", "denim_rigid"],
      breathability_importance_level: 3,
      wrinkle_resistance_importance_level: 2,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 2,
      thermal_preference_for_winter: "heavy_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.35,
      color_palette_earth_tones_share: 0.25,
      color_palette_pastels_share: 0.05,
      color_palette_bright_solids_share: 0.15,
      color_palette_bold_colors_share: 0.20,
      print_vs_solid_ratio: "55_45",
      preference_for_stripes: 0.2,
      preference_for_checks: 0.15,
      preference_for_minimal_prints: 0.3,
      preference_for_graphic_prints: 0.85,
      preference_for_logo_prints: 0.8,
      preference_for_all_over_prints: 0.5,
      tolerance_for_high_contrast_outfits: 0.75,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.5,
      lovable_brand_primary_associations: ["style", "youthfulness"],
      brand_loyalty_strength_to_lovable: 0.45,
      number_of_competing_brands_used_regularly: 5,
      influence_of_brand_storytelling: 0.6,
      influence_of_reviews_and_ratings: 0.7,
      influence_of_influencers_celebrities: 0.9,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "late_night",
      average_session_duration_minutes: 20,
      average_products_viewed_per_session: 25,
      filter_and_sort_usage_level: 0.55,
      responsiveness_to_personalized_recos: 0.8,
      responsiveness_to_push_notifications_or_emails: 0.7,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "new_to_brand",
      lifetime_value_band: "medium",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.7,
      churn_risk_level: "high",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "formal_first_professional_m_28_40",
    name: "Formal-First Professional",
    avatar_emoji: "👨‍💻",
    segment_code: "M-FFP-2840",
    segment_name: "Formal-First Professional",
    segment_weight: 0.11,
    gender: "male",
    age_band: "28-40",
    narrative_summary: "Office-centric; suits/shirts/trousers are core. Needs reliable fits, easy-care fabrics, and a small smart-casual rotation for Fridays and weekends. Brand loyal for consistent sizing.",
    
    demographics: {
      age_band: "28-40",
      age_mean: 34,
      gender: "male",
      city_tier: "metro",
      region: "north",
      monthly_income_band_in_inr: "80000-150000",
      income_mean: 110000,
      education_level: "post_graduate",
      occupation_type: "salaried",
      relationship_status: "married",
      household_type: "nuclear_family",
      dependents_count: 2,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "office_9_6",
      commute_mode_primary: "car",
      physical_activity_level: "sedentary",
      gym_sports_frequency_per_week: 1,
      social_life_intensity: "medium",
      weekend_behavior_profile: "home_focused",
      domestic_travel_frequency: 3,
      international_travel_frequency: 0.5,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "classic",
      fashion_involvement_level: 3,
      trend_adoption_speed: "late_adopter",
      brand_consciousness_level: 4,
      logo_visibility_tolerance: "low",
      silhouette_experimentation_tolerance: "low",
      statement_piece_frequency: "never",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "functional",
      risk_appetite_in_style: "low",
      perception_of_value: "durability",
      core_values: ["comfort", "reliability", "practicality", "family"],
      vals_segment: "Believers",
      social_media_influence: 0.3,
      peer_influence: 0.4,
      novelty_seeking_score: 0.25,
      impulsivity_score: 0.2,
      self_image_importance: 0.55,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "offline_brand_store",
      secondary_purchase_channel: "brand_website",
      online_offline_purchase_ratio: "40_60",
      purchase_frequency_per_quarter: 2,
      avg_items_per_order: 3,
      avg_order_value_in_inr: 6000,
      returns_frequency_rate: 0.06,
      preferred_payment_methods: ["card", "upi"],
      delivery_speed_sensitivity: "low",
      returns_friction_sensitivity: "high",
      wishlist_usage_frequency: "occasional",
      coupon_or_offer_usage_rate: 0.35,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["formal_shirts", "trousers", "chinos", "polo_tshirts", "blazers"],
      category_priority_ranking: ["shirts", "trousers", "tshirts", "chinos", "jeans"],
      purchase_frequency_by_category_per_quarter: { shirts: 2, trousers: 1, tshirts: 0.5 },
      workwear_share_of_wardrobe: 0.60,
      casual_share_of_wardrobe: 0.30,
      party_share_of_wardrobe: 0.05,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 1200, max: 2500 },
      comfort_price_band_shirt: { min: 2000, max: 4000 },
      comfort_price_band_jeans: { min: 2200, max: 4000 },
      comfort_price_band_pants_chinos: { min: 2000, max: 3800 },
      comfort_price_band_shorts: { min: 1000, max: 2000 },
      comfort_price_band_joggers: { min: 1500, max: 2800 },
      comfort_price_band_hoodie_sweatshirt: { min: 2000, max: 3500 },
      comfort_price_band_dress: null,
      comfort_price_band_kurta: { min: 1500, max: 3000 },
      max_willing_to_pay_tshirt: 3500,
      typical_discount_expectation_percentage: 20,
      discount_dependence_level: "flexible",
      price_elasticity_category: "low",
      tradeoff_priority_order: ["quality", "comfort", "brand", "design"],
      annual_fashion_spend: 72000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "regular",
      jeans_fit_preference: "straight",
      pants_fit_preference: "straight",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "at_knee",
      sleeve_length_preference: "full",
      neckline_preference: "polo",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "40_60",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "cotton_blend", "linen", "polyester_blend"],
      breathability_importance_level: 4,
      wrinkle_resistance_importance_level: 5,
      fabric_softness_importance_level: 3,
      sustainability_concern_level: 2,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.50,
      color_palette_earth_tones_share: 0.20,
      color_palette_pastels_share: 0.20,
      color_palette_bright_solids_share: 0.08,
      color_palette_bold_colors_share: 0.02,
      print_vs_solid_ratio: "15_85",
      preference_for_stripes: 0.45,
      preference_for_checks: 0.4,
      preference_for_minimal_prints: 0.35,
      preference_for_graphic_prints: 0.1,
      preference_for_logo_prints: 0.15,
      preference_for_all_over_prints: 0.05,
      tolerance_for_high_contrast_outfits: 0.2,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.7,
      lovable_brand_primary_associations: ["quality", "reliability", "comfort"],
      brand_loyalty_strength_to_lovable: 0.75,
      number_of_competing_brands_used_regularly: 3,
      influence_of_brand_storytelling: 0.4,
      influence_of_reviews_and_ratings: 0.55,
      influence_of_influencers_celebrities: 0.2,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "afternoon",
      average_session_duration_minutes: 8,
      average_products_viewed_per_session: 10,
      filter_and_sort_usage_level: 0.8,
      responsiveness_to_personalized_recos: 0.5,
      responsiveness_to_push_notifications_or_emails: 0.35,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "1_3_years",
      lifetime_value_band: "high",
      cross_category_adoption_count: 3,
      upsell_potential_to_premium_lines: 0.7,
      churn_risk_level: "low",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "budget_conscious_everyday_m_20_30",
    name: "Budget-Conscious Everyday Wearer",
    avatar_emoji: "👨‍🌾",
    segment_code: "M-BCE-2030",
    segment_name: "Budget-Conscious Everyday Wearer",
    segment_weight: 0.11,
    gender: "male",
    age_band: "20-30",
    narrative_summary: "Price-sensitive, often Tier 2/3; buys when necessary. Focuses on basic tees, shirts, jeans that 'just work' and last long. Deal hunter with strong COD preference.",
    
    demographics: {
      age_band: "20-30",
      age_mean: 26,
      gender: "male",
      city_tier: "tier_2",
      region: "central",
      monthly_income_band_in_inr: "25000-50000",
      income_mean: 38000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "single",
      household_type: "with_parents",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "office_9_6",
      commute_mode_primary: "two_wheeler",
      physical_activity_level: "sedentary",
      gym_sports_frequency_per_week: 0,
      social_life_intensity: "medium",
      weekend_behavior_profile: "home_focused",
      domestic_travel_frequency: 2,
      international_travel_frequency: 0,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "classic",
      fashion_involvement_level: 2,
      trend_adoption_speed: "late_adopter",
      brand_consciousness_level: 2,
      logo_visibility_tolerance: "medium",
      silhouette_experimentation_tolerance: "low",
      statement_piece_frequency: "never",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "value_for_money",
      attitude_to_clothing: "functional",
      risk_appetite_in_style: "low",
      perception_of_value: "durability",
      core_values: ["value-for-money", "family", "practicality", "savings"],
      vals_segment: "Makers",
      social_media_influence: 0.45,
      peer_influence: 0.5,
      novelty_seeking_score: 0.25,
      impulsivity_score: 0.2,
      self_image_importance: 0.4,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "marketplace",
      secondary_purchase_channel: "offline_mbo",
      online_offline_purchase_ratio: "60_40",
      purchase_frequency_per_quarter: 2,
      avg_items_per_order: 3,
      avg_order_value_in_inr: 1200,
      returns_frequency_rate: 0.12,
      preferred_payment_methods: ["cod", "upi"],
      delivery_speed_sensitivity: "low",
      returns_friction_sensitivity: "high",
      wishlist_usage_frequency: "occasional",
      coupon_or_offer_usage_rate: 0.95,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["basic_tshirts", "formal_shirts", "jeans", "trousers"],
      category_priority_ranking: ["tshirts", "jeans", "shirts", "trousers"],
      purchase_frequency_by_category_per_quarter: { tshirts: 1.5, jeans: 0.5, shirts: 1 },
      workwear_share_of_wardrobe: 0.40,
      casual_share_of_wardrobe: 0.50,
      party_share_of_wardrobe: 0.05,
      home_loungewear_share_of_wardrobe: 0.05,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 300, max: 600 },
      comfort_price_band_shirt: { min: 500, max: 1000 },
      comfort_price_band_jeans: { min: 700, max: 1200 },
      comfort_price_band_pants_chinos: { min: 600, max: 1100 },
      comfort_price_band_shorts: { min: 350, max: 700 },
      comfort_price_band_joggers: { min: 500, max: 900 },
      comfort_price_band_hoodie_sweatshirt: { min: 700, max: 1300 },
      comfort_price_band_dress: null,
      comfort_price_band_kurta: { min: 500, max: 1000 },
      max_willing_to_pay_tshirt: 800,
      typical_discount_expectation_percentage: 45,
      discount_dependence_level: "always_waits_for_sale",
      price_elasticity_category: "high",
      tradeoff_priority_order: ["price", "durability", "comfort", "design"],
      annual_fashion_spend: 14000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "regular",
      shirt_fit_preference: "regular",
      jeans_fit_preference: "straight",
      pants_fit_preference: "straight",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "at_knee",
      sleeve_length_preference: "half",
      neckline_preference: "crew",
      waistband_preference: "structured",
      comfort_vs_structure_ratio: "50_50",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["cotton", "polyester_blend", "cotton_blend"],
      breathability_importance_level: 3,
      wrinkle_resistance_importance_level: 3,
      fabric_softness_importance_level: 3,
      sustainability_concern_level: 1,
      thermal_preference_for_winter: "heavy_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.45,
      color_palette_earth_tones_share: 0.25,
      color_palette_pastels_share: 0.15,
      color_palette_bright_solids_share: 0.10,
      color_palette_bold_colors_share: 0.05,
      print_vs_solid_ratio: "25_75",
      preference_for_stripes: 0.35,
      preference_for_checks: 0.4,
      preference_for_minimal_prints: 0.35,
      preference_for_graphic_prints: 0.25,
      preference_for_logo_prints: 0.3,
      preference_for_all_over_prints: 0.15,
      tolerance_for_high_contrast_outfits: 0.25,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.4,
      lovable_brand_primary_associations: ["price", "reliability"],
      brand_loyalty_strength_to_lovable: 0.3,
      number_of_competing_brands_used_regularly: 6,
      influence_of_brand_storytelling: 0.25,
      influence_of_reviews_and_ratings: 0.85,
      influence_of_influencers_celebrities: 0.3,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "android",
      session_time_of_day_preference: "evening",
      average_session_duration_minutes: 12,
      average_products_viewed_per_session: 18,
      filter_and_sort_usage_level: 0.8,
      responsiveness_to_personalized_recos: 0.55,
      responsiveness_to_push_notifications_or_emails: 0.5,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "new_to_brand",
      lifetime_value_band: "low",
      cross_category_adoption_count: 3,
      upsell_potential_to_premium_lines: 0.15,
      churn_risk_level: "high",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  },
  
  {
    canonical_persona_id: "athleisure_heavy_fitness_m_22_35",
    name: "Athleisure-Heavy Fitness Worker",
    avatar_emoji: "🏋️",
    segment_code: "M-AHF-2235",
    segment_name: "Athleisure-Heavy Fitness Worker",
    segment_weight: 0.10,
    gender: "male",
    age_band: "22-35",
    narrative_summary: "Gyms regularly, active lifestyle. Heavy user of joggers, performance tees, shorts, athleisure hoodies; also wears them casually. Performance fabrics and brand-conscious in activewear.",
    
    demographics: {
      age_band: "22-35",
      age_mean: 28,
      gender: "male",
      city_tier: "metro",
      region: "south",
      monthly_income_band_in_inr: "55000-110000",
      income_mean: 78000,
      education_level: "graduate",
      occupation_type: "salaried",
      relationship_status: "single",
      household_type: "shared",
      dependents_count: 0,
      modeled_v0: true
    },
    
    lifestyle: {
      daily_routine_archetype: "mixed",
      commute_mode_primary: "car",
      physical_activity_level: "high",
      gym_sports_frequency_per_week: 5,
      social_life_intensity: "high",
      weekend_behavior_profile: "travel",
      domestic_travel_frequency: 5,
      international_travel_frequency: 1,
      modeled_v0: true
    },
    
    fashion_orientation: {
      style_identity: "athleisure",
      fashion_involvement_level: 4,
      trend_adoption_speed: "early_adopter",
      brand_consciousness_level: 4,
      logo_visibility_tolerance: "high",
      silhouette_experimentation_tolerance: "medium",
      statement_piece_frequency: "occasional",
      modeled_v0: true
    },
    
    psychographics: {
      value_orientation: "comfort_first",
      attitude_to_clothing: "self_expression",
      risk_appetite_in_style: "medium",
      perception_of_value: "durability",
      core_values: ["fitness", "performance", "wellness", "self-improvement"],
      vals_segment: "Experiencers",
      social_media_influence: 0.7,
      peer_influence: 0.6,
      novelty_seeking_score: 0.65,
      impulsivity_score: 0.5,
      self_image_importance: 0.8,
      modeled_v0: true
    },
    
    shopping_preferences: {
      primary_purchase_channel: "brand_website",
      secondary_purchase_channel: "offline_brand_store",
      online_offline_purchase_ratio: "60_40",
      purchase_frequency_per_quarter: 4,
      avg_items_per_order: 2.5,
      avg_order_value_in_inr: 3800,
      returns_frequency_rate: 0.08,
      preferred_payment_methods: ["upi", "card"],
      delivery_speed_sensitivity: "medium",
      returns_friction_sensitivity: "medium",
      wishlist_usage_frequency: "regular",
      coupon_or_offer_usage_rate: 0.4,
      modeled_v0: true
    },
    
    product_preferences: {
      categories: ["joggers", "performance_tees", "shorts", "hoodies", "athleisure_sets"],
      category_priority_ranking: ["joggers", "tshirts", "shorts", "hoodies", "jeans"],
      purchase_frequency_by_category_per_quarter: { joggers: 1.5, tshirts: 2, shorts: 1, hoodies: 0.5 },
      workwear_share_of_wardrobe: 0.15,
      casual_share_of_wardrobe: 0.35,
      party_share_of_wardrobe: 0.10,
      home_loungewear_share_of_wardrobe: 0.40,
      modeled_v0: true
    },
    
    price_behavior: {
      comfort_price_band_tshirt: { min: 1000, max: 2500 },
      comfort_price_band_shirt: { min: 1400, max: 2800 },
      comfort_price_band_jeans: { min: 1800, max: 3500 },
      comfort_price_band_pants_chinos: { min: 1600, max: 3000 },
      comfort_price_band_shorts: { min: 1000, max: 2200 },
      comfort_price_band_joggers: { min: 1500, max: 3500 },
      comfort_price_band_hoodie_sweatshirt: { min: 2000, max: 4500 },
      comfort_price_band_dress: null,
      comfort_price_band_kurta: null,
      max_willing_to_pay_tshirt: 3500,
      typical_discount_expectation_percentage: 20,
      discount_dependence_level: "flexible",
      price_elasticity_category: "medium",
      tradeoff_priority_order: ["comfort", "quality", "brand", "design"],
      annual_fashion_spend: 52000,
      modeled_v0: true
    },
    
    fit_silhouette_preferences: {
      tshirt_fit_preference: "slim",
      shirt_fit_preference: "slim",
      jeans_fit_preference: "slim",
      pants_fit_preference: "tapered",
      rise_preference_for_bottoms: "mid",
      shorts_length_preference: "above_knee",
      sleeve_length_preference: "sleeveless",
      neckline_preference: "crew",
      waistband_preference: "elastic",
      comfort_vs_structure_ratio: "75_25",
      modeled_v0: true
    },
    
    fabric_material_preferences: {
      fabric_preference_ranking: ["polyester_blend", "cotton_blend", "fleece", "modal_bamboo"],
      breathability_importance_level: 5,
      wrinkle_resistance_importance_level: 3,
      fabric_softness_importance_level: 4,
      sustainability_concern_level: 3,
      thermal_preference_for_winter: "light_layer",
      fabric_allergies_or_avoidances: [],
      modeled_v0: true
    },
    
    color_pattern_preferences: {
      color_palette_neutrals_share: 0.45,
      color_palette_earth_tones_share: 0.15,
      color_palette_pastels_share: 0.05,
      color_palette_bright_solids_share: 0.20,
      color_palette_bold_colors_share: 0.15,
      print_vs_solid_ratio: "25_75",
      preference_for_stripes: 0.2,
      preference_for_checks: 0.1,
      preference_for_minimal_prints: 0.35,
      preference_for_graphic_prints: 0.4,
      preference_for_logo_prints: 0.55,
      preference_for_all_over_prints: 0.2,
      tolerance_for_high_contrast_outfits: 0.5,
      modeled_v0: true
    },
    
    brand_psychology: {
      lovable_brand_awareness_level: 0.6,
      lovable_brand_primary_associations: ["comfort", "quality", "style"],
      brand_loyalty_strength_to_lovable: 0.6,
      number_of_competing_brands_used_regularly: 4,
      influence_of_brand_storytelling: 0.5,
      influence_of_reviews_and_ratings: 0.7,
      influence_of_influencers_celebrities: 0.65,
      modeled_v0: true
    },
    
    digital_behavior: {
      primary_device_type: "ios",
      session_time_of_day_preference: "morning",
      average_session_duration_minutes: 10,
      average_products_viewed_per_session: 14,
      filter_and_sort_usage_level: 0.7,
      responsiveness_to_personalized_recos: 0.7,
      responsiveness_to_push_notifications_or_emails: 0.55,
      modeled_v0: true
    },
    
    lifecycle_loyalty: {
      relationship_stage_with_lovable: "<1_year",
      lifetime_value_band: "medium",
      cross_category_adoption_count: 4,
      upsell_potential_to_premium_lines: 0.7,
      churn_risk_level: "medium",
      modeled_v0: true
    },
    
    swipe_data_config: {
      ready_for_vectors: true,
      expected_swipe_fields: ["like", "dislike", "super_like", "skip"],
      persona_centroid_vector: null,
      swipe_metrics_placeholder: {
        swipe_like_rate_by_category: null,
        swipe_price_sensitivity_curve: null,
        fit_and_silhouette_affinity_index: null,
        style_cluster_resonance_score: null
      },
      modeled_v0: true
    }
  }
];

// =============================================================================
// METRIC CATALOG - Enterprise KPI Definitions
// =============================================================================

const METRIC_CATALOG = [
  // Channel & Funnel
  {
    metric_name: "online_vs_offline_revenue_ratio_by_persona",
    description: "Ratio of online revenue to offline revenue for each persona segment",
    formula: { numerator: "online_revenue", denominator: "offline_revenue", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "marketplace_vs_brand_site_revenue_ratio",
    description: "Revenue split between marketplace channels and brand-owned channels",
    formula: { numerator: "marketplace_revenue", denominator: "brand_site_revenue", filters: [], time_window: "monthly" },
    level_of_aggregation: "brand_total",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "mobile_vs_desktop_session_ratio",
    description: "Ratio of mobile sessions to desktop sessions across personas",
    formula: { numerator: "mobile_sessions", denominator: "desktop_sessions", filters: ["persona_id"], time_window: "weekly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "browse_to_cart_ratio",
    description: "Conversion rate from product views to add-to-cart actions",
    formula: { numerator: "cart_adds", denominator: "product_views", filters: ["persona_id", "category"], time_window: "weekly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "cart_to_purchase_ratio",
    description: "Conversion rate from cart to completed purchase",
    formula: { numerator: "purchases", denominator: "cart_sessions", filters: ["persona_id"], time_window: "weekly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "wishlist_to_purchase_ratio",
    description: "Conversion rate from wishlist additions to purchases",
    formula: { numerator: "wishlist_purchases", denominator: "wishlist_adds", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "size_confidence_index",
    description: "Measure of customer confidence in size selection based on return rates for fit issues",
    formula: { numerator: "1 - fit_related_returns", denominator: "total_orders", filters: ["persona_id", "category"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "channel_funnel",
    status: "modeled_v0_synthetic"
  },
  
  // Category, Style & Trend
  {
    metric_name: "category_contribution_to_revenue_by_persona",
    description: "Percentage of total persona revenue contributed by each product category",
    formula: { numerator: "category_revenue", denominator: "persona_total_revenue", filters: ["persona_id", "category"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "category_style",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "category_purchase_frequency_per_quarter_by_persona",
    description: "Average number of purchases per quarter in each category by persona",
    formula: { numerator: "category_purchases", denominator: "active_customers", filters: ["persona_id", "category"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "category_style",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "style_cluster_performance",
    description: "Performance metrics for each style cluster (minimalist, streetwear, athleisure, ethnic_fusion, formal, statement)",
    formula: { numerator: "cluster_revenue", denominator: "total_revenue", filters: ["style_cluster"], time_window: "quarterly" },
    level_of_aggregation: "brand_total",
    category: "category_style",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "trend_adoption_lag_days",
    description: "Average days between trend emergence and first purchase by persona segment",
    formula: { numerator: "sum(days_to_adoption)", denominator: "trend_count", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "category_style",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "statement_piece_pull_through_rate",
    description: "Percentage of statement/bold items that convert from view to purchase",
    formula: { numerator: "statement_purchases", denominator: "statement_views", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "category_style",
    status: "modeled_v0_synthetic"
  },
  
  // Price, Margin & Markdown
  {
    metric_name: "full_price_vs_discounted_units_ratio",
    description: "Ratio of units sold at full price vs discounted price",
    formula: { numerator: "full_price_units", denominator: "discounted_units", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "price_margin",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "average_discount_realized_percentage",
    description: "Average discount percentage realized across all transactions",
    formula: { numerator: "sum(discount_amount)", denominator: "sum(original_price)", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "price_margin",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "markdown_dependency_index_per_persona",
    description: "Index measuring persona's dependence on markdowns for purchase decisions (0-1)",
    formula: { numerator: "discount_purchases", denominator: "total_purchases", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "price_margin",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "willingness_to_pay_bandwidth",
    description: "Range between minimum and maximum prices persona is willing to pay by category",
    formula: { numerator: "max_paid - min_paid", denominator: "median_paid", filters: ["persona_id", "category"], time_window: "annual" },
    level_of_aggregation: "persona",
    category: "price_margin",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "elasticity_asymmetry_index",
    description: "Measure of asymmetry in price elasticity - response to price increases vs decreases",
    formula: { numerator: "elasticity_decrease - elasticity_increase", denominator: "avg_elasticity", filters: ["persona_id"], time_window: "annual" },
    level_of_aggregation: "persona",
    category: "price_margin",
    status: "modeled_v0_synthetic"
  },
  
  // Experience, Returns & Sentiment
  {
    metric_name: "return_rate_by_reason_matrix",
    description: "Return rates broken down by reason (fit, color, fabric_feel, expectation_gap)",
    formula: { numerator: "returns_by_reason", denominator: "total_orders", filters: ["persona_id", "reason"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "experience_returns",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "experience_break_point_stage",
    description: "Most common stage where customer experience breaks (discovery, size_selection, payment, delivery, returns)",
    formula: { numerator: "drop_off_by_stage", denominator: "total_sessions", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "experience_returns",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "sentiment_to_sales_correlation",
    description: "Correlation between customer sentiment scores and sales performance",
    formula: { numerator: "correlation(sentiment_score, revenue)", denominator: "1", filters: ["persona_id"], time_window: "quarterly" },
    level_of_aggregation: "persona",
    category: "experience_returns",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "personalization_lift_index",
    description: "Percentage lift in conversion from personalized recommendations",
    formula: { numerator: "personalized_conversion - baseline_conversion", denominator: "baseline_conversion", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "experience_returns",
    status: "modeled_v0_synthetic"
  },
  
  // Regional & Gender Split
  {
    metric_name: "female_vs_male_revenue_ratio",
    description: "Ratio of female persona revenue to male persona revenue",
    formula: { numerator: "female_revenue", denominator: "male_revenue", filters: [], time_window: "quarterly" },
    level_of_aggregation: "gender",
    category: "regional_gender",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "metro_vs_non_metro_revenue_ratio",
    description: "Revenue split between metro and non-metro city tiers",
    formula: { numerator: "metro_revenue", denominator: "non_metro_revenue", filters: [], time_window: "quarterly" },
    level_of_aggregation: "region",
    category: "regional_gender",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "regional_style_preference_deltas",
    description: "Deviation in style preferences across regions from national average",
    formula: { numerator: "regional_style_share - national_style_share", denominator: "national_style_share", filters: ["region", "style"], time_window: "annual" },
    level_of_aggregation: "region",
    category: "regional_gender",
    status: "modeled_v0_synthetic"
  },
  
  // Swipe-Based Metrics (Placeholders)
  {
    metric_name: "swipe_like_rate_by_persona_and_category",
    description: "Like rate from swipe interactions by persona and product category (PLACEHOLDER - awaiting swipe data)",
    formula: { numerator: "likes", denominator: "total_swipes", filters: ["persona_id", "category"], time_window: "weekly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "swipe_price_sensitivity_curve",
    description: "Relationship between product price and swipe-like probability (PLACEHOLDER - awaiting swipe data)",
    formula: { numerator: "like_rate_by_price_band", denominator: "1", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "swipe_color_preference_vector",
    description: "Color preference distribution derived from swipe behavior (PLACEHOLDER - awaiting swipe data)",
    formula: { numerator: "likes_by_color", denominator: "total_likes", filters: ["persona_id"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "fit_and_silhouette_affinity_index",
    description: "Index measuring persona affinity for different fits derived from swipe patterns (PLACEHOLDER)",
    formula: { numerator: "fit_like_rate", denominator: "baseline_like_rate", filters: ["persona_id", "fit_type"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "style_cluster_resonance_score",
    description: "Score measuring how strongly persona resonates with each style cluster from swipes (PLACEHOLDER)",
    formula: { numerator: "cluster_like_rate", denominator: "avg_like_rate", filters: ["persona_id", "style_cluster"], time_window: "monthly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  },
  {
    metric_name: "session_swipe_depth",
    description: "Average number of swipes per session before conversion/exit (PLACEHOLDER - awaiting swipe data)",
    formula: { numerator: "total_swipes", denominator: "total_sessions", filters: ["persona_id"], time_window: "weekly" },
    level_of_aggregation: "persona",
    category: "swipe_metrics",
    status: "modeled_v0_synthetic"
  }
];

// =============================================================================
// ATTRIBUTE VECTOR GENERATION
// =============================================================================

function generateAttributeVector(persona: typeof CANONICAL_PERSONAS[0]) {
  const vector: { name: string; value: number; category: string }[] = [];
  
  // Demographics (12 attributes)
  const ageMean = persona.demographics.age_mean;
  vector.push({ name: "age_normalized", value: (ageMean - 18) / 30, category: "demographics" });
  vector.push({ name: "income_normalized", value: persona.demographics.income_mean / 200000, category: "demographics" });
  vector.push({ name: "is_female", value: persona.gender === "female" ? 1 : 0, category: "demographics" });
  vector.push({ name: "is_metro", value: persona.demographics.city_tier === "metro" ? 1 : (persona.demographics.city_tier === "tier_1" ? 0.7 : 0.4), category: "demographics" });
  vector.push({ name: "dependents_count_norm", value: persona.demographics.dependents_count / 3, category: "demographics" });
  vector.push({ name: "education_level", value: persona.demographics.education_level === "post_graduate" ? 1 : (persona.demographics.education_level === "graduate" ? 0.7 : 0.4), category: "demographics" });
  
  // Lifestyle (10 attributes)
  const activityMap: Record<string, number> = { high: 0.9, moderate: 0.5, sedentary: 0.2 };
  vector.push({ name: "physical_activity", value: activityMap[persona.lifestyle.physical_activity_level] || 0.5, category: "lifestyle" });
  vector.push({ name: "gym_frequency_norm", value: persona.lifestyle.gym_sports_frequency_per_week / 6, category: "lifestyle" });
  const socialMap: Record<string, number> = { high: 0.9, medium: 0.5, low: 0.2 };
  vector.push({ name: "social_intensity", value: socialMap[persona.lifestyle.social_life_intensity] || 0.5, category: "lifestyle" });
  vector.push({ name: "travel_domestic_norm", value: persona.lifestyle.domestic_travel_frequency / 6, category: "lifestyle" });
  vector.push({ name: "travel_international_norm", value: persona.lifestyle.international_travel_frequency / 3, category: "lifestyle" });
  
  // Fashion Orientation (10 attributes)
  vector.push({ name: "fashion_involvement", value: persona.fashion_orientation.fashion_involvement_level / 5, category: "fashion_orientation" });
  vector.push({ name: "brand_consciousness", value: persona.fashion_orientation.brand_consciousness_level / 5, category: "fashion_orientation" });
  const logoMap: Record<string, number> = { high: 0.9, medium: 0.5, low: 0.2 };
  vector.push({ name: "logo_tolerance", value: logoMap[persona.fashion_orientation.logo_visibility_tolerance] || 0.5, category: "fashion_orientation" });
  vector.push({ name: "silhouette_experimentation", value: logoMap[persona.fashion_orientation.silhouette_experimentation_tolerance] || 0.5, category: "fashion_orientation" });
  const trendMap: Record<string, number> = { early_adopter: 0.9, mainstream: 0.5, late_adopter: 0.2 };
  vector.push({ name: "trend_adoption_speed", value: trendMap[persona.fashion_orientation.trend_adoption_speed] || 0.5, category: "fashion_orientation" });
  
  // Shopping Behavior (10 attributes)
  vector.push({ name: "purchase_frequency_norm", value: persona.shopping_preferences.purchase_frequency_per_quarter / 8, category: "shopping_behavior" });
  vector.push({ name: "avg_order_value_norm", value: persona.shopping_preferences.avg_order_value_in_inr / 10000, category: "shopping_behavior" });
  vector.push({ name: "returns_rate", value: persona.shopping_preferences.returns_frequency_rate, category: "shopping_behavior" });
  const onlineRatio = parseFloat(persona.shopping_preferences.online_offline_purchase_ratio.split("_")[0]) / 100;
  vector.push({ name: "online_preference", value: onlineRatio, category: "shopping_behavior" });
  vector.push({ name: "coupon_usage", value: persona.shopping_preferences.coupon_or_offer_usage_rate, category: "shopping_behavior" });
  
  // Price Behavior (10 attributes)
  const tshirtMid = (persona.price_behavior.comfort_price_band_tshirt.min + persona.price_behavior.comfort_price_band_tshirt.max) / 2;
  vector.push({ name: "tshirt_price_norm", value: tshirtMid / 4000, category: "price_behavior" });
  const discountMap: Record<string, number> = { always_waits_for_sale: 0.9, flexible: 0.5, buys_full_price_if_likes: 0.1 };
  vector.push({ name: "discount_dependence", value: discountMap[persona.price_behavior.discount_dependence_level] || 0.5, category: "price_behavior" });
  const elasticityMap: Record<string, number> = { high: 0.9, medium: 0.5, low: 0.2 };
  vector.push({ name: "price_elasticity", value: elasticityMap[persona.price_behavior.price_elasticity_category] || 0.5, category: "price_behavior" });
  vector.push({ name: "annual_spend_norm", value: persona.price_behavior.annual_fashion_spend / 100000, category: "price_behavior" });
  vector.push({ name: "discount_expectation", value: persona.price_behavior.typical_discount_expectation_percentage / 50, category: "price_behavior" });
  
  // Fit & Silhouette (10 attributes)
  const fitMap: Record<string, number> = { slim: 0.3, regular: 0.5, relaxed: 0.7, oversized: 0.9 };
  vector.push({ name: "tshirt_fit_looseness", value: fitMap[persona.fit_silhouette_preferences.tshirt_fit_preference] || 0.5, category: "fit_silhouette" });
  const jeansFitMap: Record<string, number> = { skinny: 0.2, slim: 0.4, straight: 0.6, relaxed: 0.75, baggy: 0.9 };
  vector.push({ name: "jeans_fit_looseness", value: jeansFitMap[persona.fit_silhouette_preferences.jeans_fit_preference] || 0.5, category: "fit_silhouette" });
  const riseMap: Record<string, number> = { low: 0.3, mid: 0.5, high: 0.8 };
  vector.push({ name: "rise_preference", value: riseMap[persona.fit_silhouette_preferences.rise_preference_for_bottoms] || 0.5, category: "fit_silhouette" });
  const comfortRatio = parseFloat(persona.fit_silhouette_preferences.comfort_vs_structure_ratio.split("_")[0]) / 100;
  vector.push({ name: "comfort_vs_structure", value: comfortRatio, category: "fit_silhouette" });
  
  // Fabric & Material (8 attributes)
  vector.push({ name: "breathability_importance", value: persona.fabric_material_preferences.breathability_importance_level / 5, category: "fabric_material" });
  vector.push({ name: "wrinkle_resistance_importance", value: persona.fabric_material_preferences.wrinkle_resistance_importance_level / 5, category: "fabric_material" });
  vector.push({ name: "fabric_softness_importance", value: persona.fabric_material_preferences.fabric_softness_importance_level / 5, category: "fabric_material" });
  vector.push({ name: "sustainability_concern", value: persona.fabric_material_preferences.sustainability_concern_level / 5, category: "fabric_material" });
  
  // Color & Pattern (12 attributes)
  vector.push({ name: "neutrals_preference", value: persona.color_pattern_preferences.color_palette_neutrals_share, category: "color_pattern" });
  vector.push({ name: "earth_tones_preference", value: persona.color_pattern_preferences.color_palette_earth_tones_share, category: "color_pattern" });
  vector.push({ name: "pastels_preference", value: persona.color_pattern_preferences.color_palette_pastels_share, category: "color_pattern" });
  vector.push({ name: "bright_colors_preference", value: persona.color_pattern_preferences.color_palette_bright_solids_share, category: "color_pattern" });
  vector.push({ name: "bold_colors_preference", value: persona.color_pattern_preferences.color_palette_bold_colors_share, category: "color_pattern" });
  const printRatio = parseFloat(persona.color_pattern_preferences.print_vs_solid_ratio.split("_")[0]) / 100;
  vector.push({ name: "print_preference", value: printRatio, category: "color_pattern" });
  vector.push({ name: "graphic_prints_preference", value: persona.color_pattern_preferences.preference_for_graphic_prints, category: "color_pattern" });
  vector.push({ name: "logo_prints_preference", value: persona.color_pattern_preferences.preference_for_logo_prints, category: "color_pattern" });
  
  // Digital Behavior (8 attributes)
  vector.push({ name: "session_duration_norm", value: persona.digital_behavior.average_session_duration_minutes / 25, category: "digital_behavior" });
  vector.push({ name: "products_viewed_norm", value: persona.digital_behavior.average_products_viewed_per_session / 30, category: "digital_behavior" });
  vector.push({ name: "filter_usage", value: persona.digital_behavior.filter_and_sort_usage_level, category: "digital_behavior" });
  vector.push({ name: "personalization_response", value: persona.digital_behavior.responsiveness_to_personalized_recos, category: "digital_behavior" });
  vector.push({ name: "notification_response", value: persona.digital_behavior.responsiveness_to_push_notifications_or_emails, category: "digital_behavior" });
  
  // Brand Psychology (8 attributes)
  vector.push({ name: "brand_awareness", value: persona.brand_psychology.lovable_brand_awareness_level, category: "brand_psychology" });
  vector.push({ name: "brand_loyalty", value: persona.brand_psychology.brand_loyalty_strength_to_lovable, category: "brand_psychology" });
  vector.push({ name: "review_influence", value: persona.brand_psychology.influence_of_reviews_and_ratings, category: "brand_psychology" });
  vector.push({ name: "influencer_influence", value: persona.brand_psychology.influence_of_influencers_celebrities, category: "brand_psychology" });
  vector.push({ name: "storytelling_influence", value: persona.brand_psychology.influence_of_brand_storytelling, category: "brand_psychology" });
  
  // Psychographics (8 attributes)
  vector.push({ name: "social_media_influence", value: persona.psychographics.social_media_influence, category: "psychographics" });
  vector.push({ name: "peer_influence", value: persona.psychographics.peer_influence, category: "psychographics" });
  vector.push({ name: "novelty_seeking", value: persona.psychographics.novelty_seeking_score, category: "psychographics" });
  vector.push({ name: "impulsivity", value: persona.psychographics.impulsivity_score, category: "psychographics" });
  vector.push({ name: "self_image_importance", value: persona.psychographics.self_image_importance, category: "psychographics" });
  
  // Lifecycle & Loyalty (6 attributes)
  const churnMap: Record<string, number> = { high: 0.8, medium: 0.5, low: 0.2 };
  vector.push({ name: "churn_risk", value: churnMap[persona.lifecycle_loyalty.churn_risk_level] || 0.5, category: "lifecycle_loyalty" });
  vector.push({ name: "upsell_potential", value: persona.lifecycle_loyalty.upsell_potential_to_premium_lines, category: "lifecycle_loyalty" });
  vector.push({ name: "cross_category_adoption", value: persona.lifecycle_loyalty.cross_category_adoption_count / 5, category: "lifecycle_loyalty" });
  
  return vector;
}

// =============================================================================
// PERSONA ANALYTICS CALCULATION
// =============================================================================

function calculatePersonaAnalytics(persona: typeof CANONICAL_PERSONAS[0]) {
  const onlineRatio = parseFloat(persona.shopping_preferences.online_offline_purchase_ratio.split("_")[0]) / 100;
  const discountMap: Record<string, number> = { always_waits_for_sale: 0.85, flexible: 0.45, buys_full_price_if_likes: 0.15 };
  
  return {
    online_offline_ratio: onlineRatio,
    marketplace_brand_ratio: persona.shopping_preferences.primary_purchase_channel === "marketplace" ? 0.65 : 0.35,
    mobile_desktop_ratio: persona.digital_behavior.primary_device_type === "android" ? 0.85 : 0.7,
    browse_to_cart_ratio: 0.15 + (persona.psychographics.impulsivity_score * 0.1),
    cart_to_purchase_ratio: 0.35 + (persona.brand_psychology.brand_loyalty_strength_to_lovable * 0.2),
    wishlist_to_purchase_ratio: 0.2 + (persona.brand_psychology.brand_loyalty_strength_to_lovable * 0.15),
    return_rate: persona.shopping_preferences.returns_frequency_rate,
    full_price_discount_ratio: discountMap[persona.price_behavior.discount_dependence_level] || 0.45,
    avg_discount_availed: persona.price_behavior.typical_discount_expectation_percentage / 100,
    avg_lifetime_value: persona.price_behavior.annual_fashion_spend * 2.5,
    repeat_purchase_rate: 0.3 + (persona.brand_psychology.brand_loyalty_strength_to_lovable * 0.4),
    cross_category_adoption: persona.lifecycle_loyalty.cross_category_adoption_count / 5,
    price_elasticity_segment: persona.price_behavior.price_elasticity_category,
    above_median_purchase_pct: persona.price_behavior.annual_fashion_spend > 40000 ? 0.65 : 0.35,
    neutral_color_bold_ratio: persona.color_pattern_preferences.color_palette_neutrals_share / 
      (persona.color_pattern_preferences.color_palette_bold_colors_share + 0.01),
    solid_prints_ratio: (100 - parseFloat(persona.color_pattern_preferences.print_vs_solid_ratio.split("_")[0])) / 100,
    classic_trendy_ratio: persona.fashion_orientation.trend_adoption_speed === "late_adopter" ? 0.8 : 0.4,
    category_frequency: persona.product_preferences.purchase_frequency_by_category_per_quarter,
    category_contributions: persona.product_preferences.categories.reduce((acc, cat, i) => {
      acc[cat] = Math.max(0.05, 0.35 - (i * 0.06));
      return acc;
    }, {} as Record<string, number>),
    // New KPI fields
    size_confidence_index: 1 - persona.shopping_preferences.returns_frequency_rate * 0.5,
    trend_adoption_lag_days: persona.fashion_orientation.trend_adoption_speed === "early_adopter" ? 14 : 
      (persona.fashion_orientation.trend_adoption_speed === "mainstream" ? 45 : 90),
    statement_piece_pull_through_rate: persona.fashion_orientation.statement_piece_frequency === "regular" ? 0.25 : 0.12,
    markdown_dependency_index: discountMap[persona.price_behavior.discount_dependence_level] || 0.45,
    willingness_to_pay_bandwidth: {
      tshirt: persona.price_behavior.comfort_price_band_tshirt,
      jeans: persona.price_behavior.comfort_price_band_jeans,
      shirt: persona.price_behavior.comfort_price_band_shirt
    },
    elasticity_asymmetry_index: persona.price_behavior.price_elasticity_category === "high" ? 0.3 : 0.1,
    experience_break_point_stage: persona.shopping_preferences.returns_friction_sensitivity === "high" ? "returns" : "size_selection",
    sentiment_to_sales_correlation: 0.4 + (persona.brand_psychology.brand_loyalty_strength_to_lovable * 0.3),
    personalization_lift_index: persona.digital_behavior.responsiveness_to_personalized_recos * 0.4,
    // Swipe placeholders
    swipe_like_rate: null,
    swipe_price_sensitivity: null,
    style_cluster_resonance_score: null
  };
}

// =============================================================================
// MAIN SERVE FUNCTION
// =============================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT validation
    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      return new Response(
        JSON.stringify({ code: 401, message: "Missing JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const jwt = authHeader.split(" ")[1];

    const { tenantId, action } = await req.json();
    
    if (!tenantId) {
      throw new Error("tenantId is required");
    }

    console.log(`[regenerate-personas] Starting for tenant: ${tenantId}, action: ${action}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    // Validate user
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ code: 401, message: "Invalid JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check tenant access
    const { data: hasAccess } = await supabase.rpc("has_tenant_access", {
      _tenant_id: tenantId,
      _user_id: userData.user.id,
    });
    if (!hasAccess) {
      return new Response(
        JSON.stringify({ code: 403, message: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete existing data
    console.log("[regenerate-personas] Clearing existing data...");
    
    await supabase.from("analysis_results").delete().eq("tenant_id", tenantId);
    await supabase.from("persona_analytics").delete().eq("tenant_id", tenantId);
    await supabase.from("personas").delete().eq("tenant_id", tenantId);

    // Insert new personas
    console.log("[regenerate-personas] Creating 10 canonical personas with 100+ attributes...");
    
    const personasCreated: string[] = [];
    
    for (const persona of CANONICAL_PERSONAS) {
      const attributeVector = generateAttributeVector(persona);
      const analytics = calculatePersonaAnalytics(persona);
      
      // Insert persona
      const { data: insertedPersona, error: personaError } = await supabase
        .from("personas")
        .insert({
          tenant_id: tenantId,
          name: persona.name,
          canonical_persona_id: persona.canonical_persona_id,
          segment_code: persona.segment_code,
          segment_name: persona.segment_name,
          segment_weight: persona.segment_weight,
          gender: persona.gender,
          avatar_emoji: persona.avatar_emoji,
          description: persona.narrative_summary,
          demographics: persona.demographics,
          lifestyle: persona.lifestyle,
          fashion_orientation: persona.fashion_orientation,
          psychographics: persona.psychographics,
          shopping_preferences: persona.shopping_preferences,
          product_preferences: persona.product_preferences,
          price_behavior: persona.price_behavior,
          brand_psychology: persona.brand_psychology,
          digital_behavior: persona.digital_behavior,
          category_affinities: persona.product_preferences.categories.reduce((acc, cat, i) => {
            acc[cat] = Math.max(0.3, 1 - (i * 0.12));
            return acc;
          }, {} as Record<string, number>),
          attribute_vector: attributeVector,
          fit_silhouette_preferences: persona.fit_silhouette_preferences,
          fabric_material_preferences: persona.fabric_material_preferences,
          color_pattern_preferences: persona.color_pattern_preferences,
          lifecycle_loyalty: persona.lifecycle_loyalty,
          swipe_data_config: persona.swipe_data_config,
          data_source_status: "modeled_v0",
          is_active: true
        })
        .select("id")
        .single();

      if (personaError) {
        console.error(`[regenerate-personas] Error inserting persona ${persona.name}:`, personaError);
        continue;
      }

      // Insert persona analytics
      const { error: analyticsError } = await supabase
        .from("persona_analytics")
        .insert({
          tenant_id: tenantId,
          persona_id: insertedPersona.id,
          ...analytics
        });

      if (analyticsError) {
        console.error(`[regenerate-personas] Error inserting analytics for ${persona.name}:`, analyticsError);
      }

      personasCreated.push(persona.name);
      console.log(`[regenerate-personas] Created: ${persona.name} (${attributeVector.length} attributes)`);
    }

    // Upsert metric catalog
    console.log("[regenerate-personas] Upserting metric catalog...");
    for (const metric of METRIC_CATALOG) {
      await supabase.from("metric_catalog").upsert(metric, { onConflict: "metric_name" });
    }

    // Calculate and insert aggregate analytics
    console.log("[regenerate-personas] Calculating aggregate analytics...");
    
    const femalePersonas = CANONICAL_PERSONAS.filter(p => p.gender === "female");
    const malePersonas = CANONICAL_PERSONAS.filter(p => p.gender === "male");
    const metroPersonas = CANONICAL_PERSONAS.filter(p => p.demographics.city_tier === "metro");
    
    const aggregateAnalytics = {
      tenant_id: tenantId,
      female_revenue_ratio: femalePersonas.reduce((sum, p) => sum + p.segment_weight, 0),
      metro_non_metro_ratio: metroPersonas.reduce((sum, p) => sum + p.segment_weight, 0) / 
        (1 - metroPersonas.reduce((sum, p) => sum + p.segment_weight, 0) + 0.01),
      premium_segment_share: CANONICAL_PERSONAS
        .filter(p => p.price_behavior.price_elasticity_category === "low")
        .reduce((sum, p) => sum + p.segment_weight, 0),
      avg_discount_rate: CANONICAL_PERSONAS.reduce((sum, p) => 
        sum + (p.price_behavior.typical_discount_expectation_percentage * p.segment_weight), 0) / 100,
      total_online_ratio: CANONICAL_PERSONAS.reduce((sum, p) => {
        const ratio = parseFloat(p.shopping_preferences.online_offline_purchase_ratio.split("_")[0]) / 100;
        return sum + (ratio * p.segment_weight);
      }, 0),
      persona_segment_weights: CANONICAL_PERSONAS.reduce((acc, p) => {
        acc[p.canonical_persona_id] = p.segment_weight;
        return acc;
      }, {} as Record<string, number>),
      top_personas_by_revenue: CANONICAL_PERSONAS
        .sort((a, b) => b.price_behavior.annual_fashion_spend * b.segment_weight - 
          a.price_behavior.annual_fashion_spend * a.segment_weight)
        .slice(0, 5)
        .map(p => ({ name: p.name, id: p.canonical_persona_id, weight: p.segment_weight })),
      price_elasticity_distribution: {
        high: CANONICAL_PERSONAS.filter(p => p.price_behavior.price_elasticity_category === "high").length,
        medium: CANONICAL_PERSONAS.filter(p => p.price_behavior.price_elasticity_category === "medium").length,
        low: CANONICAL_PERSONAS.filter(p => p.price_behavior.price_elasticity_category === "low").length
      },
      top_channel_breakdown: {
        marketplace: CANONICAL_PERSONAS.filter(p => p.shopping_preferences.primary_purchase_channel === "marketplace").length,
        brand_website: CANONICAL_PERSONAS.filter(p => p.shopping_preferences.primary_purchase_channel === "brand_website").length,
        offline: CANONICAL_PERSONAS.filter(p => p.shopping_preferences.primary_purchase_channel.includes("offline")).length
      },
      regional_style_divergence: {
        metro_minimalist_index: 0.65,
        tier2_ethnic_fusion_index: 0.45,
        north_formal_index: 0.55,
        south_athleisure_index: 0.48
      },
      style_cluster_performance: {
        minimalist: 0.28,
        streetwear: 0.18,
        athleisure: 0.20,
        ethnic_fusion: 0.15,
        classic: 0.14,
        experimental: 0.05
      },
      return_rate_by_reason: {
        fit: 0.45,
        color: 0.20,
        fabric_feel: 0.15,
        expectation_gap: 0.20
      },
      personalization_lift_overall: 0.32,
      swipe_metrics_aggregate: {
        status: "awaiting_swipe_data",
        placeholder: true
      }
    };

    await supabase.from("aggregate_analytics").upsert(aggregateAnalytics, { 
      onConflict: "tenant_id,analytics_date" 
    });

    console.log(`[regenerate-personas] Complete! Created ${personasCreated.length} personas`);

    return new Response(
      JSON.stringify({
        success: true,
        personasCreated: personasCreated.length,
        personas: personasCreated,
        metricsCreated: METRIC_CATALOG.length,
        dataSourceStatus: "modeled_v0",
        notes: "This is a cold-start, synthetic, research-based digital twin. All values are modeled_v0 (hypothesis-driven). Data will be refined once real swipe data and customer behavior is available."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("[regenerate-personas] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
