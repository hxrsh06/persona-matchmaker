# SWIRL - Complete Recreation Prompt

> **Use this prompt to recreate the exact SWIRL Apparel Persona Analytics Engine in Lovable**

---

## 1. PROJECT OVERVIEW

Build **SWIRL** — an AI-powered Apparel Persona Analytics Engine for the Indian market. This is a B2B SaaS platform that helps fashion brands understand how their products resonate with different customer segments.

**Brand Identity:**
- Name: SWIRL
- Logo: White inverted logo on dark background (upload `inverted_LOGO.png`)
- Font: DM Sans (400, 500, 600, 700 weights via Google Fonts)
- Theme: Pure monochromatic black & white, Apple-like minimalist aesthetic
- No emojis anywhere in UI

**Tech Stack:**
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS + shadcn/ui components
- Backend: Supabase (Lovable Cloud) for auth, database, storage, edge functions
- AI: Lovable AI Gateway (google/gemini-2.5-flash) for product analysis and persona scoring
- Charts: Recharts

---

## 2. DESIGN SYSTEM (index.css)

### Light Mode (Pure White Background)
```css
--background: 0 0% 100%;       /* Pure white */
--foreground: 0 0% 8%;          /* Near black text */
--card: 0 0% 100%;
--card-foreground: 0 0% 8%;
--primary: 0 0% 8%;             /* Black buttons/accents */
--primary-foreground: 0 0% 100%;
--secondary: 0 0% 96%;          /* Light gray */
--secondary-foreground: 0 0% 8%;
--muted: 0 0% 96%;
--muted-foreground: 0 0% 45%;
--accent: 0 0% 96%;
--accent-foreground: 0 0% 8%;
--destructive: 0 0% 25%;
--destructive-foreground: 0 0% 100%;
--border: 0 0% 90%;
--input: 0 0% 90%;
--ring: 0 0% 8%;
--radius: 0.5rem;
--chart-1: 0 0% 20%;
--chart-2: 0 0% 35%;
--chart-3: 0 0% 50%;
--chart-4: 0 0% 65%;
--chart-5: 0 0% 80%;
```

### Dark Mode (Inverted)
```css
--background: 0 0% 4%;          /* Near black */
--foreground: 0 0% 96%;         /* Near white text */
--primary: 0 0% 96%;            /* White buttons */
--primary-foreground: 0 0% 4%;
/* ...invert all other values accordingly */
```

### Typography
- Base font: DM Sans, antialiased
- Letter-spacing: -0.01em for body, tight for headings
- Font features: "cv02", "cv03", "cv04", "cv11"
- Headings: font-medium, tracking-tight
- Custom minimal scrollbar utility class

### Tailwind Config
```js
fontFamily: {
  sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
}
```

---

## 3. DATABASE SCHEMA (Supabase)

### 3.1 Core Tables

#### `tenants`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, gen_random_uuid() |
| name | text | NOT NULL |
| slug | text | NOT NULL, unique |
| logo_url | text | Nullable |
| settings | jsonb | Default '{}' |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

#### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, references auth.users |
| email | text | Nullable |
| full_name | text | Nullable |
| avatar_url | text | Nullable |
| current_tenant_id | uuid | FK to tenants |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

#### `user_roles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | NOT NULL |
| tenant_id | uuid | FK to tenants |
| role | app_role ENUM | 'admin', 'merchandiser', 'marketer', 'viewer' |
| created_at | timestamptz | Default now() |

#### `products`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK to tenants, NOT NULL |
| name | text | NOT NULL |
| brand | text | Nullable |
| description | text | Nullable |
| category | text | NOT NULL |
| subcategory | text | Nullable |
| price | numeric | NOT NULL |
| original_price | numeric | Nullable |
| currency | text | Default 'INR' |
| primary_image_url | text | Nullable |
| additional_images | text[] | Default '{}' |
| tags | text[] | Default '{}' |
| size_range | text[] | Default '{}' |
| sku | text | Nullable |
| status | text | Default 'pending' ('pending', 'analyzed', 'error') |
| extracted_features | jsonb | Default '{}' |
| feature_vector | jsonb | Default '[]' |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

