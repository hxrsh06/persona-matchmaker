import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, RefreshCw, Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react";

interface Insight {
  type: "opportunity" | "warning" | "trend" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
}

interface InsightsData {
  insights: Insight[];
  generatedAt: string;
  summary: string;
}

const AIInsightsPanel = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);

  useEffect(() => {
    if (tenant) {
      loadCachedInsights();
    }
  }, [tenant]);

  const loadCachedInsights = async () => {
    if (!tenant) return;

    try {
      // Try to load from analytics_snapshots
      const { data } = await supabase
        .from("analytics_snapshots")
        .select("metrics")
        .eq("tenant_id", tenant.id)
        .order("snapshot_date", { ascending: false })
        .limit(1)
        .single();

      if (data?.metrics && (data.metrics as any).ai_insights) {
        setInsightsData((data.metrics as any).ai_insights);
      }
    } catch (error) {
      // No cached insights, that's okay
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!tenant) return;
    setGenerating(true);

    try {
      const response = await supabase.functions.invoke("generate-analytics-insights", {
        body: { tenantId: tenant.id },
      });

      if (response.error) throw response.error;

      setInsightsData(response.data);

      toast({
        title: "Insights generated",
        description: "AI analysis complete",
      });
    } catch (error: any) {
      toast({
        title: "Failed to generate insights",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "opportunity":
        return <Target className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "trend":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
    }
  };

  const getImpactColor = (impact: Insight["impact"]) => {
    switch (impact) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Intelligent analysis of your product and persona data
            </CardDescription>
          </div>
          <Button onClick={generateInsights} disabled={generating}>
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insightsData ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm leading-relaxed">{insightsData.summary}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Generated: {new Date(insightsData.generatedAt).toLocaleString()}
              </p>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
              {insightsData.insights.map((insight, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-border/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <span className="font-medium">{insight.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      <Badge variant={getImpactColor(insight.impact)} className="text-xs">
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              No insights generated yet. Click the button above to analyze your data.
            </p>
            <Button onClick={generateInsights} disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate First Insights
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
