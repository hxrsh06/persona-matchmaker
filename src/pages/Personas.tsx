import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, TrendingUp, ShoppingBag, Target, DollarSign, Heart } from "lucide-react";
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
  brand_psychology: Json;
  attribute_vector: Json;
  is_active: boolean;
}

// Fixed persona definitions for display
const PERSONA_FEATURES: Record<string, { icon: typeof Users; highlights: string[] }> = {
  "Comfort-First Millennial": {
    icon: Target,
    highlights: ["Values comfort over style", "Online shopper", "Mid-range budget", "Quality conscious"],
  },
  "Trend-Driven Gen Z": {
    icon: TrendingUp,
    highlights: ["Follows influencers", "Impulse buyer", "Budget-conscious", "Style-first"],
  },
  "Young Mom (WFH)": {
    icon: Heart,
    highlights: ["Prioritizes durability", "Bulk buyer", "Reviews-driven", "Value seeker"],
  },
  "Premium Comfort Seeker": {
    icon: ShoppingBag,
    highlights: ["Quality investment", "Brand loyal", "Premium budget", "Self-care focused"],
  },
  "Value-Conscious Shopper": {
    icon: DollarSign,
    highlights: ["Deal hunter", "Planned purchases", "Price sensitive", "Practical choices"],
  },
  "Fashion-Forward Professional": {
    icon: Target,
    highlights: ["Style conscious", "Brand aware", "Moderate splurger", "Trend follower"],
  },
};

const Personas = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
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

  const getAttributeCount = (persona: Persona) => {
    return Array.isArray(persona.attribute_vector) ? persona.attribute_vector.length : 0;
  };

  const getTopCategories = (persona: Persona) => {
    const prefs = persona.product_preferences as { categories?: string[] };
    return prefs?.categories?.slice(0, 3) || [];
  };

  const getPriceRange = (persona: Persona) => {
    const behavior = persona.price_behavior as { braRange?: number[] };
    if (behavior?.braRange) {
      return `₹${behavior.braRange[0]} - ₹${behavior.braRange[1]}`;
    }
    return "Varies";
  };

  const getBrandLoyalty = (persona: Persona) => {
    const psychology = persona.brand_psychology as { brandLoyalty?: number };
    const loyalty = psychology?.brandLoyalty || 0.5;
    if (loyalty >= 0.7) return "High";
    if (loyalty >= 0.4) return "Medium";
    return "Low";
  };

  const getPersonaFeatures = (personaName: string) => {
    return PERSONA_FEATURES[personaName] || { icon: Users, highlights: [] };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
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
          <p className="text-muted-foreground">
            6 fixed consumer profiles to test your products against
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona) => {
          const features = getPersonaFeatures(persona.name);
          const IconComponent = features.icon;
          
          return (
            <Card
              key={persona.id}
              className="cursor-pointer hover:shadow-md transition-shadow border-border/50"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="text-4xl">{persona.avatar_emoji}</span>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-3 h-3 text-primary" />
                    </div>
                  </div>
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
                
                {/* Key Highlights */}
                {features.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {features.highlights.slice(0, 4).map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Product Categories */}
                <div className="flex flex-wrap gap-1.5">
                  {getTopCategories(persona).map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-sm">
                      {(persona.demographics as { ageRange?: string })?.ageRange || "25-34"}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium text-xs">
                      {getPriceRange(persona)}
                    </p>
                  </div>
                  <div className="text-center p-2 rounded-md bg-muted/50">
                    <p className="text-xs text-muted-foreground">Loyalty</p>
                    <p className="font-medium text-sm">
                      {getBrandLoyalty(persona)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {personas.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">Personas not loaded yet</h3>
            <p className="text-sm text-muted-foreground text-center">
              Complete the onboarding to set up your 6 consumer personas
            </p>
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