#### `personas` (CRITICAL: FIXED 10 PERSONAS)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK to tenants, NOT NULL |
| canonical_persona_id | text | Unique identifier for locking |
| name | text | NOT NULL |
| description | text | Nullable |
| avatar_emoji | text | Default '👤' (but not displayed in UI) |
| gender | text | 'female' or 'male' |
| segment_code | text | e.g., 'F-UCC-2432' |
| segment_name | text | |
| segment_weight | numeric | 0.0-1.0, sums to ~1.0 across 10 |
| data_source_status | text | Default 'modeled_v0' |
| demographics | jsonb | NOT NULL, Default '{}' |
| lifestyle | jsonb | Default '{}' |
| fashion_orientation | jsonb | Default '{}' |
| psychographics | jsonb | NOT NULL, Default '{}' |
| shopping_preferences | jsonb | NOT NULL, Default '{}' |
| product_preferences | jsonb | NOT NULL, Default '{}' |
| price_behavior | jsonb | NOT NULL, Default '{}' |
| brand_psychology | jsonb | NOT NULL, Default '{}' |
| digital_behavior | jsonb | Default '{}' |
| category_affinities | jsonb | Default '{}' |
| fit_silhouette_preferences | jsonb | Default '{}' |
| fabric_material_preferences | jsonb | Default '{}' |
| color_pattern_preferences | jsonb | Default '{}' |
| lifecycle_loyalty | jsonb | Default '{}' |
| swipe_data_config | jsonb | Default '{}' |
| attribute_vector | jsonb | NOT NULL, Default '[]' |
| is_active | boolean | Default true |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Default now() |

#### `analysis_results`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK to products, NOT NULL |
| persona_id | uuid | FK to personas, NOT NULL |
| tenant_id | uuid | FK to tenants, NOT NULL |
| like_probability | numeric | 0-100, NOT NULL |
| confidence_score | numeric | 0-100 |
| price_floor | numeric | |
| price_sweet_spot | numeric | |
| price_ceiling | numeric | |
| price_elasticity | numeric | -1 to 1 |
| explanation | text | |
| match_factors | jsonb | Default '[]' |
| what_if_simulations | jsonb | Default '{}' |
| created_at | timestamptz | Default now() |

*Unique constraint on (product_id, persona_id)*

#### `analysis_history`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK to tenants |
| user_id | uuid | Nullable |
| product_id | uuid | FK to products, Nullable |
| action_type | text | 'single_analysis', 'what_if_simulation', etc. |
| input_data | jsonb | Default '{}' |
| results_summary | jsonb | Default '{}' |
| created_at | timestamptz | Default now() |

#### `persona_analytics`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK |
| persona_id | uuid | FK |
| analytics_date | date | Default CURRENT_DATE |
| online_offline_ratio | numeric | |
| browse_to_cart_ratio | numeric | |
| cart_to_purchase_ratio | numeric | |
| wishlist_to_purchase_ratio | numeric | |
| return_rate | numeric | |
| avg_lifetime_value | numeric | |
| swipe_like_rate | numeric | |
| swipe_price_sensitivity | numeric | |
| price_elasticity_segment | text | |
| *...35+ more analytics fields* | | |
| created_at | timestamptz | Default now() |

#### `aggregate_analytics`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK |
| analytics_date | date | Default CURRENT_DATE |
| total_online_ratio | numeric | |
| female_revenue_ratio | numeric | |
| metro_non_metro_ratio | numeric | |
| premium_segment_share | numeric | |
| avg_discount_rate | numeric | |
| top_personas_by_revenue | jsonb | Default '[]' |
| style_cluster_performance | jsonb | Default '{}' |
| price_elasticity_distribution | jsonb | Default '{}' |
| *...more aggregate fields* | | |
| created_at | timestamptz | Default now() |

#### `style_clusters`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK |
| name | text | NOT NULL |
| description | text | |
| color | text | Hex color |
| keywords | text[] | Default '{}' |
| created_at | timestamptz | Default now() |

#### `product_style_mappings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK |
| style_cluster_id | uuid | FK |
| confidence_score | numeric | Default 0 |
| created_at | timestamptz | Default now() |

#### `metric_catalog`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| metric_name | text | NOT NULL |
| description | text | |
| category | text | |
| level_of_aggregation | text | |
| formula | jsonb | Default '{}' |
| status | text | Default 'modeled_v0_synthetic' |
| created_at | timestamptz | Default now() |

#### `analytics_snapshots`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK |
| snapshot_date | date | Default CURRENT_DATE |
| metrics | jsonb | NOT NULL, Default '{}' |
| created_at | timestamptz | Default now() |

### 3.2 Storage Bucket
- **product-images**: Public bucket for product images

