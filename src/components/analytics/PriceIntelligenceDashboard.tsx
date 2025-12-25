import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";

interface WTPBandwidth {
  personaName: string;
  personaEmoji: string;
  floor: number;
  sweetSpot: number;
  ceiling: number;
  currentAvgPrice: number;
}

interface ElasticityData {
  personaName: string;
  personaEmoji: string;
  avgElasticity: number;
  upwardSensitivity: number;
  downwardSensitivity: number;
  asymmetry: "price-sensitive" | "quality-seeker" | "neutral";
}

interface PriceMetrics {
  avgPriceFloor: number;
  avgPriceCeiling: number;
  avgSweetSpot: number;
  avgCurrentPrice: number;
  potentialUplift: number;
}

const PriceIntelligenceDashboard = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [wtpData, setWtpData] = useState<WTPBandwidth[]>([]);
  const [elasticityData, setElasticityData] = useState<ElasticityData[]>([]);
  const [metrics, setMetrics] = useState<PriceMetrics | null>(null);

  const loadPriceIntelligence = useCallback(async () => {
    if (!tenant) return;

    try {
      const { data: analyses } = await supabase
        .from("analysis_results")
        .select(`
          *,
          personas(name, avatar_emoji),
          products(name, price)
        `)
        .eq("tenant_id", tenant.id);

      if (!analyses || analyses.length === 0) {
        setLoading(false);
        return;
      }

      const personaGroups: Record<string, any[]> = {};
      analyses.forEach((a: any) => {
        const personaId = a.persona_id;
        if (!personaGroups[personaId]) personaGroups[personaId] = [];
        personaGroups[personaId].push(a);
      });

      const wtpBandwidths: WTPBandwidth[] = [];
      const elasticities: ElasticityData[] = [];

      Object.entries(personaGroups).forEach(([_, analyses]) => {
        const first = analyses[0];
        if (!first.personas) return;

        const floors = analyses.map((a) => a.price_floor).filter(Boolean);
        const ceilings = analyses.map((a) => a.price_ceiling).filter(Boolean);
        const sweetSpots = analyses.map((a) => a.price_sweet_spot).filter(Boolean);
        const prices = analyses.map((a) => (a.products as any)?.price).filter(Boolean);
        const elasticity = analyses.map((a) => a.price_elasticity).filter(Boolean);

        const avgFloor = floors.length ? floors.reduce((a, b) => a + b, 0) / floors.length : 0;
        const avgCeiling = ceilings.length ? ceilings.reduce((a, b) => a + b, 0) / ceilings.length : 0;
        const avgSweetSpot = sweetSpots.length ? sweetSpots.reduce((a, b) => a + b, 0) / sweetSpots.length : 0;
        const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
        const avgElasticity = elasticity.length ? elasticity.reduce((a, b) => a + b, 0) / elasticity.length : 1;

        wtpBandwidths.push({
          personaName: (first.personas as any).name,
          personaEmoji: (first.personas as any).avatar_emoji || "👤",
          floor: Math.round(avgFloor),
          sweetSpot: Math.round(avgSweetSpot),
          ceiling: Math.round(avgCeiling),
          currentAvgPrice: Math.round(avgPrice),
        });

        const upwardSensitivity = Math.abs(avgElasticity) * 1.2;
        const downwardSensitivity = Math.abs(avgElasticity) * 0.8;
        const asymmetryRatio = upwardSensitivity / downwardSensitivity;

        elasticities.push({
          personaName: (first.personas as any).name,
          personaEmoji: (first.personas as any).avatar_emoji || "👤",
          avgElasticity: Math.abs(avgElasticity),
          upwardSensitivity,
          downwardSensitivity,
          asymmetry:
            asymmetryRatio > 1.3 ? "price-sensitive" : asymmetryRatio < 0.7 ? "quality-seeker" : "neutral",
        });
      });

      setWtpData(wtpBandwidths);
      setElasticityData(elasticities);

      if (wtpBandwidths.length > 0) {
        const avgFloor = wtpBandwidths.reduce((a, b) => a + b.floor, 0) / wtpBandwidths.length;
        const avgCeiling = wtpBandwidths.reduce((a, b) => a + b.ceiling, 0) / wtpBandwidths.length;
        const avgSweetSpot = wtpBandwidths.reduce((a, b) => a + b.sweetSpot, 0) / wtpBandwidths.length;
        const avgCurrent = wtpBandwidths.reduce((a, b) => a + b.currentAvgPrice, 0) / wtpBandwidths.length;
        const uplift = avgCurrent > 0 ? ((avgSweetSpot - avgCurrent) / avgCurrent) * 100 : 0;

        setMetrics({
          avgPriceFloor: Math.round(avgFloor),
          avgPriceCeiling: Math.round(avgCeiling),
          avgSweetSpot: Math.round(avgSweetSpot),
          avgCurrentPrice: Math.round(avgCurrent),
          potentialUplift: Math.round(uplift),
        });
      }
    } catch (error) {
      console.error("Error loading price intelligence:", error);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      loadPriceIntelligence();
    }
  }, [tenant, loadPriceIntelligence]);

  const chartConfig = {
    floor: { label: "Price Floor", color: "hsl(47, 95%, 52%)" },
    sweetSpot: { label: "Sweet Spot", color: "hsl(142, 71%, 45%)" },
    ceiling: { label: "Price Ceiling", color: "hsl(339, 80%, 55%)" },
    currentAvgPrice: { label: "Current Price", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Price Floor
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics?.avgPriceFloor || 0}</div>
            <p className="text-xs text-muted-foreground">Minimum acceptable</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Sweet Spot
            </CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics?.avgSweetSpot || 0}</div>
            <p className="text-xs text-muted-foreground">Optimal pricing</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Price Ceiling
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics?.avgPriceCeiling || 0}</div>
            <p className="text-xs text-muted-foreground">Maximum tolerable</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Price Opportunity
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.potentialUplift && metrics.potentialUplift !== 0
                ? `${metrics.potentialUplift > 0 ? "+" : ""}${metrics.potentialUplift}%`
                : "Optimal"}
            </div>
            <p className="text-xs text-muted-foreground">vs. current pricing</p>
          </CardContent>
        </Card>
      </div>

      {/* WTP Bandwidth Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Willingness-to-Pay Bandwidth
          </CardTitle>
          <CardDescription>
            Price floor, sweet spot, and ceiling by persona segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wtpData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[350px] w-full">
              <ComposedChart
                data={wtpData}
                layout="vertical"
                margin={{ left: 30, right: 30, top: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis type="number" tickFormatter={(v) => `₹${v}`} />
                <YAxis
                  type="category"
                  dataKey="personaName"
                  width={120}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v, i) => `${wtpData[i]?.personaEmoji || ""} ${v}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `₹${value}`,
                        name === "floor"
                          ? "Floor"
                          : name === "sweetSpot"
                          ? "Sweet Spot"
                          : name === "ceiling"
                          ? "Ceiling"
                          : "Current Price",
                      ]}
                    />
                  }
                />
                <Bar dataKey="floor" fill="hsl(47, 95%, 52%)" radius={[4, 0, 0, 4]} barSize={20} />
                <Bar dataKey="sweetSpot" fill="hsl(142, 71%, 45%)" barSize={20} />
                <Bar dataKey="ceiling" fill="hsl(339, 80%, 55%)" radius={[0, 4, 4, 0]} barSize={20} />
                <Line
                  type="monotone"
                  dataKey="currentAvgPrice"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </ComposedChart>
            </ChartContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Analyze products to see willingness-to-pay data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Elasticity Asymmetry */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Price Elasticity Asymmetry
          </CardTitle>
          <CardDescription>
            Sensitivity to price increases vs. decreases by persona
          </CardDescription>
        </CardHeader>
        <CardContent>
          {elasticityData.length > 0 ? (
            <div className="space-y-6">
              {elasticityData.map((persona) => (
                <div key={persona.personaName} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{persona.personaEmoji}</span>
                      <span className="font-medium">{persona.personaName}</span>
                      <Badge
                        variant={
                          persona.asymmetry === "price-sensitive"
                            ? "destructive"
                            : persona.asymmetry === "quality-seeker"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {persona.asymmetry === "price-sensitive"
                          ? "Price Sensitive"
                          : persona.asymmetry === "quality-seeker"
                          ? "Quality Seeker"
                          : "Neutral"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Elasticity: {persona.avgElasticity.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Increase Impact</span>
                        <span className="text-red-500 font-medium">
                          -{Math.round(persona.upwardSensitivity * 10)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(persona.upwardSensitivity * 50, 100)}
                        className="h-2 bg-red-100 [&>div]:bg-red-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price Decrease Gain</span>
                        <span className="text-green-500 font-medium">
                          +{Math.round(persona.downwardSensitivity * 10)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(persona.downwardSensitivity * 50, 100)}
                        className="h-2 bg-green-100 [&>div]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Analyze products to see elasticity data</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceIntelligenceDashboard;
