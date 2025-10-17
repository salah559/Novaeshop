
import Link from 'next/link';

const mockProducts = [
  {id: 'prod-1', name: 'Pack 15M', price: 20000, category:'packs', image:'/placeholder.png'},
  {id: 'prod-2', name: '100k Videos', price: 5000, category:'videos', image:'/placeholder.png'},
];

export default function Products(){
  return (
    <div>
      <h2>المنتجات</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginTop:12}}>
        {mockProducts.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8}}/>
            <h3>{p.name}</h3>
            <p>{p.price} دج</p>
            <div style={{display:'flex',gap:8}}>
              <Link href={`/products/${p.id}`}><a className="btn">تفاصيل</a></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
