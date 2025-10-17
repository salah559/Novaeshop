import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, CheckCircle, XCircle, Package, ShoppingBag, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { categories } from '@shared/schema';
import type { Order, Product } from '@shared/schema';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    downloadUrl: '',
    isFeatured: 0,
  });

  const { data: orders } = useQuery<Order[]>({ queryKey: ['/api/admin/orders'] });
  const { data: products } = useQuery<Product[]>({ queryKey: ['/api/admin/products'] });

  const confirmOrderMutation = useMutation({
    mutationFn: (orderId: string) => apiRequest('POST', `/api/admin/orders/${orderId}/confirm`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: 'تم تأكيد الطلب بنجاح' });
    },
  });

  const rejectOrderMutation = useMutation({
    mutationFn: (orderId: string) => apiRequest('POST', `/api/admin/orders/${orderId}/reject`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({ title: 'تم رفض الطلب' });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      setIsAddProductOpen(false);
      setProductForm({ name: '', description: '', price: '', category: '', imageUrl: '', downloadUrl: '', isFeatured: 0 });
      toast({ title: 'تمت إضافة المنتج بنجاح' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => apiRequest('DELETE', `/api/admin/products/${productId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      toast({ title: 'تم حذف المنتج' });
    },
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProductMutation.mutate({
      ...productForm,
      price: parseInt(productForm.price),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            الطلبات
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="w-4 h-4" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            الرسائل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {order.paymentImageUrl && (
                      <img
                        src={order.paymentImageUrl}
                        alt="Payment Receipt"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                          {order.phone && <p className="text-sm text-muted-foreground">{order.phone}</p>}
                        </div>
                        <Badge variant={order.status === 'confirmed' ? 'default' : order.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {order.status === 'pending' ? 'قيد المراجعة' : order.status === 'confirmed' ? 'مؤكد' : 'مرفوض'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {order.totalPrice.toLocaleString()} دج
                        </span>

                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => confirmOrderMutation.mutate(order.id)}
                              disabled={confirmOrderMutation.isPending}
                              className="gap-2"
                              data-testid={`button-confirm-${order.id}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              تأكيد
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => rejectOrderMutation.mutate(order.id)}
                              disabled={rejectOrderMutation.isPending}
                              className="gap-2"
                              data-testid={`button-reject-${order.id}`}
                            >
                              <XCircle className="w-4 h-4" />
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">لا توجد طلبات</p>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-product">
                <Plus className="w-4 h-4" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="name">اسم المنتج</Label>
                  <Input
                    id="name"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    data-testid="input-product-name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    data-testid="input-product-description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (دج)</Label>
                    <Input
                      id="price"
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      data-testid="input-product-price"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">التصنيف</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                    >
                      <SelectTrigger data-testid="select-product-category">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="imageUrl">رابط الصورة</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    data-testid="input-product-image"
                  />
                </div>
                <div>
                  <Label htmlFor="downloadUrl">رابط التحميل</Label>
                  <Input
                    id="downloadUrl"
                    type="url"
                    required
                    value={productForm.downloadUrl}
                    onChange={(e) => setProductForm({ ...productForm, downloadUrl: e.target.value })}
                    data-testid="input-product-download"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={productForm.isFeatured === 1}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked ? 1 : 0 })}
                    className="rounded"
                  />
                  <Label htmlFor="isFeatured">منتج مميز</Label>
                </div>
                <Button type="submit" disabled={addProductMutation.isPending} className="w-full" data-testid="button-submit-product">
                  {addProductMutation.isPending ? 'جاري الإضافة...' : 'إضافة المنتج'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products?.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{product.price.toLocaleString()} دج</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProductMutation.mutate(product.id)}
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <p className="text-center text-muted-foreground py-12">لا توجد رسائل</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
