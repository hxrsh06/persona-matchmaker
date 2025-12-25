-- Add new columns to personas table for expanded attributes
ALTER TABLE public.personas
ADD COLUMN IF NOT EXISTS canonical_persona_id text,
ADD COLUMN IF NOT EXISTS fit_silhouette_preferences jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS fabric_material_preferences jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS color_pattern_preferences jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS lifecycle_loyalty jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS swipe_data_config jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS data_source_status text DEFAULT 'modeled_v0';

-- Add new KPI columns to persona_analytics
ALTER TABLE public.persona_analytics
ADD COLUMN IF NOT EXISTS size_confidence_index numeric,
ADD COLUMN IF NOT EXISTS trend_adoption_lag_days numeric,
ADD COLUMN IF NOT EXISTS statement_piece_pull_through_rate numeric,
ADD COLUMN IF NOT EXISTS markdown_dependency_index numeric,
ADD COLUMN IF NOT EXISTS willingness_to_pay_bandwidth jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS elasticity_asymmetry_index numeric,
ADD COLUMN IF NOT EXISTS experience_break_point_stage text,
ADD COLUMN IF NOT EXISTS sentiment_to_sales_correlation numeric,
ADD COLUMN IF NOT EXISTS personalization_lift_index numeric,
ADD COLUMN IF NOT EXISTS swipe_like_rate numeric,
ADD COLUMN IF NOT EXISTS swipe_price_sensitivity numeric,
ADD COLUMN IF NOT EXISTS style_cluster_resonance_score numeric;

-- Add new columns to aggregate_analytics
ALTER TABLE public.aggregate_analytics
ADD COLUMN IF NOT EXISTS style_cluster_performance jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS return_rate_by_reason jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS personalization_lift_overall numeric,
ADD COLUMN IF NOT EXISTS swipe_metrics_aggregate jsonb DEFAULT '{}'::jsonb;

-- Create metric_catalog table for enterprise KPI definitions
CREATE TABLE IF NOT EXISTS public.metric_catalog (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name text NOT NULL UNIQUE,
  description text,
  formula jsonb DEFAULT '{}'::jsonb,
  level_of_aggregation text,
  category text,
  status text DEFAULT 'modeled_v0_synthetic',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on metric_catalog
ALTER TABLE public.metric_catalog ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read metric catalog (it's reference data)
CREATE POLICY "Authenticated users can view metric catalog"
ON public.metric_catalog
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Allow admins to manage metric catalog
CREATE POLICY "Admins can manage metric catalog"
ON public.metric_catalog
FOR ALL
USING (auth.uid() IS NOT NULL);