import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Package, Sparkles } from "lucide-react";
import ProductUploadDialog from "@/components/products/ProductUploadDialog";
import ProductAnalysisPanel from "@/components/products/ProductAnalysisPanel";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number;
  primary_image_url: string | null;
  status: string;
  created_at: string;
}

const Products = () => {
  const { tenant } = useTenant();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (tenant) {
      loadProducts();
    }
  }, [tenant]);

  const loadProducts = async () => {
    if (!tenant) return;

    const { data, error } = await supabase
      .from("products")
      .select("id, name, brand, category, price, primary_image_url, status, created_at")
      .eq("tenant_id", tenant.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">Analyzed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage and analyze your product catalog</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your first product to start analyzing
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-border/50"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-square bg-muted relative">
                {product.primary_image_url ? (
                  <img
                    src={product.primary_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(product.status)}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {product.brand || product.category}
                    </p>
                  </div>
                  <span className="font-semibold whitespace-nowrap">₹{product.price}</span>
                </div>
                {product.status === "pending" && (
                  <Button 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    <Sparkles className="w-3 h-3 mr-2" />
                    Analyze
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductUploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        onSuccess={() => {
          loadProducts();
          setShowUpload(false);
        }}
      />

      <ProductAnalysisPanel
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAnalysisComplete={loadProducts}
      />
    </div>
  );
};

export default Products;
