import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SimulationResult {
  price: number;
  likeProbabilities: { personaId: string; personaName: string; probability: number }[];
  averageProbability: number;
  expectedRevenue: number;
  recommendation: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, tenantId, priceRange, steps = 5 } = await req.json();
    
    if (!productId || !tenantId || !priceRange) {
      throw new Error("Product ID, Tenant ID, and price range are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch product and analysis results
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      throw new Error("Product not found");
    }

    const { data: analysisResults, error: analysisError } = await supabase
      .from("analysis_results")
      .select("*, personas(name)")
      .eq("product_id", productId);

    if (analysisError || !analysisResults?.length) {
      throw new Error("No analysis results found. Analyze the product first.");
    }

    const { minPrice, maxPrice } = priceRange;
    const stepSize = (maxPrice - minPrice) / (steps - 1);
    const simulations: SimulationResult[] = [];

    // Simulate different price points
    for (let i = 0; i < steps; i++) {
      const testPrice = Math.round(minPrice + (stepSize * i));
      const originalPrice = product.price;
      const priceChange = (testPrice - originalPrice) / originalPrice;

      const likeProbabilities = analysisResults.map((result: any) => {
        // Apply elasticity-based adjustment
        const elasticity = result.price_elasticity || -0.5;
        const baseProbability = result.like_probability;
        
        // Calculate adjusted probability based on price change and elasticity
        // Elasticity: % change in demand / % change in price
        const demandChange = elasticity * priceChange;
        const adjustedProbability = Math.max(0, Math.min(100, 
          baseProbability * (1 + demandChange)
        ));

        return {
          personaId: result.persona_id,
          personaName: result.personas?.name || "Unknown",
          probability: Math.round(adjustedProbability * 10) / 10
        };
      });

      const averageProbability = likeProbabilities.reduce((a, b) => a + b.probability, 0) / likeProbabilities.length;
      
      // Simple revenue model: price * probability (as proxy for conversion)
      const expectedRevenue = testPrice * (averageProbability / 100);

      let recommendation = "";
      if (testPrice < product.price * 0.9) {
        recommendation = "Aggressive pricing - may erode margins";
      } else if (testPrice > product.price * 1.1) {
        recommendation = "Premium pricing - may reduce volume";
      } else {
        recommendation = "Optimal range";
      }

      simulations.push({
        price: testPrice,
        likeProbabilities,
        averageProbability: Math.round(averageProbability * 10) / 10,
        expectedRevenue: Math.round(expectedRevenue),
        recommendation
      });
    }

    // Find optimal price point
    const optimalSimulation = simulations.reduce((best, current) => 
      current.expectedRevenue > best.expectedRevenue ? current : best
    );

    // Update analysis results with simulation data
    await supabase
      .from("analysis_results")
      .update({
        what_if_simulations: {
          priceRange,
          simulations,
          optimalPrice: optimalSimulation.price,
          timestamp: new Date().toISOString()
        }
      })
      .eq("product_id", productId);

    // Log the simulation
    await supabase.from("analysis_history").insert({
      tenant_id: tenantId,
      product_id: productId,
      action_type: "what_if",
      input_data: { priceRange, steps },
      results_summary: {
        optimalPrice: optimalSimulation.price,
        optimalProbability: optimalSimulation.averageProbability,
        simulationCount: steps
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        currentPrice: product.price,
        simulations,
        optimal: {
          price: optimalSimulation.price,
          averageProbability: optimalSimulation.averageProbability,
          expectedRevenue: optimalSimulation.expectedRevenue,
          recommendation: optimalSimulation.recommendation
        },
        insights: generateInsights(simulations, product.price)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Simulation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateInsights(simulations: SimulationResult[], currentPrice: number): string[] {
  const insights: string[] = [];
  
  const currentSim = simulations.find(s => s.price === currentPrice);
  const bestSim = simulations.reduce((a, b) => a.expectedRevenue > b.expectedRevenue ? a : b);
  const worstSim = simulations.reduce((a, b) => a.expectedRevenue < b.expectedRevenue ? a : b);
  
  if (bestSim.price !== currentPrice) {
    const diff = bestSim.price - currentPrice;
    insights.push(
      `Optimal price is ₹${bestSim.price} (${diff > 0 ? '+' : ''}₹${diff} from current), potentially ${Math.round((bestSim.expectedRevenue / (currentSim?.expectedRevenue || 1) - 1) * 100)}% better revenue`
    );
  } else {
    insights.push("Current pricing appears optimal for this product");
  }
  
  // Price sensitivity insight
  const highPriceSim = simulations[simulations.length - 1];
  const lowPriceSim = simulations[0];
  const probDrop = lowPriceSim.averageProbability - highPriceSim.averageProbability;
  
  if (probDrop > 20) {
    insights.push("High price sensitivity: consider competitive pricing or value bundles");
  } else if (probDrop < 10) {
    insights.push("Low price sensitivity: opportunity to capture premium positioning");
  }
  
  // Persona-specific insight
  const mostSensitivePersona = simulations[0].likeProbabilities.reduce((most, current, _, arr) => {
    const highPriceProb = simulations[simulations.length - 1].likeProbabilities.find(p => p.personaId === current.personaId)?.probability || 0;
    const sensitivity = current.probability - highPriceProb;
    const mostSensitivity = arr.find(p => p.personaId === most.personaId)?.probability || 0 - 
      (simulations[simulations.length - 1].likeProbabilities.find(p => p.personaId === most.personaId)?.probability || 0);
    return sensitivity > mostSensitivity ? current : most;
  });
  
  insights.push(`${mostSensitivePersona.personaName} is most price-sensitive - consider targeting this segment with promotions`);
  
  return insights;
}