### 3.3 Database Functions
```sql
-- Check tenant access
CREATE FUNCTION has_tenant_access(_user_id uuid, _tenant_id uuid) 
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND tenant_id = _tenant_id
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check specific role
CREATE FUNCTION has_role(_user_id uuid, _tenant_id uuid, _role app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND tenant_id = _tenant_id AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Auto-create profile on signup
CREATE FUNCTION handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update timestamps
CREATE FUNCTION update_updated_at_column() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3.4 Row Level Security (RLS)
All tables have RLS enabled. Pattern:
```sql
-- SELECT: Users can view data in their tenants
CREATE POLICY "Users can view X in their tenants" 
ON public.X FOR SELECT 
USING (has_tenant_access(auth.uid(), tenant_id));

-- INSERT: Users can insert into their tenants  
CREATE POLICY "Users can insert X in their tenants"
ON public.X FOR INSERT
WITH CHECK (has_tenant_access(auth.uid(), tenant_id));

-- UPDATE: Same pattern
-- DELETE: Same pattern (where applicable)
```

---

## 4. THE 10 FIXED PERSONAS (PERSONA LOCKING RULE)

### CRITICAL: NEVER regenerate, merge, split, or delete personas. Only update attributes.

### 4.1 Female Personas (5)

#### 1. Urban Comfort Creator (F, 24-32)
```json
{
  "canonical_persona_id": "urban_comfort_creator_f_24_32",
  "segment_code": "F-UCC-2432",
  "segment_weight": 0.14,
  "narrative": "Metro professional balancing office, social life, and light fitness. Prefers comfortable, polished casuals.",
  "demographics": {
    "age_band": "24-32",
    "city_tier": "metro",
    "income_band": "50000-90000 INR",
    "education": "graduate",
    "occupation": "salaried"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 800, "max": 1600 },
    "comfort_price_band_jeans": { "min": 1500, "max": 2800 },
    "price_elasticity": "medium",
    "annual_fashion_spend": 42000
  },
  "style_identity": "minimalist",
  "brand_loyalty": 0.5
}
```

#### 2. Trend-First Campus Styler (F, 18-24)
```json
{
  "canonical_persona_id": "trend_first_campus_styler_f_18_24",
  "segment_code": "F-TCS-1824",
  "segment_weight": 0.12,
  "narrative": "College student highly active on social media. Follows trends, loves experimental fashion. Budget-conscious.",
  "demographics": {
    "age_band": "18-24",
    "city_tier": "tier_1",
    "income_band": "15000-35000 INR",
    "education": "undergraduate",
    "occupation": "student"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 400, "max": 900 },
    "comfort_price_band_jeans": { "min": 800, "max": 1500 },
    "price_elasticity": "high",
    "discount_dependence": "always_waits_for_sale",
    "annual_fashion_spend": 24000
  },
  "style_identity": "experimental",
  "influencer_influence": 0.85
}
```

#### 3. Premium Office Minimalist (F, 28-38)
```json
{
  "canonical_persona_id": "premium_office_minimalist_f_28_38",
  "segment_code": "F-POM-2838",
  "segment_weight": 0.10,
  "narrative": "Senior corporate professional. Premium minimalist basics. Quality over quantity.",
  "demographics": {
    "age_band": "28-38",
    "city_tier": "metro",
    "income_band": "100000-180000 INR",
    "education": "post_graduate",
    "occupation": "salaried"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 1500, "max": 3000 },
    "comfort_price_band_jeans": { "min": 2500, "max": 5000 },
    "price_elasticity": "low",
    "annual_fashion_spend": 90000
  },
  "style_identity": "minimalist",
  "brand_consciousness": 5
}
```

#### 4. Value-Focused Tier 2 Explorer (F, 20-30)
```json
{
  "canonical_persona_id": "value_focused_tier2_explorer_f_20_30",
  "segment_code": "F-VTE-2030",
  "segment_weight": 0.12,
  "narrative": "Tier 2/3 city, aspirational value seeker. First-time buyers of many categories.",
  "demographics": {
    "age_band": "20-30",
    "city_tier": "tier_2",
    "income_band": "25000-50000 INR"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 350, "max": 700 },
    "price_elasticity": "high",
    "annual_fashion_spend": 18000
  },
  "style_identity": "classic"
}
```

#### 5. Ethnic-Fusion Weekender (F, 25-35)
```json
{
  "canonical_persona_id": "ethnic_fusion_weekender_f_25_35",
  "segment_code": "F-EFW-2535",
  "segment_weight": 0.10,
  "narrative": "Professional who loves kurtas and indo-western fusion. Active festive/occasion shopper.",
  "demographics": {
    "age_band": "25-35",
    "city_tier": "metro"
  },
  "price_behavior": {
    "comfort_price_band_kurta": { "min": 1200, "max": 2800 },
    "price_elasticity": "medium"
  },
  "style_identity": "ethnic_fusion"
}
```

### 4.2 Male Personas (5)

#### 6. Metro Smart Casualist (M, 24-34)
```json
{
  "canonical_persona_id": "metro_smart_casualist_m_24_34",
  "segment_code": "M-MSC-2434",
  "segment_weight": 0.14,
  "narrative": "Metro professional, hybrid work. Polos, chinos, smart casuals. Balanced wardrobe.",
  "demographics": {
    "age_band": "24-34",
    "city_tier": "metro",
    "income_band": "60000-120000 INR"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 800, "max": 1800 },
    "comfort_price_band_chinos": { "min": 1200, "max": 2500 },
    "price_elasticity": "medium"
  },
  "style_identity": "smart_casual"
}
```

#### 7. Gen Z Streetwear Seeker (M, 18-24)
```json
{
  "canonical_persona_id": "genz_streetwear_seeker_m_18_24",
  "segment_code": "M-GSS-1824",
  "segment_weight": 0.10,
  "narrative": "Oversized tees, graphics, sneaker culture, drop hunting. Instagram/YouTube driven.",
  "demographics": {
    "age_band": "18-24",
    "city_tier": "tier_1"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 500, "max": 1200 },
    "price_elasticity": "high",
    "logo_tolerance": "high"
  },
  "style_identity": "streetwear"
}
```

#### 8. Formal-First Professional (M, 28-40)
```json
{
  "canonical_persona_id": "formal_first_professional_m_28_40",
  "segment_code": "M-FFP-2840",
  "segment_weight": 0.12,
  "narrative": "Corporate-heavy wardrobe. Shirts, trousers, formal shoes. Conservative style.",
  "demographics": {
    "age_band": "28-40",
    "city_tier": "metro",
    "income_band": "80000-150000 INR"
  },
  "price_behavior": {
    "comfort_price_band_shirt": { "min": 1500, "max": 3500 },
    "comfort_price_band_trousers": { "min": 1800, "max": 4000 },
    "price_elasticity": "low"
  },
  "style_identity": "formal"
}
```

#### 9. Budget-Conscious Everyday Wearer (M, 20-30)
```json
{
  "canonical_persona_id": "budget_conscious_everyday_m_20_30",
  "segment_code": "M-BCE-2030",
  "segment_weight": 0.12,
  "narrative": "Basic tees, jeans, shirts. Value-driven, needs durability. Price-first decisions.",
  "demographics": {
    "age_band": "20-30",
    "city_tier": "tier_2"
  },
  "price_behavior": {
    "comfort_price_band_tshirt": { "min": 300, "max": 600 },
    "comfort_price_band_jeans": { "min": 600, "max": 1200 },
    "price_elasticity": "very_high"
  },
  "style_identity": "basic"
}
```

#### 10. Athleisure-Heavy Fitness Worker (M, 22-35)
```json
{
  "canonical_persona_id": "athleisure_fitness_worker_m_22_35",
  "segment_code": "M-AFW-2235",
  "segment_weight": 0.08,
  "narrative": "Gym-goer, joggers and performance tees for daily wear. Active lifestyle.",
  "demographics": {
    "age_band": "22-35",
    "gym_frequency": 5
  },
  "price_behavior": {
    "comfort_price_band_joggers": { "min": 1000, "max": 2200 },
    "comfort_price_band_performance_tshirt": { "min": 800, "max": 1800 }
  },
  "style_identity": "athleisure"
}
```

---

## 5. COMPLETE PERSONA ATTRIBUTE SCHEMA (131+ Fields)

Each persona has structured JSONB fields covering:

### demographics (10 fields)
```json
{
  "age_band": "24-32",
  "age_mean": 28,
  "gender": "female",
  "city_tier": "metro",
  "region": "west",
  "monthly_income_band_in_inr": "50000-90000",
  "income_mean": 68000,
  "education_level": "graduate",
  "occupation_type": "salaried",
  "relationship_status": "single",
  "household_type": "nuclear_family",
  "dependents_count": 0,
  "modeled_v0": true
}
```

### lifestyle (8 fields)
```json
{
  "daily_routine_archetype": "office_9_6",
  "commute_mode_primary": "public_transport",
  "physical_activity_level": "moderate",
  "gym_sports_frequency_per_week": 3,
  "social_life_intensity": "high",
  "weekend_behavior_profile": "mall_cafes",
  "domestic_travel_frequency": 4,
  "international_travel_frequency": 0.5
}
```

### fashion_orientation (7 fields)
```json
{
  "style_identity": "minimalist",
  "fashion_involvement_level": 4,
  "trend_adoption_speed": "mainstream",
  "brand_consciousness_level": 3,
  "logo_visibility_tolerance": "medium",
  "silhouette_experimentation_tolerance": "medium",
  "statement_piece_frequency": "occasional"
}
```

### psychographics (11 fields)
```json
{
  "value_orientation": "comfort_first",
  "attitude_to_clothing": "self_expression",
  "risk_appetite_in_style": "medium",
  "perception_of_value": "versatility",
  "core_values": ["comfort", "style", "practicality"],
  "vals_segment": "Experiencers",
  "social_media_influence": 0.75,
  "peer_influence": 0.7,
  "novelty_seeking_score": 0.6,
  "impulsivity_score": 0.5,
  "self_image_importance": 0.8
}
```

### shopping_preferences (12 fields)
```json
{
  "primary_purchase_channel": "marketplace",
  "secondary_purchase_channel": "brand_website",
  "online_offline_purchase_ratio": "70_30",
  "purchase_frequency_per_quarter": 4,
  "avg_items_per_order": 2.5,
  "avg_order_value_in_inr": 2800,
  "returns_frequency_rate": 0.12,
  "preferred_payment_methods": ["upi", "card"],
  "delivery_speed_sensitivity": "medium",
  "returns_friction_sensitivity": "medium",
  "wishlist_usage_frequency": "regular",
  "coupon_or_offer_usage_rate": 0.6
}
```

### price_behavior (24+ fields - ONE PER CATEGORY)
```json
{
  "comfort_price_band_tshirt": { "min": 800, "max": 1600 },
  "comfort_price_band_shirt": { "min": 1200, "max": 2200 },
  "comfort_price_band_polo": { "min": 900, "max": 1800 },
  "comfort_price_band_jeans": { "min": 1500, "max": 2800 },
  "comfort_price_band_chinos": { "min": 1400, "max": 2500 },
  "comfort_price_band_trousers": { "min": 1400, "max": 2500 },
  "comfort_price_band_shorts": { "min": 600, "max": 1200 },
  "comfort_price_band_joggers": { "min": 1000, "max": 2000 },
  "comfort_price_band_hoodie": { "min": 1500, "max": 2800 },
  "comfort_price_band_dress": { "min": 1800, "max": 3500 },
  "comfort_price_band_kurta": { "min": 1200, "max": 2500 },
  "comfort_price_band_jacket": { "min": 2000, "max": 4500 },
  "max_willing_to_pay_tshirt": 2000,
  "typical_discount_expectation_percentage": 20,
  "discount_dependence_level": "flexible",
  "price_elasticity_category": "medium",
  "tradeoff_priority_order": ["comfort", "design", "price", "brand"],
  "annual_fashion_spend": 42000
}
```

### product_preferences (16 fields)
```json
{
  "categories": ["tshirts", "jeans", "casual_tops", "dresses", "joggers"],
  "category_priority_ranking": ["tshirts", "jeans", "dresses", "joggers"],
  "purchase_frequency_by_category_per_quarter": {
    "tshirts": 2,
    "jeans": 1,
    "dresses": 1
  },
  "workwear_share_of_wardrobe": 0.35,
  "casual_share_of_wardrobe": 0.45,
  "party_share_of_wardrobe": 0.15,
  "athleisure_share_of_wardrobe": 0.05
}
```

### fit_silhouette_preferences (12 fields)
```json
{
  "tshirt_fit_preference": "regular",
  "shirt_fit_preference": "relaxed",
  "jeans_fit_preference": "slim",
  "pants_fit_preference": "tapered",
  "rise_preference_for_bottoms": "mid",
  "shorts_length_preference": "above_knee",
  "sleeve_length_preference": "half",
  "neckline_preference": "crew",
  "waistband_preference": "structured",
  "comfort_vs_structure_ratio": "60_40"
}
```

### fabric_material_preferences (9 fields)
```json
{
  "fabric_preference_ranking": ["cotton", "cotton_blend", "linen", "denim_stretch"],
  "breathability_importance_level": 4,
  "wrinkle_resistance_importance_level": 3,
  "fabric_softness_importance_level": 4,
  "sustainability_concern_level": 3,
  "thermal_preference_for_winter": "light_layer",
  "fabric_allergies_or_avoidances": []
}
```

### color_pattern_preferences (13 fields)
```json
{
  "color_palette_neutrals_share": 0.4,
  "color_palette_earth_tones_share": 0.2,
  "color_palette_pastels_share": 0.25,
  "color_palette_bright_solids_share": 0.1,
  "color_palette_bold_colors_share": 0.05,
  "print_vs_solid_ratio": "30_70",
  "preference_for_stripes": 0.4,
  "preference_for_checks": 0.2,
  "preference_for_graphic_prints": 0.3,
  "preference_for_logo_prints": 0.2,
  "preference_for_all_over_prints": 0.15,
  "tolerance_for_high_contrast_outfits": 0.4
}
```

### brand_psychology (7 fields)
```json
{
  "lovable_brand_awareness_level": 0.6,
  "lovable_brand_primary_associations": ["comfort", "quality", "style"],
  "brand_loyalty_strength_to_lovable": 0.5,
  "number_of_competing_brands_used_regularly": 4,
  "influence_of_brand_storytelling": 0.5,
  "influence_of_reviews_and_ratings": 0.7,
  "influence_of_influencers_celebrities": 0.6
}
```

### digital_behavior (7 fields)
```json
{
  "primary_device_type": "android",
  "session_time_of_day_preference": "evening",
  "average_session_duration_minutes": 12,
  "average_products_viewed_per_session": 15,
  "filter_and_sort_usage_level": 0.7,
  "responsiveness_to_personalized_recos": 0.7,
  "responsiveness_to_push_notifications_or_emails": 0.5
}
```

### lifecycle_loyalty (5 fields)
```json
{
  "relationship_stage_with_lovable": "new_to_brand",
  "lifetime_value_band": "medium",
  "cross_category_adoption_count": 3,
  "upsell_potential_to_premium_lines": 0.6,
  "churn_risk_level": "medium"
}
```

### swipe_data_config (placeholder for future Tinder-for-fashion integration)
```json
{
  "ready_for_vectors": true,
  "expected_swipe_fields": ["like", "dislike", "super_like", "skip"],
  "persona_centroid_vector": null,
  "swipe_metrics_placeholder": {
    "swipe_like_rate_by_category": null,
    "swipe_price_sensitivity_curve": null
  }
}
```

---

## 6. APPAREL CATEGORIES (Complete List)

**TOPS:** tshirt, shirt, polo, henley, hoodie, sweatshirt, kurta, crop_top, tank_top, blouse

**BOTTOMS:** jeans, chinos, trousers, shorts, joggers, track_pants, cargo_pants

**DRESSES:** dress, jumpsuit, co_ord_set, salwar_kameez, anarkali

**OUTERWEAR:** jacket, blazer, bomber_jacket, denim_jacket

**ATHLEISURE:** sports_bra, leggings, gym_shorts, performance_tshirt

**ACCESSORIES:** cap, beanie, socks

---

## 7. EDGE FUNCTIONS

### 7.1 `analyze-product`
**Purpose:** Analyze a single product against all 10 personas

**Flow:**
1. Authenticate JWT, verify tenant access
2. Fetch product from database
3. Fetch all active personas for tenant
4. If `extracted_features` empty, call AI to extract features
5. Score product against each persona in parallel batches of 5
6. Upsert results to `analysis_results` table
7. Log to `analysis_history`
8. Return scores with summary

**AI Calls:**
- `extractProductFeatures()`: Uses tool calling to extract structured features
- `scoreProductAgainstPersona()`: Uses tool calling to get match score

**Output:**
```json
{
  "success": true,
  "productId": "uuid",
  "features": { "category": "tshirt", "fit": "regular", ... },
  "scores": [
    {
      "personaId": "uuid",
      "personaName": "Urban Comfort Creator",
      "likeProbability": 72,
      "confidenceScore": 85,
      "priceFloor": 650,
      "priceSweetSpot": 850,
      "priceCeiling": 1100,
      "priceElasticity": -0.4,
      "explanation": "Strong match due to...",
      "matchFactors": [
        { "factor": "fit_match", "weight": 0.3, "contribution": "positive" }
      ]
    }
  ],
  "summary": {
    "averageLikeProbability": 65,
    "highestMatch": {...},
    "lowestMatch": {...}
  }
}
```

### 7.2 `regenerate-apparel-personas`
**Purpose:** Seed or update the fixed 10 personas (NEVER regenerate)

**Actions:**
- `action: "seed"` — Only works if personas table is empty. Creates exactly 10 personas.
- `action: "update_attributes"` — Updates existing personas' attributes without changing IDs/names
- `action: "reset"` — BLOCKED
- `action: "regenerate"` — BLOCKED

**Persona Locking:**
- If 10 personas exist, `locked: true`
- Cannot delete or add personas
- Only attribute updates allowed

### 7.3 `what-if-simulation`
**Purpose:** Simulate price changes and their effect on persona probabilities

**Input:**
```json
{
  "productId": "uuid",
  "tenantId": "uuid",
  "priceRange": { "min": 500, "max": 1500, "steps": 10 }
}
```

**Output:**
```json
{
  "simulations": [
    {
      "price": 500,
      "likeProbabilities": { "persona1": 80, "persona2": 65 },
      "avgProbability": 72,
      "expectedRevenue": 36000,
      "recommendation": "below_optimal"
    }
  ],
  "optimalPrice": 950,
  "insights": [
    "Optimal price is 12% higher than current",
    "Premium Office Minimalist most price-insensitive"
  ]
}
```

### 7.4 `extract-image-features`
**Purpose:** Extract visual features from product images using AI vision

### 7.5 `generate-analytics-insights`
**Purpose:** Generate AI-powered insights from aggregate analytics data

---

## 8. FRONTEND PAGES & COMPONENTS

### 8.1 Pages

#### `/` (Index.tsx)
Landing page with:
- Nav: SWIRL logo + name, Sign In, Get Started buttons
- Hero: "Understand Your Customers Like Never Before"
- Features grid: 4 cards (Personas, Analysis, Analytics, Simulator)
- Stats section: 95% Accuracy, 10K+ Products, 500+ Brands
- How It Works: 3 steps
- CTA card
- Footer

#### `/auth` (Auth.tsx)
Authentication page with:
- Email/password sign up and sign in
- SWIRL logo branding
- Auto-confirm enabled (no email verification in dev)

#### `/dashboard` (Dashboard.tsx)
Main dashboard with:
- Welcome message with tenant name
- 4 stat cards: Products, Personas, Analyses, Avg. Match %
- Quick Actions card: Upload product, View personas, Explore analytics
- How It Works card explaining the SWIRL process

#### `/dashboard/products` (Products.tsx)
Product catalog with:
- Header with Add Product button
- Search input
- Product grid (cards with image, name, brand, price, status badge)
- Click card → opens ProductAnalysisPanel
- ProductUploadDialog for adding products

#### `/dashboard/personas` (Personas.tsx)
Persona management with:
- Header with Locked badge, Synthetic v0 badge, Refresh Attributes button
- Locked Universe Banner (when 10 personas exist)
- Data Source Banner (modeled_v0 status)
- Persona grid (5 columns on desktop)
- Each card shows: Initials avatar (not emoji), name, age band, gender badge, top categories, price range, loyalty, elasticity, attribute count
- Click card → opens PersonaDetailSheet

#### `/dashboard/analytics` (Analytics.tsx)
Analytics dashboard with tabs:
- **Overview**: Stat cards, Top Products, Persona Performance, Charts, AI Insights
- **Style & Trends**: StyleClusterAnalytics component
- **Price Intel**: PriceIntelligenceDashboard component
- **Personas**: PersonaDeepDive component
- **Simulations**: WhatIfSimulator with product selector

#### `/dashboard/settings` (Settings.tsx)
Account and tenant settings

### 8.2 Key Components

#### `DashboardLayout.tsx`
- Sidebar with SWIRL logo
- Navigation links: Dashboard, Products, Personas, Analytics, Settings
- User menu in header

#### `ProductUploadDialog.tsx`
- Form: name, brand, description, category dropdown, price, image upload
- Uploads image to Supabase storage
- Creates product record
- Optionally triggers feature extraction

#### `ProductAnalysisPanel.tsx`
- Sheet/drawer that shows product details
- Analyze button that calls `analyze-product` edge function
- Displays persona scores with progress bars
- Shows price recommendations per persona
- Match factors breakdown

#### `PersonaDetailSheet.tsx`
- Full persona details in a sheet
- Sections for each attribute category
- Uses styled initials (not emoji) for avatar
- Gender-based color coding (primary for female, secondary for male)

#### `WhatIfSimulator.tsx`
- Price range slider
- Simulation results chart
- Optimal price recommendation
- Per-persona impact analysis

#### `AnalyticsCharts.tsx`
- Bar charts for product performance
- Persona performance charts
- Uses Recharts

#### `AIInsightsPanel.tsx`
- AI-generated insights card
- Calls `generate-analytics-insights` function

### 8.3 UI Patterns

**Initials Avatar (NO EMOJIS):**
```tsx
<div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${
  persona.gender === "female" 
    ? "bg-primary text-primary-foreground" 
    : "bg-secondary text-secondary-foreground"
}`}>
  {persona.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
</div>
```

