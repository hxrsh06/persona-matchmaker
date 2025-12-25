import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Palette, TrendingUp, Layers } from "lucide-react";

interface StyleCluster {
  name: string;
  count: number;
  avgMatchScore: number;
  avgPrice: number;
  color: string;
}

interface ProductStyleData {
  id: string;
  name: string;
  category: string;
  price: number;
  extractedFeatures: {
    fit?: string;
    style?: string;
    occasion?: string[];
    fabric?: string;
    pattern?: string;
  };
  avgMatchScore: number;
}

const STYLE_CLUSTERS = [
  { name: "Minimal", keywords: ["minimal", "simple", "clean", "basic", "solid"], color: "hsl(var(--primary))" },
  { name: "Streetwear", keywords: ["street", "urban", "graphic", "oversized", "hip"], color: "hsl(221, 83%, 53%)" },
  { name: "Athleisure", keywords: ["sport", "athletic", "gym", "active", "performance"], color: "hsl(142, 71%, 45%)" },
  { name: "Ethnic Fusion", keywords: ["ethnic", "traditional", "indian", "kurta", "festive"], color: "hsl(47, 95%, 52%)" },
  { name: "Romantic", keywords: ["floral", "feminine", "soft", "delicate", "elegant"], color: "hsl(339, 80%, 55%)" },
  { name: "Techwear", keywords: ["tech", "functional", "utility", "modern", "futuristic"], color: "hsl(262, 83%, 58%)" },
];

const StyleClusterAnalytics = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState<StyleCluster[]>([]);
  const [productsByCluster, setProductsByCluster] = useState<Record<string, ProductStyleData[]>>({});

  useEffect(() => {
    if (tenant) {
      loadStyleAnalytics();
    }
  }, [tenant]);

  const classifyProduct = (product: any): string => {
    const features = product.extracted_features || {};
    const searchText = [
      features.fit,
      features.style,
      features.pattern,
      features.fabric,
      ...(features.occasion || []),
      product.description,
      product.category,
      product.subcategory,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    for (const cluster of STYLE_CLUSTERS) {
      if (cluster.keywords.some((kw) => searchText.includes(kw))) {
        return cluster.name;
      }
    }
    return "Minimal"; // Default fallback
  };

  const loadStyleAnalytics = async () => {
    if (!tenant) return;

    try {
      // Fetch products with their analysis results
      const { data: products } = await supabase
        .from("products")
        .select("id, name, category, subcategory, price, description, extracted_features")
        .eq("tenant_id", tenant.id)
        .eq("status", "analyzed");

      const { data: analyses } = await supabase
        .from("analysis_results")
        .select("product_id, like_probability")
        .eq("tenant_id", tenant.id);

      if (!products) {
        setLoading(false);
        return;
      }

      // Calculate average match score per product
      const productScores: Record<string, number[]> = {};
      analyses?.forEach((a) => {
        if (!productScores[a.product_id]) productScores[a.product_id] = [];
        productScores[a.product_id].push(a.like_probability);
      });

      // Classify and group products
      const grouped: Record<string, ProductStyleData[]> = {};
      STYLE_CLUSTERS.forEach((c) => (grouped[c.name] = []));

      products.forEach((p) => {
        const cluster = classifyProduct(p);
        const scores = productScores[p.id] || [];
        const avgScore = scores.length
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

        grouped[cluster]?.push({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          extractedFeatures: p.extracted_features as any,
          avgMatchScore: avgScore,
        });
      });

      setProductsByCluster(grouped);

      // Calculate cluster metrics
      const clusterMetrics = STYLE_CLUSTERS.map((c) => {
        const prods = grouped[c.name] || [];
        const avgMatch = prods.length
          ? prods.reduce((a, b) => a + b.avgMatchScore, 0) / prods.length
          : 0;
        const avgPrice = prods.length
          ? prods.reduce((a, b) => a + b.price, 0) / prods.length
          : 0;

        return {
          name: c.name,
          count: prods.length,
          avgMatchScore: Math.round(avgMatch),
          avgPrice: Math.round(avgPrice),
          color: c.color,
        };
      });

      setClusters(clusterMetrics);
    } catch (error) {
      console.error("Error loading style analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartConfig = {
    avgMatchScore: { label: "Match Score", color: "hsl(var(--primary))" },
    count: { label: "Products", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[300px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[250px]" />
        </div>
      </div>
    );
  }

  const activeClsuters = clusters.filter((c) => c.count > 0);
  const totalProducts = clusters.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Style Clusters
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClsuters.length}</div>
            <p className="text-xs text-muted-foreground">of {STYLE_CLUSTERS.length} active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Performing Style
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeClsuters.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {[...activeClsuters].sort((a, b) => b.avgMatchScore - a.avgMatchScore)[0]?.name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {[...activeClsuters].sort((a, b) => b.avgMatchScore - a.avgMatchScore)[0]?.avgMatchScore}% avg match
                </p>
              </>
            ) : (
              <div className="text-muted-foreground">No data</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Classified
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">products categorized</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cluster Performance Bar Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Style Cluster Performance</CardTitle>
            <CardDescription>Average match score by aesthetic cluster</CardDescription>
          </CardHeader>
          <CardContent>
            {activeClsuters.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart
                  data={activeClsuters.sort((a, b) => b.avgMatchScore - a.avgMatchScore)}
                  layout="vertical"
                  margin={{ left: 20, right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          `${value}%`,
                          name === "avgMatchScore" ? "Match Score" : name,
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="avgMatchScore" radius={[0, 4, 4, 0]}>
                    {activeClsuters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Analyze products to see style performance
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cluster Distribution Pie Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Style Distribution</CardTitle>
            <CardDescription>Product count by aesthetic cluster</CardDescription>
          </CardHeader>
          <CardContent>
            {activeClsuters.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [`${value} products`, name]}
                      />
                    }
                  />
                  <Pie
                    data={activeClsuters}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, count }) => `${name}: ${count}`}
                    labelLine={false}
                  >
                    {activeClsuters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                Analyze products to see distribution
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cluster Details */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Cluster Breakdown</CardTitle>
          <CardDescription>Detailed metrics per style cluster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clusters.map((cluster) => (
              <div
                key={cluster.name}
                className="p-4 rounded-lg border border-border/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <span className="font-medium">{cluster.name}</span>
                  </div>
                  <Badge variant="secondary">{cluster.count} products</Badge>
                </div>
                {cluster.count > 0 ? (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Match</p>
                      <p className="font-semibold">{cluster.avgMatchScore}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Price</p>
                      <p className="font-semibold">₹{cluster.avgPrice}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No products in this cluster</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleClusterAnalytics;
