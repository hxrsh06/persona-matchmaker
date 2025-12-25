import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, TrendingUp, Target, Users, Package, Palette, DollarSign } from "lucide-react";
import AnalyticsCharts from "@/components/analytics/AnalyticsCharts";
import WhatIfSimulator from "@/components/analytics/WhatIfSimulator";
import StyleClusterAnalytics from "@/components/analytics/StyleClusterAnalytics";
import PriceIntelligenceDashboard from "@/components/analytics/PriceIntelligenceDashboard";
import PersonaDeepDive from "@/components/analytics/PersonaDeepDive";
import AIInsightsPanel from "@/components/analytics/AIInsightsPanel";

interface AnalyticsSummary {
  totalProducts: number;
  analyzedProducts: number;
  totalPersonas: number;
  totalAnalyses: number;
  avgLikeProbability: number;
  avgPriceDelta: number;
  topPerformingProducts: { id: string; name: string; avgScore: number }[];
  personaPerformance: { name: string; avgScore: number; emoji: string }[];
}

const Analytics = () => {
  const { tenant } = useTenant();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const loadProducts = useCallback(async () => {
    if (!tenant) return;
    
    const { data } = await supabase
      .from("products")
      .select("id, name")
      .eq("tenant_id", tenant.id)
      .eq("status", "analyzed")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }, [tenant]);

  const loadAnalytics = useCallback(async () => {
    if (!tenant) return;

    try {
      const [productsRes, personasRes, analysisRes] = await Promise.all([
        supabase.from("products").select("id, name, price, status").eq("tenant_id", tenant.id),
        supabase.from("personas").select("id, name, avatar_emoji").eq("tenant_id", tenant.id).eq("is_active", true),
        supabase.from("analysis_results").select("*, personas(name, avatar_emoji), products(name, price)").eq("tenant_id", tenant.id),
      ]);

      const products = productsRes.data || [];
      const personas = personasRes.data || [];
      const analyses = analysisRes.data || [];

      const avgLike = analyses.length
        ? analyses.reduce((a, b) => a + (b.like_probability || 0), 0) / analyses.length
        : 0;

      const priceDelta = analyses.length
        ? analyses.reduce((a, b) => {
            const productPrice = (b.products as any)?.price || 0;
            const sweetSpot = b.price_sweet_spot || productPrice;
            return a + (sweetSpot - productPrice);
          }, 0) / analyses.length
        : 0;

      const productScores: Record<string, { name: string; scores: number[] }> = {};
      analyses.forEach((a: any) => {
        const pid = a.product_id;
        if (!productScores[pid]) {
          productScores[pid] = { name: a.products?.name || "Unknown", scores: [] };
        }
        productScores[pid].scores.push(a.like_probability);
      });

      const topProducts = Object.entries(productScores)
        .map(([id, data]) => ({
          id,
          name: data.name,
          avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 5);

      const personaScores: Record<string, { name: string; emoji: string; scores: number[] }> = {};
      analyses.forEach((a: any) => {
        const pid = a.persona_id;
        if (!personaScores[pid]) {
          personaScores[pid] = { 
            name: a.personas?.name || "Unknown", 
            emoji: a.personas?.avatar_emoji || "👤",
            scores: [] 
          };
        }
        personaScores[pid].scores.push(a.like_probability);
      });

      const personaPerformance = Object.values(personaScores)
        .map((data) => ({
          name: data.name,
          emoji: data.emoji,
          avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        }))
        .sort((a, b) => b.avgScore - a.avgScore);

      setSummary({
        totalProducts: products.length,
        analyzedProducts: products.filter((p) => p.status === "analyzed").length,
        totalPersonas: personas.length,
        totalAnalyses: analyses.length,
        avgLikeProbability: Math.round(avgLike),
        avgPriceDelta: Math.round(priceDelta),
        topPerformingProducts: topProducts,
        personaPerformance,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      loadAnalytics();
      loadProducts();
    }
  }, [tenant, loadAnalytics, loadProducts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Analyzed Products",
      value: `${summary?.analyzedProducts || 0} / ${summary?.totalProducts || 0}`,
      icon: Package,
    },
    {
      title: "Active Personas",
      value: summary?.totalPersonas || 0,
      icon: Users,
    },
    {
      title: "Avg. Match Score",
      value: `${summary?.avgLikeProbability || 0}%`,
      description: "Across all analyses",
      icon: TrendingUp,
    },
    {
      title: "Avg. Price Delta",
      value: summary?.avgPriceDelta && summary.avgPriceDelta !== 0
        ? `${summary.avgPriceDelta > 0 ? "+" : ""}₹${summary.avgPriceDelta}`
        : "Optimal",
      description: "From sweet spot",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Performance insights, price intelligence, and AI-powered recommendations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Style & Trends</span>
          </TabsTrigger>
          <TabsTrigger value="price" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Price Intel</span>
          </TabsTrigger>
          <TabsTrigger value="personas" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Personas</span>
          </TabsTrigger>
          <TabsTrigger value="simulations" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Simulations</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <Card key={card.title} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  {card.description && (
                    <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Top Performing Products
                </CardTitle>
                <CardDescription>Highest average persona match scores</CardDescription>
              </CardHeader>
              <CardContent>
                {summary?.topPerformingProducts && summary.topPerformingProducts.length > 0 ? (
                  <div className="space-y-3">
                    {summary.topPerformingProducts.map((product, i) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                        </div>
                        <Badge variant="secondary">{Math.round(product.avgScore)}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No analyzed products yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Persona Performance */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Persona Performance
                </CardTitle>
                <CardDescription>Average match scores by persona</CardDescription>
              </CardHeader>
              <CardContent>
                {summary?.personaPerformance && summary.personaPerformance.length > 0 ? (
                  <div className="space-y-3">
                    {summary.personaPerformance.map((persona) => (
                      <div key={persona.name} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {persona.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{persona.name}</p>
                        </div>
                        <Badge variant="secondary">{Math.round(persona.avgScore)}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No persona data yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <AnalyticsCharts 
            topProducts={summary?.topPerformingProducts || []}
            personaPerformance={summary?.personaPerformance || []}
          />

          {/* AI Insights Panel */}
          <AIInsightsPanel />
        </TabsContent>

        {/* Style & Trends Tab */}
        <TabsContent value="style" className="space-y-6">
          <StyleClusterAnalytics />
        </TabsContent>

        {/* Price Intelligence Tab */}
        <TabsContent value="price" className="space-y-6">
          <PriceIntelligenceDashboard />
        </TabsContent>

        {/* Personas Tab */}
        <TabsContent value="personas" className="space-y-6">
          <PersonaDeepDive />
        </TabsContent>

        {/* Simulations Tab */}
        <TabsContent value="simulations" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                What-If Price Simulator
              </CardTitle>
              <CardDescription>
                Explore how price changes affect persona match probabilities and expected revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Select a product to simulate" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedProduct && <WhatIfSimulator productId={selectedProduct} />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
