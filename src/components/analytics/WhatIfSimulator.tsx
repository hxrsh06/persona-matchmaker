import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SimulationResult {
  price: number;
  likeProbabilities: { personaId: string; personaName: string; probability: number }[];
  averageProbability: number;
  expectedRevenue: number;
  recommendation: string;
}

interface WhatIfSimulatorProps {
  productId: string;
}

const WhatIfSimulator = ({ productId }: WhatIfSimulatorProps) => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [product, setProduct] = useState<{ id: string; name: string; price: number } | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 0]);
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [optimal, setOptimal] = useState<{
    price: number;
    averageProbability: number;
    expectedRevenue: number;
  } | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  const loadProduct = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, price")
      .eq("id", productId)
      .single();

    if (data) {
      setProduct(data);
      const min = Math.round(data.price * 0.5);
      const max = Math.round(data.price * 1.5);
      setPriceRange([min, max]);
      setSelectedRange([min, max]);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const runSimulation = useCallback(async () => {
    if (!tenant || !product) return;
    setSimulating(true);

    try {
      const response = await supabase.functions.invoke("what-if-simulation", {
        body: {
          productId: product.id,
          tenantId: tenant.id,
          priceRange: { minPrice: selectedRange[0], maxPrice: selectedRange[1] },
          steps: 7,
        },
      });

      if (response.error) throw response.error;

      setResults(response.data.simulations);
      setOptimal(response.data.optimal);
      setInsights(response.data.insights || []);
    } catch (error: any) {
      toast({
        title: "Simulation failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSimulating(false);
    }
  }, [tenant, product, selectedRange, toast]);

  if (!product) {
    return <Skeleton className="h-64" />;
  }

  const getPriceIndicator = (simPrice: number) => {
    if (simPrice < product.price) {
      return { icon: TrendingDown, color: "text-orange-500", label: "Lower" };
    }
    if (simPrice > product.price) {
      return { icon: TrendingUp, color: "text-blue-500", label: "Higher" };
    }
    return { icon: Minus, color: "text-green-500", label: "Current" };
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">Current price: ₹{product.price}</p>
          </div>
          <Button onClick={runSimulation} disabled={simulating}>
            {simulating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Price Range: ₹{selectedRange[0]} - ₹{selectedRange[1]}</span>
          </div>
          <Slider
            value={selectedRange}
            onValueChange={(value) => setSelectedRange(value as [number, number])}
            min={priceRange[0]}
            max={priceRange[1]}
            step={50}
            className="py-4"
          />
        </div>
      </div>

      {results && results.length > 0 && (
        <div className="space-y-4">
          {optimal && (
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Optimal Price Point</p>
                  <p className="text-2xl font-bold text-primary">₹{optimal.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Avg. Match Probability</p>
                  <p className="text-2xl font-bold">{optimal.averageProbability}%</p>
                </div>
              </div>
              {optimal.price !== product.price && (
                <p className="text-sm mt-2">
                  {optimal.price > product.price
                    ? `Consider increasing price by ₹${optimal.price - product.price}`
                    : `Consider decreasing price by ₹${product.price - optimal.price}`}
                </p>
              )}
            </div>
          )}

          <div className="grid gap-2">
            {results.map((sim) => {
              const indicator = getPriceIndicator(sim.price);
              const Icon = indicator.icon;
              const isOptimal = optimal && sim.price === optimal.price;

              return (
                <div
                  key={sim.price}
                  className={`p-3 rounded-lg border ${
                    isOptimal ? "border-primary bg-primary/5" : "border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${indicator.color}`} />
                      <span className="font-medium">₹{sim.price}</span>
                      {isOptimal && (
                        <Badge variant="default" className="text-xs">Optimal</Badge>
                      )}
                      {sim.price === product.price && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Match: <span className="font-medium text-foreground">{sim.averageProbability}%</span>
                      </span>
                      <span className="text-muted-foreground">
                        Revenue Index: <span className="font-medium text-foreground">{sim.expectedRevenue}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-2 flex-wrap">
                    {sim.likeProbabilities.map((p) => (
                      <Badge key={p.personaId} variant="secondary" className="text-xs">
                        {p.personaName}: {Math.round(p.probability)}%
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {insights.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="font-medium text-sm">Insights</p>
              <ul className="space-y-1">
                {insights.map((insight, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
