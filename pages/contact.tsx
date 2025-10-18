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
        marginBottom: 'clamp(20px, 5vw, 40px)',
        padding: 'clamp(20px, 5vw, 30px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 'clamp(12px, 3vw, 16px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8em, 6vw, 2.5em)',
          marginBottom: 'clamp(8px, 2vw, 10px)',
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>📧 تواصل معنا</h2>
        <p style={{color: '#c0c0c0', fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>نحن هنا للإجابة على استفساراتك</p>
      </div>

      <div className="card animate-fadeInUp shadow-glow" style={{
        maxWidth: 700,
        margin: '0 auto'
      }}>
        {success && (
          <div className="animate-scaleIn" style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%)',
            border: '1px solid rgba(0, 255, 136, 0.4)',
            borderRadius: 12,
            padding: 'clamp(15px, 3vw, 20px)',
            marginBottom: 'clamp(20px, 4vw, 30px)',
            textAlign: 'center'
          }}>
            <div style={{fontSize: 'clamp(2em, 5vw, 3em)', marginBottom: 'clamp(8px, 2vw, 10px)'}}>✅</div>
            <h3 style={{color: '#00ff88', marginBottom: 'clamp(6px, 1.5vw, 8px)', fontSize: 'clamp(1.1em, 3vw, 1.3em)'}}>تم الإرسال بنجاح!</h3>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>سنتواصل معك قريباً</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 'clamp(18px, 4vw, 25px)'}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2.5vw, 1em)'
            }}>الاسم الكامل</label>
            <input 
              value={name} 
              onChange={e=>setName(e.target.value)}
              placeholder="أدخل اسمك"
              required
              className="shadow-glow-hover"
            />
          </div>

          <div style={{marginBottom: 'clamp(18px, 4vw, 25px)'}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2.5vw, 1em)'
            }}>البريد الإلكتروني</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="shadow-glow-hover"
            />
          </div>

          <div style={{marginBottom: 'clamp(18px, 4vw, 25px)'}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2.5vw, 1em)'
            }}>الرسالة</label>
            <textarea 
              value={message} 
              onChange={e=>setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              rows={6}
              required
              className="shadow-glow-hover"
              style={{minHeight: '150px'}}
            />
          </div>

          <div style={{marginBottom: 'clamp(20px, 4vw, 30px)'}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2.5vw, 1em)'
            }}>إرفاق ملف (اختياري)</label>
            <input 
              type="file"
              onChange={e=>setFile(e.target.files?.[0] || null)}
              accept="image/*,.pdf,.doc,.docx"
              className="shadow-glow-hover"
              style={{
                padding: 'clamp(10px, 2.5vw, 12px)',
                fontSize: 'clamp(0.85em, 2vw, 0.95em)'
              }}
            />
            {file && (
              <p style={{
                marginTop: 'clamp(8px, 2vw, 10px)', 
                color: '#00ff88', 
                fontSize: 'clamp(0.85em, 2vw, 0.9em)'
              }}>
                ✓ {file.name}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn shadow-glow-hover"
            style={{
              width: '100%',
              fontSize: 'clamp(1em, 2.5vw, 1.1em)',
              padding: 'clamp(12px, 3vw, 14px)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : '📨 إرسال الرسالة'}
          </button>
        </form>

        <div className="animate-fadeInUp" style={{
          marginTop: 'clamp(30px, 6vw, 40px)',
          paddingTop: 'clamp(20px, 4vw, 30px)',
          borderTop: '1px solid rgba(0, 255, 136, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
          gap: 'clamp(15px, 3vw, 20px)',
          textAlign: 'center'
        }}>
          <div>
            <div style={{fontSize: 'clamp(2em, 5vw, 2.5em)', marginBottom: 'clamp(8px, 2vw, 10px)'}}>📧</div>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.85em, 2vw, 0.9em)'}}>البريد الإلكتروني</p>
            <p style={{color: '#00ff88', fontSize: 'clamp(0.85em, 2vw, 0.95em)', wordBreak: 'break-all'}}>support@enova.dz</p>
          </div>
          <div>
            <div style={{fontSize: 'clamp(2em, 5vw, 2.5em)', marginBottom: 'clamp(8px, 2vw, 10px)'}}>⏰</div>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.85em, 2vw, 0.9em)'}}>ساعات العمل</p>
            <p style={{color: '#00ff88', fontSize: 'clamp(0.85em, 2vw, 0.95em)'}}>طوال الأسبوع 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
