import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signInWithGoogle } from '@/lib/firebaseClient';
import Link from 'next/link';

interface Order {
  id: string;
  items: any[];
  total: number;
  paymentImageUrl: string;
  email: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: any;
  confirmedAt?: any;
  rejectedAt?: any;
  rejectionReason?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        loadOrders(u.uid, u.email);
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  async function loadOrders(userId: string, email: string | null) {
    setLoading(true);
    try {
      const qUserId = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapUserId = await getDocs(qUserId);
      let ordersList = snapUserId.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      
      if (email) {
        const qEmail = query(
          collection(db, 'orders'),
          where('email', '==', email)
        );
        const snapEmail = await getDocs(qEmail);
        const emailOrders = snapEmail.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        
        const allOrders = [...ordersList, ...emailOrders];
        const uniqueOrders = allOrders.filter((order, index, self) =>
          index === self.findIndex((o) => o.id === order.id)
        );
        ordersList = uniqueOrders;
      }
      
      ordersList.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setOrders(ordersList);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending': return '#ffa500';
      case 'confirmed': return '#39ff14';
      case 'rejected': return '#ff6b6b';
      default: return '#c0c0c0';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return '⏳ قيد المراجعة';
      case 'confirmed': return '✅ تم التأكيد';
      case 'rejected': return '❌ مرفوض';
      default: return status;
    }
  }

  function formatDate(timestamp: any) {
    if (!timestamp) return 'غير متوفر';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

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
          }}>طلباتي</h2>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 60px)',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: 'clamp(3.5em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>🔐</div>
          <h3 style={{color: '#39ff14', marginBottom: 'clamp(12px, 2vw, 18px)', textShadow: '0 0 15px rgba(57, 255, 20, 0.3)', fontSize: 'clamp(1.2em, 3.5vw, 1.5em)'}}>يجب تسجيل الدخول</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 'clamp(25px, 5vw, 35px)', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>الرجاء تسجيل الدخول لعرض طلباتك</p>
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
        }}>📋 طلباتي</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>تتبع حالة طلباتك</p>
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
          <p style={{color: '#39ff14', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>جاري تحميل الطلبات...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: 'clamp(40px, 8vw, 60px)',
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: 'clamp(3.5em, 10vw, 4.5em)', marginBottom: 'clamp(20px, 4vw, 30px)'}}>📭</div>
          <h3 style={{color: '#39ff14', marginBottom: 'clamp(12px, 2vw, 18px)', textShadow: '0 0 15px rgba(57, 255, 20, 0.3)', fontSize: 'clamp(1.2em, 3.5vw, 1.5em)'}}>لا توجد طلبات</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 'clamp(25px, 5vw, 35px)', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>لم تقم بأي طلبات حتى الآن</p>
          <Link href="/products" className="btn">🛍️ تصفح المنتجات</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 'clamp(18px, 4vw, 28px)',
          maxWidth: 900,
          margin: '0 auto'
        }}>
          {orders.map((order, idx) => (
            <div key={order.id} className="card animate-fadeInUp" style={{
              padding: 'clamp(20px, 4vw, 28px)',
              borderLeft: `4px solid ${getStatusColor(order.status)}`,
              animationDelay: `${idx * 0.05}s`,
              opacity: 0
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'clamp(12px, 2vw, 20px)', flexWrap: 'wrap', marginBottom: 'clamp(16px, 3vw, 22px)'}}>
                <div>
                  <h3 style={{color: '#fff', marginBottom: 8, fontSize: 'clamp(1.05em, 3vw, 1.25em)'}}>الطلب #{order.id?.substring(0, 8)}</h3>
                  <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{formatDate(order.createdAt)}</p>
                </div>
                <div style={{
                  background: 'rgba(57, 255, 20, 0.1)',
                  padding: 'clamp(8px, 1.5vw, 12px) clamp(14px, 3vw, 18px)',
                  borderRadius: 10,
                  fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                  color: getStatusColor(order.status),
                  fontWeight: 600,
                  border: `1px solid ${getStatusColor(order.status)}80`,
                  whiteSpace: 'nowrap'
                }}>
                  {getStatusText(order.status)}
                </div>
              </div>

              <div style={{
                background: 'rgba(57, 255, 20, 0.05)',
                padding: 'clamp(14px, 3vw, 18px)',
                borderRadius: 10,
                marginBottom: 'clamp(14px, 3vw, 20px)'
              }}>
                <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>المنتجات:</p>
                {order.items?.map((item: any, i: number) => (
                  <p key={i} style={{color: '#fff', margin: 4, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>• {item.name} - {item.price} دج</p>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 'clamp(14px, 3vw, 20px)',
                borderTop: '1px solid rgba(57, 255, 20, 0.1)',
                gap: 'clamp(12px, 2vw, 18px)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <p style={{color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>المجموع</p>
                  <p style={{fontSize: 'clamp(1.3em, 4vw, 1.6em)', fontWeight: 700, color: '#39ff14', margin: 0, textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'}}>{order.total} دج</p>
                </div>
                {order.paymentImageUrl && (
                  <a 
                    href={order.paymentImageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn"
                    style={{fontSize: 'clamp(0.9em, 2.5vw, 1em)', padding: 'clamp(10px, 2vw, 12px) clamp(18px, 3vw, 24px)'}}
                  >
                    🖼️ عرض الإيصال
                  </a>
                )}
              </div>

              {order.rejectionReason && (
                <div style={{
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: 10,
                  padding: 'clamp(12px, 2.5vw, 16px)',
                  marginTop: 'clamp(14px, 3vw, 20px)',
                  color: '#ff6b6b',
                  fontSize: 'clamp(0.9em, 2.5vw, 0.95em)'
                }}>
                  <strong>سبب الرفض:</strong> {order.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
