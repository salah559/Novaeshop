import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { auth, signInEmail, registerEmail, signInWithGoogle } from '@/lib/firebaseClient';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+213');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      if (u) {
        // User is logged in, redirect to home
        router.push('/');
      }
    });
    return () => unsub();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'signup' && password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'signin') {
        const userCredential = await signInEmail(email, password);
        // التحقق من أن البريد مؤكد
        if (!userCredential.user.emailVerified) {
          // توجيه المستخدم لصفحة التحقق
          router.push('/verify-email');
          return;
        }
      } else {
        await registerEmail(email, password);
        // توجيه المستخدم لصفحة التحقق
        router.push('/verify-email');
        return;
      }
      // سيتم توجيه المستخدم تلقائياً للصفحة الرئيسية عبر useEffect
    } catch (err: any) {
      console.error('Auth error:', err.code, err.message);
      
      let errorMessage = '';
      
      // رسائل خطأ دقيقة بناءً على كود الخطأ
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = '⚠️ هذا البريد الإلكتروني مُستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.';
          break;
        
        case 'auth/weak-password':
          errorMessage = '🔒 كلمة المرور ضعيفة! يجب أن تكون 6 أحرف على الأقل.';
          break;
        
        case 'auth/invalid-email':
          errorMessage = '📧 البريد الإلكتروني غير صالح. تأكد من كتابته بشكل صحيح (مثال: user@example.com)';
          break;
        
        case 'auth/user-not-found':
          errorMessage = '❌ لا يوجد حساب بهذا البريد الإلكتروني. يرجى إنشاء حساب جديد أولاً.';
          break;
        
        case 'auth/wrong-password':
          errorMessage = '🔑 كلمة المرور غير صحيحة. حاول مرة أخرى أو استخدم "نسيت كلمة المرور".';
          break;
        
        case 'auth/invalid-credential':
          errorMessage = '⚠️ البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من المعلومات المُدخلة.';
          break;
        
        case 'auth/too-many-requests':
          errorMessage = '⏳ تم حظر هذا الحساب مؤقتاً بسبب محاولات تسجيل دخول كثيرة. حاول لاحقاً.';
          break;
        
        case 'auth/user-disabled':
          errorMessage = '🚫 تم تعطيل هذا الحساب. تواصل مع الدعم الفني.';
          break;
        
        case 'auth/operation-not-allowed':
          errorMessage = '⚠️ طريقة تسجيل الدخول هذه غير مفعلة. تواصل مع الدعم الفني.';
          break;
        
        case 'auth/network-request-failed':
          errorMessage = '📡 فشل الاتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.';
          break;
        
        case 'auth/invalid-login-credentials':
          errorMessage = '⚠️ بيانات تسجيل الدخول غير صحيحة. تحقق من البريد وكلمة المرور.';
          break;
        
        case 'auth/missing-password':
          errorMessage = '🔑 يرجى إدخال كلمة المرور.';
          break;
        
        case 'auth/missing-email':
          errorMessage = '📧 يرجى إدخال البريد الإلكتروني.';
          break;
        
        default:
          // رسالة افتراضية مع تفاصيل الخطأ
          errorMessage = `❌ حدث خطأ: ${err.message || 'خطأ غير معروف'}`;
          console.error('Unhandled auth error:', err);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (phoneStep === 'input') {
        // تنظيف reCAPTCHA القديم إذا كان موجوداً
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch (e) {
            console.log('Error clearing recaptcha:', e);
          }
          (window as any).recaptchaVerifier = null;
        }

        // تنظيف العنصر من DOM
        const container = document.getElementById('recaptcha-container');
        if (container) {
          container.innerHTML = '';
        }

        // إعداد reCAPTCHA جديد
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            }
          },
          auth
        );

        const appVerifier = (window as any).recaptchaVerifier;
        const fullPhone = countryCode + phone;

        console.log('Sending code to:', fullPhone);
        const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
        setConfirmationResult(result);
        setPhoneStep('verify');
      } else {
        // التحقق من الكود
        if (!confirmationResult) {
          setError('حدث خطأ، يرجى المحاولة مرة أخرى');
          return;
        }
        await confirmationResult.confirm(verificationCode);
        // سيتم توجيه المستخدم تلقائياً للصفحة الرئيسية عبر useEffect
      }
    } catch (err: any) {
      console.error('Phone auth error:', err.code, err.message);
      
      let errorMessage = '';
      
      switch (err.code) {
        case 'auth/invalid-phone-number':
          errorMessage = '📱 رقم الهاتف غير صحيح. تأكد من إدخال الرقم بشكل صحيح.';
          break;
        
        case 'auth/missing-phone-number':
          errorMessage = '📱 يرجى إدخال رقم الهاتف.';
          break;
        
        case 'auth/quota-exceeded':
          errorMessage = '⏳ تم تجاوز الحد المسموح للرسائل. حاول لاحقاً.';
          break;
        
        case 'auth/invalid-verification-code':
          errorMessage = '🔢 رمز التحقق غير صحيح. تحقق من الرمز وحاول مرة أخرى.';
          break;
        
        case 'auth/code-expired':
          errorMessage = '⏰ انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً.';
          break;
        
        case 'auth/too-many-requests':
          errorMessage = '⏳ محاولات كثيرة جداً. حاول بعد قليل.';
          break;
        
        case 'auth/captcha-check-failed':
          errorMessage = '🤖 فشل التحقق من reCAPTCHA. أعد تحميل الصفحة وحاول مرة أخرى.';
          break;
        
        default:
          errorMessage = `❌ حدث خطأ: ${err.message || 'خطأ غير معروف'}`;
      }
      
      setError(errorMessage);
      
      // إعادة تعيين reCAPTCHA في حالة الخطأ
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {
          console.log('Error clearing recaptcha:', e);
        }
        (window as any).recaptchaVerifier = null;
      }
      setPhoneStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google auth error:', err.code, err.message);
      
      let errorMessage = '';
      
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = '⚠️ تم إغلاق نافذة تسجيل الدخول. حاول مرة أخرى.';
          break;
        
        case 'auth/popup-blocked':
          errorMessage = '🚫 تم حظر النافذة المنبثقة. سمح بالنوافذ المنبثقة وحاول مرة أخرى.';
          break;
        
        case 'auth/cancelled-popup-request':
          errorMessage = '⚠️ تم إلغاء طلب تسجيل الدخول.';
          break;
        
        case 'auth/account-exists-with-different-credential':
          errorMessage = '📧 يوجد حساب بنفس البريد الإلكتروني بطريقة تسجيل دخول مختلفة.';
          break;
        
        case 'auth/network-request-failed':
          errorMessage = '📡 فشل الاتصال بالإنترنت. تحقق من اتصالك.';
          break;
        
        default:
          errorMessage = `❌ حدث خطأ في تسجيل الدخول بـ Google: ${err.message || 'خطأ غير معروف'}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setVerificationCode('');
    setPhoneStep('input');
    setError('');
  };

  const switchAuthMode = (mode: AuthMode) => {
    setAuthMode(mode);
    resetForm();
  };

  const switchAuthMethod = (method: AuthMethod) => {
    setAuthMethod(method);
    resetForm();
    // تنظيف reCAPTCHA
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {
        console.log('Error clearing recaptcha:', e);
      }
      (window as any).recaptchaVerifier = null;
    }
    // تنظيف العنصر من DOM
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Link href="/" className="back-link">
          ← {t('home')}
        </Link>

        <div className="login-card">
          {/* Auth Mode Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authMode === 'signin' ? 'active' : ''}`}
              onClick={() => switchAuthMode('signin')}
            >
              {t('signIn')}
            </button>
            <button
              className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => switchAuthMode('signup')}
            >
              {t('signUp')}
            </button>
          </div>

          <h1 className="auth-title">
            {authMode === 'signin' ? t('welcomeBack') : t('createAccount')}
          </h1>

          {/* Auth Method Selection - Phone disabled until billing enabled */}
          {/* <div className="auth-method-selector">
            <button
              className={`method-btn ${authMethod === 'email' ? 'active' : ''}`}
              onClick={() => switchAuthMethod('email')}
            >
              📧 {t('email')}
            </button>
            <button
              className={`method-btn ${authMethod === 'phone' ? 'active' : ''}`}
              onClick={() => switchAuthMethod('phone')}
            >
              📱 {t('phone')}
            </button>
          </div> */}

          {error && (
            <div className={error.startsWith('✅') ? 'auth-success' : 'auth-error'}>
              {error}
            </div>
          )}

          {/* Email Authentication */}
          {/* authMethod === 'email' && */ (
            <form onSubmit={handleEmailAuth} className="auth-form">
              <div className="form-group">
                <label>{t('emailAddress')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enterPassword')}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {authMode === 'signup' && (
                <div className="form-group">
                  <label>{t('confirmPassword')}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('confirmPassword')}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('loading') : authMode === 'signin' ? t('signIn') : t('signUp')}
              </button>
            </form>
          ) /* } */}

          {/* Phone Authentication - Disabled until Firebase billing enabled */}
          {/* authMethod === 'phone' && (
            <form onSubmit={handlePhoneAuth} className="auth-form">
              {phoneStep === 'input' ? (
                <>
                  <div className="form-group">
                    <label>{t('phoneNumber')}</label>
                    <div className="phone-input-group">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="country-code-select"
                        disabled={loading}
                      >
                        <option value="+213">🇩🇿 +213</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+216">🇹🇳 +216</option>
                        <option value="+962">🇯🇴 +962</option>
                        <option value="+974">🇶🇦 +974</option>
                        <option value="+965">🇰🇼 +965</option>
                        <option value="+973">🇧🇭 +973</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+33">🇫🇷 +33</option>
                      </select>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="555123456"
                        required
                        disabled={loading}
                        className="phone-input"
                      />
                    </div>
                    <small className="input-hint">{t('phoneHint')}</small>
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? t('loading') : t('sendCode')}
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>{t('verificationCode')}</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      required
                      disabled={loading}
                      maxLength={6}
                      className="verification-input"
                    />
                    <small className="input-hint">{t('codeSentTo')} {countryCode}{phone}</small>
                  </div>

                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? t('loading') : t('verify')}
                  </button>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setPhoneStep('input')}
                    disabled={loading}
                  >
                    {t('changeNumber')}
                  </button>
                </>
              )}
            </form>
          ) */}

          {/* Divider */}
          <div className="auth-divider">
            <span>{t('or')}</span>
          </div>

          {/* reCAPTCHA Container (مخفي) */}
          <div id="recaptcha-container"></div>

          {/* Google Sign In */}
          <button
            className="google-btn"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            {t('continueWithGoogle')}
          </button>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(5, 7, 8, 0.95) 0%, rgba(10, 15, 20, 0.95) 50%, rgba(5, 7, 8, 0.98) 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .login-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .login-container {
          width: 100%;
          max-width: 500px;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.6s ease-out;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 20px;
          color: #39ff14;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          transform: translateX(-5px);
          color: #ffd700;
        }

        .login-card {
          background: linear-gradient(135deg, rgba(5, 7, 8, 0.95) 0%, rgba(10, 15, 20, 0.95) 100%);
          border: 2px solid rgba(57, 255, 20, 0.2);
          border-radius: 24px;
          padding: clamp(30px, 5vw, 50px);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(57, 255, 20, 0.15);
          backdrop-filter: blur(10px);
        }

        .auth-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          background: rgba(0, 0, 0, 0.3);
          padding: 6px;
          border-radius: 12px;
        }

        .auth-tab {
          flex: 1;
          padding: 14px;
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: clamp(0.95rem, 2.5vw, 1.05rem);
        }

        .auth-tab.active {
          background: linear-gradient(135deg, #39ff14 0%, #ffd700 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(57, 255, 20, 0.4);
        }

        .auth-tab:not(.active):hover {
          background: rgba(57, 255, 20, 0.1);
          color: #39ff14;
        }

        .auth-title {
          text-align: center;
          font-size: clamp(1.6em, 5vw, 2em);
          margin-bottom: 30px;
          background: linear-gradient(135deg, #39ff14 0%, #ffd700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-method-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
        }

        .method-btn {
          flex: 1;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .method-btn.active {
          background: rgba(57, 255, 20, 0.15);
          border-color: #39ff14;
          color: #39ff14;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
        }

        .method-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(57, 255, 20, 0.4);
        }

        .auth-error {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9em;
          text-align: center;
        }

        .auth-success {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: #39ff14;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.9em;
          text-align: center;
        }

        .auth-form {
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #39ff14;
          font-weight: 500;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: clamp(0.95rem, 2.5vw, 1rem);
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #39ff14;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .phone-input-group {
          display: flex;
          gap: 10px;
        }

        .country-code-select {
          width: 110px;
          padding: 14px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .country-code-select:focus {
          outline: none;
          border-color: #39ff14;
          box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
        }

        .country-code-select option {
          background: #0a0f14;
          color: #fff;
        }

        .phone-input {
          flex: 1;
        }

        .verification-input {
          text-align: center;
          font-size: clamp(1.3rem, 4vw, 1.5rem) !important;
          letter-spacing: 0.5em;
          font-weight: 600;
        }

        .input-hint {
          display: block;
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: clamp(0.8rem, 2vw, 0.85rem);
        }

        .btn-submit {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #39ff14 0%, #ffd700 100%);
          border: none;
          border-radius: 8px;
          color: #000;
          font-weight: 700;
          font-size: clamp(1rem, 2.5vw, 1.1rem);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(57, 255, 20, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(57, 255, 20, 0.6);
          background: linear-gradient(135deg, #ffd700 0%, #39ff14 100%);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.2);
          border-radius: 8px;
          color: #39ff14;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          font-size: clamp(0.95rem, 2.5vw, 1rem);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: #39ff14;
        }

        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 25px 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(57, 255, 20, 0.1);
        }

        .auth-divider span {
          position: relative;
          background: linear-gradient(135deg, rgba(5, 7, 8, 0.95) 0%, rgba(10, 15, 20, 0.95) 100%);
          padding: 0 15px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9em;
        }

        .google-btn {
          width: 100%;
          padding: 16px;
          background: #fff;
          border: 1px solid #dadce0;
          border-radius: 8px;
          color: #3c4043;
          font-weight: 600;
          font-size: clamp(0.95rem, 2.5vw, 1rem);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .google-btn:hover:not(:disabled) {
          background: #f8f9fa;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        @media (max-width: 600px) {
          .login-page {
            padding: 15px;
            align-items: flex-start;
            padding-top: 40px;
          }

          .login-card {
            padding: 25px 20px;
          }

          .verification-input {
            letter-spacing: 0.3em;
          }
        }
      `}</style>
    </div>
  );
}