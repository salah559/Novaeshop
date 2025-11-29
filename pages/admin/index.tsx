import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { isAdmin } from '@/lib/adminCheck';
import Link from 'next/link';

export default function Admin(){
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    rejected: 0,
    totalRevenue: 0,
    todayOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending');
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      const authorized = u ? isAdmin(u.email) : false;
      setIsAuthorized(authorized);
      if (authorized) {
        loadOrders();
        loadStats();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  },[]);

  useEffect(() => {
    if (isAuthorized) {
      loadOrders();
    }
  }, [filter, isAuthorized]);

  async function loadStats() {
    try {
      const allOrdersSnap = await getDocs(collection(db, 'orders'));
      const allOrders = allOrdersSnap.docs.map(d => ({id: d.id, ...d.data()}));
      
      const pending = allOrders.filter((o: any) => o.status === 'pending').length;
      const confirmed = allOrders.filter((o: any) => o.status === 'confirmed').length;
      const rejected = allOrders.filter((o: any) => o.status === 'rejected').length;
      
      const totalRevenue = allOrders
        .filter((o: any) => o.status === 'confirmed')
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = allOrders.filter((o: any) => {
        const orderDate = o.createdAt?.toDate?.() || new Date(0);
        return orderDate >= today;
      }).length;

      setStats({
        pending,
        confirmed,
        rejected,
        totalRevenue,
        todayOrders
      });
    } catch (e) {
      console.error('Error loading stats:', e);
    }
  }

  async function loadOrders(){
    setLoading(true);
    try{
      let q;
      if (filter === 'all') {
        q = query(collection(db, 'orders'));
      } else {
        q = query(
          collection(db, 'orders'), 
          where('status', '==', filter)
        );
      }
      
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
      loadStats();
    } catch(e) {
      alert('❌ حدث خطأ في تأكيد الطلب');
      console.error(e);
    }
  }

  async function rejectOrder(orderId: string) {
    if (!rejectionReason.trim()) {
      alert('⚠️ الرجاء إدخال سبب الرفض');
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectionReason: rejectionReason.trim()
      });
      
      alert('✅ تم رفض الطلب');
      setRejecting(null);
      setRejectionReason('');
      loadOrders();
      loadStats();
    } catch(e) {
      alert('❌ حدث خطأ في رفض الطلب');
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
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
          borderRadius: 16
        }}>
          <h2 style={{
            fontSize: '2.5em',
            marginBottom: 10,
            background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)',
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
          <h3 style={{color: '#39ff14', marginBottom: 15}}>وصول محظور</h3>
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
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 10,
          background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>لوحة الأدمن</h2>
        <p style={{color: '#c0c0c0'}}>إدارة الطلبات والمدفوعات</p>
      </div>

      {/* Statistics Dashboard */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        <div className="card" style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(255, 165, 0, 0.4)'
        }}>
          <div style={{fontSize: '2.5em', marginBottom: 10}}>⏳</div>
          <h3 style={{color: '#FFA500', fontSize: '2em', margin: '10px 0'}}>{stats.pending}</h3>
          <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>طلبات معلقة</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.4)'
        }}>
          <div style={{fontSize: '2.5em', marginBottom: 10}}>✅</div>
          <h3 style={{color: '#39ff14', fontSize: '2em', margin: '10px 0'}}>{stats.confirmed}</h3>
          <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>طلبات مؤكدة</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(255, 107, 107, 0.4)'
        }}>
          <div style={{fontSize: '2.5em', marginBottom: 10}}>❌</div>
          <h3 style={{color: '#ff6b6b', fontSize: '2em', margin: '10px 0'}}>{stats.rejected}</h3>
          <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>طلبات مرفوضة</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.4)'
        }}>
          <div style={{fontSize: '2.5em', marginBottom: 10}}>💰</div>
          <h3 style={{color: '#39ff14', fontSize: '1.5em', margin: '10px 0'}}>{stats.totalRevenue.toLocaleString()} دج</h3>
          <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>إجمالي المبيعات</p>
        </div>

        <div className="card" style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.4)'
        }}>
          <div style={{fontSize: '2.5em', marginBottom: 10}}>📅</div>
          <h3 style={{color: '#39ff14', fontSize: '2em', margin: '10px 0'}}>{stats.todayOrders}</h3>
          <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>طلبات اليوم</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={{
        display: 'flex',
        gap: 15,
        marginBottom: 30,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '12px 24px',
          background: '#39ff14',
          border: '1px solid #39ff14',
          borderRadius: 8,
          color: '#0a0f14',
          fontWeight: 600
        }}>
          📦 الطلبات
        </div>
        <Link href="/admin/products" style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          borderRadius: 8,
          color: '#c0c0c0',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          🛍️ المنتجات
        </Link>
      </div>

      {/* Filter buttons */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 30,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '10px 20px',
            background: filter === 'pending' ? 'rgba(255, 165, 0, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${filter === 'pending' ? '#FFA500' : 'rgba(255, 165, 0, 0.3)'}`,
            borderRadius: 8,
            color: filter === 'pending' ? '#FFA500' : '#c0c0c0',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ⏳ معلقة ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          style={{
            padding: '10px 20px',
            background: filter === 'confirmed' ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${filter === 'confirmed' ? '#39ff14' : 'rgba(57, 255, 20, 0.3)'}`,
            borderRadius: 8,
            color: filter === 'confirmed' ? '#39ff14' : '#c0c0c0',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ✅ مؤكدة ({stats.confirmed})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          style={{
            padding: '10px 20px',
            background: filter === 'rejected' ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${filter === 'rejected' ? '#ff6b6b' : 'rgba(255, 107, 107, 0.3)'}`,
            borderRadius: 8,
            color: filter === 'rejected' ? '#ff6b6b' : '#c0c0c0',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ❌ مرفوضة ({stats.rejected})
        </button>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '10px 20px',
            background: filter === 'all' ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${filter === 'all' ? '#39ff14' : 'rgba(57, 255, 20, 0.3)'}`,
            borderRadius: 8,
            color: filter === 'all' ? '#39ff14' : '#c0c0c0',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          📋 الكل ({stats.pending + stats.confirmed + stats.rejected})
        </button>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: 60}}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(57, 255, 20, 0.2)',
            borderTop: '4px solid #39ff14',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{color: '#39ff14'}}>جاري تحميل الطلبات...</p>
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
              <h3 style={{color: '#39ff14', marginBottom: 15}}>لا توجد طلبات</h3>
              <p style={{color: '#c0c0c0'}}>
                {filter === 'pending' && 'لا توجد طلبات معلقة في الوقت الحالي'}
                {filter === 'confirmed' && 'لا توجد طلبات مؤكدة'}
                {filter === 'rejected' && 'لا توجد طلبات مرفوضة'}
                {filter === 'all' && 'لا توجد أي طلبات'}
              </p>
            </div>
          ) : (
            orders.map(o=>(
              <div key={o.id} className="card" style={{
                background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
                border: '1px solid rgba(57, 255, 20, 0.4)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 20,
                  marginBottom: 20
                }}>
                  <div>
                    <h4 style={{color: '#39ff14', marginBottom: 8}}>معلومات الطلب</h4>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 5}}>
                      <strong style={{color: '#fff'}}>رقم الطلب:</strong> {o.id.substring(0, 8)}...
                    </p>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 5}}>
                      <strong style={{color: '#fff'}}>البريد:</strong> {o.email || 'غير متوفر'}
                    </p>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 5}}>
                      <strong style={{color: '#fff'}}>الحالة:</strong>{' '}
                      <span style={{
                        color: o.status === 'pending' ? '#FFA500' : o.status === 'confirmed' ? '#39ff14' : '#ff6b6b',
                        fontWeight: 600
                      }}>
                        {o.status === 'pending' ? '⏳ معلق' : o.status === 'confirmed' ? '✅ مؤكد' : '❌ مرفوض'}
                      </span>
                    </p>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>
                      <strong style={{color: '#fff'}}>المبلغ:</strong> 
                      <span style={{
                        color: '#39ff14',
                        marginRight: 8,
                        fontSize: '1.2em',
                        fontWeight: 700
                      }}>{o.total} دج</span>
                    </p>
                  </div>

                  <div>
                    <h4 style={{color: '#39ff14', marginBottom: 8}}>المنتجات</h4>
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
                  <h4 style={{color: '#39ff14', marginBottom: 12}}>إيصال الدفع</h4>
                  <img 
                    src={o.paymentImageUrl} 
                    alt="إيصال الدفع"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      borderRadius: 8,
                      border: '2px solid rgba(57, 255, 20, 0.3)',
                      objectFit: 'contain',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(o.paymentImageUrl, '_blank')}
                    title="اضغط لفتح الصورة بحجم كامل"
                  />
                </div>

                {o.status === 'rejected' && o.rejectionReason && (
                  <div style={{
                    padding: '15px',
                    background: 'rgba(255, 107, 107, 0.1)',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: 8,
                    marginBottom: 20,
                    color: '#ff6b6b'
                  }}>
                    <strong>سبب الرفض:</strong> {o.rejectionReason}
                  </div>
                )}

                {o.status === 'pending' && (
                  <>
                    {rejecting === o.id ? (
                      <div style={{
                        padding: '20px',
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: '2px solid rgba(255, 107, 107, 0.3)',
                        borderRadius: 12,
                        marginBottom: 15
                      }}>
                        <h4 style={{color: '#ff6b6b', marginBottom: 15}}>رفض الطلب</h4>
                        <textarea
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.target.value)}
                          placeholder="اكتب سبب رفض الطلب (مثال: الإيصال غير واضح، المبلغ غير صحيح، ...)"
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                            borderRadius: 8,
                            color: '#fff',
                            fontSize: '1rem',
                            marginBottom: 15,
                            minHeight: 80,
                            resize: 'vertical'
                          }}
                        />
                        <div style={{display: 'flex', gap: 10}}>
                          <button
                            onClick={() => rejectOrder(o.id)}
                            style={{
                              flex: 1,
                              padding: '12px',
                              background: 'rgba(255, 0, 0, 0.3)',
                              color: '#ff6b6b',
                              border: '2px solid rgba(255, 0, 0, 0.5)',
                              borderRadius: 8,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            ✓ تأكيد الرفض
                          </button>
                          <button
                            onClick={() => {
                              setRejecting(null);
                              setRejectionReason('');
                            }}
                            style={{
                              flex: 1,
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: '#c0c0c0',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: 8,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{display: 'flex', gap: 15}}>
                        <button 
                          onClick={()=>confirm(o.id)} 
                          className="btn" 
                          style={{
                            flex: 2,
                            fontSize: '1.1em',
                            padding: '14px',
                            boxShadow: '0 0 30px rgba(57, 255, 20, 0.4)'
                          }}
                        >
                          ✓ تأكيد الدفع وتفعيل الطلب
                        </button>
                        <button 
                          onClick={() => setRejecting(o.id)}
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255, 0, 0, 0.2)',
                            color: '#ff6b6b',
                            border: '2px solid rgba(255, 0, 0, 0.4)',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: '1.1em',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          ✗ رفض الطلب
                        </button>
                      </div>
                    )}
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
