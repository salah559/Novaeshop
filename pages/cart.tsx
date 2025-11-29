import Link from 'next/link';

export default function Cart(){
  const items = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')||'[]') : [];
  const total = items.reduce((s: number, i: any)=>s+(i.price||0),0);
  
  return (
    <div>
      <div className="animate-fadeIn" style={{
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
        }}>🛒 سلة التسوق</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>راجع منتجاتك قبل الدفع</p>
      </div>

      <div className="card animate-fadeInUp" style={{
        maxWidth: 850,
        margin: '0 auto',
        padding: 'clamp(25px, 5vw, 35px)'
      }}>
        {items.length === 0 ? (
          <div className="animate-scaleIn" style={{
            textAlign: 'center',
            padding: 'clamp(40px, 8vw, 60px) clamp(15px, 3vw, 20px)'
          }}>
            <div className="animate-float" style={{fontSize: 'clamp(3em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>🛒</div>
            <h3 style={{
              color: '#39ff14',
              marginBottom: 'clamp(12px, 2vw, 18px)',
              fontSize: 'clamp(1.3em, 4.5vw, 1.7em)',
              textShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
            }}>السلة فارغة</h3>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 'clamp(25px, 5vw, 35px)',
              fontSize: 'clamp(1em, 2.5vw, 1.15em)'
            }}>لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/products" className="btn" style={{
              fontSize: 'clamp(1em, 2.5vw, 1.15em)',
              padding: 'clamp(14px, 3vw, 18px) clamp(30px, 7vw, 40px)'
            }}>
              🛍️ تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div style={{marginBottom: 'clamp(25px, 5vw, 35px)'}}>
              {items.map((it:any, idx:number)=>(
                <div key={idx} className="animate-fadeInUp" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'clamp(16px, 3vw, 22px) 0',
                  borderBottom: idx < items.length - 1 ? '1px solid rgba(57, 255, 20, 0.15)' : 'none',
                  gap: 'clamp(12px, 2vw, 18px)',
                  flexWrap: 'wrap',
                  animationDelay: `${idx * 0.1}s`,
                  opacity: 0
                }}>
                  <div style={{flex: 1, minWidth: 'min(200px, 100%)'}}>
                    <h4 style={{
                      color: '#fff',
                      marginBottom: 'clamp(6px, 1.5vw, 10px)',
                      fontSize: 'clamp(1.05em, 3vw, 1.3em)'
                    }}>{it.name}</h4>
                    <p style={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 'clamp(0.9em, 2.5vw, 0.95em)'
                    }}>كمية: 1</p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(12px, 2vw, 18px)',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
                      padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 4vw, 22px)',
                      borderRadius: '10px',
                      color: '#39ff14',
                      fontWeight: 700,
                      fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
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
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '2px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '10px',
                        padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2.5vw, 16px)',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: 'clamp(1em, 2.5vw, 1.15em)',
                        transition: 'all 0.3s ease',
                        fontWeight: 600
                      }}
                    >
                      ✕ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
              border: '2px solid rgba(57, 255, 20, 0.25)',
              borderRadius: '14px',
              padding: 'clamp(20px, 4vw, 28px)',
              marginBottom: 'clamp(25px, 5vw, 35px)',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '12px',
                fontSize: 'clamp(0.95em, 2.5vw, 1.05em)'
              }}>المجموع</p>
              <div style={{
                fontSize: 'clamp(2em, 6vw, 2.8em)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #39ff14, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
              }}>
                {total} دج
              </div>
            </div>

            <Link href="/checkout" className="btn" style={{
              width: '100%',
              textAlign: 'center',
              padding: 'clamp(14px, 3vw, 18px)',
              fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
              borderRadius: '12px',
              display: 'block'
            }}>
              💳 متابعة الدفع
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
