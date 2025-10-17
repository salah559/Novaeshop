import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MyPurchases(){
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u=> {
      setUser(u);
      if(u) load(u.uid);
      else setLoading(false);
    });
    return ()=>unsub();
  },[]);

  async function load(uid: string){
    const ordersQuery = query(collection(db, 'orders'), where('userId','==',uid));
    const purchasesQuery = query(collection(db, 'purchases'), where('userId','==',uid));
    
    const [ordersSnap, purchasesSnap] = await Promise.all([
      getDocs(ordersQuery),
      getDocs(purchasesQuery)
    ]);
    
    const orders = ordersSnap.docs.map(d=>({
      id: d.id,
      ...d.data(),
      type: 'order'
    }));
    
    const purchases = purchasesSnap.docs.map(d=>({
      id: d.id,
      ...d.data(),
      type: 'purchase'
    }));
    
    setPurchases([...orders, ...purchases].sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    }));
    
    setLoading(false);
  }

  if(!user){
    return (
      <div>
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          padding: '30px 20px',
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
          borderRadius: 16
        }}>
          <h2 style={{
            fontSize: '2.5em',
            marginBottom: 10,
            background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>مشترياتي</h2>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          padding: 60,
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: '4em', marginBottom: 20}}>🔐</div>
          <h3 style={{color: '#00ff88', marginBottom: 15}}>يجب تسجيل الدخول</h3>
          <p style={{color: '#c0c0c0'}}>الرجاء تسجيل الدخول لعرض مشترياتك</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        padding: '30px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 10,
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>مشترياتي</h2>
        <p style={{color: '#c0c0c0'}}>جميع منتجاتك الرقمية في مكان واحد</p>
      </div>

      {loading ? (
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
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 20,
          maxWidth: 900,
          margin: '0 auto'
        }}>
          {purchases.length === 0 ? (
            <div className="card" style={{
              textAlign: 'center',
              padding: 60
            }}>
              <div style={{fontSize: '4em', marginBottom: 20}}>📦</div>
              <h3 style={{color: '#00ff88', marginBottom: 15}}>لا توجد مشتريات</h3>
              <p style={{color: '#c0c0c0', marginBottom: 30}}>لم تقم بشراء أي منتجات بعد</p>
              <a href="/products" className="btn">تصفح المنتجات</a>
            </div>
          ) : (
            purchases.map(p=>(
              <div key={p.id} className="card" style={{
                background: p.type === 'order' 
                  ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)'
                  : 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
                border: p.type === 'order'
                  ? '1px solid rgba(255, 193, 7, 0.3)'
                  : '1px solid rgba(0, 255, 136, 0.3)'
              }}>
                {p.type === 'order' ? (
                  <>
                    <div style={{marginBottom: 20}}>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(255, 193, 7, 0.2)',
                        color: '#ffc107',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: '0.85em',
                        fontWeight: 600,
                        marginBottom: 15
                      }}>
                        ⏳ قيد المراجعة
                      </div>
                      <h3 style={{color: '#fff', marginBottom: 12}}>طلبية #{p.id.substring(0, 8)}</h3>
                      <div style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 8}}>
                        <strong>المنتجات:</strong>
                      </div>
                      {p.items && p.items.map((item: any, idx: number) => (
                        <div key={idx} style={{
                          color: '#c0c0c0',
                          fontSize: '0.9em',
                          marginBottom: 4,
                          paddingRight: 15
                        }}>
                          • {item.name} - {item.price} دج
                        </div>
                      ))}
                      <div style={{
                        marginTop: 12,
                        padding: '12px 0',
                        borderTop: '1px solid rgba(255, 193, 7, 0.2)',
                        color: '#ffc107',
                        fontWeight: 700,
                        fontSize: '1.1em'
                      }}>
                        المجموع: {p.total} دج
                      </div>
                      <p style={{color: '#c0c0c0', fontSize: '0.85em', marginTop: 8}}>
                        📅 تاريخ الطلب: {p.createdAt?.toDate?.()?.toLocaleDateString('ar-DZ') || 'غير محدد'}
                      </p>
                    </div>
                    <div style={{
                      background: 'rgba(255, 193, 7, 0.1)',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#ffc107'
                    }}>
                      جاري مراجعة طلبك، سيتم تفعيله قريباً
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{flex: 1}}>
                      <div style={{
                        display: 'inline-block',
                        background: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: '0.85em',
                        fontWeight: 600,
                        marginBottom: 12
                      }}>
                        ✅ مؤكد
                      </div>
                      <h3 style={{color: '#fff', marginBottom: 8}}>{p.name}</h3>
                      <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>
                        تم الشراء: {p.createdAt?.toDate?.()?.toLocaleDateString('ar-DZ') || 'غير محدد'}
                      </p>
                    </div>
                    <a 
                      className="btn" 
                      href={p.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 15
                      }}
                    >
                      <span>تحميل</span>
                      <span>⬇️</span>
                    </a>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
