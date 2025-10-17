
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MyPurchases(){
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u=> {
      setUser(u);
      if(u) load(u.uid);
    });
    return ()=>unsub();
  },[]);

  async function load(uid:string){
    // purchases collection expected to contain user purchases after admin confirmation
    const q = query(collection(db, 'purchases'), where('userId','==',uid));
    const snap = await getDocs(q);
    setPurchases(snap.docs.map(d=>({id:d.id, ...d.data()})));
  }

  return (
    <div>
      <h2>مشترياتي</h2>
      <div style={{display:'grid',gap:12}}>
        {purchases.length===0 && <div className="card">لا توجد مشتريات بعد.</div>}
        {purchases.map(p=>(
          <div key={p.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <h4>{p.name}</h4>
            </div>
            <a className="btn" href={p.downloadUrl}>تحميل</a>
          </div>
        ))}
      </div>
    </div>
  );
}
