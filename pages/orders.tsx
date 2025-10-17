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
      // Get orders by userId
      const qUserId = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapUserId = await getDocs(qUserId);
      let ordersList = snapUserId.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      
      // Always get orders by email too (for legacy orders created before user had an account)
      if (email) {
        const qEmail = query(
          collection(db, 'orders'),
          where('email', '==', email)
        );
        const snapEmail = await getDocs(qEmail);
        const emailOrders = snapEmail.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        
        // Merge and remove duplicates
        const allOrders = [...ordersList, ...emailOrders];
        const uniqueOrders = allOrders.filter((order, index, self) =>
          index === self.findIndex((o) => o.id === order.id)
        );
        ordersList = uniqueOrders;
      }
      
      // Sort by creation date (newest first)
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
      case 'pending': return '#FFA500';
      case 'confirmed': return '#00ff88';
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

  if (!user) {
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
          }}>تسجيل الدخول مطلوب</h2>
          <p style={{ color: '#c0c0c0' }}>يجب عليك تسجيل الدخول لعرض طلباتك</p>
        </div>

        <div className="card" style={{
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4em', marginBottom: 30 }}>🔐</div>
          <h3 style={{ color: '#00ff88', marginBottom: 20, fontSize: '1.5em' }}>
            لعرض طلباتك
          </h3>
          <p style={{ color: '#c0c0c0', marginBottom: 30, lineHeight: 1.8 }}>
            يجب عليك تسجيل الدخول أولاً لتتبع حالة طلباتك ومشترياتك.
          </p>
          <button
            onClick={signInWithGoogle}
            className="btn"
            style={{
              fontSize: '1.2em',
              padding: '16px 40px',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
            }}
          >
            🔑 تسجيل الدخول بواسطة Google
          </button>
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
        }}>طلباتي</h2>
        <p style={{ color: '#c0c0c0' }}>تتبع حالة طلباتك ومشترياتك</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(0, 255, 136, 0.2)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#00ff88' }}>جاري تحميل الطلبات...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: 60,
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4em', marginBottom: 20 }}>📦</div>
          <h3 style={{ color: '#00ff88', marginBottom: 15 }}>لا توجد طلبات</h3>
          <p style={{ color: '#c0c0c0', marginBottom: 30 }}>
            لم تقم بأي طلبات بعد. تصفح المنتجات وابدأ الشراء!
          </p>
          <Link href="/products" className="btn">
            🛍️ تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: 25,
          maxWidth: 1000,
          margin: '0 auto'
        }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
              border: `2px solid ${getStatusColor(order.status)}40`
            }}>
              {/* Header with status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 15,
                borderBottom: '1px solid rgba(0, 255, 136, 0.2)'
              }}>
                <div>
                  <h3 style={{ color: '#00ff88', marginBottom: 5 }}>
                    طلب #{order.id.substring(0, 8)}
                  </h3>
                  <p style={{ color: '#888', fontSize: '0.9em' }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div style={{
                  padding: '10px 20px',
                  background: `${getStatusColor(order.status)}20`,
                  border: `2px solid ${getStatusColor(order.status)}`,
                  borderRadius: 8,
                  fontWeight: 700,
                  color: getStatusColor(order.status)
                }}>
                  {getStatusText(order.status)}
                </div>
              </div>

              {/* Order items */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ color: '#00ff88', marginBottom: 12 }}>المنتجات:</h4>
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                  }}>
                    <span style={{ color: '#c0c0c0' }}>• {item.name}</span>
                    <span style={{ color: '#00ff88', fontWeight: 600 }}>{item.price} دج</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 8,
                marginBottom: 20
              }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1em' }}>
                  المجموع الكلي:
                </span>
                <span style={{
                  color: '#00ff88',
                  fontWeight: 700,
                  fontSize: '1.5em'
                }}>
                  {order.total} دج
                </span>
              </div>

              {/* Status-specific messages */}
              {order.status === 'pending' && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 165, 0, 0.1)',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  borderRadius: 8,
                  color: '#FFA500'
                }}>
                  <strong>⏳ طلبك قيد المراجعة</strong>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.9em' }}>
                    جاري التحقق من إيصال الدفع. سيتم تفعيل طلبك قريباً وستتمكن من التحميل.
                  </p>
                </div>
              )}

              {order.status === 'confirmed' && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: 8
                }}>
                  <strong style={{ color: '#00ff88' }}>✅ تم تأكيد طلبك!</strong>
                  <p style={{ margin: '8px 0', fontSize: '0.9em', color: '#c0c0c0' }}>
                    تم في: {formatDate(order.confirmedAt)}
                  </p>
                  <Link 
                    href="/mypurchases" 
                    className="btn"
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      padding: '12px 24px'
                    }}
                  >
                    📥 تحميل المشتريات
                  </Link>
                </div>
              )}

              {order.status === 'rejected' && (
                <div style={{
                  padding: '15px',
                  background: 'rgba(255, 107, 107, 0.1)',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  borderRadius: 8,
                  color: '#ff6b6b'
                }}>
                  <strong>❌ تم رفض الطلب</strong>
                  <p style={{ margin: '8px 0', fontSize: '0.9em' }}>
                    تم في: {formatDate(order.rejectedAt)}
                  </p>
                  {order.rejectionReason && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9em' }}>
                      <strong>السبب:</strong> {order.rejectionReason}
                    </p>
                  )}
                  <p style={{ margin: '12px 0 0 0', fontSize: '0.85em', color: '#c0c0c0' }}>
                    💡 يمكنك التواصل معنا للاستفسار أو إعادة المحاولة بإيصال صحيح.
                  </p>
                </div>
              )}
            </div>
          ))}
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
