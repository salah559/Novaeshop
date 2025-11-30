
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function Home(){
  const { t } = useLanguage();
  
  return (
    <div>
      <div className="floating-orbs">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>
        <div className="orb orb3"></div>
      </div>

      <section style={{
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
            marginBottom: 30
          }}>
            <span className="tag">
              ✨ {t('newShoppingExperience')}
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.2em, 10vw, 4.5em)',
            marginBottom: 'clamp(20px, 4vw, 35px)',
            lineHeight: 1.1,
            fontWeight: 800
          }}>{t('welcomeTitle')}</h1>
          
          <p style={{
            fontSize: 'clamp(1.1em, 3.5vw, 1.4em)',
            color: 'rgba(255,255,255,0.75)',
            marginBottom: 'clamp(15px, 3vw, 25px)',
            lineHeight: 1.8,
            maxWidth: 750,
            margin: '0 auto 25px'
          }}>
            {t('welcomeSubtitle')}
          </p>
          
          <p style={{
            fontSize: 'clamp(1.05em, 3vw, 1.3em)',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
              fontSize: '1.1em'
            }}>{t('paymentInfo')}</span>
          </p>
          
          <div style={{
            display: 'flex',
            gap: 'clamp(15px, 4vw, 25px)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }} className="hero-buttons">
            <Link href="/products" className="btn animate-slideInLeft animate-delay-1" style={{
              fontSize: 'clamp(1em, 2.5vw, 1.2em)',
              padding: 'clamp(16px, 3vw, 20px) clamp(32px, 8vw, 50px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span>🛍️</span>
              {t('browseProducts')}
            </Link>
            <Link href="/contact" className="btn btn-outline animate-slideInRight animate-delay-2" style={{
              fontSize: 'clamp(1em, 2.5vw, 1.2em)',
              padding: 'clamp(16px, 3vw, 20px) clamp(32px, 8vw, 50px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span>💬</span>
              {t('contactUs')}
            </Link>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(30px, 6vw, 50px)',
            marginTop: 'clamp(50px, 10vw, 80px)',
            flexWrap: 'wrap'
          }}>
            <div className="animate-fadeInUp animate-delay-1 glow-effect" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2.2em, 7vw, 3.2em)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #39ff14, #ffd700)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(57, 255, 20, 0.5)'
              }}>500+</div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1em',
                marginTop: 8,
                fontWeight: 500
              }}>{t('digitalProducts')}</div>
            </div>
            <div className="animate-fadeInUp animate-delay-2 glow-effect" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2.2em, 7vw, 3.2em)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #ffd700, #39ff14)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(255, 215, 0, 0.5)'
              }}>1000+</div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1em',
                marginTop: 8,
                fontWeight: 500
              }}>{t('happyCustomers')}</div>
            </div>
            <div className="animate-fadeInUp animate-delay-3 glow-effect" style={{textAlign: 'center'}}>
              <div style={{
                fontSize: 'clamp(2.2em, 7vw, 3.2em)',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #00ff88, #39ff14)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 40px rgba(57, 255, 20, 0.5)'
              }}>24/7</div>
              <div style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1em',
                marginTop: 8,
                fontWeight: 500
              }}>{t('continuousSupport')}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: 'clamp(25px, 5vw, 35px)',
        marginTop: 'clamp(30px, 8vw, 60px)'
      }}>
        <div className="card animate-fadeInUp animate-delay-1" style={{textAlign: 'center'}}>
          <div className="icon-box animate-float" style={{
            margin: '0 auto 25px'
          }}>🛍️</div>
          <h3 style={{
            color: '#39ff14',
            marginBottom: 15,
            fontSize: 'clamp(1.15em, 3.5vw, 1.4em)',
            textShadow: '0 0 15px rgba(57, 255, 20, 0.4)'
          }}>{t('diverseProducts')}</h3>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8,
            fontSize: '0.95em'
          }}>
            {t('diverseProductsDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-2" style={{textAlign: 'center'}}>
          <div className="icon-box animate-float" style={{
            margin: '0 auto 25px',
            animationDelay: '0.5s'
          }}>💳</div>
          <h3 style={{
            color: '#ffd700',
            marginBottom: 15,
            fontSize: 'clamp(1.15em, 3.5vw, 1.4em)',
            textShadow: '0 0 15px rgba(255, 215, 0, 0.4)'
          }}>{t('securePayment')}</h3>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8,
            fontSize: '0.95em'
          }}>
            {t('securePaymentDesc')}
          </p>
        </div>

        <div className="card animate-fadeInUp animate-delay-3" style={{textAlign: 'center'}}>
          <div className="icon-box animate-float" style={{
            margin: '0 auto 25px',
            animationDelay: '1s'
          }}>⚡</div>
          <h3 style={{
            color: '#00ff88',
            marginBottom: 15,
            fontSize: 'clamp(1.15em, 3.5vw, 1.4em)',
            textShadow: '0 0 15px rgba(0, 255, 136, 0.4)'
          }}>{t('instantDelivery')}</h3>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8,
            fontSize: '0.95em'
          }}>
            {t('instantDeliveryDesc')}
          </p>
        </div>
      </section>

      <section className="card animate-fadeInUp animate-delay-2" style={{
        marginTop: 'clamp(50px, 12vw, 100px)',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
        border: '2px solid rgba(57, 255, 20, 0.25)',
        textAlign: 'center',
        padding: 'clamp(40px, 8vw, 60px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #39ff14, transparent)',
          animation: 'shine 2s infinite'
        }}></div>
        
        <span className="tag" style={{marginBottom: 20, display: 'inline-block'}}>
          🚀 {t('howToUseTag')}
        </span>
        <h2 style={{
          marginBottom: 'clamp(25px, 5vw, 40px)',
          fontSize: 'clamp(1.8em, 6vw, 2.4em)',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>{t('howItWorks')}</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(30px, 6vw, 45px)',
          marginTop: 'clamp(30px, 6vw, 50px)'
        }}>
          <div className="animate-fadeInUp animate-delay-1">
            <div style={{
              width: 70,
              height: 70,
              margin: '0 auto 18px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #39ff14, #00ff88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 800,
              color: '#000',
              boxShadow: '0 0 40px rgba(57, 255, 20, 0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>1</div>
            <h4 style={{
              color: '#39ff14',
              marginBottom: 12,
              fontSize: '1.15em',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
            }}>{t('step1')}</h4>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95em',
              lineHeight: 1.7
            }}>{t('step1Desc')}</p>
          </div>
          
          <div className="animate-fadeInUp animate-delay-2">
            <div style={{
              width: 70,
              height: 70,
              margin: '0 auto 18px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 800,
              color: '#000',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>2</div>
            <h4 style={{
              color: '#ffd700',
              marginBottom: 12,
              fontSize: '1.15em',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
            }}>{t('step2')}</h4>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95em',
              lineHeight: 1.7
            }}>{t('step2Desc')}</p>
          </div>
          
          <div className="animate-fadeInUp animate-delay-3">
            <div style={{
              width: 70,
              height: 70,
              margin: '0 auto 18px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ff88, #39ff14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8em',
              fontWeight: 800,
              color: '#000',
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.6)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>3</div>
            <h4 style={{
              color: '#00ff88',
              marginBottom: 12,
              fontSize: '1.15em',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(0, 255, 136, 0.3)'
            }}>{t('step3')}</h4>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.95em',
              lineHeight: 1.7
            }}>{t('step3Desc')}</p>
          </div>
        </div>
      </section>

      <section style={{
        marginTop: 'clamp(50px, 12vw, 100px)',
        textAlign: 'center',
        padding: 'clamp(40px, 8vw, 60px) 0',
        position: 'relative'
      }}>
        <h2 style={{
          marginBottom: 20,
          fontSize: 'clamp(1.8em, 6vw, 2.4em)',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>{t('readyToStart')}</h2>
        <p style={{
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 35,
          fontSize: '1.1em',
          lineHeight: 1.8
        }}>
          {t('joinCustomers')}
        </p>
        <Link href="/products" className="btn animate-pulse" style={{
          fontSize: '1.15em',
          padding: '16px 45px'
        }}>
          {t('startShopping')} ← 
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
