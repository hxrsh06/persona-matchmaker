-- Allow authenticated users to insert tenants (for creating their own brands)
CREATE POLICY "Users can create tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to insert user_roles (for assigning themselves to tenants)
CREATE POLICY "Users can create their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());