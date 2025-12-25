import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Users, Sparkles, Target } from "lucide-react";

interface PersonaData {
  id: string;
  name: string;
  emoji: string;
  demographics: any;
  psychographics: any;
  priceBehavior: any;
  avgMatchScore: number;
}

interface CategoryAffinity {
  category: string;
  personas: { name: string; emoji: string; score: number }[];
}

interface StylePreference {
  attribute: string;
  value: number;
}

const PersonaDeepDive = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [personas, setPersonas] = useState<PersonaData[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [categoryAffinities, setCategoryAffinities] = useState<CategoryAffinity[]>([]);
  const [stylePreferences, setStylePreferences] = useState<StylePreference[]>([]);

  const loadPersonaStylePreferences = useCallback(() => {
    const persona = personas.find((p) => p.id === selectedPersona);
    if (!persona) return;

    const psycho = persona.psychographics || {};
    const price = persona.priceBehavior || {};

    const preferences: StylePreference[] = [
      { attribute: "Quality Focus", value: psycho.quality_importance || 70 },
      { attribute: "Brand Consciousness", value: psycho.brand_importance || 50 },
      { attribute: "Price Sensitivity", value: price.price_sensitivity ? price.price_sensitivity * 20 : 60 },
      { attribute: "Trend Following", value: psycho.trend_awareness || 40 },
      { attribute: "Sustainability", value: psycho.sustainability_concern || 30 },
      { attribute: "Impulse Buying", value: psycho.impulse_tendency || 45 },
    ];

    setStylePreferences(preferences);
  }, [personas, selectedPersona]);

  const loadPersonaData = useCallback(async () => {
    if (!tenant) return;

    try {
      const [personasRes, analysesRes, productsRes] = await Promise.all([
        supabase
          .from("personas")
          .select("*")
          .eq("tenant_id", tenant.id)
          .eq("is_active", true),
        supabase
          .from("analysis_results")
          .select("persona_id, product_id, like_probability")
          .eq("tenant_id", tenant.id),
        supabase.from("products").select("id, category").eq("tenant_id", tenant.id),
      ]);

      const personasData = personasRes.data || [];
      const analyses = analysesRes.data || [];
      const products = productsRes.data || [];

      const productCategoryMap: Record<string, string> = {};
      products.forEach((p) => {
        productCategoryMap[p.id] = p.category;
      });

      const personaMetrics: PersonaData[] = personasData.map((p: any) => {
        const personaAnalyses = analyses.filter((a) => a.persona_id === p.id);
        const avgScore = personaAnalyses.length
          ? personaAnalyses.reduce((a, b) => a + b.like_probability, 0) / personaAnalyses.length
          : 0;

        return {
          id: p.id,
          name: p.name,
          emoji: p.avatar_emoji || "👤",
          demographics: p.demographics,
          psychographics: p.psychographics,
          priceBehavior: p.price_behavior,
          avgMatchScore: Math.round(avgScore),
        };
      });

      setPersonas(personaMetrics);
      if (personaMetrics.length > 0) {
        setSelectedPersona(personaMetrics[0].id);
      }

      const categories = [...new Set(products.map((p) => p.category))];
      const affinities: CategoryAffinity[] = categories.map((category) => {
        const categoryProducts = products.filter((p) => p.category === category).map((p) => p.id);
        const personaScores = personaMetrics.map((persona) => {
          const personaCategoryAnalyses = analyses.filter(
            (a) => a.persona_id === persona.id && categoryProducts.includes(a.product_id)
          );
          const score = personaCategoryAnalyses.length
            ? personaCategoryAnalyses.reduce((a, b) => a + b.like_probability, 0) /
              personaCategoryAnalyses.length
            : 0;
          return { name: persona.name, emoji: persona.emoji, score: Math.round(score) };
        });

        return { category, personas: personaScores };
      });

      setCategoryAffinities(affinities);
    } catch (error) {
      console.error("Error loading persona data:", error);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    if (tenant) {
      loadPersonaData();
    }
  }, [tenant, loadPersonaData]);

  useEffect(() => {
    if (selectedPersona && personas.length > 0) {
      loadPersonaStylePreferences();
    }
  }, [selectedPersona, personas, loadPersonaStylePreferences]);

  const chartConfig = {
    value: { label: "Score", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  const getAffinityColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  const selectedPersonaData = personas.find((p) => p.id === selectedPersona);

  return (
    <div className="space-y-6">
      {/* Persona Selector */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Persona Deep Dive
          </CardTitle>
          <CardDescription>Select a persona to explore detailed analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedPersonaData && (
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg py-1 px-3">
                  {selectedPersonaData.emoji}
                </Badge>
                <div>
                  <p className="font-semibold">{selectedPersonaData.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Avg Match: {selectedPersonaData.avgMatchScore}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Style Preferences Radar */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-primary" />
              Style Preferences
            </CardTitle>
            <CardDescription>Behavioral attributes radar chart</CardDescription>
          </CardHeader>
          <CardContent>
            {stylePreferences.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[350px] w-full">
                <RadarChart data={stylePreferences} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid className="stroke-border/50" />
                  <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                Select a persona to see style preferences
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Affinity Heatmap */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-primary" />
              Persona-Category Affinity
            </CardTitle>
            <CardDescription>Match scores by category and persona</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryAffinities.length > 0 && personas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-medium">Category</th>
                      {personas.map((p) => (
                        <th key={p.id} className="text-center p-2 font-medium">
                          <span title={p.name}>{p.emoji}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryAffinities.map((affinity) => (
                      <tr key={affinity.category} className="border-t border-border/50">
                        <td className="p-2 font-medium">{affinity.category}</td>
                        {affinity.personas.map((p, i) => (
                          <td key={i} className="p-2 text-center">
                            <div
                              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xs font-semibold text-white ${getAffinityColor(
                                p.score
                              )}`}
                              title={`${p.name}: ${p.score}%`}
                            >
                              {p.score}%
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                Analyze products to see category affinities
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Persona Comparison */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Persona Comparison</CardTitle>
          <CardDescription>Side-by-side comparison of all personas</CardDescription>
        </CardHeader>
        <CardContent>
          {personas.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {personas.map((persona) => (
                <div
                  key={persona.id}
                  className={`p-4 rounded-lg border transition-all ${
                    persona.id === selectedPersona
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                  onClick={() => setSelectedPersona(persona.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{persona.emoji}</span>
                    <div>
                      <p className="font-semibold">{persona.name}</p>
                      <Badge variant="secondary">{persona.avgMatchScore}% avg match</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {persona.demographics?.age_range && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age Range</span>
                        <span>{persona.demographics.age_range}</span>
                      </div>
                    )}
                    {persona.demographics?.income_bracket && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Income</span>
                        <span>{persona.demographics.income_bracket}</span>
                      </div>
                    )}
                    {persona.priceBehavior?.price_sensitivity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price Sensitivity</span>
                        <span>{persona.priceBehavior.price_sensitivity}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
              Generate personas to see comparison data
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaDeepDive;
