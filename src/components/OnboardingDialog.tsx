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
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OnboardingDialog = ({ open, onOpenChange }: OnboardingDialogProps) => {
  const { createTenant } = useTenant();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingPersonas, setGeneratingPersonas] = useState(false);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = brandName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const tenant = await createTenant(brandName, slug);
    
    if (tenant) {
      toast({
        title: "Brand created!",
        description: "Now generating AI personas...",
      });

      // Generate personas
      setGeneratingPersonas(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        const response = await supabase.functions.invoke("generate-personas", {
          body: { 
            tenantId: tenant.id,
            customizeForBrand: brandName
          },
        });

        if (response.error) {
          throw response.error;
        }

        const { personasCreated, productsCreated } = response.data;
        toast({
          title: "Setup complete!",
          description: `Created ${personasCreated} AI personas and ${productsCreated || 0} demo products for you to explore.`,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Welcome to Lovable Twin</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your brand to get started with AI-powered product analysis
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateBrand} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="brand-name">Brand Name</Label>
            <Input
              id="brand-name"
              placeholder="e.g., Lovable Intimates"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
              disabled={loading || generatingPersonas}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || generatingPersonas || !brandName.trim()}
          >
            {loading || generatingPersonas ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {generatingPersonas ? "Generating AI Personas..." : "Creating Brand..."}
              </>
            ) : (
              "Create Brand & Generate Personas"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We'll create 5 AI personas and sample products to help you explore
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
