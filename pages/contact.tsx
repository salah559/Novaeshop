
import { useState } from 'react';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Contact(){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState('');
  const [file,setFile]=useState<any|null>(null);

  async function handleSubmit(e:any){
    e.preventDefault();
    let fileUrl = null;
    if(file){
      const path = `messages/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }
    await addDoc(collection(db,'messages'), {
      name, email, message, fileUrl, createdAt: new Date()
    });
    alert('تم إرسال الرسالة.');
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
