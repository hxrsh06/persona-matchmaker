-- Add brand_psychology column to personas table
ALTER TABLE public.personas 
ADD COLUMN brand_psychology jsonb NOT NULL DEFAULT '{}'::jsonb;