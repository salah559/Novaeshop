import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function ProductDetails(){
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);

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
    checkCart();
  }, [id]);

  function checkCart() {
    if (typeof window === 'undefined') return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some((item: any) => item.id === id));
  }

  function addToCart() {
    if (typeof window === 'undefined') return;
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (cart.some((item: any) => item.id === id)) {
      alert('⚠️ هذا المنتج موجود بالفعل في السلة');
      return;
    }
    
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setInCart(true);
    alert('✅ تمت إضافة المنتج إلى السلة');
  }

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 60}}>
        <div style={{
          width: 60,
          height: 60,
          border: '4px solid rgba(0, 255, 136, 0.2)',
          borderTop: '4px solid #00ff88',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{color: '#00ff88'}}>جاري التحميل...</p>
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
        padding: 60,
        maxWidth: 600,
        margin: '60px auto'
      }}>
        <div style={{fontSize: '4em', marginBottom: 20}}>❌</div>
        <h3 style={{color: '#00ff88', marginBottom: 15}}>المنتج غير موجود</h3>
        <Link href="/products" className="btn">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto'
      }}>
        <Link href="/products" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          color: '#00ff88',
          marginBottom: 30,
          fontSize: '1.05em'
        }}>
          ← العودة للمنتجات
        </Link>

        <div className="card" style={{
          padding: 0,
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40
          }}>
            <div style={{
              width: '100%',
              minHeight: 400,
              background: `linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(0, 0, 0, 0.4) 100%), url(${product.imageUrl || '/placeholder.png'}) center/cover`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 25,
                right: 25,
                background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                color: '#0a0f14',
                padding: '12px 28px',
                borderRadius: 30,
                fontWeight: 700,
                fontSize: '1.4em',
                boxShadow: '0 6px 25px rgba(0, 255, 136, 0.5)'
              }}>
                {product.price === 0 ? 'مجاناً' : `${product.price} دج`}
              </div>
            </div>

            <div style={{padding: '40px 40px 40px 0'}}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(0, 255, 136, 0.15)',
                color: '#00ff88',
                padding: '6px 18px',
                borderRadius: 20,
                fontSize: '0.85em',
                fontWeight: 600,
                marginBottom: 20
              }}>
                {product.category || 'منتج رقمي'}
              </div>

              <h1 style={{
                fontSize: '2.5em',
                color: '#fff',
                marginBottom: 25,
                lineHeight: 1.2
              }}>{product.name}</h1>

              <p style={{
                color: '#c0c0c0',
                lineHeight: 1.8,
                fontSize: '1.05em',
                marginBottom: 35
              }}>{product.description || 'منتج رقمي عالي الجودة'}</p>

              {inCart ? (
                <div style={{
                  display: 'flex',
                  gap: 15,
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    flex: 1,
                    background: 'rgba(0, 255, 136, 0.15)',
                    border: '2px solid rgba(0, 255, 136, 0.4)',
                    borderRadius: 12,
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    color: '#00ff88',
                    fontWeight: 600
                  }}>
                    <span style={{fontSize: '1.5em'}}>✓</span>
                    <span>في السلة</span>
                  </div>
                  <Link href="/cart" className="btn" style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '18px 24px',
                    fontSize: '1.1em'
                  }}>
                    عرض السلة →
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={addToCart}
                  className="btn" 
                  style={{
                    width: '100%',
                    fontSize: '1.2em',
                    padding: '18px',
                    boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
                  }}
                >
                  إضافة إلى السلة 🛒
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 25,
          marginTop: 40
        }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)'
          }}>
            <div style={{fontSize: '2.5em', marginBottom: 15}}>⚡</div>
            <h3 style={{color: '#00ff88', marginBottom: 10}}>تسليم فوري</h3>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>احصل على المنتج فوراً بعد تأكيد الدفع</p>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)'
          }}>
            <div style={{fontSize: '2.5em', marginBottom: 15}}>🔒</div>
            <h3 style={{color: '#00ff88', marginBottom: 10}}>دفع آمن</h3>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>نظام دفع آمن ومضمون 100%</p>
          </div>

          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)'
          }}>
            <div style={{fontSize: '2.5em', marginBottom: 15}}>♾️</div>
            <h3 style={{color: '#00ff88', marginBottom: 10}}>حقوق إعادة بيع</h3>
            <p style={{color: '#c0c0c0', fontSize: '0.95em'}}>يمكنك إعادة بيع المنتج بلا حدود</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .card > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
