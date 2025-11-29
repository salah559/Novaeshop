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
  const [success, setSuccess] = useState(false);

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
      
      setSuccess(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setMessage('');
        setFile(null);
        setSuccess(false);
      }, 3000);
    } catch(err) {
      alert('❌ حدث خطأ. الرجاء المحاولة مرة أخرى');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="animate-fadeIn" style={{
        textAlign: 'center',
        marginBottom: 'clamp(30px, 6vw, 50px)',
        padding: 'clamp(30px, 6vw, 50px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        border: '2px solid rgba(57, 255, 20, 0.2)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2em, 7vw, 3em)',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>📧 تواصل معنا</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>نحن هنا للإجابة على استفساراتك</p>
      </div>

      <div className="card animate-fadeInUp" style={{
        maxWidth: 750,
        margin: '0 auto',
        padding: 'clamp(25px, 5vw, 35px)'
      }}>
        {success && (
          <div className="animate-scaleIn" style={{
            background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.15) 0%, rgba(57, 255, 20, 0.08) 100%)',
            border: '2px solid rgba(57, 255, 20, 0.4)',
            borderRadius: '14px',
            padding: 'clamp(18px, 3vw, 25px)',
            marginBottom: 'clamp(25px, 5vw, 35px)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: 'clamp(2.5em, 6vw, 3.5em)', marginBottom: 'clamp(12px, 2vw, 18px)'}}>✅</div>
            <h3 style={{
              color: '#39ff14',
              marginBottom: 'clamp(8px, 1.5vw, 12px)',
              fontSize: 'clamp(1.2em, 3.5vw, 1.5em)',
              textShadow: '0 0 15px rgba(57, 255, 20, 0.3)'
            }}>تم الإرسال بنجاح!</h3>
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.95em, 2.5vw, 1.05em)'}}>سنتواصل معك قريباً</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>الاسم الكامل</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)}
              placeholder="أدخل اسمك"
              required
            />
          </div>

          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>البريد الإلكتروني</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              required
            />
          </div>

          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>الرسالة</label>
            <textarea 
              value={message} 
              onChange={e=>setMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              required
              rows={5}
            ></textarea>
          </div>

          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>إرفاق ملف (اختياري)</label>
            <input 
              type="file" 
              onChange={e=>setFile(e.target.files?.[0]||null)}
              style={{
                color: '#39ff14'
              }}
            />
          </div>

          <button 
            className="btn" 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
              padding: 'clamp(14px, 3vw, 18px)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '12px'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : '✓ إرسال الرسالة'}
          </button>
        </form>
      </div>
    </div>
  );
}
