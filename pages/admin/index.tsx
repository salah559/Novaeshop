import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { isAdmin } from '@/lib/adminCheck';
import Link from 'next/link';

export default function Admin(){
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      const authorized = u ? isAdmin(u.email) : false;
      setIsAuthorized(authorized);
      if (authorized) {
        loadOrders();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  },[]);

  async function loadOrders(){
    setLoading(true);
    try{
      const q = query(
        collection(db, 'orders'), 
        where('status', '==', 'pending')
      );
      const snap = await getDocs(q);
      const ordersList = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setOrders(ordersList.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      }));
    }catch(e){
      console.error(e);
      alert('حدث خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }

  async function confirm(orderId: string){
    if(!window.confirm('هل أنت متأكد من تأكيد هذا الطلب؟')) return;
    
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const items = order.items || [];
      
      for (const item of items) {
        const productSnap = await getDocs(query(collection(db, 'products'), where('__name__', '==', item.id)));
        if (productSnap.empty) continue;
        
        const productData = productSnap.docs[0].data();
        
        await addDoc(collection(db, 'purchases'), {
          userId: order.userId || null,
          productId: item.id,
          name: productData.name || item.name,
          downloadUrl: productData.fileUrl || null,
          createdAt: new Date()
        });
      }
      
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'confirmed',
        confirmedAt: new Date()
      });
      
      alert('✅ تم تأكيد الطلب بنجاح');
      loadOrders();
    } catch(e) {
      alert('❌ حدث خطأ في تأكيد الطلب');
      console.error(e);
    }
  }

  if (!user || !isAuthorized) {
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
          }}>غير مصرح</h2>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          padding: 60,
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: '4em', marginBottom: 20}}>🚫</div>
          <h3 style={{color: '#00ff88', marginBottom: 15}}>وصول محظور</h3>
          <p style={{color: '#c0c0c0'}}>هذه الصفحة مخصصة للمدراء فقط</p>
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
        }}>لوحة الأدمن</h2>
        <p style={{color: '#c0c0c0'}}>إدارة الطلبات والمدفوعات</p>
      </div>

      <div style={{
        display: 'flex',
        gap: 15,
        marginBottom: 30,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '12px 24px',
          background: '#00ff88',
          border: '1px solid #00ff88',
          borderRadius: 8,
          color: '#0a0f14',
          fontWeight: 600
        }}>
          📦 الطلبات
        </div>
        <Link href="/admin/products" style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 8,
          color: '#c0c0c0',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          🛍️ المنتجات
        </Link>
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
          <p style={{color: '#00ff88'}}>جاري تحميل الطلبات...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 25
        }}>
          {orders.length === 0 ? (
            <div className="card" style={{
              textAlign: 'center',
              padding: 60
            }}>
              <div style={{fontSize: '4em', marginBottom: 20}}>📋</div>
              <h3 style={{color: '#00ff88', marginBottom: 15}}>لا توجد طلبات</h3>
              <p style={{color: '#c0c0c0'}}>لا توجد طلبات معلقة في الوقت الحالي</p>
            </div>
          ) : (
            orders.map(o=>(
              <div key={o.id} className="card" style={{
                background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
                border: '1px solid rgba(0, 255, 136, 0.4)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 20,
                  marginBottom: 20
                }}>
                  <div>
                    <h4 style={{color: '#00ff88', marginBottom: 8}}>معلومات الطلب</h4>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 5}}>
                      <strong style={{color: '#fff'}}>رقم الطلب:</strong> {o.id.substring(0, 8)}...
                    </p>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 5}}>
                      <strong style={{color: '#fff'}}>البريد:</strong> {o.email || 'غير متوفر'}
                    </p>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>
                      <strong style={{color: '#fff'}}>المبلغ:</strong> 
                      <span style={{
                        color: '#00ff88',
                        marginRight: 8,
                        fontSize: '1.2em',
                        fontWeight: 700
                      }}>{o.total} دج</span>
                    </p>
                  </div>

                  <div>
                    <h4 style={{color: '#00ff88', marginBottom: 8}}>المنتجات</h4>
                    {o.items && o.items.map((item: any, idx: number) => (
                      <p key={idx} style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 3}}>
                        • {item.name} - {item.price} دج
                      </p>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 20
                }}>
                  <h4 style={{color: '#00ff88', marginBottom: 12}}>إيصال الدفع</h4>
                  <img 
                    src={o.paymentImageUrl} 
                    alt="إيصال الدفع"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      border: '2px solid rgba(0, 255, 136, 0.3)',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                <button 
                  onClick={()=>confirm(o.id)} 
                  className="btn" 
                  style={{
                    width: '100%',
                    fontSize: '1.1em',
                    padding: '14px',
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)'
                  }}
                >
                  ✓ تأكيد الدفع وتفعيل الطلب
                </button>
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
