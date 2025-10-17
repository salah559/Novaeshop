import { Link } from 'wouter';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/cart-store';

export default function Cart() {
  const { items, removeItem, getTotalPrice } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
        <p className="text-muted-foreground mb-8">
          لم تقم بإضافة أي منتجات إلى السلة بعد
        </p>
        <Link href="/products">
          <Button className="gap-2" data-testid="button-browse-products">
            <ArrowRight className="w-4 h-4" />
            تصفح المنتجات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">السلة</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((product) => (
            <Card key={product.id} data-testid={`cart-item-${product.id}`}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} دج
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(product.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                        data-testid={`button-remove-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">ملخص الطلب</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد المنتجات</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">الإجمالي</span>
                    <span className="text-2xl font-bold text-primary" data-testid="text-total-price">
                      {total.toLocaleString()} دج
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/payment">
                  <Button className="w-full gap-2 h-12" data-testid="button-proceed-to-payment">
                    متابعة الدفع
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    متابعة التسوق
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
