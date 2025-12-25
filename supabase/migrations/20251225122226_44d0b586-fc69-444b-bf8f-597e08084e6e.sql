-- Drop ALL policies on tenants and recreate with explicit permissive
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;

-- Create INSERT policy - explicitly permissive, allowing any authenticated user
CREATE POLICY "Users can create tenants"
ON public.tenants
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create SELECT policy - explicitly permissive
CREATE POLICY "Users can view their tenants"
ON public.tenants
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (has_tenant_access(auth.uid(), id));