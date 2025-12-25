import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder for future chart implementations
const AnalyticsCharts = () => {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Charts will be added here with more data
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCharts;
