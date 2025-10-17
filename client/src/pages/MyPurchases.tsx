import { useQuery } from '@tanstack/react-query';
import { Download, Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PurchaseWithProduct {
  id: string;
  productId: string;
  downloadUrl: string;
  status: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  };
}

export default function MyPurchases() {
  const { data: purchases, isLoading } = useQuery<PurchaseWithProduct[]>({
    queryKey: ['/api/purchases'],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-bold mb-4">لا توجد مشتريات</h2>
        <p className="text-muted-foreground mb-8">
          لم تقم بشراء أي منتجات بعد
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">مشترياتي</h1>

      <div className="space-y-4">
        {purchases.map((purchase) => (
          <Card key={purchase.id} data-testid={`purchase-${purchase.id}`}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img
                  src={purchase.product.imageUrl}
                  alt={purchase.product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {purchase.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {purchase.product.description}
                      </p>
                    </div>
                    {purchase.status === 'active' ? (
                      <Badge className="gap-1 bg-primary">
                        <CheckCircle className="w-3 h-3" />
                        مفعل
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        بانتظار التأكيد
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {purchase.product.price.toLocaleString()} دج
                    </span>

                    {purchase.status === 'active' && (
                      <a href={purchase.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button className="gap-2" data-testid={`button-download-${purchase.id}`}>
                          <Download className="w-4 h-4" />
                          تحميل المنتج
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
