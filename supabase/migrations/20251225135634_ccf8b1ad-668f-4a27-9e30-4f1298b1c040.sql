-- Create style_clusters table for aesthetic classifications
CREATE TABLE public.style_clusters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  keywords text[] DEFAULT '{}'::text[],
  color text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create product_style_mappings table
CREATE TABLE public.product_style_mappings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  style_cluster_id uuid NOT NULL REFERENCES public.style_clusters(id) ON DELETE CASCADE,
  confidence_score numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(product_id, style_cluster_id)
);

-- Create analytics_snapshots table for historical tracking
CREATE TABLE public.analytics_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  snapshot_date date NOT NULL DEFAULT CURRENT_DATE,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, snapshot_date)
);

-- Enable RLS on all new tables
ALTER TABLE public.style_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_style_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS policies for style_clusters
CREATE POLICY "Users can view style clusters in their tenants"
  ON public.style_clusters FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert style clusters in their tenants"
  ON public.style_clusters FOR INSERT
  WITH CHECK (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can update style clusters in their tenants"
  ON public.style_clusters FOR UPDATE
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can delete style clusters in their tenants"
  ON public.style_clusters FOR DELETE
  USING (has_tenant_access(auth.uid(), tenant_id));

-- RLS policies for product_style_mappings (via product's tenant)
CREATE POLICY "Users can view style mappings for their products"
  ON public.product_style_mappings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id AND has_tenant_access(auth.uid(), p.tenant_id)
  ));

CREATE POLICY "Users can insert style mappings for their products"
  ON public.product_style_mappings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id AND has_tenant_access(auth.uid(), p.tenant_id)
  ));

CREATE POLICY "Users can update style mappings for their products"
  ON public.product_style_mappings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id AND has_tenant_access(auth.uid(), p.tenant_id)
  ));

CREATE POLICY "Users can delete style mappings for their products"
  ON public.product_style_mappings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.products p 
    WHERE p.id = product_id AND has_tenant_access(auth.uid(), p.tenant_id)
  ));

-- RLS policies for analytics_snapshots
CREATE POLICY "Users can view analytics snapshots in their tenants"
  ON public.analytics_snapshots FOR SELECT
  USING (has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert analytics snapshots in their tenants"
  ON public.analytics_snapshots FOR INSERT
  WITH CHECK (has_tenant_access(auth.uid(), tenant_id));

-- Insert default style clusters (will be added per-tenant)
-- These will be seeded when the first analytics run happens