import Link from 'next/link';

export default function Cart(){
  const items = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')||'[]') : [];
  const total = items.reduce((s: number, i: any)=>s+(i.price||0),0);
  
  return (
    <div>
      <div className="animate-fadeIn" style={{
        textAlign: 'center',
        marginBottom: 'clamp(20px, 5vw, 40px)',
        padding: 'clamp(20px, 5vw, 30px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 'clamp(12px, 3vw, 16px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8em, 6vw, 2.5em)',
          marginBottom: 'clamp(8px, 2vw, 10px)',
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>🛒 سلة التسوق</h2>
        <p style={{color: '#c0c0c0', fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>راجع منتجاتك قبل الدفع</p>
      </div>

      <div className="card animate-fadeInUp shadow-glow" style={{
        maxWidth: 800,
        margin: '0 auto'
      }}>
        {items.length === 0 ? (
          <div className="animate-scaleIn" style={{
            textAlign: 'center',
            padding: 'clamp(40px, 8vw, 60px) clamp(15px, 3vw, 20px)'
          }}>
            <div className="animate-float" style={{fontSize: 'clamp(3em, 10vw, 4em)', marginBottom: 'clamp(15px, 3vw, 20px)'}}>🛒</div>
            <h3 style={{color: '#00ff88', marginBottom: 'clamp(12px, 2vw, 15px)', fontSize: 'clamp(1.2em, 4vw, 1.5em)'}}>السلة فارغة</h3>
            <p style={{color: '#c0c0c0', marginBottom: 'clamp(20px, 4vw, 30px)', fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/products" className="btn shadow-glow-hover" style={{
              fontSize: 'clamp(0.9em, 2.5vw, 1em)',
              padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 6vw, 28px)'
            }}>
              🛍️ تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div style={{marginBottom: 'clamp(20px, 4vw, 30px)'}}>
              {items.map((it:any, idx:number)=>(
                <div key={idx} className="animate-fadeInUp shadow-glow-hover" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'clamp(15px, 3vw, 20px) 0',
                  borderBottom: idx < items.length - 1 ? '1px solid rgba(0, 255, 136, 0.1)' : 'none',
                  gap: 'clamp(10px, 2vw, 15px)',
                  flexWrap: 'wrap',
                  animationDelay: `${idx * 0.1}s`,
                  opacity: 0
                }}>
                  <div style={{flex: 1, minWidth: 'min(200px, 100%)'}}>
                    <h4 style={{
                      color: '#fff', 
                      marginBottom: 'clamp(6px, 1.5vw, 8px)',
                      fontSize: 'clamp(1em, 3vw, 1.2em)'
                    }}>{it.name}</h4>
                    <p style={{
                      color: '#c0c0c0', 
                      fontSize: 'clamp(0.85em, 2vw, 0.9em)'
                    }}>كمية: 1</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(10px, 2vw, 15px)',
                    flexWrap: 'wrap'
                  }}>
                    <div className="pulse-animation" style={{
                      background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%)',
                      padding: 'clamp(6px, 1.5vw, 8px) clamp(16px, 4vw, 20px)',
                      borderRadius: 8,
                      color: '#00ff88',
                      fontWeight: 700,
                      fontSize: 'clamp(1em, 2.5vw, 1.1em)'
                    }}>
                      {it.price} دج
                    </div>
                    <button
                      onClick={() => {
                        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const updated = cart.filter((_:any, i:number) => i !== idx);
                        localStorage.setItem('cart', JSON.stringify(updated));
                        window.location.reload();
                      }}
                      className="shadow-glow-hover"
                      style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 0, 0, 0.3)',
                        borderRadius: 8,
                        padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px)',
                        color: '#ff4444',
                        cursor: 'pointer',
                        fontSize: 'clamp(1em, 2.5vw, 1.1em)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '2px solid rgba(0, 255, 136, 0.3)',
              paddingTop: 'clamp(20px, 4vw, 25px)',
              marginTop: 'clamp(20px, 4vw, 25px)'
            }}>
              <div className="cart-total" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'clamp(20px, 4vw, 30px)',
                gap: 'clamp(10px, 2vw, 15px)',
                flexWrap: 'wrap'
              }}>
                <strong style={{
                  fontSize: 'clamp(1.2em, 4vw, 1.4em)', 
                  color: '#fff'
                }}>المجموع الكلي</strong>
                <strong className="pulse-animation" style={{
                  fontSize: 'clamp(1.5em, 5vw, 1.8em)',
                  background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{total} دج</strong>
              </div>
              
              <Link href="/checkout" className="btn shadow-glow-hover" style={{
                width: '100%',
                textAlign: 'center',
                display: 'block',
                fontSize: 'clamp(1em, 2.5vw, 1.1em)',
                padding: 'clamp(12px, 3vw, 16px)',
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
              }}>
                💳 متابعة الدفع →
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 480px) {
          .cart-total {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
