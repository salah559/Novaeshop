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
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#39ff14', marginBottom: 20 }}>🚫 غير مصرح</h2>
        <p style={{ color: '#ccc' }}>هذه الصفحة للمسؤولين فقط</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#39ff14', marginBottom: 20 }}>📦 إدارة الطلبات</h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 15,
        marginBottom: 30 
      }}>
        <div style={{ background: 'rgba(255,165,0,0.1)', border: '1px solid rgba(255,165,0,0.3)', borderRadius: 8, padding: 15, textAlign: 'center' }}>
          <div style={{fontSize: '1.5em', marginBottom: 8}}>⏳</div>
          <p style={{color: '#FFA500', fontWeight: 'bold', fontSize: '1.2em'}}>{stats.pending}</p>
          <p style={{color: '#999', fontSize: '0.8em'}}>معلقة</p>
        </div>
        <div style={{ background: 'rgba(57,255,20,0.1)', border: '1px solid rgba(57,255,20,0.3)', borderRadius: 8, padding: 15, textAlign: 'center' }}>
          <div style={{fontSize: '1.5em', marginBottom: 8}}>✅</div>
          <p style={{color: '#39ff14', fontWeight: 'bold', fontSize: '1.2em'}}>{stats.confirmed}</p>
          <p style={{color: '#999', fontSize: '0.8em'}}>مؤكدة</p>
        </div>
        <div style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 8, padding: 15, textAlign: 'center' }}>
          <div style={{fontSize: '1.5em', marginBottom: 8}}>❌</div>
          <p style={{color: '#ff6b6b', fontWeight: 'bold', fontSize: '1.2em'}}>{stats.rejected}</p>
          <p style={{color: '#999', fontSize: '0.8em'}}>مرفوضة</p>
        </div>
      </div>

      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <Link href="/admin/products" style={{ color: '#39ff14', textDecoration: 'underline' }}>🛍️ المنتجات</Link>
        <span style={{ color: '#39ff14', fontWeight: 'bold' }}>📦 الطلبات</span>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setFilter('pending')} style={{ padding: '8px 16px', background: filter === 'pending' ? '#39ff14' : 'rgba(57,255,20,0.2)', color: filter === 'pending' ? '#000' : '#39ff14', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
          ⏳ معلقة
        </button>
        <button onClick={() => setFilter('confirmed')} style={{ padding: '8px 16px', background: filter === 'confirmed' ? '#39ff14' : 'rgba(57,255,20,0.2)', color: filter === 'confirmed' ? '#000' : '#39ff14', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
          ✅ مؤكدة
        </button>
        <button onClick={() => setFilter('rejected')} style={{ padding: '8px 16px', background: filter === 'rejected' ? '#ff6b6b' : 'rgba(255,100,100,0.2)', color: filter === 'rejected' ? '#000' : '#ff6b6b', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
          ❌ مرفوضة
        </button>
        <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', background: filter === 'all' ? '#39ff14' : 'rgba(57,255,20,0.2)', color: filter === 'all' ? '#000' : '#39ff14', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}>
          📋 الكل
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#39ff14', textAlign: 'center', padding: 40 }}>جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <div style={{ color: '#39ff14', textAlign: 'center', padding: 40 }}>لا توجد طلبات</div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {orders.map(o => (
            <div key={o.id} style={{
              background: 'rgba(57,255,20,0.05)',
              border: '1px solid rgba(57,255,20,0.3)',
              borderRadius: 8,
              padding: 20
            }}>
              <div style={{ marginBottom: 15 }}>
                <h3 style={{color: '#39ff14', marginBottom: 10}}>الطلب #{o.id.substring(0, 8)}</h3>
                <p style={{color: '#ccc', marginBottom: 5}}><strong>البريد:</strong> {o.email}</p>
                <p style={{color: '#ccc', marginBottom: 5}}><strong>المبلغ:</strong> <span style={{color: '#39ff14', fontWeight: 'bold', fontSize: '1.1em'}}>{o.total} دج</span></p>
                <p style={{color: '#ccc'}}><strong>الحالة:</strong> <span style={{color: o.status === 'pending' ? '#FFA500' : o.status === 'confirmed' ? '#39ff14' : '#ff6b6b', fontWeight: 'bold'}}>
                  {o.status === 'pending' ? '⏳ معلق' : o.status === 'confirmed' ? '✅ مؤكد' : '❌ مرفوض'}
                </span></p>
              </div>

              {o.items && o.items.length > 0 && (
                <div style={{ marginBottom: 15 }}>
                  <p style={{color: '#39ff14', fontWeight: 'bold', marginBottom: 8}}>المنتجات:</p>
                  {o.items.map((item: any, idx: number) => (
                    <p key={idx} style={{color: '#ccc', marginLeft: 10}}>• {item.name} - {item.price} دج</p>
                  ))}
                </div>
              )}

              {o.paymentImageUrl && (
                <div style={{ marginBottom: 15 }}>
                  <p style={{color: '#39ff14', fontWeight: 'bold', marginBottom: 8}}>إيصال الدفع:</p>
                  <img src={o.paymentImageUrl} alt="إيصال" style={{maxWidth: '100%', maxHeight: 200, borderRadius: 6, border: '1px solid rgba(57,255,20,0.3)', cursor: 'pointer'}} onClick={() => window.open(o.paymentImageUrl, '_blank')} />
                </div>
              )}

              {o.status === 'rejected' && o.rejectionReason && (
                <div style={{ padding: 10, background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 6, marginBottom: 15, color: '#ff6b6b' }}>
                  <strong>سبب الرفض:</strong> {o.rejectionReason}
                </div>
              )}

              {o.status === 'pending' && (
                <>
                  {rejecting === o.id ? (
                    <div>
                      <textarea
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="سبب الرفض"
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,100,100,0.3)',
                          borderRadius: 6,
                          color: '#fff',
                          marginBottom: 10,
                          minHeight: 80
                        }}
                      />
                      <button
                        onClick={() => rejectOrder(o.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#ff6b6b',
                          color: '#000',
                          border: 'none',
                          borderRadius: 6,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          marginBottom: 8
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
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(200,200,200,0.2)',
                          color: '#ccc',
                          border: '1px solid rgba(200,200,200,0.3)',
                          borderRadius: 6,
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        onClick={() => confirm(o.id)}
                        style={{
                          flex: 2,
                          padding: '12px',
                          background: '#39ff14',
                          color: '#000',
                          border: 'none',
                          borderRadius: 6,
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ تأكيد الدفع
                      </button>
                      <button 
                        onClick={() => setRejecting(o.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          background: 'rgba(255,100,100,0.2)',
                          color: '#ff6b6b',
                          border: '1px solid rgba(255,100,100,0.3)',
                          borderRadius: 6,
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        ✗ رفض
                      </button>
                    </div>
                  )}
                </>
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
