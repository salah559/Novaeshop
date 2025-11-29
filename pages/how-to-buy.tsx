import Link from 'next/link';

export default function HowToBuy() {
  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(30px, 6vw, 50px)',
        padding: 'clamp(30px, 6vw, 50px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        border: '2px solid rgba(57, 255, 20, 0.2)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2em, 7vw, 3em)',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>كيف تشتري من Enova؟</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>دليل سهل وبسيط للشراء من متجرنا</p>
      </div>

      <div style={{
        display: 'grid',
        gap: 'clamp(20px, 4vw, 28px)',
        maxWidth: 900,
        margin: '0 auto'
      }}>
        {[
          {
            num: 1,
            title: 'تصفح المنتجات',
            desc: '• ابحث عن ما تريده في صفحة المنتجات\n• استخدم البحث أو الفلترة للعثور بسرعة\n• اقرأ الوصف والسعر بعناية',
            emoji: '🛍️'
          },
          {
            num: 2,
            title: 'أضف إلى السلة',
            desc: '• اضغط على "إضافة إلى السلة"\n• يمكنك إضافة عدة منتجات\n• راجع سلتك من القائمة العلوية',
            emoji: '🛒'
          },
          {
            num: 3,
            title: 'الدفع عبر بريدي موب',
            desc: '• انتقل إلى صفحة الدفع\n• حول المبلغ المطلوب\n• احفظ إيصال التحويل',
            emoji: '💳'
          },
          {
            num: 4,
            title: 'أرفق الإيصال',
            desc: '• التقط صورة واضحة للإيصال\n• يجب أن تظهر رقم الملف والمبلغ\n• أرفقها في نموذج الدفع',
            emoji: '📸'
          },
          {
            num: 5,
            title: 'انتظر التأكيد',
            desc: '• سيراجع الفريق الإيصال\n• سيتم التحقق من التحويل\n• ستحصل على إشعار التأكيد',
            emoji: '⏳'
          },
          {
            num: 6,
            title: 'تحميل المنتجات',
            desc: '• بعد التأكيد ستصبح المنتجات متاحة\n• ستجدها في "مشترياتي"\n• حمل الملفات متى تشاء',
            emoji: '⬇️'
          }
        ].map((step) => (
          <div key={step.num} className="card animate-fadeInUp" style={{
            background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '2px solid rgba(57, 255, 20, 0.2)',
            padding: 'clamp(20px, 4vw, 28px)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(18px, 4vw, 25px)',
            alignItems: 'start'
          }}>
            <div style={{
              width: 'clamp(50px, 10vw, 70px)',
              height: 'clamp(50px, 10vw, 70px)',
              background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1.6em, 5vw, 2em)',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0,
              boxShadow: '0 0 25px rgba(57, 255, 20, 0.4)',
              lineHeight: 1
            }}>
              {step.num}
            </div>
            <div>
              <h3 style={{
                color: '#39ff14',
                fontSize: 'clamp(1.15em, 3.5vw, 1.4em)',
                margin: '0 0 clamp(10px, 2vw, 14px) 0',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
              }}>
                {step.emoji} {step.title}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.9,
                fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.12) 0%, rgba(255, 215, 0, 0.08) 100%)',
        border: '2px solid rgba(57, 255, 20, 0.3)',
        borderRadius: 'clamp(14px, 3vw, 18px)',
        padding: 'clamp(25px, 5vw, 35px)',
        marginTop: 'clamp(40px, 8vw, 60px)',
        textAlign: 'center',
        maxWidth: 750,
        margin: 'clamp(40px, 8vw, 60px) auto 0'
      }}>
        <h3 style={{
          fontSize: 'clamp(1.2em, 3.5vw, 1.5em)',
          color: '#39ff14',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
        }}>
          💡 نصائح مهمة
        </h3>
        <ul style={{
          textAlign: 'right',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 2,
          fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
          margin: 0,
          paddingLeft: 0,
          listStyle: 'none'
        }}>
          <li>✓ تأكد من كتابة رقم الحساب بشكل صحيح</li>
          <li>✓ احرص على أن تكون صورة الإيصال واضحة</li>
          <li>✓ تواصل معنا عبر الدردشة إذا واجهت أي مشكلة</li>
          <li>✓ المنتجات متاحة للتحميل فوراً بعد التأكيد</li>
        </ul>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: 'clamp(40px, 8vw, 60px)'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(1em, 2.5vw, 1.1em)',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          هل انت مستعد للبدء؟
        </p>
        <Link href="/products" className="btn" style={{
          fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
          padding: 'clamp(14px, 3vw, 18px) clamp(30px, 7vw, 40px)',
          borderRadius: 'clamp(12px, 3vw, 16px)'
        }}>
          🛍️ تصفح المنتجات الآن
        </Link>
      </div>
    </div>
  );
}
