import { Link } from 'wouter';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/cart-store';
import type { Product } from '@shared/schema';
import { categories } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const { toast } = useToast();

  const category = categories.find((c) => c.value === product.category);
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
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

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-product-${product.id}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.isFeatured === 1 && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              مميز
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              {category.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            {product.price.toLocaleString()} دج
          </span>
          {product.soldCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {product.soldCount} مبيعات
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={isInCart}
          className="flex-1 gap-2"
          data-testid={`button-add-to-cart-${product.id}`}
        >
          <ShoppingCart className="w-4 h-4" />
          {isInCart ? 'في السلة' : 'أضف للسلة'}
        </Button>
        <Link href={`/product/${product.id}`}>
          <Button variant="outline" size="icon" data-testid={`button-view-details-${product.id}`}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
