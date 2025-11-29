
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home(){
  const { t } = useLanguage();
  
  return (
    <div>
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <section className="animate-fadeIn" style={{
        padding: 'clamp(60px, 12vw, 120px) 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 clamp(15px, 3vw, 20px)'
        }}>
          <div className="animate-scaleIn" style={{
            display: 'inline-block',
            marginBottom: 20
          }}>
            <span className="tag purple" style={{fontSize: '0.9em'}}>
              🚀 منصة رقمية متطورة
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.2em, 9vw, 4em)',
            marginBottom: 'clamp(20px, 4vw, 30px)',
            lineHeight: 1.1,
            fontWeight: 800
          }}>{t('welcomeTitle')}</h1>
          
          <p style={{
            fontSize: 'clamp(1.1em, 3.5vw, 1.4em)',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 'clamp(15px, 3vw, 20px)',
            lineHeight: 1.7,
            maxWidth: 700,
            margin: '0 auto'
          }}>
            {t('welcomeSubtitle')}
          </p>
          
          <p style={{
            fontSize: 'clamp(1em, 3vw, 1.2em)',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            marginTop: 15
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600
            }}>{t('paymentInfo')}</span>
          </p>
          
          <div style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 20px)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }} className="hero-buttons">
            <Link href="/products" className="btn" style={{
              fontSize: 'clamp(1em, 2.5vw, 1.15em)',
              padding: 'clamp(14px, 3vw, 18px) clamp(28px, 7vw, 45px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span>🛍️</span>
              {t('browseProducts')}
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{
              fontSize: 'clamp(1em, 2.5vw, 1.15em)',
              padding: 'clamp(14px, 3vw, 18px) clamp(28px, 7vw, 45px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span>💬</span>
              {t('contactUs')}
            </Link>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            marginTop: 'clamp(40px, 8vw, 70px)',
            flexWrap: 'wrap'
          }}>
            <div className="animate-fadeInUp animate-delay-1" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2em, 6vw, 2.8em)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>500+</div>
              <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.95em'}}>منتج رقمي</div>
            </div>
            <div className="animate-fadeInUp animate-delay-2" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2em, 6vw, 2.8em)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>1000+</div>
              <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.95em'}}>عميل سعيد</div>
            </div>
            <div className="animate-fadeInUp animate-delay-3" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2em, 6vw, 2.8em)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>24/7</div>
              <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.95em'}}>دعم متواصل</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(20px, 4vw, 30px)',
        marginTop: 'clamp(20px, 6vw, 40px)'
      }}>
        <div className="card animate-fadeInUp animate-delay-1" style={{textAlign: 'center'}}>
          <div className="icon-box purple animate-float" style={{
            margin: '0 auto 20px'
          }}>🛍️</div>
          <h3 style={{
            color: '#818cf8',
            marginBottom: 12,
            fontSize: 'clamp(1.1em, 3vw, 1.3em)'
          }}>{t('diverseProducts')}</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.95em'}}>
            {t('diverseProductsDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-2" style={{textAlign: 'center'}}>
          <div className="icon-box pink animate-float" style={{
            margin: '0 auto 20px',
            animationDelay: '0.5s'
          }}>💳</div>
          <h3 style={{
            color: '#f472b6',
            marginBottom: 12,
            fontSize: 'clamp(1.1em, 3vw, 1.3em)'
          }}>{t('securePayment')}</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.95em'}}>
            {t('securePaymentDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-3" style={{textAlign: 'center'}}>
          <div className="icon-box cyan animate-float" style={{
            margin: '0 auto 20px',
            animationDelay: '1s'
          }}>⚡</div>
          <h3 style={{
            color: '#22d3ee',
            marginBottom: 12,
            fontSize: 'clamp(1.1em, 3vw, 1.3em)'
          }}>{t('instantDelivery')}</h3>
          <p style={{color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: '0.95em'}}>
            {t('instantDeliveryDesc')}
          </p>
        </div>
      </section>

      <section className="card animate-fadeInUp" style={{
        marginTop: 'clamp(40px, 10vw, 80px)',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        textAlign: 'center',
        padding: 'clamp(30px, 6vw, 50px)'
      }}>
        <span className="tag pink" style={{marginBottom: 15, display: 'inline-block'}}>
          ✨ سهولة في الاستخدام
        </span>
        <h2 style={{marginBottom: 'clamp(20px, 4vw, 30px)', fontSize: 'clamp(1.6em, 5vw, 2.2em)'}}>{t('howItWorks')}</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(25px, 5vw, 40px)',
          marginTop: 'clamp(25px, 5vw, 40px)'
        }}>
          <div className="animate-fadeInUp animate-delay-1">
            <div style={{
              width: 60,
              height: 60,
              margin: '0 auto 15px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5em',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
            }}>1</div>
            <h4 style={{color: '#fff', marginBottom: 10, fontSize: '1.1em'}}>{t('step1')}</h4>
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9em', lineHeight: 1.6}}>{t('step1Desc')}</p>
          </div>
          
          <div className="animate-fadeInUp animate-delay-2">
            <div style={{
              width: 60,
              height: 60,
              margin: '0 auto 15px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #f472b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5em',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 0 30px rgba(236, 72, 153, 0.4)'
            }}>2</div>
            <h4 style={{color: '#fff', marginBottom: 10, fontSize: '1.1em'}}>{t('step2')}</h4>
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9em', lineHeight: 1.6}}>{t('step2Desc')}</p>
          </div>
          
          <div className="animate-fadeInUp animate-delay-3">
            <div style={{
              width: 60,
              height: 60,
              margin: '0 auto 15px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5em',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
            }}>3</div>
            <h4 style={{color: '#fff', marginBottom: 10, fontSize: '1.1em'}}>{t('step3')}</h4>
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.9em', lineHeight: 1.6}}>{t('step3Desc')}</p>
          </div>
        </div>
      </section>

      <section style={{
        marginTop: 'clamp(40px, 10vw, 80px)',
        textAlign: 'center',
        padding: 'clamp(30px, 6vw, 50px) 0'
      }}>
        <h2 style={{marginBottom: 15}}>هل أنت مستعد للبدء؟</h2>
        <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 30, fontSize: '1.1em'}}>
          انضم إلى آلاف العملاء الراضين واحصل على منتجاتك الرقمية الآن
        </p>
        <Link href="/products" className="btn" style={{
          fontSize: '1.1em',
          padding: '16px 40px'
        }}>
          ابدأ التسوق الآن ←
        </Link>
      </section>

      <style jsx>{`
        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          
          .hero-buttons :global(a) {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
