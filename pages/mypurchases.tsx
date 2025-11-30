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
        <div style={{maxWidth: 1000, margin: '0 auto'}}>
          {purchases.map((item) => (
            <div key={item.id} style={{
              padding: '20px',
              marginBottom: '20px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '8px'
            }}>
              <h3 style={{color: '#39ff14', marginBottom: '8px', fontSize: '1.2em'}}>
                {item.type === 'purchase' ? item.name : `الطلب #${item.id?.substring(0, 8)}`}
              </h3>
              <p style={{color: '#999', fontSize: '0.9em', marginBottom: '15px'}}>
                {item.createdAt?.toDate?.().toLocaleDateString('ar-DZ')}
              </p>
              
              {item.type === 'purchase' ? (
                <>
                  {item.purchaseContent && item.purchaseContent.trim() && (
                    <div style={{
                      background: '#0a0a0a',
                      padding: '15px',
                      borderRadius: '6px',
                      border: '1px solid #444',
                      marginBottom: '15px'
                    }}>
                      <p style={{color: '#ffd700', marginBottom: '10px', fontWeight: 'bold'}}>محتوى الشراء:</p>
                      <div style={{
                        color: '#ccc',
                        fontSize: '0.95em',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontFamily: 'monospace'
                      }}>
                        {typeof item.purchaseContent === 'string' 
                          ? item.purchaseContent.split('\n').map((line: string, idx: number) => {
                              const urlMatches = line.match(/https?:\/\/[^\s]+/g);
                              if (!urlMatches) {
                                return <div key={idx}>{line}</div>;
                              }
                              
                              let parts: any[] = [];
                              let lastIndex = 0;
                              
                              urlMatches.forEach((url: string) => {
                                const startIndex = line.indexOf(url, lastIndex);
                                if (startIndex > lastIndex) {
                                  parts.push({ type: 'text', content: line.substring(lastIndex, startIndex) });
                                }
                                parts.push({ type: 'url', content: url });
                                lastIndex = startIndex + url.length;
                              });
                              
                              if (lastIndex < line.length) {
                                parts.push({ type: 'text', content: line.substring(lastIndex) });
                              }
                              
                              return (
                                <div key={idx}>
                                  {parts.map((part: any, i: number) =>
                                    part.type === 'url' ? (
                                      <button
                                        key={i}
                                        onClick={() => window.open(part.content, '_blank')}
                                        style={{
                                          background: '#39ff14',
                                          color: '#000',
                                          border: 'none',
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: 'inherit',
                                          fontFamily: 'inherit',
                                          fontWeight: 'bold',
                                          marginLeft: '4px',
                                          marginRight: '4px'
                                        }}
                                      >
                                        🔗
                                      </button>
                                    ) : (
                                      <span key={i}>{part.content}</span>
                                    )
                                  )}
                                </div>
                              );
                            })
                          : JSON.stringify(item.purchaseContent)
                        }
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{color: '#ffa500'}}>
                  قيد المراجعة - المجموع: {item.total} دج
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
