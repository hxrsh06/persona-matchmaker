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
}

interface PersonaDetailSheetProps {
  persona: Persona | null;
  onClose: () => void;
}

const PersonaDetailSheet = ({ persona, onClose }: PersonaDetailSheetProps) => {
  if (!persona) return null;

  const renderAttributes = (obj: Json, depth = 0): JSX.Element[] => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return [];
    
    return Object.entries(obj).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
      
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return (
          <div key={key} className="space-y-2">
            <p className="font-medium text-sm capitalize">{label}</p>
            <div className="pl-3 border-l border-border/50 space-y-2">
              {renderAttributes(value as Json, depth + 1)}
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
                  {String(item)}
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

      // Render numeric values with progress bars if between 0 and 1
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

      return (
        <div key={key} className="flex justify-between items-center py-1">
          <span className="text-sm text-muted-foreground capitalize">{label}</span>
          <span className="text-sm font-medium">{String(value)}</span>
        </div>
      );
    });
  };

  const attributeVector = Array.isArray(persona.attribute_vector) 
    ? persona.attribute_vector as { name: string; value: number; category: string }[]
    : [];
  
  const groupedAttributes = attributeVector.reduce((acc, attr) => {
    if (!acc[attr.category]) acc[attr.category] = [];
    acc[attr.category].push(attr);
    return acc;
  }, {} as Record<string, { name: string; value: number; category: string }[]>);

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
  };

  return (
    <Sheet open={!!persona} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{persona.avatar_emoji}</span>
            <div>
              <SheetTitle className="text-xl">{persona.name}</SheetTitle>
              <SheetDescription>
                {attributeVector.length} ML-ready attributes across {Object.keys(groupedAttributes).length} categories
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {persona.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{persona.description}</p>
          )}

          <Separator />

          <Accordion type="multiple" defaultValue={["vector", "demographics"]} className="space-y-2">
            {/* Attribute Vector Section - Primary */}
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
                        <p className="text-sm font-medium text-foreground">
                          {categoryDisplayNames[category] || category.replace(/_/g, " ")}
                        </p>
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
                <span className="font-medium">Demographics</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.demographics)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="psychographics" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Psychographics & Lifestyle</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.psychographics)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="shopping" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Shopping Preferences</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.shopping_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="product" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Product Preferences</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.product_preferences)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Price Behavior</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.price_behavior)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="brand" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium">Brand Psychology & Digital</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                {renderAttributes(persona.brand_psychology)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PersonaDetailSheet;
