import Link from 'next/link';

export default function Home(){
  return (
    <div>
      <section style={{
        padding: '80px 0',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 24,
        marginBottom: 40
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '3.5em',
            marginBottom: 20,
            background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2
          }}>مرحباً في DZ Digital Market</h1>
          
          <p style={{
            fontSize: '1.3em',
            color: '#e0e0e0',
            marginBottom: 30,
            lineHeight: 1.8
          }}>
            منصة رقمية متقدمة لبيع وشراء المنتجات الرقمية في الجزائر
            <br/>
            <span style={{color: '#00ff88'}}>الدفع عبر بريدي موب - آمن وسريع</span>
          </p>
          
          <div style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 40
          }}>
            <Link href="/products" className="btn" style={{
              fontSize: '1.1em',
              padding: '16px 40px',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
            }}>
              تصفح المنتجات
            </Link>
            <Link href="/contact" style={{
              display: 'inline-block',
              padding: '16px 40px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 8,
              color: '#00ff88',
              fontWeight: 600,
              fontSize: '1.1em',
              transition: 'all 0.3s ease'
            }}>
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 30,
        marginTop: 60
      }}>
        <div className="card" style={{textAlign: 'center'}}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5em',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
          }}>🛍️</div>
          <h3 style={{color: '#00ff88', marginBottom: 15}}>منتجات رقمية متنوعة</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6}}>
            مجموعة واسعة من المنتجات الرقمية عالية الجودة
          </p>
        </div>

        <div className="card" style={{textAlign: 'center'}}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5em',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
          }}>💳</div>
          <h3 style={{color: '#00ff88', marginBottom: 15}}>دفع آمن ببريدي موب</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6}}>
            نظام دفع محلي آمن وموثوق عبر بريدي موب
          </p>
        </div>

        <div className="card" style={{textAlign: 'center'}}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5em',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
          }}>⚡</div>
          <h3 style={{color: '#00ff88', marginBottom: 15}}>تسليم فوري</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6}}>
            احصل على منتجاتك فوراً بعد تأكيد الدفع
          </p>
        </div>
      </section>

      <section className="card" style={{
        marginTop: 60,
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
        border: '2px solid rgba(0, 255, 136, 0.3)',
        textAlign: 'center'
      }}>
        <h2 style={{marginBottom: 20}}>كيف يعمل الموقع؟</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 30,
          marginTop: 40
        }}>
          <div>
            <div style={{
              fontSize: '2.5em',
              color: '#00ff88',
              marginBottom: 10
            }}>1</div>
            <h4 style={{color: '#fff', marginBottom: 10}}>اختر المنتج</h4>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>تصفح المنتجات واختر ما يناسبك</p>
          </div>
          <div>
            <div style={{
              fontSize: '2.5em',
              color: '#00ff88',
              marginBottom: 10
            }}>2</div>
            <h4 style={{color: '#fff', marginBottom: 10}}>ادفع ببريدي موب</h4>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>قم بالدفع وارفع إيصال الدفع</p>
          </div>
          <div>
            <div style={{
              fontSize: '2.5em',
              color: '#00ff88',
              marginBottom: 10
            }}>3</div>
            <h4 style={{color: '#fff', marginBottom: 10}}>احصل على منتجك</h4>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>بعد التأكيد، حمّل منتجك فوراً</p>
          </div>
        </div>
      </section>
    </div>
  );
}