**Status Badges:**
```tsx
// Analyzed = green tint
<Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">Analyzed</Badge>
// Pending = secondary
<Badge variant="secondary">Pending</Badge>
// Error = destructive
<Badge variant="destructive">Error</Badge>
```

**Cards:**
- Use `border-border/50` for subtle borders
- Hover effect: `hover:shadow-md transition-shadow`
- Cursor pointer when clickable

---

## 9. HOOKS

### `useAuth.tsx`
- Manages authentication state
- `user`, `loading`, `signIn`, `signUp`, `signOut`

### `useTenant.tsx`
- Manages current tenant context
- Creates default tenant on first login
- `tenant`, `loading`, `switchTenant`

### `use-toast.ts`
- Toast notifications (via shadcn/ui)

### `use-mobile.tsx`
- Mobile viewport detection

---

## 10. ROUTING (App.tsx)

```tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="personas" element={<Personas />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 11. AI INTEGRATION (Lovable AI Gateway)

### Configuration
- URL: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Model: `google/gemini-2.5-flash`
- Auth: `LOVABLE_API_KEY` (auto-provisioned)

### Tool Calling Pattern
```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
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
            category: { type: "string", enum: ["tshirt", "shirt", ...] },
            // ...more properties
          },
          required: ["category", "fabric", ...]
        }
      }
    }],
    tool_choice: { type: "function", function: { name: "extract_features" } }
  }),
});

