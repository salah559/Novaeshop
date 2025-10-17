
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Admin(){
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(()=> {
    async function load(){
      try{
        const res = await axios.get('/api/admin/list-orders');
        setOrders(res.data || []);
      }catch(e){
        console.error(e);
      }
    }
    load();
  },[]);

  async function confirm(id:string){
    await axios.post('/api/admin/confirm-order',{orderId:id});
    const res = await axios.get('/api/admin/list-orders');
    setOrders(res.data || []);
  }

  return (
    <div>
      <h2>لوحة الأدمن</h2>
      <div style={{display:'grid',gap:12}}>
        {orders.length===0 && <div className="card">لا طلبات حالياً</div>}
        {orders.map(o=>(
          <div key={o.id} className="card">
            <div><strong>Order:</strong> {o.id}</div>
            <div><strong>Email:</strong> {o.email}</div>
            <div><strong>Total:</strong> {o.total} دج</div>
            <div><img src={o.paymentImageUrl} style={{maxWidth:200}}/></div>
            <div style={{marginTop:8}}>
              <button onClick={()=>confirm(o.id)} className="btn">تأكيد الدفع</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
