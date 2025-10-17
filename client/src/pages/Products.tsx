import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { categories } from '@shared/schema';
import type { Product } from '@shared/schema';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
  });

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products?.filter((p) => p.category === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">المنتجات الرقمية</h1>
        <p className="text-lg text-muted-foreground">
          اكتشف مجموعتنا الواسعة من المنتجات الرقمية عالية الجودة
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            data-testid="button-category-all"
          >
            جميع المنتجات
          </Button>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.value)}
              data-testid={`button-category-${category.value}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">لا توجد منتجات في هذا التصنيف</p>
        </div>
      )}
    </div>
  );
}
