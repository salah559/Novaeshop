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
    const q = query(collection(db, 'purchases'), where('userId','==',uid));
    const snap = await getDocs(q);
    setPurchases(snap.docs.map(d=>({id:d.id, ...d.data()})));
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20,
                flexWrap: 'wrap'
              }}>
                <div style={{flex: 1}}>
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
                    gap: 8
                  }}
                >
                  <span>تحميل</span>
                  <span>⬇️</span>
                </a>
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
