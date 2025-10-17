
export default function MyPurchases(){
  // mock purchases
  const purchases = [
    {id:'p-1', name:'Pack 15M', status:'confirmed', download:'/placeholder.png'}
  ];
  return (
    <div>
      <h2>مشترياتي</h2>
      <div style={{display:'grid',gap:12}}>
        {purchases.map(p=>(
          <div key={p.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h4>{p.name}</h4>
              <small>{p.status}</small>
            </div>
            {p.status === 'confirmed' ? <a className="btn" href={p.download}>تحميل</a> : <span>بانتظار التفعيل</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
