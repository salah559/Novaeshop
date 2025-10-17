
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

export default function Products(){
  const [products, setProducts] = useState<any[]>([]);
  useEffect(()=> {
    async function load(){
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d=>({id:d.id, ...d.data()})));
    }
    load();
  },[]);
  return (
    <div>
      <h2>المنتجات</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,marginTop:12}}>
        {products.length===0 && <div className="card">لا يوجد منتجات (أضف منتجات في Firestore)</div>}
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.imageUrl||'/placeholder.png'} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8}}/>
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
