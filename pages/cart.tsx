
import Link from 'next/link';
export default function Cart(){
  // For demo: cart stored in localStorage (you'll wire real cart)
  const items = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')||'[]') : [];
  const total = items.reduce((s: number, i: any)=>s+(i.price||0),0);
  return (
    <div>
      <h2>السلة</h2>
      <div className="card">
        {items.length===0 && <div>السلة فارغة</div>}
        {items.map((it:any)=>(
          <div key={it.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div>{it.name}</div>
            <div>{it.price} دج</div>
          </div>
        ))}
        <hr/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
          <strong>المجموع</strong>
          <strong>{total} دج</strong>
        </div>
        <Link href="/checkout" className="btn" style={{marginTop:12}}>تابع الدفع</Link>
      </div>
    </div>
  );
}
