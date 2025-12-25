import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";

interface AnalyticsChartsProps {
  topProducts: { id: string; name: string; avgScore: number }[];
  personaPerformance: { name: string; avgScore: number; emoji: string }[];
}

const AnalyticsCharts = ({ topProducts, personaPerformance }: AnalyticsChartsProps) => {
  const productChartConfig = {
    avgScore: {
      label: "Match Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const personaChartConfig = {
    avgScore: {
      label: "Match Score",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  const pieColors = [
    "hsl(var(--primary))",
    "hsl(221, 83%, 53%)",
    "hsl(142, 71%, 45%)",
    "hsl(47, 95%, 52%)",
    "hsl(262, 83%, 58%)",
    "hsl(339, 80%, 55%)",
  ];

  const productData = topProducts.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    avgScore: Math.round(p.avgScore),
  }));

  const personaData = personaPerformance.map((p) => ({
    name: `${p.emoji} ${p.name}`,
    value: Math.round(p.avgScore),
  }));

  // Simulated trend data for demo
  const trendData = [
    { month: "Jan", products: 5, personas: 3, avgScore: 65 },
    { month: "Feb", products: 8, personas: 4, avgScore: 68 },
    { month: "Mar", products: 12, personas: 5, avgScore: 72 },
    { month: "Apr", products: 15, personas: 5, avgScore: 75 },
    { month: "May", products: 20, personas: 6, avgScore: 78 },
    { month: "Jun", products: 25, personas: 6, avgScore: 82 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Product Performance Bar Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Product Match Scores</CardTitle>
          <CardDescription>Top products by average persona match</CardDescription>
        </CardHeader>
        <CardContent>
          {productData.length > 0 ? (
            <ChartContainer config={productChartConfig} className="h-[250px] w-full">
              <BarChart data={productData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent formatter={(value) => `${value}%`} />} 
                />
                <Bar 
                  dataKey="avgScore" 
                  fill="hsl(var(--primary))" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              Analyze products to see performance data
            </div>
          )}
        </CardContent>
      </Card>

      {/* Persona Distribution Pie Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Persona Distribution</CardTitle>
          <CardDescription>Average match scores by persona</CardDescription>
        </CardHeader>
        <CardContent>
          {personaData.length > 0 ? (
            <ChartContainer config={personaChartConfig} className="h-[250px] w-full">
              <PieChart>
                <ChartTooltip 
                  content={<ChartTooltipContent formatter={(value) => `${value}%`} />} 
                />
                <Pie
                  data={personaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${value}%`}
                  labelLine={false}
                >
                  {personaData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value: string) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
              Generate personas to see distribution
            </div>
          )}
        </CardContent>
      </Card>

      {/* Growth Trend Area Chart */}
      <Card className="border-border/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Growth Trend</CardTitle>
          <CardDescription>Products, personas, and average match score over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              products: { label: "Products", color: "hsl(var(--primary))" },
              personas: { label: "Personas", color: "hsl(221, 83%, 53%)" },
              avgScore: { label: "Avg Score", color: "hsl(142, 71%, 45%)" },
            }} 
            className="h-[300px] w-full"
          >
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="products"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.3)"
              />
              <Area
                type="monotone"
                dataKey="personas"
                stackId="2"
                stroke="hsl(221, 83%, 53%)"
                fill="hsl(221, 83%, 53% / 0.3)"
              />
              <Line
                type="monotone"
                dataKey="avgScore"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 71%, 45%)" }}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;
