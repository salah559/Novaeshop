
import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

export default function Checkout(){
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u=> setUser(u));
    return ()=>unsub();
  },[]);

  async function handleSubmit(e:any){
    e.preventDefault();
    if(!file) return alert('أرفق صورة الإيصال');
    // get cart
    const items = JSON.parse(localStorage.getItem('cart')||'[]');
    const total = items.reduce((s:any,i:any)=>s+(i.price||0),0);
    // upload receipt
    const path = `receipts/${Date.now()}_${(file as any).name}`;
    const storageRef = ref(storage, path);
    const blob = file as any;
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    // create order in Firestore
    await addDoc(collection(db, 'orders'), {
      userId: user?.uid || null,
      items,
      total,
      paymentImageUrl: url,
      email: email || user?.email || null,
      status: 'pending',
      createdAt: new Date()
    });
    alert('تم إرسال الطلب. سيتم مراجعته من قبل الأدمن.');
    localStorage.removeItem('cart');
    window.location.href = '/mypurchases';
  }

  return (
    <div>
      <h2>الدفع</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>بريدك الإلكتروني</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:6,marginBottom:12}}/>

        <label>صورة الإيداع</label>
        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} style={{display:'block',marginTop:6,marginBottom:12}}/>

        <button className="btn" type="submit">تأكيد الطلب</button>
      </form>
    </div>
  );
}
