import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Users, Database, FlaskConical, Lock, Sparkles } from "lucide-react";
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
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const loadPersonas = useCallback(async () => {
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
  }, [tenant, toast]);

  useEffect(() => {
    if (tenant) {
      loadPersonas();
    }
  }, [tenant, loadPersonas]);

  const seedPersonas = useCallback(async () => {
    if (!tenant) return;
    setActionLoading(true);

    try {
      const response = await supabase.functions.invoke("regenerate-apparel-personas", {
        body: { tenantId: tenant.id, action: "seed" },
      });

      if (response.error) throw response.error;

      if (response.data.locked && !response.data.success) {
        toast({
          title: "Persona Universe Locked",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Personas initialized",
          description: `Created ${response.data.personasCreated} canonical personas. Universe is now locked.`,
        });
      }

      loadPersonas();
    } catch (error: any) {
      toast({
        title: "Failed to initialize personas",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }, [tenant, toast, loadPersonas]);

  const refreshAttributes = useCallback(async () => {
    if (!tenant) return;
    setActionLoading(true);

    try {
      const response = await supabase.functions.invoke("regenerate-apparel-personas", {
        body: { tenantId: tenant.id, action: "update_attributes" },
      });

      if (response.error) throw response.error;

      toast({
        title: "Attributes refreshed",
        description: `Updated ${response.data.updatedCount} personas. Universe remains locked.`,
      });

      loadPersonas();
    } catch (error: any) {
      toast({
        title: "Failed to refresh attributes",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }, [tenant, toast, loadPersonas]);

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

  const isUniverseLocked = personas.length === 10;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">Consumer Personas</h1>
          <p className="text-sm text-muted-foreground">
            10 canonical apparel personas (5 female, 5 male) with 100+ attributes each
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isUniverseLocked && (
            <Badge variant="outline" className="gap-1.5 py-1 border-primary/50 text-primary">
              <Lock className="w-3 h-3" />
              <span className="text-xs">Locked</span>
            </Badge>
          )}
          <Badge variant="outline" className="gap-1.5 py-1">
            <FlaskConical className="w-3 h-3" />
            <span className="text-xs">Synthetic v0</span>
          </Badge>
          {personas.length > 0 ? (
            <Button onClick={refreshAttributes} disabled={actionLoading} variant="outline" size="sm">
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Attributes
                </>
              )}
            </Button>
          ) : (
            <Button onClick={seedPersonas} disabled={actionLoading} size="sm">
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Initialize Personas
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Locked Universe Banner */}
      {isUniverseLocked && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-3 px-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Persona Universe: Locked</p>
              <p className="text-xs text-muted-foreground">
                10 canonical personas (5F, 5M) are fixed by design. Only attributes and metrics can be updated.
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              Fixed Set
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Data Source Banner */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="flex items-center gap-4 py-3 px-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Data Source: modeled_v0 (Synthetic)</p>
            <p className="text-xs text-muted-foreground">
              All persona attributes are hypothesis-driven. Values will be refined with real swipe data.
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Awaiting Swipe Data
          </Badge>
        </CardContent>
      </Card>

      {personas.length > 0 ? (
        <div className="space-y-2">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className="cursor-pointer transition-all duration-200 hover:bg-muted/50 border-border/40"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-4">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 w-[200px] shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                      persona.gender === "female" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {persona.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{persona.name}</p>
                      <p className="text-xs text-muted-foreground">{getAgeBand(persona)}</p>
                    </div>
                  </div>

                  {/* Gender Badge */}
                  <Badge 
                    variant={persona.gender === "female" ? "default" : "secondary"} 
                    className="text-xs shrink-0 w-16 justify-center"
                  >
                    {persona.gender === "female" ? "Female" : "Male"}
                  </Badge>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground flex-1 min-w-0 line-clamp-1 hidden lg:block">
                    {persona.description}
                  </p>

                  {/* Categories */}
                  <div className="hidden xl:flex items-center gap-1.5 shrink-0">
                    {getTopCategories(persona).slice(0, 3).map((cat) => (
                      <span 
                        key={cat} 
                        className="text-[11px] px-2 py-0.5 rounded border border-border text-foreground whitespace-nowrap"
                      >
                        {String(cat).replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="hidden 2xl:flex items-center gap-4 shrink-0 text-xs">
                    <div className="w-28 text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">T-shirt Price</p>
                      <p className="font-medium">{getPriceRange(persona)}</p>
                    </div>
                    <div className="w-16 text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Loyalty</p>
                      <p className="font-medium">{getBrandLoyalty(persona)}</p>
                    </div>
                    <div className="w-16 text-center">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Elasticity</p>
                      <p className="font-medium capitalize">{getElasticity(persona)}</p>
                    </div>
                  </div>

                  {/* Weight & Version */}
                  <div className="flex items-center gap-2 shrink-0">
                    {persona.segment_weight && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(persona.segment_weight * 100)}%
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span className="text-xs">v0</span>
                    </div>
                  </div>
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
              Initialize the fixed persona universe with 10 canonical apparel personas (5 female, 5 male). Once created, personas are locked and only their attributes can be updated.
            </p>
            <Button onClick={seedPersonas} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Initialize Persona Universe
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
