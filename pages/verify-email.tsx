
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { auth } from '@/lib/firebaseClient';
import { sendEmailVerification, User } from 'firebase/auth';
import { useLanguage } from '@/lib/LanguageContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // منع التنقل إلى صفحات أخرى
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // السماح فقط بالانتقال إلى صفحة تسجيل الدخول أو البقاء في نفس الصفحة
      if (url !== '/login' && url !== '/verify-email') {
        router.events.emit('routeChangeError');
        throw 'Route change aborted.';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        // إذا لم يكن هناك مستخدم، توجيه لصفحة تسجيل الدخول
        router.replace('/login');
        return;
      }

      // تحديث حالة التحقق
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        // إذا كان البريد مؤكداً، توجيه للصفحة الرئيسية
        router.replace('/');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // التحقق الدوري من حالة البريد
  useEffect(() => {
    if (!user) return;

    const checkEmailVerified = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        setMessage('✅ تم التحقق من بريدك الإلكتروني بنجاح! جاري التوجيه...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    }, 3000); // التحقق كل 3 ثواني

    return () => clearInterval(checkEmailVerified);
  }, [user, router]);

  const handleResendEmail = async () => {
    if (!user || !canResend) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendEmailVerification(user);
      setMessage('✅ تم إرسال رابط التحقق مرة أخرى. يرجى التحقق من صندوق الوارد الخاص بك.');
      setCanResend(false);
      setCountdown(60); // انتظر 60 ثانية قبل إعادة الإرسال
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('تم إرسال عدد كبير من الطلبات. يرجى الانتظار قليلاً.');
      } else {
        setError('حدث خطأ أثناء إرسال البريد. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  const handleBackToLogin = async () => {
    await auth.signOut();
    router.replace('/login');
  };

  if (!user) {
    return (
      <div className="verify-page">
        <div className="loading">جاري التحميل...</div>
        <style jsx>{`
          .verify-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-darker);
          }
          .loading {
            color: var(--electric-green);
            font-size: 1.2rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="verify-page">
      <div className="verify-container">
        <button onClick={handleBackToLogin} className="back-to-login-btn">
          ← العودة لتسجيل الدخول
        </button>
        
        <div className="verify-card">
          {/* أيقونة البريد */}
          <div className="email-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="verify-title">تحقق من بريدك الإلكتروني</h1>
          
          <p className="verify-description">
            لقد أرسلنا رابط التحقق إلى:
          </p>
          
          <div className="email-display">
            {user.email}
          </div>

          <p className="verify-instructions">
            يرجى التحقق من صندوق الوارد الخاص بك والنقر على رابط التحقق لتفعيل حسابك.
            <br />
            <strong>سيتم تحديث الصفحة تلقائياً بعد التحقق.</strong>
          </p>

          {/* الرسائل */}
          {message && (
            <div className="message success">
              {message}
            </div>
          )}

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {/* زر إعادة الإرسال */}
          <button
            onClick={handleResendEmail}
            disabled={loading || !canResend}
            className="resend-btn"
          >
            {loading ? (
              'جاري الإرسال...'
            ) : !canResend ? (
              `إعادة الإرسال بعد ${countdown} ثانية`
            ) : (
              '📧 إعادة إرسال رابط التحقق'
            )}
          </button>

          {/* ملاحظة */}
          <div className="note">
            💡 لم تستلم البريد؟ تحقق من مجلد البريد المزعج (Spam)
          </div>

          
        </div>
      </div>

      <style jsx>{`
        .verify-page {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg-darker) 0%, var(--bg-dark) 50%, #001a0f 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .back-to-login-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 12px;
          color: var(--electric-green);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          z-index: 10;
        }

        .back-to-login-btn:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: var(--electric-green);
          transform: translateX(-5px);
        }

        .verify-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(57, 255, 20, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .verify-container {
          width: 100%;
          max-width: 600px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
        }

        .verify-card {
          background: linear-gradient(135deg, rgba(10, 15, 20, 0.95) 0%, rgba(5, 10, 14, 0.95) 100%);
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(0, 255, 136, 0.2);
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .email-icon {
          margin: 0 auto 30px;
          width: 80px;
          height: 80px;
          color: var(--electric-green);
          animation: pulse 2s ease-in-out infinite;
        }

        .verify-title {
          font-size: 2em;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #00ff88 0%, #39ff14 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .verify-description {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .email-display {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 12px;
          padding: 15px 20px;
          margin: 20px 0;
          color: var(--electric-green);
          font-size: 1.1rem;
          font-weight: 600;
          word-break: break-all;
        }

        .verify-instructions {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.8;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .verify-instructions strong {
          color: var(--electric-green);
        }

        .message {
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .message.success {
          background: rgba(0, 255, 136, 0.1);
          border: 1px solid rgba(0, 255, 136, 0.3);
          color: #00ff88;
        }

        .message.error {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
        }

        .resend-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          border: none;
          border-radius: 12px;
          color: #0a0f14;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
          margin-bottom: 20px;
        }

        .resend-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 255, 136, 0.6);
          background: linear-gradient(135deg, #39ff14 0%, #00ff88 100%);
        }

        .resend-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .note {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 15px;
          color: #ffc107;
          font-size: 0.9rem;
          margin-bottom: 30px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @media (max-width: 600px) {
          .verify-card {
            padding: 40px 25px;
          }

          .verify-title {
            font-size: 1.6em;
          }

          .email-display {
            font-size: 0.95rem;
          }

          .back-to-login-btn {
            top: 15px;
            left: 15px;
            padding: 10px 18px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
