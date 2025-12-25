import { useState, useEffect, useCallback } from "react";
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building2, User, Loader2 } from "lucide-react";

const Settings = () => {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync brandName when tenant changes
  useEffect(() => {
    if (tenant?.name) {
      setBrandName(tenant.name);
    }
  }, [tenant?.name]);

  const handleSaveBrand = useCallback(async () => {
    if (!tenant) return;
    setSaving(true);

    const { error } = await supabase
      .from("tenants")
      .update({ name: brandName })
      .eq("id", tenant.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update brand name",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Brand name updated successfully",
      });
    }
    setSaving(false);
  }, [tenant, brandName, toast]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and brand settings</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Brand Settings
          </CardTitle>
          <CardDescription>Configure your brand profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your brand name"
            />
          </div>
          <Button onClick={handleSaveBrand} disabled={saving || !brandName.trim()}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={user?.id || ""} disabled className="font-mono text-xs" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-sm text-muted-foreground">
        <p>Lovable Twin v1.0</p>
        <p>AI-powered product-persona matching</p>
      </div>
    </div>
  );
};

export default Settings;
