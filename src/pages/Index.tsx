import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Package, 
  BarChart3, 
  ArrowRight, 
  Target, 
  TrendingUp,
  Zap
} from "lucide-react";
import swirlLogo from "@/assets/swirl-logo.png";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "AI-Generated Personas",
      description: "Create detailed customer personas with demographics, psychographics, and shopping preferences powered by AI.",
    },
    {
      icon: Package,
      title: "Product Analysis",
      description: "Upload products and get instant AI analysis with persona match scores and pricing recommendations.",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Track performance metrics, persona engagement, and product success rates in real-time.",
    },
    {
      icon: Target,
      title: "What-If Simulator",
      description: "Test pricing strategies and see how changes affect persona purchase probability.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={swirlLogo} alt="SWIRL" className="h-6 w-auto" />
            <span className="text-xl font-semibold tracking-tight">SWIRL</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          <Zap className="mr-1 h-3 w-3" />
          AI-Powered Customer Intelligence
        </Badge>
        <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Understand Your Customers
          <br />
          <span className="text-primary">Like Never Before</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Create AI-powered digital twins of your target customers. Analyze products, 
          predict purchase behavior, and optimize pricing strategies with precision.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">Everything You Need</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Powerful tools to understand your customers and optimize your product strategy.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-4xl font-semibold">95%</div>
              <p className="text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-semibold">10K+</div>
              <p className="text-muted-foreground">Products Analyzed</p>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-semibold">500+</div>
              <p className="text-muted-foreground">Brands Trust Us</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-semibold">How It Works</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              1
            </div>
            <h3 className="mb-2 text-xl font-medium">Create Your Brand</h3>
            <p className="text-muted-foreground">
              Set up your brand profile and let AI generate your target customer personas.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              2
            </div>
            <h3 className="mb-2 text-xl font-medium">Upload Products</h3>
            <p className="text-muted-foreground">
              Add your products and get instant AI analysis with persona match scores.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              3
            </div>
            <h3 className="mb-2 text-xl font-medium">Optimize & Grow</h3>
            <p className="text-muted-foreground">
              Use insights to optimize pricing, targeting, and product development.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <TrendingUp className="h-12 w-12" />
            <h2 className="text-3xl font-semibold">Ready to Transform Your Business?</h2>
            <p className="max-w-xl opacity-90">
              Join hundreds of brands using AI-powered customer intelligence to drive growth.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={swirlLogo} alt="SWIRL" className="h-5 w-auto" />
            <span className="font-medium">SWIRL</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2025 SWIRL. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;