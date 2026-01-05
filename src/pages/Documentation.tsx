import { useEffect } from "react";

const Documentation = () => {
  useEffect(() => {
    // Add print-specific styles
    const style = document.createElement("style");
    style.id = "print-styles";
    style.textContent = `
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
        .page-break { page-break-before: always; }
        .print-section { page-break-inside: avoid; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.getElementById("print-styles")?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Print Button */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium shadow-lg hover:opacity-90 transition"
        >
          Export to PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* Cover Page */}
        <section className="text-center py-24 border-b border-border">
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-4xl font-bold mx-auto mb-6">
              S
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">SWIRL</h1>
          <p className="text-xl text-muted-foreground mb-2">
            Apparel Persona Analytics Engine
          </p>
          <p className="text-muted-foreground">Technical Documentation v1.0</p>
          <p className="text-sm text-muted-foreground mt-8">
            Complete Recreation Guide for Lovable
          </p>
        </section>

        {/* Table of Contents */}
        <section className="print-section">
          <h2 className="text-2xl font-semibold mb-6 border-b border-border pb-2">
            Table of Contents
          </h2>
          <nav className="space-y-2 text-muted-foreground">
            <div className="flex justify-between">
              <span>1. Project Overview</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span>2. System Architecture</span>
              <span>4</span>
            </div>
            <div className="flex justify-between">
              <span>3. Database Schema</span>
              <span>6</span>
            </div>
            <div className="flex justify-between">
              <span>4. The 10 Fixed Personas</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>5. Complete Attribute Schema (131+ Fields)</span>
              <span>14</span>
            </div>
            <div className="flex justify-between">
              <span>6. Edge Functions</span>
              <span>20</span>
            </div>
            <div className="flex justify-between">
              <span>7. Frontend Architecture</span>
              <span>24</span>
            </div>
            <div className="flex justify-between">
              <span>8. User Flows</span>
              <span>28</span>
            </div>
            <div className="flex justify-between">
              <span>9. Analytics Metrics Catalog</span>
              <span>30</span>
            </div>
            <div className="flex justify-between">
              <span>10. Implementation Guide</span>
              <span>34</span>
            </div>
          </nav>
        </section>

        {/* Section 1: Project Overview */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">1. Project Overview</h2>

          <div className="bg-muted/30 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">What is SWIRL?</h3>
            <p className="text-muted-foreground">
              SWIRL is an AI-powered Apparel Persona Analytics Engine designed
              for the Indian fashion market. It's a B2B SaaS platform that helps
              fashion brands understand how their products resonate with
              different customer segments through data-driven persona analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">Brand Identity</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Name: SWIRL</li>
                <li>• Font: DM Sans (400-700)</li>
                <li>• Theme: Monochromatic B&W</li>
                <li>• Style: Apple-like minimalist</li>
                <li>• No emojis in UI</li>
              </ul>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium mb-2">Tech Stack</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React 18 + Vite + TypeScript</li>
                <li>• Tailwind CSS + shadcn/ui</li>
                <li>• Supabase (Lovable Cloud)</li>
                <li>• Lovable AI Gateway</li>
                <li>• Recharts for visualization</li>
              </ul>
            </div>
          </div>

          <h3 className="font-semibold mb-4">Core Value Propositions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                title: "AI-Powered Analysis",
                desc: "Automatic product feature extraction and persona matching",
              },
              {
                title: "Fixed Persona Universe",
                desc: "10 locked personas representing the Indian market",
              },
              {
                title: "Price Intelligence",
                desc: "What-if simulations for optimal pricing",
              },
              {
                title: "Multi-Tenant SaaS",
                desc: "Secure isolation for multiple brands",
              },
            ].map((item, i) => (
              <div key={i} className="border border-border/50 rounded p-3">
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: System Architecture */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">2. System Architecture</h2>

          <h3 className="font-semibold mb-4">High-Level Architecture Diagram</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8 font-mono text-sm">
            <pre className="whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Landing   │  │    Auth     │  │  Dashboard  │              │
│  │   Page      │  │   Pages     │  │   Pages     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                │                │                      │
│  ┌──────┴────────────────┴────────────────┴──────┐              │
│  │              React + Vite + TypeScript         │              │
│  │              Tailwind CSS + shadcn/ui          │              │
│  └────────────────────────┬──────────────────────┘              │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE LAYER                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                     Edge Functions                           ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       ││
│  │  │analyze-product│  │ what-if-sim │  │ gen-personas │       ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘       ││
│  │  ┌──────────────┐  ┌──────────────┐                         ││
│  │  │extract-image │  │gen-insights │                          ││
│  │  └──────────────┘  └──────────────┘                         ││
│  └─────────────────────────┬───────────────────────────────────┘│
│                            │                                     │
│  ┌─────────────────────────┴───────────────────────────────────┐│
│  │                    PostgreSQL Database                       ││
│  │  tenants │ profiles │ products │ personas │ analysis_results ││
│  │  user_roles │ persona_analytics │ aggregate_analytics        ││
│  │  style_clusters │ product_style_mappings │ metric_catalog    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐               │
│  │   Auth (Email)      │  │   Storage (Images)  │               │
│  └─────────────────────┘  └─────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AI LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Lovable AI Gateway                              ││
│  │              Model: google/gemini-2.5-flash                  ││
│  │              Tool Calling for Structured Output              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <h3 className="font-semibold mb-4">Data Flow Diagram</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap">
{`User Upload Product
        │
        ▼
┌───────────────────┐
│  Product Created  │──────────────────────────────────────┐
│   (status: pending)│                                      │
└─────────┬─────────┘                                      │
          │                                                │
          ▼                                                │
┌───────────────────┐      ┌───────────────────┐          │
│ Extract Features  │◄────▶│  Lovable AI       │          │
│ (Edge Function)   │      │  Vision Analysis  │          │
└─────────┬─────────┘      └───────────────────┘          │
          │                                                │
          ▼                                                │
┌───────────────────┐                                      │
│ Features Stored   │                                      │
│ (extracted_features)│                                    │
└─────────┬─────────┘                                      │
          │                                                │
          ▼                                                │
┌───────────────────┐      ┌───────────────────┐          │
│ Analyze Product   │◄────▶│  10 Fixed Personas │◄────────┘
│ (Edge Function)   │      │  (131+ attributes) │
└─────────┬─────────┘      └───────────────────┘
          │
          ▼
┌───────────────────┐
│ Score Each Persona│
│ - Like Probability│
│ - Price Bands     │
│ - Match Factors   │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ analysis_results  │
│ (product × persona)│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Display in UI     │
│ - Scores Grid     │
│ - Price Recs      │
│ - What-If Sim     │
└───────────────────┘`}
            </pre>
          </div>
        </section>

        {/* Section 3: Database Schema */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">3. Database Schema</h2>

          <h3 className="font-semibold mb-4">Entity Relationship Diagram</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8 font-mono text-xs">
            <pre className="whitespace-pre-wrap">
{`┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     tenants     │         │    profiles     │         │   user_roles    │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┐│ id (PK)         │    ┌───▶│ id (PK)         │
│ name            │        ││ email           │    │    │ user_id         │
│ slug (unique)   │        ││ full_name       │    │    │ tenant_id (FK)  │─┐
│ logo_url        │        ││ avatar_url      │    │    │ role (enum)     │ │
│ settings (JSONB)│        └│ current_tenant_id│───┘    │ created_at      │ │
│ created_at      │         │ created_at      │         └─────────────────┘ │
│ updated_at      │         │ updated_at      │                             │
└────────┬────────┘         └─────────────────┘                             │
         │                                                                   │
         │◄──────────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────────────┐
         │                                                                 │
         ▼                                                                 ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    products     │         │    personas     │         │ style_clusters  │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───┐    │ id (PK)         │◄───┐    │ id (PK)         │
│ tenant_id (FK)  │────┤    │ tenant_id (FK)  │────┤    │ tenant_id (FK)  │
│ name            │    │    │ canonical_id    │    │    │ name            │
│ brand           │    │    │ name            │    │    │ description     │
│ description     │    │    │ gender          │    │    │ color           │
│ category        │    │    │ segment_code    │    │    │ keywords[]      │
│ subcategory     │    │    │ segment_weight  │    │    │ created_at      │
│ price           │    │    │ demographics    │    │    └────────┬────────┘
│ original_price  │    │    │ lifestyle       │    │             │
│ primary_image   │    │    │ psychographics  │    │             ▼
│ additional_imgs │    │    │ shopping_prefs  │    │    ┌─────────────────┐
│ tags[]          │    │    │ price_behavior  │    │    │product_style_   │
│ size_range[]    │    │    │ brand_psychology│    │    │   mappings      │
│ sku             │    │    │ + 8 more JSONB  │    │    ├─────────────────┤
│ status          │    │    │ attribute_vector│    │    │ id (PK)         │
│ extracted_feats │    │    │ is_active       │    │    │ product_id (FK) │
│ feature_vector  │    │    │ created/updated │    │    │ style_cluster_id│
│ created/updated │    │    └─────────────────┘    │    │ confidence_score│
└────────┬────────┘    │              │            │    └─────────────────┘
         │             │              │            │
         │             │              ▼            │
         │             │    ┌─────────────────┐    │
         │             └───▶│analysis_results │◄───┘
         │                  ├─────────────────┤
         └─────────────────▶│ id (PK)         │
                            │ product_id (FK) │
                            │ persona_id (FK) │
                            │ tenant_id (FK)  │
                            │ like_probability│
                            │ confidence_score│
                            │ price_floor     │
                            │ price_sweet_spot│
                            │ price_ceiling   │
                            │ price_elasticity│
                            │ explanation     │
                            │ match_factors   │
                            │ what_if_sims    │
                            │ created_at      │
                            └─────────────────┘`}
            </pre>
          </div>

          <h3 className="font-semibold mb-4">Core Tables Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium">tenants</div>
              <div className="px-4 py-3 text-muted-foreground">
                Multi-tenant isolation. Each brand/company has one tenant.
                Contains name, slug (URL-safe), logo, and settings JSON.
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium">products</div>
              <div className="px-4 py-3 text-muted-foreground">
                Product catalog. Stores name, brand, category, prices, images,
                tags, and AI-extracted features. Status: pending → analyzed → error.
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium">personas</div>
              <div className="px-4 py-3 text-muted-foreground">
                <strong>FIXED 10 PERSONAS.</strong> Each has 131+ attributes across
                13 JSONB fields. Never regenerate—only update attributes.
              </div>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium">analysis_results</div>
              <div className="px-4 py-3 text-muted-foreground">
                Product × Persona scoring. Contains like probability, price bands,
                elasticity, explanation, and match factors.
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The 10 Fixed Personas */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">4. The 10 Fixed Personas</h2>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-destructive mb-2">
              CRITICAL: Persona Locking Rule
            </h3>
            <p className="text-sm text-muted-foreground">
              NEVER regenerate, merge, split, or delete personas. The 10 personas
              are locked. Only attribute updates are allowed. This ensures
              consistency across all analysis results.
            </p>
          </div>

          <h3 className="font-semibold mb-4">Female Personas (5)</h3>
          <div className="space-y-4 mb-8">
            {[
              {
                id: "F-UCC-2432",
                name: "Urban Comfort Creator",
                age: "24-32",
                weight: "14%",
                narrative: "Metro professional balancing office, social life, and light fitness. Prefers comfortable, polished casuals.",
                priceRange: "₹800-1600 (T-shirt), ₹1500-2800 (Jeans)",
                style: "Minimalist",
              },
              {
                id: "F-TCS-1824",
                name: "Trend-First Campus Styler",
                age: "18-24",
                weight: "12%",
                narrative: "College student highly active on social media. Follows trends, loves experimental fashion. Budget-conscious.",
                priceRange: "₹400-900 (T-shirt), ₹800-1500 (Jeans)",
                style: "Experimental",
              },
              {
                id: "F-POM-2838",
                name: "Premium Office Minimalist",
                age: "28-38",
                weight: "10%",
                narrative: "Senior corporate professional. Premium minimalist basics. Quality over quantity.",
                priceRange: "₹1500-3000 (T-shirt), ₹2500-5000 (Jeans)",
                style: "Minimalist Premium",
              },
              {
                id: "F-VTE-2030",
                name: "Value-Focused Tier 2 Explorer",
                age: "20-30",
                weight: "12%",
                narrative: "Tier 2/3 city, aspirational value seeker. First-time buyers of many categories.",
                priceRange: "₹350-700 (T-shirt)",
                style: "Classic",
              },
              {
                id: "F-EFW-2535",
                name: "Ethnic-Fusion Weekender",
                age: "25-35",
                weight: "10%",
                narrative: "Professional who loves kurtas and indo-western fusion. Active festive/occasion shopper.",
                priceRange: "₹1200-2800 (Kurta)",
                style: "Ethnic Fusion",
              },
            ].map((p, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                    {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium">{i + 1}. {p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.id} • F, {p.age} • {p.weight} weight
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{p.narrative}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Price: </span>{p.priceRange}
                  <span className="ml-4 text-muted-foreground">Style: </span>{p.style}
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mb-4">Male Personas (5)</h3>
          <div className="space-y-4">
            {[
              {
                id: "M-MSC-2434",
                name: "Metro Smart Casualist",
                age: "24-34",
                weight: "14%",
                narrative: "Metro professional, hybrid work. Polos, chinos, smart casuals. Balanced wardrobe.",
                priceRange: "₹800-1800 (T-shirt), ₹1200-2500 (Chinos)",
                style: "Smart Casual",
              },
              {
                id: "M-GSS-1824",
                name: "Gen Z Streetwear Seeker",
                age: "18-24",
                weight: "10%",
                narrative: "Oversized tees, graphics, sneaker culture, drop hunting. Instagram/YouTube driven.",
                priceRange: "₹500-1200 (T-shirt)",
                style: "Streetwear",
              },
              {
                id: "M-FFP-2840",
                name: "Formal-First Professional",
                age: "28-40",
                weight: "12%",
                narrative: "Corporate-heavy wardrobe. Shirts, trousers, formal shoes. Conservative style.",
                priceRange: "₹1500-3500 (Shirt), ₹1800-4000 (Trousers)",
                style: "Formal",
              },
              {
                id: "M-BCE-2030",
                name: "Budget-Conscious Everyday Wearer",
                age: "20-30",
                weight: "12%",
                narrative: "Basic tees, jeans, shirts. Value-driven, needs durability. Price-first decisions.",
                priceRange: "₹300-600 (T-shirt), ₹600-1200 (Jeans)",
                style: "Basic",
              },
              {
                id: "M-AFW-2235",
                name: "Athleisure-Heavy Fitness Worker",
                age: "22-35",
                weight: "8%",
                narrative: "Gym-goer, joggers and performance tees for daily wear. Active lifestyle.",
                priceRange: "₹1000-2200 (Joggers), ₹800-1800 (Performance Tee)",
                style: "Athleisure",
              },
            ].map((p, i) => (
              <div key={i} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-medium text-sm">
                    {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium">{i + 6}. {p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.id} • M, {p.age} • {p.weight} weight
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{p.narrative}</p>
                <div className="text-xs">
                  <span className="text-muted-foreground">Price: </span>{p.priceRange}
                  <span className="ml-4 text-muted-foreground">Style: </span>{p.style}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Attribute Schema */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">5. Complete Attribute Schema</h2>
          <p className="text-muted-foreground mb-6">
            Each persona has 131+ attributes organized into 13 JSONB categories:
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { name: "demographics", fields: "12 fields", examples: "age_band, city_tier, income_band, education, occupation" },
              { name: "lifestyle", fields: "8 fields", examples: "daily_routine, commute_mode, gym_frequency, social_intensity" },
              { name: "fashion_orientation", fields: "7 fields", examples: "style_identity, trend_adoption, brand_consciousness" },
              { name: "psychographics", fields: "11 fields", examples: "value_orientation, risk_appetite, novelty_seeking, impulsivity" },
              { name: "shopping_preferences", fields: "12 fields", examples: "primary_channel, purchase_frequency, avg_order_value, returns_rate" },
              { name: "price_behavior", fields: "24+ fields", examples: "comfort_price_band per category, elasticity, discount_dependence" },
              { name: "product_preferences", fields: "16 fields", examples: "categories, priority_ranking, wardrobe_shares" },
              { name: "fit_silhouette_preferences", fields: "12 fields", examples: "tshirt_fit, jeans_fit, rise_preference, neckline" },
              { name: "fabric_material_preferences", fields: "9 fields", examples: "fabric_ranking, breathability, sustainability" },
              { name: "color_pattern_preferences", fields: "13 fields", examples: "neutrals_share, print_vs_solid, stripe/check preferences" },
              { name: "brand_psychology", fields: "7 fields", examples: "brand_awareness, loyalty_strength, influencer_influence" },
              { name: "digital_behavior", fields: "7 fields", examples: "device_type, session_duration, filter_usage, push_responsiveness" },
              { name: "lifecycle_loyalty", fields: "5 fields", examples: "relationship_stage, LTV_band, churn_risk, upsell_potential" },
            ].map((cat, i) => (
              <div key={i} className="border border-border rounded-lg p-3">
                <div className="font-medium text-xs mb-1">{cat.name}</div>
                <div className="text-xs text-muted-foreground mb-1">{cat.fields}</div>
                <div className="text-xs text-muted-foreground/70">{cat.examples}</div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mt-8 mb-4">Sample: price_behavior Structure</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-4 font-mono text-xs">
            <pre>{`{
  "comfort_price_band_tshirt": { "min": 800, "max": 1600 },
  "comfort_price_band_shirt": { "min": 1200, "max": 2200 },
  "comfort_price_band_jeans": { "min": 1500, "max": 2800 },
  "comfort_price_band_dress": { "min": 1800, "max": 3500 },
  "comfort_price_band_kurta": { "min": 1200, "max": 2500 },
  "comfort_price_band_hoodie": { "min": 1500, "max": 2800 },
  "comfort_price_band_joggers": { "min": 1000, "max": 2000 },
  ... // 24+ category-specific price bands
  "max_willing_to_pay_tshirt": 2000,
  "typical_discount_expectation_percentage": 20,
  "discount_dependence_level": "flexible",
  "price_elasticity_category": "medium",
  "tradeoff_priority_order": ["comfort", "design", "price", "brand"],
  "annual_fashion_spend": 42000
}`}</pre>
          </div>
        </section>

        {/* Section 6: Edge Functions */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">6. Edge Functions</h2>

          <div className="space-y-6">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                analyze-product
              </div>
              <div className="p-4 space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Analyzes a product against all 10 personas, generating match
                  scores, price recommendations, and explanations.
                </p>
                <div className="bg-muted/20 rounded p-3 font-mono text-xs">
                  <div className="font-semibold mb-2">Flow:</div>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Authenticate JWT, verify tenant access</li>
                    <li>Fetch product from database</li>
                    <li>Fetch all 10 active personas</li>
                    <li>If extracted_features empty → call AI to extract</li>
                    <li>Score product against each persona (batch of 5)</li>
                    <li>Upsert results to analysis_results table</li>
                    <li>Log to analysis_history</li>
                    <li>Return scores with summary</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                what-if-simulation
              </div>
              <div className="p-4 space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Simulates price changes and their effect on persona probabilities.
                </p>
                <div className="bg-muted/20 rounded p-3 font-mono text-xs">
                  <div className="font-semibold mb-2">Input:</div>
                  <pre>{`{
  "productId": "uuid",
  "tenantId": "uuid", 
  "priceRange": { "min": 500, "max": 1500, "steps": 10 }
}`}</pre>
                  <div className="font-semibold mb-2 mt-3">Output:</div>
                  <pre>{`{
  "simulations": [...],
  "optimalPrice": 950,
  "insights": ["Optimal is 12% higher than current"]
}`}</pre>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                regenerate-apparel-personas
              </div>
              <div className="p-4 text-sm">
                <p className="text-muted-foreground mb-2">
                  Seeds or updates the fixed 10 personas. <strong>Never regenerates.</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <code>action: "seed"</code> — Only works if table empty</li>
                  <li>• <code>action: "update_attributes"</code> — Updates existing</li>
                  <li>• <code>action: "reset"</code> — BLOCKED</li>
                  <li>• <code>action: "regenerate"</code> — BLOCKED</li>
                </ul>
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                extract-image-features
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                Uses AI vision to extract visual features from product images
                (colors, patterns, silhouette, style indicators).
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                generate-analytics-insights
              </div>
              <div className="p-4 text-sm text-muted-foreground">
                Generates AI-powered insights from aggregate analytics data
                for the dashboard.
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Frontend Architecture */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">7. Frontend Architecture</h2>

          <h3 className="font-semibold mb-4">Page Structure</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8 font-mono text-sm">
            <pre className="whitespace-pre-wrap">
{`src/
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Auth.tsx           # Sign in/up
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Products.tsx       # Product catalog
│   ├── Personas.tsx       # Persona management
│   ├── Analytics.tsx      # Analytics tabs
│   ├── Settings.tsx       # Account settings
│   └── NotFound.tsx       # 404
│
├── components/
│   ├── layout/
│   │   └── DashboardLayout.tsx   # Sidebar + header
│   │
│   ├── products/
│   │   ├── ProductUploadDialog.tsx
│   │   └── ProductAnalysisPanel.tsx
│   │
│   ├── personas/
│   │   └── PersonaDetailSheet.tsx
│   │
│   ├── analytics/
│   │   ├── AnalyticsCharts.tsx
│   │   ├── AIInsightsPanel.tsx
│   │   ├── WhatIfSimulator.tsx
│   │   ├── PriceIntelligenceDashboard.tsx
│   │   ├── StyleClusterAnalytics.tsx
│   │   └── PersonaDeepDive.tsx
│   │
│   └── ui/                # shadcn/ui components
│
├── hooks/
│   ├── useAuth.tsx        # Auth state
│   ├── useTenant.tsx      # Tenant context
│   ├── use-toast.ts       # Notifications
│   └── use-mobile.tsx     # Viewport detection
│
└── integrations/
    └── supabase/
        ├── client.ts      # Auto-generated
        └── types.ts       # Auto-generated`}
            </pre>
          </div>

          <h3 className="font-semibold mb-4">Routing</h3>
          <div className="border border-border rounded-lg p-4 font-mono text-xs">
            <pre>{`<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<Products />} />
    <Route path="personas" element={<Personas />} />
    <Route path="analytics" element={<Analytics />} />
    <Route path="settings" element={<Settings />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes>`}</pre>
          </div>
        </section>

        {/* Section 8: User Flows */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">8. User Flows</h2>

          <h3 className="font-semibold mb-4">Onboarding Flow</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 mb-8 font-mono text-sm">
            <pre className="whitespace-pre-wrap">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│   Sign Up   │────▶│  Onboarding │
│    Page     │     │    Form     │     │   Dialog    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┘
                         ▼
              ┌─────────────────────┐
              │  Create Tenant      │
              │  (auto: brand name) │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Initialize 10      │
              │  Fixed Personas     │
              │  (if table empty)   │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Redirect to        │
              │  Dashboard          │
              └─────────────────────┘`}
            </pre>
          </div>

          <h3 className="font-semibold mb-4">Product Analysis Flow</h3>
          <div className="bg-muted/20 border border-border rounded-lg p-6 font-mono text-sm">
            <pre className="whitespace-pre-wrap">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Products   │────▶│   Upload    │────▶│  Product    │
│    Page     │     │   Dialog    │     │  Created    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
      ┌────────────────────────────────────────┘
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Click     │────▶│  Analysis   │────▶│  Edge Func  │
│  Product    │     │   Panel     │     │  analyze-   │
│   Card      │     │  (Sheet)    │     │  product    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
      ┌────────────────────────────────────────┘
      ▼
┌─────────────────────────────────────────────────────┐
│                   Analysis Results                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Persona    │  │   Price     │  │   Match     │  │
│  │  Scores     │  │   Bands     │  │  Factors    │  │
│  │  (10 bars)  │  │  (per pers) │  │ (breakdown) │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘`}
            </pre>
          </div>
        </section>

        {/* Section 9: Metrics Catalog */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">9. Analytics Metrics Catalog</h2>
          <p className="text-muted-foreground mb-6">50+ KPIs tracked across categories:</p>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Funnel Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Browse to Cart Ratio</li>
                <li>• Cart to Purchase Ratio</li>
                <li>• Wishlist to Purchase Ratio</li>
                <li>• Return Rate</li>
                <li>• Swipe Like Rate</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Channel Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Online/Offline Ratio</li>
                <li>• Mobile/Desktop Ratio</li>
                <li>• Marketplace/Brand Ratio</li>
                <li>• Top Channel Breakdown</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Price Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Price Elasticity Segment</li>
                <li>• Avg Discount Availed</li>
                <li>• Full Price/Discount Ratio</li>
                <li>• Above Median Purchase %</li>
                <li>• Willingness to Pay Bandwidth</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Style Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Style Cluster Resonance Score</li>
                <li>• Classic/Trendy Ratio</li>
                <li>• Neutral/Bold Color Ratio</li>
                <li>• Solid/Prints Ratio</li>
                <li>• Statement Piece Pull-Through</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Loyalty Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Repeat Purchase Rate</li>
                <li>• Avg Lifetime Value</li>
                <li>• Cross-Category Adoption</li>
                <li>• Personalization Lift Index</li>
                <li>• Churn Risk Level</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Regional Metrics</h4>
              <ul className="text-muted-foreground space-y-1 text-xs">
                <li>• Metro/Non-Metro Ratio</li>
                <li>• Regional Style Divergence</li>
                <li>• City Tier Performance</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 10: Implementation Guide */}
        <section className="page-break print-section">
          <h2 className="text-3xl font-bold mb-6">10. Implementation Guide</h2>

          <h3 className="font-semibold mb-4">Build Order</h3>
          <ol className="space-y-4 text-sm">
            {[
              { phase: "Setup", items: ["Create project in Lovable", "Enable Cloud/Supabase", "Configure DM Sans font", "Set up index.css tokens"] },
              { phase: "Database", items: ["Create all 12 tables via migrations", "Enable RLS on all tables", "Create database functions", "Set up storage bucket"] },
              { phase: "Auth", items: ["Enable email auth", "Set auto-confirm = true", "Create profiles trigger", "Build Auth.tsx page"] },
              { phase: "Multi-tenancy", items: ["Create useTenant hook", "Implement tenant creation on signup", "Add tenant_id to all queries"] },
              { phase: "Personas", items: ["Create regenerate-apparel-personas edge function", "Build Personas.tsx page", "Build PersonaDetailSheet", "Seed 10 personas on first login"] },
              { phase: "Products", items: ["Create analyze-product edge function", "Build Products.tsx page", "Build ProductUploadDialog", "Build ProductAnalysisPanel"] },
              { phase: "Analytics", items: ["Create what-if-simulation function", "Build Analytics.tsx with all tabs", "Build all analytics sub-components"] },
              { phase: "Polish", items: ["Landing page", "Dashboard overview", "Error handling", "Loading states"] },
            ].map((p, i) => (
              <li key={i} className="border border-border rounded-lg p-4">
                <div className="font-medium mb-2">Phase {i + 1}: {p.phase}</div>
                <ul className="text-muted-foreground text-xs grid grid-cols-2 gap-1">
                  {p.items.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* Footer */}
        <section className="border-t border-border pt-8 mt-12 text-center text-sm text-muted-foreground">
          <p>SWIRL Technical Documentation v1.0</p>
          <p className="mt-2">
            Generated from Lovable Project • {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
};

export default Documentation;
