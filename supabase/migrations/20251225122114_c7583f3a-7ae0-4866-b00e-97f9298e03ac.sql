-- Drop the existing restrictive INSERT policy and recreate as permissive
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;

CREATE POLICY "Users can create tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also ensure the SELECT policy is permissive for new tenants
DROP POLICY IF EXISTS "Users can view their tenants" ON public.tenants;

CREATE POLICY "Users can view their tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (has_tenant_access(auth.uid(), id));