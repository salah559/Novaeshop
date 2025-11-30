import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function ProductDetails(){
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    async function load() {
      const snap = await getDoc(doc(db, 'products', id as string));
      if (snap.exists()) {
        setProduct({id: snap.id, ...snap.data()});
      }
      setLoading(false);
    }
    
    load();
  }, [id]);

  function buyNow() {
    if (!product) return;

    if (!auth.currentUser) {
      alert('⚠️ يجب تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }
    
    const checkoutData = {
      items: [product],
      total: product.price
    };
    
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  }

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 'clamp(50px, 10vw, 80px)'}}>
        <div style={{
          width: 60,
          height: 60,
          border: '4px solid rgba(57, 255, 20, 0.2)',
          borderTop: '4px solid #39ff14',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{color: '#39ff14', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>جاري التحميل...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="card" style={{
        textAlign: 'center',
        padding: 'clamp(40px, 8vw, 60px)',
        maxWidth: 600,
        margin: '60px auto'
      }}>
        <div style={{fontSize: 'clamp(3.5em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>❌</div>
        <h3 style={{color: '#39ff14', marginBottom: 'clamp(18px, 4vw, 25px)', textShadow: '0 0 15px rgba(57, 255, 20, 0.3)', fontSize: 'clamp(1.2em, 3.5vw, 1.5em)'}}>المنتج غير موجود</h3>
        <Link href="/products" className="btn" style={{fontSize: 'clamp(1em, 2.5vw, 1.1em)', padding: 'clamp(12px, 2.5vw, 16px) clamp(28px, 6vw, 36px)'}}>
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/products" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        color: '#39ff14',
        marginBottom: 'clamp(25px, 5vw, 35px)',
        fontSize: 'clamp(1em, 2.5vw, 1.1em)',
        padding: 'clamp(10px, 2vw, 14px) clamp(14px, 3vw, 20px)',
        background: 'rgba(57, 255, 20, 0.1)',
        borderRadius: 10,
        border: '1px solid rgba(57, 255, 20, 0.2)',
        transition: 'all 0.3s ease',
        width: 'fit-content'
      }} className="back-button">
        ← العودة للمنتجات
      </Link>

      <div className="card" style={{
        padding: 'clamp(20px, 4vw, 30px)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
          gap: 'clamp(25px, 5vw, 35px)',
          alignItems: 'start'
        }}>
          <div style={{
            width: '100%',
            minHeight: '300px',
            background: `linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%), url(${product.imageUrl || '/placeholder.png'}) center/cover`,
            borderRadius: 'clamp(12px, 3vw, 16px)',
            border: '2px solid rgba(57, 255, 20, 0.2)',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.15)'
          }}></div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 4vw, 25px)'}}>
            {product.category && (
              <div style={{
                display: 'inline-flex',
                background: 'rgba(57, 255, 20, 0.15)',
                color: '#39ff14',
                padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 18px)',
                borderRadius: 10,
                fontSize: 'clamp(0.85em, 2vw, 0.95em)',
                fontWeight: 600,
                border: '1px solid rgba(57, 255, 20, 0.3)',
                width: 'fit-content'
              }}>
                {product.category}
              </div>
            )}

            <h1 style={{
              color: '#fff',
              margin: 0,
              fontSize: 'clamp(1.5em, 5vw, 2.2em)',
              lineHeight: 1.2
            }}>
              {product.name}
            </h1>

            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 'clamp(1em, 2.5vw, 1.15em)',
              lineHeight: 1.8,
              margin: 0
            }}>
              {product.description}
            </p>

            <div style={{
              background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
              padding: 'clamp(18px, 3.5vw, 24px)',
              borderRadius: 'clamp(12px, 3vw, 16px)',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              textAlign: 'center'
            }}>
              <p style={{color: 'rgba(255,255,255,0.6)', margin: 0, marginBottom: 8, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>السعر</p>
              <div style={{
                fontSize: 'clamp(2em, 6vw, 2.8em)',
                fontWeight: 900,
                color: '#39ff14',
                textShadow: '0 0 20px rgba(57, 255, 20, 0.4)',
                margin: 0
              }}>
                {product.price} دج
              </div>
            </div>

            <button
              onClick={buyNow}
              className="btn"
              style={{
                width: '100%',
                fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
                padding: 'clamp(14px, 3vw, 18px)',
                borderRadius: 'clamp(12px, 3vw, 16px)'
              }}
            >
              💳 شراء الآن
            </button>

            {false && (
              <div style={{
                width: '100%',
                background: 'rgba(57, 255, 20, 0.15)',
                color: '#39ff14',
                padding: 'clamp(14px, 3vw, 18px)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: 'clamp(1em, 2.5vw, 1.15em)',
                border: '2px solid rgba(57, 255, 20, 0.3)',
                boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
              }}>
                ✅ موجود في السلة
              </div>
            )}

            <Link href="/cart" className="btn btn-outline" style={{
              width: '100%',
              fontSize: 'clamp(1em, 2.5vw, 1.15em)',
              padding: 'clamp(14px, 3vw, 18px)',
              borderRadius: 'clamp(12px, 3vw, 16px)',
              textAlign: 'center'
            }}>
              💳 إتمام الشراء
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .back-button:hover {
          background: rgba(57, 255, 20, 0.15) !important;
          box-shadow: 0 0 15px rgba(57, 255, 20, 0.2) !important;
        }
        
        @media (max-width: 600px) {
          .card {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
