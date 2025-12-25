import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, RefreshCw, Loader2 } from "lucide-react";
import PersonaDetailSheet from "@/components/personas/PersonaDetailSheet";
import type { Json } from "@/integrations/supabase/types";

interface Persona {
  id: string;
  name: string;
  description: string | null;
  avatar_emoji: string;
  demographics: Json;
  psychographics: Json;
  shopping_preferences: Json;
  product_preferences: Json;
  price_behavior: Json;
  attribute_vector: Json;
  is_active: boolean;
}

const Personas = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  useEffect(() => {
    if (tenant) {
      loadPersonas();
    }
  }, [tenant]);

  const loadPersonas = async () => {
    if (!tenant) return;

    const { data, error } = await supabase
      .from("personas")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("is_active", true)
      .order("created_at");

    if (error) {
      toast({
        title: "Error loading personas",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPersonas(data || []);
    }
    setLoading(false);
  };

  const regeneratePersonas = async () => {
    if (!tenant) return;
    setRegenerating(true);

    try {
      // Deactivate existing personas
      await supabase
        .from("personas")
        .update({ is_active: false })
        .eq("tenant_id", tenant.id);

      // Generate new personas
      const response = await supabase.functions.invoke("generate-personas", {
        body: { tenantId: tenant.id, customizeForBrand: tenant.name },
      });

      if (response.error) throw response.error;

      toast({
        title: "Personas regenerated!",
        description: `Created ${response.data.personasCreated} fresh personas.`,
      });

      loadPersonas();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate personas",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const getAttributeCount = (persona: Persona) => {
    return persona.attribute_vector?.length || 0;
  };

  const getTopCategories = (persona: Persona) => {
    const prefs = persona.product_preferences as { categories?: string[] };
    return prefs?.categories?.slice(0, 3) || [];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consumer Personas</h1>
          <p className="text-muted-foreground">AI-generated customer profiles with 100+ attributes each</p>
        </div>
        <Button variant="outline" onClick={regeneratePersonas} disabled={regenerating}>
          {regenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Personas
            </>
          )}
        </Button>
      </div>

      {personas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">No personas yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI personas to start analyzing products
            </p>
            <Button onClick={regeneratePersonas} disabled={regenerating}>
              {regenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Personas"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-border/50"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{persona.avatar_emoji}</span>
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">{persona.name}</CardTitle>
                    <CardDescription className="truncate">
                      {getAttributeCount(persona)} attributes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {persona.description || "AI-generated consumer persona"}
                </p>
                
                <div className="flex flex-wrap gap-1.5">
                  {getTopCategories(persona).map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-sm">
                      {(persona.demographics as { ageRange?: string })?.ageRange || "25-34"}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">City Tier</p>
                    <p className="font-medium text-sm">
                      {(persona.demographics as { cityTier?: string })?.cityTier || "Metro"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PersonaDetailSheet
        persona={selectedPersona}
        onClose={() => setSelectedPersona(null)}
      />
    </div>
  );
};

export default Personas;
