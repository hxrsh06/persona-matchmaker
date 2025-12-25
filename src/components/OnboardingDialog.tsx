import { useState } from "react";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import swirlLogo from "@/assets/swirl-logo.png";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BRAND_SEGMENTS = [
  { value: "lite", label: "Lite", description: "Budget-friendly, value-focused" },
  { value: "premium", label: "Premium", description: "Quality-driven, mid-to-high pricing" },
  { value: "luxury", label: "Luxury", description: "High-end, exclusive positioning" },
  { value: "streetwear", label: "Streetwear", description: "Trendy, youth-focused, style-driven" },
];

const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const { createTenant } = useTenant();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [segment, setSegment] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingPersonas, setGeneratingPersonas] = useState(false);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = brandName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const tenant = await createTenant(brandName, slug);
    
    if (tenant) {
      // Update tenant settings with brand info
      await supabase
        .from("tenants")
        .update({
          settings: {
            segment,
            priceRange: {
              min: parseInt(minPrice) || 0,
              max: parseInt(maxPrice) || 0,
            },
          },
        })
        .eq("id", tenant.id);

      toast({
        title: "Brand created!",
        description: "Now setting up your 6 consumer personas...",
      });

      // Generate personas
      setGeneratingPersonas(true);
      try {
        const response = await supabase.functions.invoke("generate-personas", {
          body: { 
            tenantId: tenant.id,
            customizeForBrand: brandName,
            brandSegment: segment,
            priceRange: { min: parseInt(minPrice) || 0, max: parseInt(maxPrice) || 0 },
          },
        });

        if (response.error) {
          throw response.error;
        }

        const { personasCreated, productsCreated } = response.data;
        toast({
          title: "Setup complete!",
          description: `Created ${personasCreated} consumer personas and ${productsCreated || 0} demo products.`,
        });
      } catch (error) {
        console.error("Error generating personas:", error);
        toast({
          title: "Setup will complete soon",
          description: "You can start exploring while we set up your personas and demo data.",
        });
      }

      setGeneratingPersonas(false);
      onOpenChange(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to create brand. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const isFormValid = brandName.trim() && segment && minPrice && maxPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <img src={swirlLogo} alt="SWIRL" className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center">Welcome to SWIRL</DialogTitle>
          <DialogDescription className="text-center">
            Tell us about your brand to set up personalized consumer personas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateBrand} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              placeholder="e.g., Your Brand Name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              disabled={loading || generatingPersonas}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Brand Segment</Label>
            <Select value={segment} onValueChange={setSegment} disabled={loading || generatingPersonas}>
              <SelectTrigger>
                <SelectValue placeholder="Select your brand segment" />
              </SelectTrigger>
              <SelectContent>
                {BRAND_SEGMENTS.map((seg) => (
                  <SelectItem key={seg.value} value={seg.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{seg.label}</span>
                      <span className="text-xs text-muted-foreground">{seg.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Usual Price Range (INR)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                disabled={loading || generatingPersonas}
                min={0}
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                disabled={loading || generatingPersonas}
                min={0}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || generatingPersonas || !isFormValid}
          >
            {loading || generatingPersonas ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {generatingPersonas ? "Setting up personas..." : "Creating Brand..."}
              </>
            ) : (
              "Create Brand & Set Up Personas"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We'll set up 6 fixed consumer personas for you to test your products against
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;