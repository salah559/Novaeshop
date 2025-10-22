import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup';
type AuthMethod = 'email' | 'phone' | 'google';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t, language } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+213'); // Algeria default
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'verify'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (authMode === 'signup' && password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implement Firebase email authentication
      console.log(`${authMode} with email:`, email);
      // This will be connected to Firebase later
    } catch (err: any) {
      setError(err.message || t('authError'));
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
        // TODO: Send verification code via Firebase
        console.log('Sending code to:', countryCode + phone);
        setPhoneStep('verify');
      } else {
        // TODO: Verify code with Firebase
        console.log('Verifying code:', verificationCode);
      }
    } catch (err: any) {
      setError(err.message || t('authError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    
    try {
      // TODO: Implement Firebase Google authentication
      console.log('Google sign in');
    } catch (err: any) {
      setError(err.message || t('authError'));
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
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
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

        <h2 className="auth-title">
          {authMode === 'signin' ? t('welcomeBack') : t('createAccount')}
        </h2>

        {/* Auth Method Selection */}
        <div className="auth-method-selector">
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
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Email Authentication */}
        {authMethod === 'email' && (
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
        )}

        {/* Phone Authentication */}
        {authMethod === 'phone' && (
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
        )}

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('or')}</span>
        </div>

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

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .modal-container {
          background: linear-gradient(135deg, rgba(10, 15, 20, 0.95) 0%, rgba(5, 10, 14, 0.95) 100%);
          border: 2px solid rgba(0, 255, 136, 0.3);
          border-radius: 24px;
          padding: 40px;
          max-width: 480px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(0, 255, 136, 0.2);
          position: relative;
          animation: scaleIn 0.3s ease-out;
        }

        .modal-close {
          position: absolute;
          top: 20px;
          ${language === 'ar' ? 'left: 20px' : 'right: 20px'};
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 0, 0, 0.2);
          border-color: rgba(255, 0, 0, 0.5);
          transform: rotate(90deg);
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
          padding: 12px;
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-tab.active {
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          color: #0a0f14;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
        }

        .auth-tab:not(.active):hover {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
        }

        .auth-title {
          text-align: center;
          font-size: 1.8em;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #00ff88 0%, #39ff14 100%);
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
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.2);
          color: #e0e0e0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95em;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .method-btn.active {
          background: rgba(0, 255, 136, 0.15);
          border-color: #00ff88;
          color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        .method-btn:not(.active):hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(0, 255, 136, 0.4);
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

        .auth-form {
          margin-bottom: 25px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #00ff88;
          font-weight: 500;
          font-size: 0.95em;
        }

        .form-group input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
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
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .country-code-select:focus {
          outline: none;
          border-color: #00ff88;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
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
          font-size: 1.5rem !important;
          letter-spacing: 0.5em;
          font-weight: 600;
        }

        .input-hint {
          display: block;
          margin-top: 6px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85em;
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
          border: none;
          border-radius: 8px;
          color: #0a0f14;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 255, 136, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 255, 136, 0.6);
          background: linear-gradient(135deg, #39ff14 0%, #00ff88 100%);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          color: #00ff88;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          border-color: #00ff88;
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
          background: rgba(0, 255, 136, 0.2);
        }

        .auth-divider span {
          position: relative;
          background: linear-gradient(135deg, rgba(10, 15, 20, 0.95) 0%, rgba(5, 10, 14, 0.95) 100%);
          padding: 0 15px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9em;
        }

        .google-btn {
          width: 100%;
          padding: 14px;
          background: #fff;
          border: 1px solid #dadce0;
          border-radius: 8px;
          color: #3c4043;
          font-weight: 600;
          font-size: 1rem;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 600px) {
          .modal-container {
            padding: 30px 20px;
            border-radius: 16px;
          }

          .auth-title {
            font-size: 1.5em;
          }

          .verification-input {
            letter-spacing: 0.3em;
          }
        }
      `}</style>
    </div>
  );
}
