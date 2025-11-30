import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { getCache, setCache } from '@/lib/cache';

export default function MyPurchases(){
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  async function load(uid: string){
    const cacheKey = `purchases_${uid}`;

    const ordersQuery = query(collection(db, 'orders'), where('userId','==',uid));
    const purchasesQuery = query(collection(db, 'purchases'), where('userId','==',uid));
    
    const [ordersSnap, purchasesSnap] = await Promise.all([
      getDocs(ordersQuery),
      getDocs(purchasesQuery)
    ]);
    
    const orders = ordersSnap.docs
      .filter((d: any) => d.data().status === 'pending')
      .map(d=>({
        id: d.id,
        ...d.data(),
        type: 'order'
      }));
    
    const purchasesData = purchasesSnap.docs.map(d=>({
      id: d.id,
      ...d.data(),
      type: 'purchase'
    }));
    
    const allData = [...orders, ...purchasesData].sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    setPurchases(allData);
    setLoading(false);
  }

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(async u=> {
      setUser(u);
      if(u) await load(u.uid);
      else setLoading(false);
    });
    return ()=>unsub();
  }, []);

  if(!user){
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
          }}>مشترياتي</h2>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 60px)',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: 'clamp(3.5em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>🔐</div>
          <h3 style={{color: '#39ff14', marginBottom: 'clamp(12px, 2vw, 18px)', textShadow: '0 0 15px rgba(57, 255, 20, 0.3)', fontSize: 'clamp(1.2em, 3.5vw, 1.5em)'}}>يجب تسجيل الدخول</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>الرجاء تسجيل الدخول لعرض مشترياتك</p>
        </div>
      </div>
    );
  }

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
        }}>📦 مشترياتي</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>جميع منتجاتك الرقمية في مكان واحد</p>
      </div>

      {loading ? (
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
      ) : purchases.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 60px)',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: 'clamp(3.5em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>🎁</div>
          <h3 style={{color: '#39ff14', marginBottom: 'clamp(12px, 2vw, 18px)', textShadow: '0 0 15px rgba(57, 255, 20, 0.3)', fontSize: 'clamp(1.2em, 3.5vw, 1.5em)'}}>لم تشتري شيئاً بعد</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 'clamp(25px, 5vw, 35px)', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>ابدأ بتصفح منتجاتنا وأضف إلى سلتك</p>
          <Link href="/products" className="btn" style={{fontSize: 'clamp(1em, 2.5vw, 1.15em)', padding: 'clamp(12px, 2.5vw, 16px) clamp(28px, 6vw, 36px)'}}>🛍️ تصفح المنتجات</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 'clamp(18px, 4vw, 28px)',
          maxWidth: 900,
          margin: '0 auto'
        }}>
          {purchases.map((item, idx) => (
            <div key={item.id} className="card animate-fadeInUp" style={{
              padding: 'clamp(20px, 4vw, 28px)',
              borderLeft: item.type === 'purchase' ? '4px solid #39ff14' : '4px solid #ffa500',
              animationDelay: `${idx * 0.05}s`,
              opacity: 0
            }}>
              {item.type === 'purchase' ? (
                <>
                  <div style={{marginBottom: 'clamp(14px, 3vw, 20px)'}}>
                    <h3 style={{color: '#fff', marginBottom: 8, fontSize: 'clamp(1.05em, 3vw, 1.25em)', textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'}}>{item.name}</h3>
                    <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{item.createdAt?.toDate?.().toLocaleDateString('ar-DZ')}</p>
                  </div>
                  {item.purchaseContent && item.purchaseContent.trim() && (() => {
                    const lines: string[] = typeof item.purchaseContent === 'string' ? item.purchaseContent.split('\n') : [];
                    const urls: string[] = lines.filter((line: string) => {
                      const trimmed = line.trim();
                      return trimmed.startsWith('http://') || trimmed.startsWith('https://');
                    }).map((l: string) => l.trim());
                    const textLines: string[] = lines.filter((line: string) => {
                      const trimmed = line.trim();
                      return !(trimmed.startsWith('http://') || trimmed.startsWith('https://'));
                    }).filter((l: string) => l.trim());

                    return (
                      <>
                        {urls.length > 0 && (
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.08) 100%)',
                            padding: 'clamp(14px, 3vw, 18px)',
                            borderRadius: 10,
                            borderLeft: '4px solid #39ff14',
                            marginBottom: 'clamp(14px, 3vw, 20px)'
                          }}>
                            <p style={{color: '#39ff14', marginBottom: 12, fontSize: 'clamp(0.9em, 2.5vw, 1em)', fontWeight: 'bold', margin: 0}}>🔗 الروابط</p>
                            <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                              {urls.map((url: string, i: number) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => window.open(url, '_blank')}
                                  style={{
                                    background: 'transparent',
                                    border: '2px solid #39ff14',
                                    color: '#39ff14',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(0.8em, 2vw, 0.9em)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s ease',
                                    textAlign: 'center',
                                    minHeight: 44,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    zIndex: 10
                                  }}
                                  onMouseEnter={(e) => {
                                    const btn = e.currentTarget;
                                    btn.style.background = 'rgba(57, 255, 20, 0.2)';
                                    btn.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    const btn = e.currentTarget;
                                    btn.style.background = 'transparent';
                                    btn.style.transform = 'translateY(0)';
                                  }}
                                >
                                  🌐 فتح الرابط {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {textLines.length > 0 && (
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
                            padding: 'clamp(14px, 3vw, 18px)',
                            borderRadius: 10,
                            borderLeft: '4px solid #ffd700',
                            marginBottom: 'clamp(14px, 3vw, 20px)',
                            wordBreak: 'break-word'
                          }}>
                            <p style={{color: '#ffd700', marginBottom: 10, fontSize: 'clamp(0.9em, 2.5vw, 1em)', fontWeight: 'bold'}}>📋 محتوى الشراء</p>
                            <div style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 'clamp(0.85em, 2.5vw, 0.95em)',
                              lineHeight: 1.8,
                              whiteSpace: 'pre-wrap'
                            }}>
                              {textLines.map((line: string, idx: number) => (
                                <div key={idx} style={{marginBottom: 8}}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div style={{marginBottom: 'clamp(14px, 3vw, 20px)'}}>
                    <h3 style={{color: '#fff', marginBottom: 8, fontSize: 'clamp(1.05em, 3vw, 1.25em)'}}>الطلب #{item.id?.substring(0, 8)}</h3>
                    <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{item.createdAt?.toDate?.().toLocaleDateString('ar-DZ')}</p>
                  </div>
                  <div style={{
                    background: 'rgba(255, 165, 0, 0.08)',
                    padding: 'clamp(14px, 3vw, 18px)',
                    borderRadius: 10,
                    marginBottom: 'clamp(14px, 3vw, 20px)'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
                      <span style={{fontSize: '1.3em'}}>⏳</span>
                      <p style={{color: '#ffa500', fontSize: 'clamp(0.95em, 2.5vw, 1.05em)', margin: 0, fontWeight: 600}}>قيد المراجعة</p>
                    </div>
                    <p style={{color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)', margin: 0}}>المجموع: <strong style={{color: '#ffd700'}}>{item.total} دج</strong></p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
