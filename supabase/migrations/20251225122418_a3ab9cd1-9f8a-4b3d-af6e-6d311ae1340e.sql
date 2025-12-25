-- Recreate policies to target public role as well (for edge cases)
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;

CREATE POLICY "Users can create tenants"
ON public.tenants
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (auth.uid() IS NOT NULL);