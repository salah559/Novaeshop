import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Package, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import type { Product } from '@shared/schema';

export default function Home() {
  const { data: featuredProducts, isLoading: loadingFeatured } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const { data: bestSellers, isLoading: loadingBestSellers } = useQuery<Product[]>({
    queryKey: ['/api/products/bestsellers'],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background animate-gradient-shift" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">منصة موثوقة 100%</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                بيع واشتري منتجات رقمية
              </span>
              <br />
              <span className="bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                بسهولة وأمان
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              كل شيء قانوني، آمن، ومباشر بالدينار الجزائري 💸
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="gap-2 text-lg h-12 px-8" data-testid="button-discover-products">
                  اكتشف المنتجات
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-lg h-12 px-8" data-testid="button-contact">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packs Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Package className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">الباقات المميزة</h2>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد باقات مميزة حالياً
          </div>
        )}
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold">الأكثر مبيعاً</h2>
        </div>

        {loadingBestSellers ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bestSellers && bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            لا توجد منتجات حالياً
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ابدأ رحلتك الرقمية الآن
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            آلاف المنتجات الرقمية الاحترافية في انتظارك. تصفح، اختر، وادفع بالدينار الجزائري.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2 text-lg h-12 px-8" data-testid="button-browse-products">
              تصفح جميع المنتجات
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
