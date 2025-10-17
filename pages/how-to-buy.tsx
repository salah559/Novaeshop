import Link from 'next/link';

export default function HowToBuy() {
  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 50,
        padding: '40px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 15,
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>كيف تشتري من Enova؟</h2>
        <p style={{color: '#c0c0c0', fontSize: '1.1em'}}>دليل سهل وبسيط للشراء من متجرنا</p>
      </div>

      {/* Steps */}
      <div style={{
        display: 'grid',
        gap: 30,
        maxWidth: 900,
        margin: '0 auto 60px'
      }}>
        {/* Step 1 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>1</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>تصفح المنتجات</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • ابحث في صفحة <Link href="/products" style={{color: '#00ff88', fontWeight: 600}}>المنتجات</Link> عن ما تريده<br/>
            • استخدم البحث أو الفلترة لإيجاد منتجك بسهولة<br/>
            • اقرأ وصف المنتج والسعر بعناية
          </p>
        </div>

        {/* Step 2 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>2</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>أضف إلى السلة</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • اضغط على "إضافة إلى السلة" 🛒<br/>
            • يمكنك إضافة عدة منتجات<br/>
            • راجع سلتك من القائمة العلوية
          </p>
        </div>

        {/* Step 3 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>3</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>سجل الدخول</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • اضغط "تسجيل الدخول" في الأعلى<br/>
            • سجل بواسطة Google (سريع وآمن) 🔐<br/>
            • هذا ضروري لتتبع طلباتك ومشترياتك
          </p>
        </div>

        {/* Step 4 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(255, 165, 0, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>4</div>
            <h3 style={{color: '#FFA500', fontSize: '1.5em', margin: 0}}>ادفع عبر بريدي موب</h3>
          </div>
          <div style={{
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: 12,
            padding: '20px',
            marginBottom: 15
          }}>
            <h4 style={{color: '#FFA500', marginBottom: 15}}>📱 معلومات الدفع:</h4>
            <p style={{color: '#c0c0c0', lineHeight: 2, fontSize: '1.05em', marginBottom: 0}}>
              <strong style={{color: '#fff'}}>اسم المستفيد:</strong> [اسم صاحب الحساب]<br/>
              <strong style={{color: '#fff'}}>رقم الحساب:</strong> [رقم بريدي موب]<br/>
              <strong style={{color: '#fff'}}>المبلغ:</strong> راجع سلتك للمبلغ الإجمالي
            </p>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • افتح تطبيق بريدي موب<br/>
            • قم بتحويل المبلغ المطلوب<br/>
            • احتفظ بصورة الإيصال (مهم جداً!) 📸
          </p>
        </div>

        {/* Step 5 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>5</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>أرسل الإيصال</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • في صفحة الدفع، ارفع صورة إيصال بريدي موب 📤<br/>
            • تأكد أن الصورة واضحة ويظهر فيها المبلغ والتاريخ<br/>
            • اضغط "إرسال الطلب"
          </p>
        </div>

        {/* Step 6 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>6</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>انتظر التأكيد</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • سنراجع إيصالك خلال 24 ساعة ⏰<br/>
            • تابع حالة طلبك في <Link href="/orders" style={{color: '#00ff88', fontWeight: 600}}>"طلباتي"</Link><br/>
            • سيظهر الطلب كـ "⏳ قيد المراجعة"
          </p>
        </div>

        {/* Step 7 */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(0, 255, 136, 0.5)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20
          }}>
            <div style={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0
            }}>7</div>
            <h3 style={{color: '#00ff88', fontSize: '1.5em', margin: 0}}>حمّل مشترياتك</h3>
          </div>
          <p style={{color: '#c0c0c0', lineHeight: 1.8, fontSize: '1.05em'}}>
            • بعد التأكيد، ستظهر الحالة: "✅ تم التأكيد"<br/>
            • اذهب إلى <Link href="/mypurchases" style={{color: '#00ff88', fontWeight: 600}}>"مشترياتي"</Link> 📥<br/>
            • حمّل منتجاتك الرقمية مباشرة<br/>
            • استمتع بمشترياتك! 🎉
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{maxWidth: 900, margin: '0 auto'}}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2em',
          marginBottom: 40,
          color: '#00ff88'
        }}>❓ أسئلة شائعة</h2>

        <div style={{display: 'grid', gap: 20}}>
          <div className="card">
            <h4 style={{color: '#00ff88', marginBottom: 12}}>كم يستغرق تأكيد الطلب؟</h4>
            <p style={{color: '#c0c0c0', lineHeight: 1.7}}>
              عادةً نراجع الطلبات خلال 24 ساعة. في أوقات الذروة قد تستغرق حتى 48 ساعة.
            </p>
          </div>

          <div className="card">
            <h4 style={{color: '#00ff88', marginBottom: 12}}>ماذا لو رُفض طلبي؟</h4>
            <p style={{color: '#c0c0c0', lineHeight: 1.7}}>
              إذا رُفض طلبك، سنوضح السبب (مثلاً: الإيصال غير واضح، المبلغ غير صحيح). يمكنك إعادة المحاولة بإيصال صحيح أو التواصل معنا.
            </p>
          </div>

          <div className="card">
            <h4 style={{color: '#00ff88', marginBottom: 12}}>هل يمكنني الشراء بدون تسجيل دخول؟</h4>
            <p style={{color: '#c0c0c0', lineHeight: 1.7}}>
              لا، تسجيل الدخول ضروري لربط المشتريات بحسابك وتتبع طلباتك. هذا يضمن حماية مشترياتك.
            </p>
          </div>

          <div className="card">
            <h4 style={{color: '#00ff88', marginBottom: 12}}>كيف أحمّل المنتج بعد الشراء؟</h4>
            <p style={{color: '#c0c0c0', lineHeight: 1.7}}>
              بعد تأكيد الطلب، اذهب إلى صفحة "مشترياتي" وستجد رابط التحميل لكل منتج اشتريته.
            </p>
          </div>

          <div className="card">
            <h4 style={{color: '#00ff88', marginBottom: 12}}>ماذا لو واجهت مشكلة؟</h4>
            <p style={{color: '#c0c0c0', lineHeight: 1.7, marginBottom: 15}}>
              يمكنك التواصل معنا في أي وقت عبر <Link href="/contact" style={{color: '#00ff88', fontWeight: 600}}>صفحة التواصل</Link>. سنرد عليك في أقرب وقت ممكن.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        textAlign: 'center',
        marginTop: 60,
        padding: '40px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
        borderRadius: 16,
        border: '2px solid rgba(0, 255, 136, 0.4)'
      }}>
        <h3 style={{color: '#00ff88', fontSize: '1.8em', marginBottom: 20}}>
          جاهز للبدء؟ 🚀
        </h3>
        <p style={{color: '#c0c0c0', marginBottom: 30, fontSize: '1.1em'}}>
          تصفح منتجاتنا واختر ما يناسبك!
        </p>
        <Link href="/products" className="btn" style={{
          padding: '16px 40px',
          fontSize: '1.2em',
          boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
        }}>
          🛍️ تصفح المنتجات
        </Link>
      </div>
    </div>
  );
}