const data = await response.json();
const result = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
```

---

## 12. MULTI-TENANCY

- Every data table has `tenant_id` column
- All queries filter by `tenant_id`
- RLS policies enforce tenant isolation
- `useTenant` hook provides current tenant context
- First-time users get auto-created default tenant
- User-tenant relationship via `user_roles` table

---

## 13. AUTHENTICATION

- Supabase Auth with email/password
- Auto-confirm enabled (no email verification)
- Profile auto-created via `handle_new_user` trigger
- Protected routes check `useAuth` state

---

## 14. ONBOARDING FLOW

1. User signs up → profile created
2. Default tenant created → user added as admin
3. Onboarding dialog prompts to initialize personas
4. "Initialize Persona Universe" seeds 10 fixed personas
5. User can now upload products and analyze

---

## 15. ANALYTICS METRICS CATALOG (50+)

### Funnel Metrics
- browse_to_cart_ratio
- cart_to_purchase_ratio
- wishlist_to_purchase_ratio
- size_confidence_index

### Channel Metrics
- online_offline_rev_ratio
- mobile_desktop_session_ratio
- marketplace_brand_ratio

### Category Metrics
- tshirt_rev_share, shirt_rev_share, dress_rev_share (per category)
- category_frequency
- category_contributions

### Price Metrics
- fullprice_discount_ratio
- markdown_dependency_index
- willingness_to_pay_bandwidth
- elasticity_asymmetry_index

### Style Metrics
- streetwear_performance
- minimalist_performance
- ethnic_fusion_performance
- style_cluster_resonance_score

### Loyalty Metrics
- repeat_purchase_rate
- avg_lifetime_value
- cross_category_adoption
- churn_risk_level

### Regional Metrics
- female_male_rev_ratio
- metro_nonmetro_ratio
- regional_style_divergence

---

## 16. IMPLEMENTATION ORDER

1. **Enable Lovable Cloud** (Supabase)
2. **Run database migrations** for all tables, enums, functions, RLS policies
3. **Configure auth** with auto-confirm email
4. **Create storage bucket** `product-images` (public)
5. **Add DM Sans font** via Google Fonts in index.html
6. **Set up Tailwind** with DM Sans font family
7. **Create design system** in index.css (monochromatic)
8. **Build core components**: Button, Card, Badge, Dialog, Sheet, etc. (shadcn/ui)
9. **Create hooks**: useAuth, useTenant
10. **Build pages**: Index, Auth, Dashboard, Products, Personas, Analytics, Settings
11. **Create edge functions**: regenerate-apparel-personas, analyze-product, what-if-simulation
12. **Deploy and test**

---

## 17. KEY CONSTRAINTS

1. **Persona Locking**: EXACTLY 10 personas, NEVER regenerate
2. **No Emojis**: Use styled initials for avatars
3. **Monochromatic**: Pure black/white/gray only
4. **DM Sans**: Primary font throughout
5. **Indian Market**: Prices in INR (₹), Indian city tiers
6. **Synthetic Data**: All marked `modeled_v0`
7. **Multi-tenant**: All data scoped to tenants
8. **AI via Lovable**: Use Lovable AI Gateway, not external APIs

---

*This prompt contains everything needed to recreate SWIRL exactly. Copy the entire content and paste into Lovable.*
