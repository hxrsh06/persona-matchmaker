import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import PersonaDetailSheet from "@/components/personas/PersonaDetailSheet";
import type { Json } from "@/integrations/supabase/types";

// Banned intimate wear terms to filter out from personas
const BANNED_INTIMATE_TERMS = [
  "bra", "bralette", "sports bra", "t-shirt bra", "panty", "panties", 
  "lingerie", "innerwear", "underwear", "thong", "bikini", "camisole",
  "shapewear", "nightwear", "sleepwear", "chemise", "teddy", "bodysuit",
  "corset", "bustier", "slip", "negligee", "strap", "underwire", "padded",
  "push-up", "strapless", "convertible bra", "nursing bra", "maternity bra"
];

// Check if persona contains any banned intimate terms
const hasIntimateTerms = (persona: Persona): boolean => {
  const checkJson = (obj: Json): boolean => {
    if (typeof obj === "string") {
      const lower = obj.toLowerCase();
      return BANNED_INTIMATE_TERMS.some(term => lower.includes(term));
    }
    if (Array.isArray(obj)) {
      return obj.some(item => checkJson(item));
    }
    if (obj && typeof obj === "object") {
      return Object.values(obj).some(val => checkJson(val as Json));
    }
    return false;
  };
  
  return (
    checkJson(persona.product_preferences) ||
    checkJson(persona.attribute_vector) ||
    (persona.description && BANNED_INTIMATE_TERMS.some(term => 
      persona.description!.toLowerCase().includes(term)
    ))
  );
};

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

