import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Users, Sparkles, Database, FlaskConical } from "lucide-react";
import PersonaDetailSheet from "@/components/personas/PersonaDetailSheet";
import type { Json } from "@/integrations/supabase/types";

interface Persona {
  id: string;
  name: string;
  description: string | null;
  avatar_emoji: string;
  canonical_persona_id?: string;
  segment_code?: string;
  segment_name?: string;
  segment_weight?: number;
  gender?: string;
  demographics: Json;
  lifestyle?: Json;
  fashion_orientation?: Json;
  psychographics: Json;
  shopping_preferences: Json;
  product_preferences: Json;
  price_behavior: Json;
  brand_psychology: Json;
  digital_behavior?: Json;
  category_affinities?: Json;
  attribute_vector: Json;
  fit_silhouette_preferences?: Json;
  fabric_material_preferences?: Json;
  color_pattern_preferences?: Json;
  lifecycle_loyalty?: Json;
  swipe_data_config?: Json;
  data_source_status?: string;
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
      const response = await supabase.functions.invoke("regenerate-apparel-personas", {
        body: { tenantId: tenant.id, action: "reset" },
      });

      if (response.error) throw response.error;

      toast({
        title: "Personas regenerated",
        description: `Created ${response.data.personasCreated} canonical apparel personas with 100+ attributes each`,
      });

      loadPersonas();
    } catch (error: any) {
      toast({
        title: "Failed to regenerate personas",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const getAttributeCount = (persona: Persona) => {
    return Array.isArray(persona.attribute_vector) ? persona.attribute_vector.length : 0;
  };

  const getTopCategories = (persona: Persona) => {
    const prefs = persona.product_preferences as { categories?: string[] };
    return prefs?.categories?.slice(0, 4) || [];
  };

  const getPriceRange = (persona: Persona) => {
    const behavior = persona.price_behavior as { 
      comfort_price_band_tshirt?: { min: number; max: number }; 
    };
    if (behavior?.comfort_price_band_tshirt) {
      return `₹${behavior.comfort_price_band_tshirt.min.toLocaleString()} - ${behavior.comfort_price_band_tshirt.max.toLocaleString()}`;
    }
    return "Variable";
  };

  const getBrandLoyalty = (persona: Persona) => {
    const psychology = persona.brand_psychology as { brand_loyalty_strength_to_lovable?: number };
    const loyalty = psychology?.brand_loyalty_strength_to_lovable || 0.5;
    if (loyalty >= 0.7) return "High";
    if (loyalty >= 0.4) return "Medium";
    return "Low";
  };

  const getElasticity = (persona: Persona) => {
    const behavior = persona.price_behavior as { price_elasticity_category?: string };
    return behavior?.price_elasticity_category || "medium";
  };

  const getAgeBand = (persona: Persona) => {
    const demographics = persona.demographics as { age_band?: string };
    return demographics?.age_band || "";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">Consumer Personas</h1>
          <p className="text-muted-foreground">
            10 canonical apparel personas (5 female, 5 male) with 100+ attributes each
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 py-1">
            <FlaskConical className="w-3 h-3" />
            <span className="text-xs">Synthetic v0</span>
          </Badge>
          <Button onClick={regeneratePersonas} disabled={regenerating}>
            {regenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate Personas
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Data Source Banner */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Data Source: modeled_v0 (Synthetic)</p>
            <p className="text-xs text-muted-foreground">
              All persona attributes are hypothesis-driven. Values will be refined with real swipe data from the Tinder-for-fashion app.
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Awaiting Swipe Data
          </Badge>
        </CardContent>
      </Card>

      {personas.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg border-border/40 bg-card"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{persona.avatar_emoji}</span>
                      <div>
                        <CardTitle className="text-sm font-medium truncate">{persona.name}</CardTitle>
                        <p className="text-[10px] text-muted-foreground">{getAgeBand(persona)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={persona.gender === "female" ? "default" : "secondary"} 
                      className="text-[10px] font-normal shrink-0"
                    >
                      {persona.gender === "female" ? "F" : "M"}
                    </Badge>
                    <Badge variant="outline" className="text-[8px] py-0">
                      v0
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {persona.description}
                </p>

                {/* Categories */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Top Categories
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {getTopCategories(persona).slice(0, 3).map((cat) => (
                      <span 
                        key={cat} 
                        className="text-[10px] px-1.5 py-0.5 rounded border border-border text-foreground"
                      >
                        {String(cat).replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      T-shirt
                    </p>
                    <p className="text-[10px] font-medium truncate">
                      {getPriceRange(persona)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      Loyalty
                    </p>
                    <p className="text-[10px] font-medium">
                      {getBrandLoyalty(persona)}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      Elasticity
                    </p>
                    <p className="text-[10px] font-medium capitalize">
                      {getElasticity(persona)}
                    </p>
                  </div>
                </div>

                {/* Segment Weight & Attributes */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[10px] text-muted-foreground">
                    {getAttributeCount(persona)} attributes
                  </span>
                  {persona.segment_weight && (
                    <Badge variant="outline" className="text-[10px]">
                      {Math.round(persona.segment_weight * 100)}% weight
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No personas configured</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
              Generate 10 canonical apparel consumer personas with 100+ attributes for analytics and swipe data integration
            </p>
            <Button onClick={regeneratePersonas} disabled={regenerating}>
              {regenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Personas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <PersonaDetailSheet
        persona={selectedPersona}
        onClose={() => setSelectedPersona(null)}
      />
    </div>
  );
};

export default Personas;
