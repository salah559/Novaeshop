
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Checkout(){
  const [file, setFile] = useState<File|null>(null);
  const [email, setEmail] = useState('');

  async function handleSubmit(e:any){
    e.preventDefault();
    if(!file){ alert('Please attach payment proof'); return; }
    // simple upload example (client-side) - for production use server-side signed uploads
    const fileName = `receipts/${Date.now()}_${(file as any).name}`;
    const { data, error } = await supabase.storage.from('uploads').upload(fileName, file);
    if(error){ alert('Upload failed'); console.error(error); return; }
    const publicUrl = supabase.storage.from('uploads').getPublicUrl(fileName).data.publicUrl;
    // create order entry - requires API or direct insert if using anon key (for demo only)
    alert('تم رفع الإيصال. سيتم معاينته من قبل الأدمن. (هذه نسخة تجريبية)');
    console.log({publicUrl, email});
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
