
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [file,setFile]=useState<File|null>(null);

  async function handleSubmit(e:any){
    e.preventDefault();
    // for demo simply alert
    alert('تم إرسال الرسالة. هذه نسخة تجريبية.');
    console.log({name,email,message,file});
  }

  return (
    <div>
      <h2>تواصل معنا</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>الاسم</label>
        <input value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:8,marginTop:6,marginBottom:12}}/>
        <label>البريد</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:6,marginBottom:12}}/>
        <label>الرسالة</label>
        <textarea value={message} onChange={e=>setMessage(e.target.value)} style={{width:'100%',padding:8,marginTop:6,marginBottom:12}}/>
        <label>مرفق (اختياري)</label>
        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} style={{display:'block',marginTop:6,marginBottom:12}}/>
        <button className="btn" type="submit">إرسال</button>
      </form>
    </div>
  );
}
