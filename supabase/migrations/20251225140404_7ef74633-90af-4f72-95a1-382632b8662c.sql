-- Add expanded attribute columns to personas for enterprise-grade analytics
ALTER TABLE public.personas 
ADD COLUMN IF NOT EXISTS segment_code text,
ADD COLUMN IF NOT EXISTS segment_name text,
ADD COLUMN IF NOT EXISTS segment_weight numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS lifestyle jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS fashion_orientation jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS digital_behavior jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS category_affinities jsonb DEFAULT '{}'::jsonb;

-- Create persona_analytics table for KPI tracking
CREATE TABLE IF NOT EXISTS public.persona_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  persona_id uuid REFERENCES public.personas(id) ON DELETE CASCADE,
  analytics_date date NOT NULL DEFAULT CURRENT_DATE,
  
  -- Channel Ratios
  online_offline_ratio numeric,
  marketplace_brand_ratio numeric,
  mobile_desktop_ratio numeric,
  
  -- Category Ratios
  category_contributions jsonb DEFAULT '{}'::jsonb,
  category_frequency jsonb DEFAULT '{}'::jsonb,
  repeat_purchase_rate numeric,
  
  -- Price & Discount Ratios
  full_price_discount_ratio numeric,
  avg_discount_availed numeric,
  above_median_purchase_pct numeric,
  price_elasticity_segment text,
  
  -- Color & Style Ratios
  neutral_color_bold_ratio numeric,
  solid_prints_ratio numeric,
  classic_trendy_ratio numeric,
  
  -- Engagement Ratios
  browse_to_cart_ratio numeric,
  cart_to_purchase_ratio numeric,
  wishlist_to_purchase_ratio numeric,
  return_rate numeric,
  
  -- Lifetime Value
  avg_lifetime_value numeric,
  cross_category_adoption numeric,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, persona_id, analytics_date)
);

-- Create aggregate_analytics for workspace-level KPIs
CREATE TABLE IF NOT EXISTS public.aggregate_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  analytics_date date NOT NULL DEFAULT CURRENT_DATE,
  
  -- Gender & Region Split
  female_revenue_ratio numeric,
  metro_non_metro_ratio numeric,
  regional_style_divergence jsonb DEFAULT '{}'::jsonb,
  
  -- Channel Summary
  total_online_ratio numeric,
  top_channel_breakdown jsonb DEFAULT '{}'::jsonb,
  
  -- Price Summary  
  price_elasticity_distribution jsonb DEFAULT '{}'::jsonb,
  avg_discount_rate numeric,
  premium_segment_share numeric,
  
  -- Persona Performance
  top_personas_by_revenue jsonb DEFAULT '[]'::jsonb,
  persona_segment_weights jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, analytics_date)
);

-- Enable RLS
ALTER TABLE public.persona_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregate_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for persona_analytics
CREATE POLICY "Users can view persona analytics in their tenants"
  ON public.persona_analytics FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert persona analytics in their tenants"
  ON public.persona_analytics FOR INSERT
  WITH CHECK (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can update persona analytics in their tenants"
  ON public.persona_analytics FOR UPDATE
  USING (has_tenant_access(auth.uid(), tenant_id));

-- RLS Policies for aggregate_analytics
CREATE POLICY "Users can view aggregate analytics in their tenants"
  ON public.aggregate_analytics FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert aggregate analytics in their tenants"
  ON public.aggregate_analytics FOR INSERT
  WITH CHECK (has_tenant_access(auth.uid(), tenant_id));