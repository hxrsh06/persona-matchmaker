import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { Json } from "@/integrations/supabase/types";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: Json;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  switchTenant: (tenantId: string) => Promise<void>;
  createTenant: (name: string, slug: string) => Promise<Tenant | null>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  tenants: [],
  loading: true,
  switchTenant: async () => {},
  createTenant: async () => null,
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTenants();
    } else {
      setTenant(null);
      setTenants([]);
      setLoading(false);
    }
  }, [user]);

  const loadTenants = async () => {
    try {
      // Get user's profile to see current tenant
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_tenant_id")
        .eq("id", user!.id)
        .single();

      // Get all tenants user has access to
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("tenant_id, tenants(*)")
        .eq("user_id", user!.id);

      if (userRoles && userRoles.length > 0) {
        const tenantList = userRoles
          .map((r: any) => r.tenants)
          .filter(Boolean) as Tenant[];
        setTenants(tenantList);

        // Set current tenant
        const currentTenantId = profile?.current_tenant_id;
        const currentTenant = tenantList.find(t => t.id === currentTenantId) || tenantList[0];
        setTenant(currentTenant);

        // Update profile if no current tenant set
        if (!currentTenantId && currentTenant) {
          await supabase
            .from("profiles")
            .update({ current_tenant_id: currentTenant.id })
            .eq("id", user!.id);
        }
      }
    } catch (error) {
      console.error("Error loading tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant && user) {
      setTenant(newTenant);
      await supabase
        .from("profiles")
        .update({ current_tenant_id: tenantId })
        .eq("id", user.id);
    }
  };

  const createTenant = async (name: string, slug: string): Promise<Tenant | null> => {
    if (!user) return null;

    try {
      // Create tenant
      const { data: newTenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({ name, slug })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // Add user as admin
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          tenant_id: newTenant.id,
          role: "admin",
        });

      if (roleError) throw roleError;

      // Update profile
      await supabase
        .from("profiles")
        .update({ current_tenant_id: newTenant.id })
        .eq("id", user.id);

      // Update state
      setTenants(prev => [...prev, newTenant]);
      setTenant(newTenant);

      return newTenant;
    } catch (error) {
      console.error("Error creating tenant:", error);
      return null;
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, loading, switchTenant, createTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