// Enterprise persona definitions for 10 personas (5 female, 5 male)
const PERSONA_DATA: Record<string, { segment: string; highlights: string[]; gender: string }> = {
  "Priya Sharma": {
    segment: "Trend-Conscious Millennial",
    gender: "Female",
    highlights: ["Social media influenced", "Monthly purchase cycle", "Mid-range pricing", "Style-driven decisions"],
  },
  "Ananya Mehta": {
    segment: "Quality-Conscious Professional",
    gender: "Female",
    highlights: ["Quality over quantity", "High brand loyalty", "Premium segment", "Investment mindset"],
  },
  "Sneha Patel": {
    segment: "Budget-Conscious Student",
    gender: "Female",
    highlights: ["Price-sensitive", "Sale-driven purchases", "High variety seeking", "Marketplace preference"],
  },
  "Meera Reddy": {
    segment: "Ethnic-Fusion Enthusiast",
    gender: "Female",
    highlights: ["Occasion-driven", "Cultural blend", "Festive spender", "Traditional-modern mix"],
  },
  "Kavya Iyer": {
    segment: "Athleisure Lifestyle",
    gender: "Female",
    highlights: ["Fitness-focused", "Performance fabrics", "Comfort-first", "Brand-conscious active"],
  },
  "Rahul Kumar": {
    segment: "Comfort-Focused Professional",
    gender: "Male",
    highlights: ["Comfort-first approach", "Basics-oriented", "Practical choices", "Brand-loyal for fit"],
  },
  "Arjun Verma": {
    segment: "Style-Forward Executive",
    gender: "Male",
    highlights: ["Premium brands", "Image-conscious", "High spend capacity", "Quality-driven"],
  },
  "Vikram Joshi": {
    segment: "Streetwear Enthusiast",
    gender: "Male",
    highlights: ["Drop-culture driven", "Exclusivity seeker", "Community-oriented", "Trend-setter"],
  },
  "Aditya Singh": {
    segment: "Value Maximizer",
    gender: "Male",
    highlights: ["Deal-hunter", "Bulk buyer", "Tier 2/3 cities", "COD preference"],
  },
  "Rohan Kapoor": {
    segment: "Smart Casual Hybrid",
    gender: "Male",
    highlights: ["WFH professional", "Versatile wardrobe", "Quality-conscious", "Work-weekend blend"],
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
      // Filter out personas with intimate wear terms
      const filteredPersonas = (data || []).filter(p => !hasIntimateTerms(p));
      setPersonas(filteredPersonas);
    }
    setLoading(false);
  };

  const getAttributeCount = (persona: Persona) => {
    return Array.isArray(persona.attribute_vector) ? persona.attribute_vector.length : 0;
  };

  const getTopCategories = (persona: Persona) => {
    const prefs = persona.product_preferences as { categories?: string[] };
    return prefs?.categories?.slice(0, 4) || [];
  };

  const getPriceRange = (persona: Persona) => {
    const behavior = persona.price_behavior as { comfortPriceTshirtsMin?: number; comfortPriceTshirtsMax?: number; tshirtRange?: number[] };
    if (behavior?.comfortPriceTshirtsMin && behavior?.comfortPriceTshirtsMax) {
      return `₹${behavior.comfortPriceTshirtsMin.toLocaleString()} - ${behavior.comfortPriceTshirtsMax.toLocaleString()}`;
    }
    if (behavior?.tshirtRange) {
      return `₹${behavior.tshirtRange[0].toLocaleString()} - ${behavior.tshirtRange[1].toLocaleString()}`;
    }
    return "Variable";
  };

  const getBrandLoyalty = (persona: Persona) => {
    const psychology = persona.brand_psychology as { brandLoyaltyScore?: number; brandLoyalty?: number };
    const loyalty = psychology?.brandLoyaltyScore || psychology?.brandLoyalty || 0.5;
    if (loyalty >= 0.7) return { label: "High", value: loyalty };
    if (loyalty >= 0.4) return { label: "Medium", value: loyalty };
    return { label: "Low", value: loyalty };
  };

  const getPersonaData = (personaName: string) => {
    // Try exact match first
    if (PERSONA_DATA[personaName]) {
      return PERSONA_DATA[personaName];
    }
    // Fallback to first name match
    const firstName = personaName.split(" ")[0];
    const match = Object.entries(PERSONA_DATA).find(([key]) => key.startsWith(firstName));
    return match ? match[1] : { segment: "Consumer Persona", highlights: [], gender: "Unknown" };
  };

  const getElasticity = (persona: Persona) => {
    const behavior = persona.price_behavior as { elasticity?: number; priceElasticityIndicator?: string };
    if (behavior?.priceElasticityIndicator) {
      if (behavior.priceElasticityIndicator.includes("high")) return "High";
      if (behavior.priceElasticityIndicator.includes("low")) return "Low";
      return "Medium";
    }
    const elasticity = Math.abs(behavior?.elasticity || 0.5);
    if (elasticity >= 0.7) return "High";
    if (elasticity >= 0.4) return "Medium";
    return "Low";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
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
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Consumer Personas</h1>
        <p className="text-muted-foreground">
          Ten enterprise-grade consumer profiles (5 female, 5 male) with 144+ attributes each
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {personas.map((persona) => {
          const data = getPersonaData(persona.name);
          const loyalty = getBrandLoyalty(persona);
          
          return (
            <Card
              key={persona.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg border-border/40 bg-card"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <CardTitle className="text-base font-medium truncate">{persona.name}</CardTitle>
                    <CardDescription className="text-[10px] font-medium uppercase tracking-wide line-clamp-1">
                      {data.segment}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={data.gender === "Female" ? "default" : "secondary"} 
                    className="text-[10px] font-normal shrink-0"
                  >
                    {data.gender === "Female" ? "F" : "M"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {persona.description}
                </p>
                
                {/* Key Characteristics */}
                <div className="flex flex-wrap gap-1">
                  {data.highlights.slice(0, 2).map((highlight) => (
                    <span 
                      key={highlight} 
                      className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

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
                        {cat}
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
                      {loyalty.label}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                      Elasticity
                    </p>
                    <p className="text-[10px] font-medium">
                      {getElasticity(persona)}
                    </p>
                  </div>
                </div>

                {/* Attribute Count */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-[10px] text-muted-foreground">
                    {getAttributeCount(persona)} attributes
                  </span>
                  <span className="text-[10px] text-primary">
                    Details →
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {personas.length === 0 && (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-lg font-medium text-muted-foreground">0</span>
            </div>
            <h3 className="font-medium mb-1">No personas configured</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Complete the onboarding process to generate your ten consumer personas
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
