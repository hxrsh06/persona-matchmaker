import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Users, BarChart3, TrendingUp, ArrowRight, Zap } from "lucide-react";

interface DashboardStats {
  productCount: number;
  personaCount: number;
  analysisCount: number;
  avgLikeProbability: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!tenant) return;

    try {
      const [productsRes, personasRes, analysisRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id),
        supabase.from("personas").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id).eq("is_active", true),
        supabase.from("analysis_results").select("like_probability").eq("tenant_id", tenant.id),
      ]);

      const avgLike = analysisRes.data?.length 
        ? analysisRes.data.reduce((a, b) => a + (b.like_probability || 0), 0) / analysisRes.data.length 
        : 0;

      setStats({
        productCount: productsRes.count || 0,
        personaCount: personasRes.count || 0,
        analysisCount: analysisRes.data?.length || 0,
        avgLikeProbability: Math.round(avgLike),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      loadStats();
    }
  }, [tenant, loadStats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Products",
      value: stats?.productCount || 0,
      description: "Total products uploaded",
      icon: Package,
      href: "/dashboard/products",
    },
    {
      title: "Personas",
      value: stats?.personaCount || 0,
      description: "Active consumer personas",
      icon: Users,
      href: "/dashboard/personas",
    },
    {
      title: "Analyses",
      value: stats?.analysisCount || 0,
      description: "Product-persona matches",
      icon: BarChart3,
      href: "/dashboard/analytics",
    },
    {
      title: "Avg. Match",
      value: `${stats?.avgLikeProbability || 0}%`,
      description: "Average like probability",
      icon: TrendingUp,
      href: "/dashboard/analytics",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to {tenant?.name || "Dashboard"}</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered product-persona matching analytics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card 
            key={card.title}
            className="cursor-pointer hover:shadow-md transition-shadow border-border/50"
            onClick={() => navigate(card.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate("/dashboard/products")}
            >
              Upload a new product
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate("/dashboard/personas")}
            >
              View consumer personas
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate("/dashboard/analytics")}
            >
              Explore analytics
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>The SWIRL process</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">1</span>
                <span><strong>Upload products</strong> — Add product images and metadata</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">2</span>
                <span><strong>AI extraction</strong> — We analyze features automatically</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">3</span>
                <span><strong>Persona matching</strong> — Score against 5+ consumer profiles</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background text-xs font-medium">4</span>
                <span><strong>Price optimization</strong> — Get optimal pricing per persona</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
