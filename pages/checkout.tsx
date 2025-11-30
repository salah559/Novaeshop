import { useState, useEffect } from 'react';
import { auth, db, signInWithGoogle } from '@/lib/firebaseClient';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/components/Toast';

export default function Checkout(){
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const toast = useToast();

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

  useEffect(() => {
    const updateCheckout = () => {
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{"items":[],"total":0}');
      const items = checkoutData.items || [];
      setCartItems(items);
      const newTotal = checkoutData.total || items.reduce((s: any, i: any) => s + (i.price || 0), 0);
      setTotal(newTotal);
    };

    updateCheckout();
    const interval = setInterval(updateCheckout, 500);
    window.addEventListener('storage', updateCheckout);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCheckout);
    };
  }, []);

  async function handleSubmit(e:any){
    e.preventDefault();
    if(!file) {
      toast.error('الرجاء إرفاق صورة الإيصال');
      return;
    }
    
    setLoading(true);
    try {
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData')||'{"items":[],"total":0}');
      const items = checkoutData.items || [];
      const total = checkoutData.total || items.reduce((s:any,i:any)=>s+(i.price||0),0);
      
      if (!items || items.length === 0) {
        toast.error('لا يوجد منتج - يرجى اختيار منتج قبل الشراء');
        setLoading(false);
        return;
      }
      
      if (total <= 0) {
        toast.error('المبلغ الإجمالي يجب أن يكون أكبر من 0');
        setLoading(false);
        return;
      }
      
      console.log('Creating order with items:', items, 'total:', total, 'userId:', user?.uid);
      
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
      
      if (!uploadResponse.ok) {
        throw new Error('فشل في الاتصال بخادم رفع الصور');
      }
      
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
      
      toast.success('تم إرسال الطلب بنجاح! سيتم مراجعته من قبل الأدمن.');
      localStorage.removeItem('checkoutData');
      setTimeout(() => {
        window.location.href = '/mypurchases';
      }, 1500);
    } catch(err: any) {
      toast.error(err.message || 'حدث خطأ. الرجاء المحاولة مرة أخرى');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div>
        <div style={{
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
          }}>تسجيل الدخول مطلوب</h2>
          <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>يجب عليك تسجيل الدخول لمتابعة عملية الدفع</p>
        </div>

        <div className="card animate-fadeInUp" style={{
          maxWidth: 700,
          margin: '0 auto',
          textAlign: 'center',
          padding: 'clamp(30px, 6vw, 50px)'
        }}>
          <div style={{fontSize: 'clamp(3.5em, 10vw, 5em)', marginBottom: 'clamp(25px, 5vw, 35px)'}}>🔐</div>
          <h3 style={{
            color: '#39ff14',
            marginBottom: 'clamp(18px, 4vw, 28px)',
            fontSize: 'clamp(1.3em, 4.5vw, 1.7em)',
            textShadow: '0 0 15px rgba(57, 255, 20, 0.3)'
          }}>
            للمتابعة إلى الدفع
          </h3>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            marginBottom: 'clamp(25px, 5vw, 35px)',
            lineHeight: 1.8,
            fontSize: 'clamp(1em, 2.5vw, 1.1em)'
          }}>
            يجب عليك تسجيل الدخول أولاً لضمان حماية مشترياتك وتتبع طلباتك بسهولة. سيتم ربط طلبك بحسابك لتتمكن من الوصول إليه في أي وقت.
          </p>
          <button 
            onClick={signInWithGoogle} 
            className="btn"
            style={{
              fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
              padding: 'clamp(14px, 3vw, 18px) clamp(30px, 7vw, 40px)',
              boxShadow: '0 0 40px rgba(57, 255, 20, 0.5)'
            }}
          >
            🔑 تسجيل الدخول بواسطة Google
          </button>
          <p style={{color: 'rgba(255,255,255,0.5)', marginTop: 'clamp(18px, 3vw, 25px)', fontSize: 'clamp(0.9em, 2.5vw, 0.95em)'}}>
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
        }}>💳 إتمام الدفع</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>قم بالدفع عبر بريدي موب وأرفق صورة الإيصال</p>
      </div>

      <div className="card animate-fadeInUp" style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 'clamp(25px, 5vw, 35px)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(255, 215, 0, 0.08) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.25)',
          borderRadius: '14px',
          padding: 'clamp(20px, 4vw, 28px)',
          marginBottom: 'clamp(25px, 5vw, 35px)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(14px, 3vw, 20px)',
            alignItems: 'center'
          }}>
            <div style={{fontSize: 'clamp(2em, 5vw, 2.5em)'}}>📱</div>
            <div>
              <p style={{color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.9em, 2.5vw, 1em)', marginBottom: 8}}>رقم حساب بريدي موب:</p>
              <div style={{
                fontSize: 'clamp(1.4em, 4vw, 1.8em)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #39ff14, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'monospace',
                letterSpacing: 2
              }}>
                004191270393
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(0,0,0,0.3) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.2)',
          borderRadius: '14px',
          padding: 'clamp(18px, 3.5vw, 24px)',
          marginBottom: 'clamp(25px, 5vw, 35px)'
        }}>
          <h3 style={{
            color: '#39ff14',
            marginBottom: 'clamp(14px, 2.5vw, 18px)',
            fontSize: 'clamp(1.1em, 3vw, 1.3em)',
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(8px, 2vw, 12px)',
            textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
          }}>
            <span style={{fontSize: '1.3em'}}>📋</span> خطوات الدفع
          </h3>
          <ol style={{
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.9,
            paddingLeft: 'clamp(20px, 3vw, 28px)',
            fontSize: 'clamp(0.95em, 2.5vw, 1.05em)'
          }}>
            <li style={{marginBottom: '12px'}}>حول المبلغ <strong style={{color: '#ffd700'}}>{total} دج</strong> إلى رقم الحساب أعلاه</li>
            <li style={{marginBottom: '12px'}}>خذ صورة واضحة لإيصال التحويل (يظهر رقم الملف والمبلغ والتاريخ)</li>
            <li>أرفقها هنا وسيتم التحقق منها من قبل الفريق</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>📸 صورة الإيصال</label>
            <div style={{
              position: 'relative',
              border: '2px dashed rgba(57, 255, 20, 0.3)',
              borderRadius: '12px',
              padding: 'clamp(25px, 5vw, 35px)',
              textAlign: 'center',
              background: 'rgba(57, 255, 20, 0.02)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e)=>setFile(e.target.files?.[0]||null)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
              />
              <div style={{color: '#39ff14', fontSize: 'clamp(2em, 6vw, 2.8em)', marginBottom: 12}}>📤</div>
              <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.95em, 2.5vw, 1.05em)', margin: '8px 0'}}>
                {file ? file.name : 'اضغط أو اسحب الصورة هنا'}
              </p>
              <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2vw, 0.9em)'}}>PNG, JPG, GIF حتى 10MB</p>
            </div>
          </div>

          <div style={{marginBottom: 'clamp(20px, 4vw, 28px)'}}>
            <label style={{
              display: 'block',
              color: '#39ff14',
              marginBottom: 'clamp(10px, 2vw, 14px)',
              fontWeight: 600,
              fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
              textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
            }}>📧 بريدك الإلكتروني</label>
            <input 
              type="email"
              value={email} 
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              disabled
              style={{
                width: '100%',
                padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 22px)',
                background: 'rgba(57, 255, 20, 0.08)',
                border: '2px solid rgba(57, 255, 20, 0.25)',
                borderRadius: '12px',
                color: '#39ff14',
                fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn"
            style={{
              width: '100%',
              fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
              padding: 'clamp(14px, 3vw, 18px)',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: '12px'
            }}
          >
            {loading ? '⏳ جاري الإرسال...' : '✓ إرسال الطلب'}
          </button>
        </form>
      </div>
    </div>
  );
}
