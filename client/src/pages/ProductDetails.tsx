import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingCart, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';
import { categories } from '@shared/schema';

export default function ProductDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', id],
  });

  const category = product ? categories.find((c) => c.value === product.category) : null;
  const isInCart = product ? cartItems.some((item) => item.id === product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;

    if (isInCart) {
      toast({
        title: 'المنتج موجود بالفعل',
        description: 'هذا المنتج موجود بالفعل في السلة',
      });
      return;
    }

    addItem(product);
    toast({
      title: 'تمت الإضافة إلى السلة',
      description: `تم إضافة "${product.name}" إلى السلة`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-muted rounded-xl" />
          <div className="h-32 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
        <Link href="/products">
          <Button className="gap-2">
            <ArrowRight className="w-4 h-4" />
            العودة إلى المنتجات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products">
        <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back-to-products">
          <ArrowRight className="w-4 h-4" />
          العودة إلى المنتجات
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured === 1 && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              مميز
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {category && (
            <Badge variant="secondary" className="text-sm">
              {category.label}
            </Badge>
          )}

          <div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-product-name">
              {product.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              {product.description}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-primary" data-testid="text-product-price">
                  {product.price.toLocaleString()} دج
                </span>
                {product.soldCount > 0 && (
                  <Badge variant="outline">
                    {product.soldCount} مبيعات
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className="w-full gap-2 h-12 text-lg"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInCart ? 'موجود في السلة' : 'أضف إلى السلة'}
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span>تحميل فوري بعد تأكيد الدفع</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">معلومات المنتج</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ منتج رقمي قابل للتحميل</li>
                <li>✓ دعم فني متواصل</li>
                <li>✓ تحديثات مجانية</li>
                <li>✓ دفع آمن عبر بريدي موب</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
