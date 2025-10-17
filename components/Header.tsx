
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, signInWithGoogle, logout } from '@/lib/firebaseClient';

export default function Header(){
  const [user, setUser] = useState<any>(null);
  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  },[]);
  return (
    <header style={{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:48,height:48,background:'rgba(255,255,255,0.2)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>DZ</div>
        <div>
          <h1 style={{margin:0}}>DZ Digital Market</h1>
          <small>الدفع ببريدي موب - Firestore</small>
        </div>
      </div>
      <nav>
        <Link href="/"><a style={{marginRight:12}}>الرئيسية</a></Link>
        <Link href="/products"><a style={{marginRight:12}}>المنتجات</a></Link>
        <Link href="/mypurchases"><a style={{marginRight:12}}>مشترياتي</a></Link>
        <Link href="/contact"><a style={{marginRight:12}}>تواصل</a></Link>
        <Link href="/admin"><a style={{marginRight:12}}>لوحة الأدمن</a></Link>
        {user ? (
          <>
            <span style={{marginRight:8}}>{user.email}</span>
            <button onClick={()=>logout()} style={{padding:'8px 12px',borderRadius:8}}>خروج</button>
          </>
        ) : (
          <button onClick={()=>signInWithGoogle()} style={{padding:'8px 12px',borderRadius:8}}>تسجيل Google</button>
        )}
      </nav>
    </header>
  );
}
