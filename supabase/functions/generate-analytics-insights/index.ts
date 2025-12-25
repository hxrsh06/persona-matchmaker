import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Insight {
  type: "opportunity" | "warning" | "trend" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // JWT validation
    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization");
    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      return new Response(
        JSON.stringify({ code: 401, message: "Missing JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const jwt = authHeader.split(" ")[1];

    const { tenantId } = await req.json();
    console.log("Generating insights for tenant:", tenantId);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    // Validate user
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ code: 401, message: "Invalid JWT" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check tenant access
    const { data: hasAccess } = await supabase.rpc("has_tenant_access", {
      _tenant_id: tenantId,
      _user_id: userData.user.id,
    });
    if (!hasAccess) {
      return new Response(
        JSON.stringify({ code: 403, message: "Forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all relevant data
    const [productsRes, personasRes, analysesRes] = await Promise.all([
      supabase.from("products").select("*").eq("tenant_id", tenantId),
      supabase.from("personas").select("*").eq("tenant_id", tenantId).eq("is_active", true),
      supabase.from("analysis_results").select("*").eq("tenant_id", tenantId),
    ]);

    const products = productsRes.data || [];
    const personas = personasRes.data || [];
    const analyses = analysesRes.data || [];

    console.log(`Loaded ${products.length} products, ${personas.length} personas, ${analyses.length} analyses`);

    // Generate insights based on data patterns
    const insights: Insight[] = [];

    // Insight 1: Product coverage
    const analyzedProducts = products.filter((p) => p.status === "analyzed").length;
    const coveragePercent = products.length > 0 ? (analyzedProducts / products.length) * 100 : 0;
    
    if (coveragePercent < 50) {
      insights.push({
        type: "warning",
        title: "Low Analysis Coverage",
        description: `Only ${Math.round(coveragePercent)}% of your products have been analyzed. Analyze more products to get comprehensive insights.`,
        impact: "high",
        category: "Coverage",
      });
    } else if (coveragePercent >= 90) {
      insights.push({
        type: "trend",
        title: "Excellent Analysis Coverage",
        description: `${Math.round(coveragePercent)}% of products are analyzed. Your insights are highly representative.`,
        impact: "low",
        category: "Coverage",
      });
    }

    // Insight 2: Price optimization opportunities
    const priceOptimizations = analyses.filter((a) => {
      const product = products.find((p) => p.id === a.product_id);
      if (!product || !a.price_sweet_spot) return false;
      return Math.abs(a.price_sweet_spot - product.price) > product.price * 0.1;
    });

    if (priceOptimizations.length > 0) {
      const avgPotentialUplift = priceOptimizations.reduce((sum, a) => {
        const product = products.find((p) => p.id === a.product_id);
        if (!product) return sum;
        return sum + ((a.price_sweet_spot - product.price) / product.price) * 100;
      }, 0) / priceOptimizations.length;

      insights.push({
        type: "opportunity",
        title: "Price Optimization Potential",
        description: `${priceOptimizations.length} products have significant pricing gaps. Average potential adjustment: ${avgPotentialUplift > 0 ? "+" : ""}${Math.round(avgPotentialUplift)}%.`,
        impact: Math.abs(avgPotentialUplift) > 15 ? "high" : "medium",
        category: "Pricing",
      });
    }

    // Insight 3: Persona engagement variance
    if (personas.length > 1) {
      const personaScores: Record<string, number[]> = {};
      analyses.forEach((a) => {
        if (!personaScores[a.persona_id]) personaScores[a.persona_id] = [];
        personaScores[a.persona_id].push(a.like_probability);
      });

      const avgScores = Object.entries(personaScores).map(([id, scores]) => ({
        id,
        avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      }));

      if (avgScores.length >= 2) {
        const maxScore = Math.max(...avgScores.map((s) => s.avg));
        const minScore = Math.min(...avgScores.map((s) => s.avg));
        const variance = maxScore - minScore;

        if (variance > 20) {
          const topPersona = personas.find((p) => p.id === avgScores.find((s) => s.avg === maxScore)?.id);
          const lowPersona = personas.find((p) => p.id === avgScores.find((s) => s.avg === minScore)?.id);

          insights.push({
            type: "recommendation",
            title: "Persona Engagement Gap",
            description: `${topPersona?.name || "Top persona"} shows ${Math.round(variance)}% higher engagement than ${lowPersona?.name || "lowest persona"}. Consider tailoring assortment.`,
            impact: "high",
            category: "Personas",
          });
        }
      }
    }

    // Insight 4: Category performance
    const categoryScores: Record<string, number[]> = {};
    analyses.forEach((a) => {
      const product = products.find((p) => p.id === a.product_id);
      if (!product) return;
      if (!categoryScores[product.category]) categoryScores[product.category] = [];
      categoryScores[product.category].push(a.like_probability);
    });

    const categoryAvgs = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      avg: scores.reduce((a, b) => a + b, 0) / scores.length,
      count: scores.length,
    }));

    if (categoryAvgs.length > 1) {
      const topCategory = [...categoryAvgs].sort((a, b) => b.avg - a.avg)[0];
      const bottomCategory = [...categoryAvgs].sort((a, b) => a.avg - b.avg)[0];

      if (topCategory && topCategory.avg > 60) {
        insights.push({
          type: "trend",
          title: "Top Performing Category",
          description: `${topCategory.category} leads with ${Math.round(topCategory.avg)}% average match across ${topCategory.count} product-persona combinations.`,
          impact: "medium",
          category: "Categories",
        });
      }

      if (bottomCategory && bottomCategory.avg < 40 && topCategory.category !== bottomCategory.category) {
        insights.push({
          type: "warning",
          title: "Underperforming Category",
          description: `${bottomCategory.category} has only ${Math.round(bottomCategory.avg)}% average match. Review product selection or persona targeting.`,
          impact: "medium",
          category: "Categories",
        });
      }
    }

    // Insight 5: Price elasticity patterns
    const highElasticityCount = analyses.filter((a) => a.price_elasticity && Math.abs(a.price_elasticity) > 1.5).length;
    if (highElasticityCount > analyses.length * 0.3) {
      insights.push({
        type: "warning",
        title: "High Price Sensitivity Detected",
        description: `${Math.round((highElasticityCount / analyses.length) * 100)}% of analyses show high price elasticity. Your audience may be price-conscious.`,
        impact: "high",
        category: "Pricing",
      });
    }

    // Generate summary
    const summary = generateSummary(products.length, personas.length, analyses.length, insights);

    // Cache the insights
    const insightsData = {
      insights,
      generatedAt: new Date().toISOString(),
      summary,
    };

    await supabase.from("analytics_snapshots").upsert({
      tenant_id: tenantId,
      snapshot_date: new Date().toISOString().split("T")[0],
      metrics: { ai_insights: insightsData },
    });

    console.log(`Generated ${insights.length} insights`);

    return new Response(JSON.stringify(insightsData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating insights:", error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateSummary(
  productCount: number,
  personaCount: number,
  analysisCount: number,
  insights: Insight[]
): string {
  const highImpactCount = insights.filter((i) => i.impact === "high").length;
  const opportunities = insights.filter((i) => i.type === "opportunity").length;
  const warnings = insights.filter((i) => i.type === "warning").length;

  let summary = `Based on analysis of ${productCount} products across ${personaCount} personas (${analysisCount} total evaluations), `;

  if (highImpactCount > 0) {
    summary += `we identified ${highImpactCount} high-impact ${highImpactCount === 1 ? "finding" : "findings"}. `;
  }

  if (opportunities > 0) {
    summary += `There ${opportunities === 1 ? "is" : "are"} ${opportunities} growth ${opportunities === 1 ? "opportunity" : "opportunities"} to explore. `;
  }

  if (warnings > 0) {
    summary += `${warnings} ${warnings === 1 ? "area requires" : "areas require"} attention. `;
  }

  if (insights.length === 0) {
    summary = "Not enough data to generate meaningful insights yet. Analyze more products to unlock AI-powered recommendations.";
  }

  return summary.trim();
}
