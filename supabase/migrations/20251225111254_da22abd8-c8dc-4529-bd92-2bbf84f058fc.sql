-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- MULTI-BRAND TENANT SYSTEM
-- =============================================================================

-- Tenants (brands) table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'merchandiser', 'marketer', 'viewer');

-- User roles table (for RBAC)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  current_tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- PERSONA SYSTEM (100+ ATTRIBUTES EACH)
-- =============================================================================

CREATE TABLE public.personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_emoji TEXT DEFAULT '👤',
  
  -- Demographics (stored as JSONB for flexibility)
  demographics JSONB NOT NULL DEFAULT '{}',
  
  -- Psychographics (VALS-style)
  psychographics JSONB NOT NULL DEFAULT '{}',
  
  -- Shopping preferences
  shopping_preferences JSONB NOT NULL DEFAULT '{}',
  
  -- Product tastes
  product_preferences JSONB NOT NULL DEFAULT '{}',
  
  -- Price behavior
  price_behavior JSONB NOT NULL DEFAULT '{}',
  
  -- All 100+ attributes in normalized vector form for ML
  attribute_vector JSONB NOT NULL DEFAULT '[]',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- PRODUCT CATALOG
-- =============================================================================

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  sku TEXT,
  
  -- Categorization
  category TEXT NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  
  -- Size & availability
  size_range TEXT[] DEFAULT '{}',
  
  -- Images (stored in Lovable Cloud Storage)
  primary_image_url TEXT,
  additional_images TEXT[] DEFAULT '{}',
  
  -- AI-extracted features (populated by edge function)
  extracted_features JSONB DEFAULT '{}',
  feature_vector JSONB DEFAULT '[]',
  
  -- Metadata
  status TEXT DEFAULT 'pending', -- pending, analyzed, error
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- ANALYSIS RESULTS (SCORING ENGINE OUTPUT)
-- =============================================================================

CREATE TABLE public.analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES public.personas(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Core scores
  like_probability DECIMAL(5,2) NOT NULL, -- 0-100%
  confidence_score DECIMAL(5,2), -- How confident we are
  
  -- Price recommendations
  price_floor DECIMAL(10,2),
  price_sweet_spot DECIMAL(10,2),
  price_ceiling DECIMAL(10,2),
  price_elasticity DECIMAL(5,4), -- -1 to 1 sensitivity
  
  -- Explanation
  explanation TEXT,
  match_factors JSONB DEFAULT '[]', -- What drove the score
  
  -- Analytics
  what_if_simulations JSONB DEFAULT '{}', -- Price simulation results
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(product_id, persona_id)
);

-- =============================================================================
-- ANALYTICS & HISTORY
-- =============================================================================

CREATE TABLE public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  
  -- What was analyzed
  action_type TEXT NOT NULL, -- 'single_analysis', 'bulk_analysis', 'comparison', 'what_if'
  input_data JSONB DEFAULT '{}',
  
  -- Results summary
  results_summary JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX idx_personas_tenant ON public.personas(tenant_id);
CREATE INDEX idx_products_tenant ON public.products(tenant_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_analysis_results_product ON public.analysis_results(product_id);
CREATE INDEX idx_analysis_results_persona ON public.analysis_results(persona_id);
CREATE INDEX idx_analysis_history_tenant ON public.analysis_history(tenant_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_tenant ON public.user_roles(tenant_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_tenant_access(_user_id UUID, _tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
  )
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _tenant_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND tenant_id = _tenant_id
      AND role = _role
  )
$$;

-- Profiles: Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Tenants: Users can view tenants they belong to
CREATE POLICY "Users can view their tenants" ON public.tenants
  FOR SELECT USING (
    public.has_tenant_access(auth.uid(), id)
  );

-- User roles: Users can view roles in their tenants
CREATE POLICY "Users can view roles in their tenants" ON public.user_roles
  FOR SELECT USING (
    user_id = auth.uid() OR public.has_tenant_access(auth.uid(), tenant_id)
  );

-- Personas: Users can CRUD personas in their tenants
CREATE POLICY "Users can view personas in their tenants" ON public.personas
  FOR SELECT USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert personas in their tenants" ON public.personas
  FOR INSERT WITH CHECK (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can update personas in their tenants" ON public.personas
  FOR UPDATE USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can delete personas in their tenants" ON public.personas
  FOR DELETE USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Products: Users can CRUD products in their tenants
CREATE POLICY "Users can view products in their tenants" ON public.products
  FOR SELECT USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert products in their tenants" ON public.products
  FOR INSERT WITH CHECK (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can update products in their tenants" ON public.products
  FOR UPDATE USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can delete products in their tenants" ON public.products
  FOR DELETE USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Analysis results: Users can view/manage in their tenants
CREATE POLICY "Users can view analysis in their tenants" ON public.analysis_results
  FOR SELECT USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert analysis in their tenants" ON public.analysis_results
  FOR INSERT WITH CHECK (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can update analysis in their tenants" ON public.analysis_results
  FOR UPDATE USING (public.has_tenant_access(auth.uid(), tenant_id));

-- Analysis history: Users can view in their tenants
CREATE POLICY "Users can view history in their tenants" ON public.analysis_history
  FOR SELECT USING (public.has_tenant_access(auth.uid(), tenant_id));

CREATE POLICY "Users can insert history in their tenants" ON public.analysis_history
  FOR INSERT WITH CHECK (public.has_tenant_access(auth.uid(), tenant_id));

-- =============================================================================
-- TRIGGERS FOR TIMESTAMPS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personas_updated_at
  BEFORE UPDATE ON public.personas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update their product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete their product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');