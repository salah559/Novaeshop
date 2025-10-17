
import Link from 'next/link';

export default function Cart(){
  // Simple mock cart
  const items = [{id:'prod-1', name:'Pack 15M', price:20000}];
  const total = items.reduce((s,i)=>s+i.price,0);
  return (
    <div>
      <h2>السلة</h2>
      <div className="card">
        {items.map(it=>(
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
        <Link href="/checkout"><a className="btn" style={{marginTop:12}}>تابع الدفع</a></Link>
      </div>
    </div>
  );
}
