import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Upload, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/lib/cart-store';
import { queryClient, apiRequest } from '@/lib/queryClient';

export default function Payment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const total = getTotalPrice();

  const createOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('POST', '/api/orders', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      clearCart();
      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: 'سيتم مراجعة طلبك وتأكيده في أقرب وقت',
      });
      setLocation('/purchases');
    },
    onError: () => {
      toast({
        title: 'حدث خطأ',
        description: 'فشل إرسال الطلب. حاول مرة أخرى.',
        variant: 'destructive',
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: 'السلة فارغة',
        description: 'أضف منتجات إلى السلة أولاً',
        variant: 'destructive',
      });
      return;
    }

    if (!paymentImage) {
      toast({
        title: 'صورة الدفع مطلوبة',
        description: 'يرجى رفع صورة إيصال الدفع',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('productIds', JSON.stringify(items.map((i) => i.id)));
    formDataToSend.append('totalPrice', total.toString());
    formDataToSend.append('paymentImage', paymentImage);

    createOrderMutation.mutate(formDataToSend);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">السلة فارغة</h2>
        <p className="text-muted-foreground">أضف منتجات إلى السلة للمتابعة</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">إتمام الدفع</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Instructions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                معلومات الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">رقم الحساب - بريدي موب</p>
                <p className="text-2xl font-bold text-primary">0555 123 456</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">خطوات الدفع:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>افتح تطبيق بريدي موب على هاتفك</li>
                  <li>اختر "تحويل الأموال"</li>
                  <li>أدخل رقم الحساب أعلاه</li>
                  <li>أدخل المبلغ: <span className="font-bold text-primary">{total.toLocaleString()} دج</span></li>
                  <li>أكمل عملية التحويل</li>
                  <li>التقط صورة للإيصال وارفعها أدناه</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>تأكيد الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    data-testid="input-fullname"
                  />
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="paymentImage">صورة إيصال الدفع *</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Payment Receipt"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setPaymentImage(null);
                            setImagePreview('');
                          }}
                        >
                          تغيير الصورة
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="paymentImage"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover-elevate transition-all"
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">اضغط لرفع الصورة</span>
                        <input
                          id="paymentImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          data-testid="input-payment-image"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">المبلغ الإجمالي</span>
                    <span className="text-2xl font-bold text-primary">
                      {total.toLocaleString()} دج
                    </span>
                  </div>

                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full gap-2 h-12"
                    data-testid="button-submit-order"
                  >
                    {createOrderMutation.isPending ? (
                      'جاري الإرسال...'
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        تأكيد الطلب
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
