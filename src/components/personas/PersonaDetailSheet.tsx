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
              {value.map((item, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {String(item)}
                </Badge>
              ))}
            </div>
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

  return (
    <Sheet open={!!persona} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{persona.avatar_emoji}</span>
            <div>
              <SheetTitle className="text-xl">{persona.name}</SheetTitle>
          <SheetDescription>
                {attributeVector.length} normalized attributes
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {persona.description && (
            <p className="text-muted-foreground">{persona.description}</p>
          )}

          <Separator />

          <Accordion type="multiple" defaultValue={["demographics", "product"]} className="space-y-2">
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
                <span className="font-medium">Psychographics</span>
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

            {groupedAttributes && Object.keys(groupedAttributes).length > 0 && (
              <AccordionItem value="vector" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-medium">Attribute Vector (ML Features)</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pb-4">
                  {Object.entries(groupedAttributes).map(([category, attrs]) => (
                    <div key={category} className="space-y-2">
                      <p className="text-sm font-medium capitalize text-muted-foreground">{category}</p>
                      <div className="space-y-2">
                        {attrs.slice(0, 10).map((attr, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="capitalize">{attr.name.replace(/_/g, " ")}</span>
                              <span>{(attr.value * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={attr.value * 100} className="h-1.5" />
                          </div>
                        ))}
                        {attrs.length > 10 && (
                          <p className="text-xs text-muted-foreground">
                            +{attrs.length - 10} more attributes
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PersonaDetailSheet;
