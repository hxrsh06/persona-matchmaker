import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, TrendingUp, TrendingDown, Target, DollarSign, Package } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  primary_image_url: string | null;
  status: string;
}

interface AnalysisResult {
  persona_id: string;
  like_probability: number;
  confidence_score: number;
  price_floor: number;
  price_sweet_spot: number;
  price_ceiling: number;
  explanation: string;
  match_factors: Json;
  personas: { name: string; avatar_emoji: string } | null;
}

interface ProductAnalysisPanelProps {
  product: Product | null;
  onClose: () => void;
  onAnalysisComplete: () => void;
}

const ProductAnalysisPanel = ({ product, onClose, onAnalysisComplete }: ProductAnalysisPanelProps) => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && product.status === "analyzed") {
      loadResults();
    } else {
      setResults([]);
    }
  }, [product]);

  const loadResults = async () => {
    if (!product || !tenant) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("analysis_results")
      .select("*, personas(name, avatar_emoji)")
      .eq("product_id", product.id)
      .order("like_probability", { ascending: false });

    if (!error && data) {
      setResults(data as AnalysisResult[]);
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!product || !tenant) return;
    setAnalyzing(true);

    try {
      // Ensure we have a valid session before calling the edge function
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Please sign in again to analyze products");
      }

      const response = await supabase.functions.invoke("analyze-product", {
        body: { productId: product.id, tenantId: tenant.id },
      });

      if (response.error) throw response.error;

      toast({
        title: "Analysis complete!",
        description: `Scored against ${response.data.scores?.length || 0} personas.`,
      });

      onAnalysisComplete();
      loadResults();
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPriceDelta = (sweetSpot: number, currentPrice: number) => {
    const delta = sweetSpot - currentPrice;
    if (Math.abs(delta) < 50) return { text: "Optimal", icon: Target, color: "text-green-600" };
    if (delta > 0) return { text: `+₹${Math.round(delta)}`, icon: TrendingUp, color: "text-blue-600" };
    return { text: `₹${Math.round(delta)}`, icon: TrendingDown, color: "text-orange-600" };
  };

  if (!product) return null;

  return (
    <Sheet open={!!product} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Product Analysis</SheetTitle>
          <SheetDescription>
            AI-powered persona matching and pricing insights
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
              {product.primary_image_url ? (
                <img src={product.primary_image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.brand || product.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">₹{product.price}</span>
                <Badge variant="outline" className="text-xs">{product.category}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Analysis Button or Results */}
          {product.status !== "analyzed" && results.length === 0 ? (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="font-medium mb-2">Ready for Analysis</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Score this product against your consumer personas
              </p>
              <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Product
                  </>
                )}
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Persona Scores</h4>
                <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Re-analyze"}
                </Button>
              </div>

              {results.map((result) => {
                const priceDelta = getPriceDelta(result.price_sweet_spot, product.price);
                const PriceIcon = priceDelta.icon;

                return (
                  <Card key={result.persona_id} className="border-border/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{result.personas?.avatar_emoji || "👤"}</span>
                          <CardTitle className="text-base">{result.personas?.name || "Persona"}</CardTitle>
                        </div>
                        <span className={`text-2xl font-bold ${getScoreColor(result.like_probability)}`}>
                          {Math.round(result.like_probability)}%
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Like Probability</span>
                          <span>{Math.round(result.confidence_score || 70)}% confidence</span>
                        </div>
                        <Progress value={result.like_probability} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Floor</p>
                          <p className="font-medium">₹{Math.round(result.price_floor)}</p>
                        </div>
                        <div className="p-2 rounded-md bg-primary/10 border border-primary/20">
                          <p className="text-xs text-primary">Sweet Spot</p>
                          <p className="font-bold text-primary">₹{Math.round(result.price_sweet_spot)}</p>
                        </div>
                        <div className="p-2 rounded-md bg-muted/50">
                          <p className="text-xs text-muted-foreground">Ceiling</p>
                          <p className="font-medium">₹{Math.round(result.price_ceiling)}</p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 p-2 rounded-md bg-muted/50 ${priceDelta.color}`}>
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">Price recommendation: {priceDelta.text}</span>
                      </div>

                      {result.explanation && (
                        <p className="text-sm text-muted-foreground">{result.explanation}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductAnalysisPanel;
