import { useState } from 'react';
import { db, storage } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Contact(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any){
    e.preventDefault();
    setLoading(true);
    
    try {
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
      
      alert('✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setName('');
      setEmail('');
      setMessage('');
      setFile(null);
    } catch(err) {
      alert('❌ حدث خطأ. الرجاء المحاولة مرة أخرى');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        padding: '30px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 10,
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>تواصل معنا</h2>
        <p style={{color: '#c0c0c0'}}>نحن هنا للإجابة على استفساراتك</p>
      </div>

      <div className="card" style={{
        maxWidth: 700,
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 25}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600
            }}>الاسم الكامل</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)}
              placeholder="أدخل اسمك"
              required
            />
          </div>

          <div style={{marginBottom: 25}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600
            }}>البريد الإلكتروني</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div style={{marginBottom: 25}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600
            }}>الرسالة</label>
            <textarea 
              value={message} 
              onChange={e=>setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={6}
              required
              style={{
                minHeight: 150,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{marginBottom: 30}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600
            }}>مرفق (اختياري)</label>
            <div style={{
              position: 'relative',
              border: '2px dashed rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
              background: 'rgba(0, 255, 136, 0.03)',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                onChange={e=>setFile(e.target.files?.[0]||null)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <div style={{fontSize: '2em', marginBottom: 8}}>📎</div>
              <p style={{color: file ? '#00ff88' : '#c0c0c0', fontSize: '0.9em'}}>
                {file ? `✓ ${file.name}` : 'اضغط لإرفاق ملف'}
              </p>
            </div>
          </div>

          <button 
            className="btn" 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontSize: '1.1em',
              padding: '16px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : '📨 إرسال الرسالة'}
          </button>
        </form>
      </div>
    </div>
  );
}
