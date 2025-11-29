import { useState, useEffect } from 'react';
import { auth, db, signInWithGoogle } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';

export default function Checkout(){
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u=> {
      setUser(u);
      if (u?.email) {
        setEmail(u.email);
      }
      setCheckingAuth(false);
    });
    return ()=>unsub();
  },[]);

  async function handleSubmit(e:any){
    e.preventDefault();
    if(!file) {
      alert('⚠️ الرجاء إرفاق صورة الإيصال');
      return;
    }
    
    setLoading(true);
    try {
      const items = JSON.parse(localStorage.getItem('cart')||'[]');
      const total = items.reduce((s:any,i:any)=>s+(i.price||0),0);
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const base64Image = await base64Promise;
      
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'فشل في رفع الصورة');
      }
      
      const url = uploadData.url;
      
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid || null,
        items,
        total,
        paymentImageUrl: url,
        email: email || user?.email || null,
        status: 'pending',
        createdAt: new Date()
      });
      
      alert('✅ تم إرسال الطلب بنجاح! سيتم مراجعته من قبل الأدمن.');
      localStorage.removeItem('cart');
      window.location.href = '/mypurchases';
    } catch(err) {
      alert('❌ حدث خطأ. الرجاء المحاولة مرة أخرى');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div style={{textAlign: 'center', padding: '100px 20px'}}>
        <div style={{fontSize: '3em', marginBottom: 20}}>⏳</div>
        <p style={{color: '#c0c0c0'}}>جاري التحميل...</p>
      </div>
    );
  }

  if (!user) {
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
          }}>تسجيل الدخول مطلوب</h2>
          <p style={{color: '#c0c0c0'}}>يجب عليك تسجيل الدخول لمتابعة عملية الدفع</p>
        </div>

        <div className="card" style={{
          maxWidth: 600,
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '4em', marginBottom: 30}}>🔐</div>
          <h3 style={{color: '#00ff88', marginBottom: 20, fontSize: '1.5em'}}>
            للمتابعة إلى الدفع
          </h3>
          <p style={{color: '#c0c0c0', marginBottom: 30, lineHeight: 1.8}}>
            يجب عليك تسجيل الدخول أولاً لضمان حماية مشترياتك وتتبع طلباتك بسهولة.
            سيتم ربط طلبك بحسابك لتتمكن من الوصول إليه في أي وقت.
          </p>
          <button 
            onClick={signInWithGoogle} 
            className="btn"
            style={{
              fontSize: '1.2em',
              padding: '16px 40px',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
            }}
          >
            🔑 تسجيل الدخول بواسطة Google
          </button>
          <p style={{color: '#888', marginTop: 20, fontSize: '0.9em'}}>
            سريع وآمن - نستخدم Google للمصادقة
          </p>
        </div>
      </div>
    );
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
        }}>إتمام الدفع</h2>
        <p style={{color: '#c0c0c0'}}>قم بالدفع عبر بريدي موب وأرفق صورة الإيصال</p>
      </div>

      <div className="card" style={{
        maxWidth: 700,
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 30
        }}>
          <h3 style={{color: '#00ff88', marginBottom: 20, fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: 10}}>
            <span style={{fontSize: '1.3em'}}>💳</span> خطوات إتمام الطلب
          </h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 10,
              padding: 16,
              borderLeft: '4px solid #00ff88'
            }}>
              <div style={{color: '#00ff88', fontWeight: 600, marginBottom: 8, fontSize: '1.05em'}}>
                <span style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                  fontSize: '0.9em'
                }}>1</span>
                قم بتحويل المبلغ عبر بريدي موب
              </div>
              <p style={{color: '#c0c0c0', margin: 0, paddingRight: 36, lineHeight: 1.6, marginBottom: 12}}>
                حول المبلغ الكامل للطلب باستخدام تطبيق بريدي موب
              </p>
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '2px dashed rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                padding: '12px 16px',
                marginRight: 36
              }}>
                <div style={{color: '#888', fontSize: '0.85em', marginBottom: 4}}>📱 حساب بريدي موب:</div>
                <div style={{
                  color: '#00ff88',
                  fontSize: '1.15em',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  direction: 'ltr',
                  textAlign: 'right'
                }}>004191270393</div>
                <div style={{color: '#888', fontSize: '0.8em', marginTop: 4}}>⚠️ تأكد من إدخال الرقم بشكل صحيح</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 10,
              padding: 16,
              borderLeft: '4px solid #00ff88'
            }}>
              <div style={{color: '#00ff88', fontWeight: 600, marginBottom: 8, fontSize: '1.05em'}}>
                <span style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                  fontSize: '0.9em'
                }}>2</span>
                التقط صورة واضحة لإيصال الدفع
              </div>
              <p style={{color: '#c0c0c0', margin: 0, paddingRight: 36, lineHeight: 1.6}}>
                تأكد من وضوح جميع التفاصيل في الصورة (المبلغ، التاريخ، رقم العملية)
              </p>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              borderRadius: 10,
              padding: 16,
              borderLeft: '4px solid #00ff88'
            }}>
              <div style={{color: '#00ff88', fontWeight: 600, marginBottom: 8, fontSize: '1.05em'}}>
                <span style={{
                  background: 'rgba(0, 255, 136, 0.2)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                  fontSize: '0.9em'
                }}>3</span>
                ارفع صورة الإيصال في النموذج أدناه
              </div>
              <p style={{color: '#c0c0c0', margin: 0, paddingRight: 36, lineHeight: 1.6}}>
                املأ البيانات المطلوبة وارفع صورة الإيصال
              </p>
            </div>
          </div>

          <div style={{
            marginTop: 20,
            padding: 16,
            background: 'rgba(57, 255, 20, 0.05)',
            border: '1px solid rgba(57, 255, 20, 0.2)',
            borderRadius: 8
          }}>
            <p style={{color: '#c0c0c0', margin: 0, lineHeight: 1.7, fontSize: '0.95em'}}>
              ✅ <strong style={{color: '#00ff88'}}>سيتم مراجعة طلبك خلال 24 ساعة</strong><br/>
              📧 ستصلك رسالة تأكيد عبر البريد الإلكتروني بمجرد الموافقة<br/>
              📦 بعد التأكيد، يمكنك تحميل المنتجات من صفحة "مشترياتي"
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 25}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: '1.1em'
            }}>البريد الإلكتروني (نفس الإيميل الذي سترسل منه الوصل)</label>
            <input 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              readOnly={!!user?.email}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: user?.email ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                color: '#fff',
                fontSize: '1rem',
                cursor: user?.email ? 'not-allowed' : 'text'
              }}
            />
            <small style={{color: user?.email ? '#00ff88' : '#888', fontSize: '0.85em', marginTop: 8, display: 'block'}}>
              {user?.email ? '✓ تم تسجيل الدخول بنجاح - سنرسل لك التأكيد على هذا الإيميل' : 'سيتم إرسال تأكيد الطلب إلى هذا البريد الإلكتروني'}
            </small>
          </div>

          <div style={{marginBottom: 30}}>
            <label style={{
              display: 'block',
              color: '#00ff88',
              marginBottom: 10,
              fontWeight: 600,
              fontSize: '1.1em'
            }}>صورة وصل الإرسال (للتأكيد)</label>
            <div style={{
              position: 'relative',
              border: '2px dashed rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              padding: 30,
              textAlign: 'center',
              background: 'rgba(0, 255, 136, 0.03)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={e=>setFile(e.target.files?.[0]||null)}
                required
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
              <div style={{fontSize: '3em', marginBottom: 10}}>📤</div>
              <p style={{color: file ? '#00ff88' : '#c0c0c0', marginBottom: 5}}>
                {file ? `✓ ${file.name}` : 'اضغط لاختيار الصورة'}
              </p>
              <small style={{color: '#888'}}>JPG, PNG أو GIF</small>
            </div>
          </div>

          <button 
            className="btn" 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              fontSize: '1.2em',
              padding: '16px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : '✓ تأكيد الطلب'}
          </button>
        </form>
      </div>
    </div>
  );
}
