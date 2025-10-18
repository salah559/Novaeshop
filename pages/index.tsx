
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home(){
  const { t } = useLanguage();
  
  return (
    <div>
      <section className="animate-fadeIn" style={{
        padding: 'clamp(40px, 10vw, 80px) 0',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        marginBottom: 'clamp(20px, 5vw, 40px)'
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 clamp(15px, 3vw, 20px)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2em, 8vw, 3.5em)',
            marginBottom: 'clamp(15px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.2
          }}>{t('welcomeTitle')}</h1>
          
          <p style={{
            fontSize: 'clamp(1em, 3.5vw, 1.3em)',
            color: '#e0e0e0',
            marginBottom: 'clamp(20px, 4vw, 30px)',
            lineHeight: 1.6
          }}>
            {t('welcomeSubtitle')}
            <br/>
            <span style={{color: '#00ff88'}}>{t('paymentInfo')}</span>
          </p>
          
          <div style={{
            display: 'flex',
            gap: 'clamp(10px, 3vw, 20px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 'clamp(20px, 5vw, 40px)',
            flexDirection: 'row'
          }} className="hero-buttons">
            <Link href="/products" className="btn" style={{
              fontSize: 'clamp(0.9em, 2.5vw, 1.1em)',
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)',
              display: 'inline-block',
              minWidth: 'clamp(140px, 40vw, 200px)'
            }}>
              {t('browseProducts')}
            </Link>
            <Link href="/contact" style={{
              display: 'inline-block',
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 8,
              color: '#00ff88',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2.5vw, 1.1em)',
              transition: 'all 0.3s ease',
              minWidth: 'clamp(140px, 40vw, 200px)',
              textAlign: 'center'
            }}>
              {t('contactUs')}
            </Link>
          </div>
        </div>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: 'clamp(15px, 4vw, 30px)',
        marginTop: 'clamp(30px, 8vw, 60px)'
      }}>
        <div className="card animate-fadeInUp animate-delay-1 shadow-glow-hover" style={{textAlign: 'center'}}>
          <div className="animate-float" style={{
            width: 'clamp(60px, 15vw, 80px)',
            height: 'clamp(60px, 15vw, 80px)',
            margin: '0 auto clamp(15px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(2em, 5vw, 2.5em)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            animationDelay: '0.2s'
          }}>🛍️</div>
          <h3 style={{color: '#00ff88', marginBottom: 'clamp(10px, 2vw, 15px)', fontSize: 'clamp(1.1em, 3vw, 1.3em)'}}>{t('diverseProducts')}</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>
            {t('diverseProductsDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-2 shadow-glow-hover" style={{textAlign: 'center'}}>
          <div className="animate-float" style={{
            width: 'clamp(60px, 15vw, 80px)',
            height: 'clamp(60px, 15vw, 80px)',
            margin: '0 auto clamp(15px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(2em, 5vw, 2.5em)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
          }}>💳</div>
          <h3 style={{color: '#00ff88', marginBottom: 'clamp(10px, 2vw, 15px)', fontSize: 'clamp(1.1em, 3vw, 1.3em)'}}>{t('securePayment')}</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>
            {t('securePaymentDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-3 shadow-glow-hover" style={{textAlign: 'center'}}>
          <div className="animate-float" style={{
            width: 'clamp(60px, 15vw, 80px)',
            height: 'clamp(60px, 15vw, 80px)',
            margin: '0 auto clamp(15px, 3vw, 20px)',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(2em, 5vw, 2.5em)',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
            animationDelay: '0.5s'
          }}>⚡</div>
          <h3 style={{color: '#00ff88', marginBottom: 'clamp(10px, 2vw, 15px)', fontSize: 'clamp(1.1em, 3vw, 1.3em)'}}>{t('instantDelivery')}</h3>
          <p style={{color: '#c0c0c0', lineHeight: 1.6, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>
            {t('instantDeliveryDesc')}
          </p>
        </div>
      </section>

      <section className="card animate-fadeInUp shadow-glow" style={{
        marginTop: 'clamp(30px, 8vw, 60px)',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
        border: '2px solid rgba(0, 255, 136, 0.3)',
        textAlign: 'center'
      }}>
        <h2 style={{marginBottom: 'clamp(15px, 3vw, 20px)', fontSize: 'clamp(1.5em, 5vw, 2em)'}}>{t('howItWorks')}</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
          gap: 'clamp(20px, 4vw, 30px)',
          marginTop: 'clamp(20px, 5vw, 40px)'
        }}>
          <div>
            <div style={{
              fontSize: 'clamp(2em, 6vw, 2.5em)',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)'
            }}>1</div>
            <h4 style={{color: '#fff', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1em, 3vw, 1.2em)'}}>{t('step1')}</h4>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{t('step1Desc')}</p>
          </div>
          <div>
            <div style={{
              fontSize: 'clamp(2em, 6vw, 2.5em)',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)'
            }}>2</div>
            <h4 style={{color: '#fff', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1em, 3vw, 1.2em)'}}>{t('step2')}</h4>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{t('step2Desc')}</p>
          </div>
          <div>
            <div style={{
              fontSize: 'clamp(2em, 6vw, 2.5em)',
              color: '#00ff88',
              marginBottom: 'clamp(8px, 2vw, 10px)'
            }}>3</div>
            <h4 style={{color: '#fff', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1em, 3vw, 1.2em)'}}>{t('step3')}</h4>
            <p style={{color: '#c0c0c0', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>{t('step3Desc')}</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
          
          .hero-buttons a {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
