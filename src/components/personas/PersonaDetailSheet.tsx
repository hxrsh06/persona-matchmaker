import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FlaskConical, TrendingUp, Shirt, Palette, User, ShoppingCart, DollarSign, Smartphone, Heart, Sparkles, Lock } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface Persona {
  id: string;
  name: string;
  description: string | null;
  avatar_emoji: string;
  canonical_persona_id?: string;
  segment_name?: string;
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
  attribute_vector: Json;
  fit_silhouette_preferences?: Json;
  fabric_material_preferences?: Json;
  color_pattern_preferences?: Json;
  lifecycle_loyalty?: Json;
  swipe_data_config?: Json;
  data_source_status?: string;
}

interface PersonaDetailSheetProps {
  persona: Persona | null;
  onClose: () => void;
}

const PersonaDetailSheet = ({ persona, onClose }: PersonaDetailSheetProps) => {
  if (!persona) return null;

  const renderKeyValue = (key: string, value: unknown, depth = 0): JSX.Element | null => {
    if (value === null || value === undefined) return null;
    
    const label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
    
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const obj = value as Record<string, unknown>;
      if (obj.min !== undefined && obj.max !== undefined) {
        return (
          <div key={key} className="flex justify-between items-center py-1">
            <span className="text-sm text-muted-foreground capitalize">{label}</span>
            <span className="text-sm font-medium">₹{String(obj.min)} - ₹{String(obj.max)}</span>
          </div>
        );
      }
      return (
        <div key={key} className="space-y-2">
          <p className="font-medium text-sm capitalize">{label}</p>
          <div className="pl-3 border-l border-border/50 space-y-1">
            {Object.entries(obj).map(([k, v]) => renderKeyValue(k, v, depth + 1))}
          </div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} className="space-y-1">
          <p className="text-sm text-muted-foreground capitalize">{label}</p>
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 8).map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {String(item).replace(/_/g, " ")}
              </Badge>
            ))}
            {value.length > 8 && (
              <Badge variant="outline" className="text-xs">
                +{value.length - 8} more
              </Badge>
            )}
          </div>
        </div>
      );
    }

    if (typeof value === "number" && value >= 0 && value <= 1) {
      return (
        <div key={key} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground capitalize">{label}</span>
            <span className="font-medium">{(value * 100).toFixed(0)}%</span>
          </div>
          <Progress value={value * 100} className="h-1.5" />
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div key={key} className="flex justify-between items-center py-1">
          <span className="text-sm text-muted-foreground capitalize">{label}</span>
          <Badge variant={value ? "default" : "secondary"} className="text-xs">
            {value ? "Yes" : "No"}
          </Badge>
        </div>
      );
    }

    return (
      <div key={key} className="flex justify-between items-center py-1">
        <span className="text-sm text-muted-foreground capitalize">{label}</span>
        <span className="text-sm font-medium capitalize">{String(value).replace(/_/g, " ")}</span>
      </div>
    );
  };

  const renderSection = (data: Json | undefined, excludeKeys: string[] = []) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return Object.entries(data)
      .filter(([key]) => !excludeKeys.includes(key) && key !== "modeled_v0")
      .map(([key, value]) => renderKeyValue(key, value));
  };

  const attributeVector = Array.isArray(persona.attribute_vector) 
    ? persona.attribute_vector as { name: string; value: number; category: string }[]
    : [];
  
  const groupedAttributes = attributeVector.reduce((acc, attr) => {
    if (!acc[attr.category]) acc[attr.category] = [];
    acc[attr.category].push(attr);
    return acc;
  }, {} as Record<string, { name: string; value: number; category: string }[]>);

  const categoryIcons: Record<string, React.ReactNode> = {
    demographics: <User className="w-4 h-4" />,
    lifestyle: <TrendingUp className="w-4 h-4" />,
    fashion_orientation: <Sparkles className="w-4 h-4" />,
    shopping_behavior: <ShoppingCart className="w-4 h-4" />,
    price_behavior: <DollarSign className="w-4 h-4" />,
    fit_silhouette: <Shirt className="w-4 h-4" />,
    fabric_material: <Shirt className="w-4 h-4" />,
    color_pattern: <Palette className="w-4 h-4" />,
    digital_behavior: <Smartphone className="w-4 h-4" />,
    brand_psychology: <Heart className="w-4 h-4" />,
    psychographics: <User className="w-4 h-4" />,
    lifecycle_loyalty: <TrendingUp className="w-4 h-4" />,
  };

  const categoryDisplayNames: Record<string, string> = {
    demographics: "Demographics",
    lifestyle: "Lifestyle",
    fashion_orientation: "Fashion Orientation",
    shopping_behavior: "Shopping Behavior",
    price_behavior: "Price Sensitivity",
    category_preferences: "Category Preferences",
    fit_silhouette: "Fit & Silhouette",
    fabric_material: "Fabric & Material",
    color_pattern: "Color & Pattern",
    digital_behavior: "Digital Behavior",
    brand_psychology: "Brand Psychology",
    psychographics: "Psychographics",
    lifecycle_loyalty: "Lifecycle & Loyalty",
  };

  return (
    <Sheet open={!!persona} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold ${
              persona.gender === "female" 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            }`}>
              {persona.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-xl">{persona.name}</SheetTitle>
                <Badge variant="outline" className="gap-1 text-xs border-primary/50 text-primary">
                  <Lock className="w-3 h-3" />
                  Locked
                </Badge>
                <Badge variant="outline" className="gap-1 text-xs">
                  <FlaskConical className="w-3 h-3" />
                  v0
                </Badge>
              </div>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <span>{persona.segment_name || "Consumer Persona"}</span>
                <span className="text-muted-foreground">•</span>
                <span>{attributeVector.length} ML-ready attributes</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Locked Persona Banner */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Lock className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <p className="text-xs font-medium">Fixed Persona Identity</p>
              <p className="text-[10px] text-muted-foreground">
                ID: <code className="bg-muted px-1 rounded">{persona.canonical_persona_id}</code> — Identity is immutable, only attributes can be updated.
              </p>
            </div>
          </div>

          {/* Data Source Banner */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-dashed">
            <FlaskConical className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs font-medium">Data Source: modeled_v0</p>
              <p className="text-[10px] text-muted-foreground">
                Synthetic, hypothesis-driven attributes awaiting swipe data validation
              </p>
            </div>
          </div>

          {persona.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
          )}

          <Separator />

          <Accordion type="multiple" defaultValue={["vector", "demographics", "price"]} className="space-y-2">
            {/* Attribute Vector Section */}
            {groupedAttributes && Object.keys(groupedAttributes).length > 0 && (
              <AccordionItem value="vector" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">ML Attribute Vector</span>
                    <Badge variant="secondary" className="text-xs">
                      {attributeVector.length} attributes
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pb-4">
                  {Object.entries(groupedAttributes).map(([category, attrs]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {categoryIcons[category]}
                          <p className="text-sm font-medium text-foreground">
                            {categoryDisplayNames[category] || category.replace(/_/g, " ")}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {attrs.length}
                        </Badge>
                      </div>
                      <div className="grid gap-2">
                        {attrs.map((attr, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="capitalize text-muted-foreground">
                                {attr.name.replace(/_/g, " ")}
                              </span>
                              <span className="font-medium">{(attr.value * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={attr.value * 100} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="demographics" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Demographics & Context</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.demographics)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lifestyle" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Lifestyle & Routine</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.lifestyle)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fashion" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Fashion Orientation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.fashion_orientation)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shopping" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="font-medium">Shopping Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.shopping_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">Price Behavior</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.price_behavior)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fit" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  <span className="font-medium">Fit & Silhouette</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.fit_silhouette_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="fabric" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  <span className="font-medium">Fabric & Material</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.fabric_material_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="font-medium">Color & Pattern</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.color_pattern_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="digital" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-medium">Digital Behavior</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.digital_behavior)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brand" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">Brand Psychology</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.brand_psychology)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="psychographics" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Psychographics</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.psychographics)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lifecycle" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">Lifecycle & Loyalty</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderSection(persona.lifecycle_loyalty)}
              </AccordionContent>
            </AccordionItem>

            {/* Swipe Data Config - Placeholder */}
            <AccordionItem value="swipe" className="border rounded-lg px-4 border-dashed">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Future Swipe Data</span>
                  <Badge variant="outline" className="text-[10px]">Placeholder</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    Swipe data metrics will be populated once the Tinder-for-fashion app generates user interaction data.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">swipe_like_rate_by_category</span>
                      <Badge variant="secondary">Awaiting data</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">swipe_price_sensitivity_curve</span>
                      <Badge variant="secondary">Awaiting data</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">fit_and_silhouette_affinity_index</span>
                      <Badge variant="secondary">Awaiting data</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">style_cluster_resonance_score</span>
                      <Badge variant="secondary">Awaiting data</Badge>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PersonaDetailSheet;
