import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

export default function HowToBuy() {
  const { t } = useLanguage();

  const steps = [
    {
      num: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      emoji: '🛍️'
    },
    {
      num: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      emoji: '🛒'
    },
    {
      num: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      emoji: '💳'
    },
    {
      num: 4,
      title: t('step4Title'),
      desc: t('step4Desc'),
      emoji: '📸'
    },
    {
      num: 5,
      title: t('step5Title'),
      desc: t('step5Desc'),
      emoji: '⏳'
    },
    {
      num: 6,
      title: t('step6Title'),
      desc: t('step6Desc'),
      emoji: '⬇️'
    }
  ];

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
        }}>{t('howToBuyTitle')}</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>{t('howToBuySubtitle')}</p>
      </div>

      <div style={{
        display: 'grid',
        gap: 'clamp(20px, 4vw, 28px)',
        maxWidth: 900,
        margin: '0 auto'
      }}>
        {steps.map((step) => (
          <div key={step.num} className="card animate-fadeInUp" style={{
            background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '2px solid rgba(57, 255, 20, 0.2)',
            padding: 'clamp(20px, 4vw, 28px)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(18px, 4vw, 25px)',
            alignItems: 'start'
          }}>
            <div style={{
              width: 'clamp(50px, 10vw, 70px)',
              height: 'clamp(50px, 10vw, 70px)',
              background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(1.6em, 5vw, 2em)',
              fontWeight: 700,
              color: '#0a0f14',
              flexShrink: 0,
              boxShadow: '0 0 25px rgba(57, 255, 20, 0.4)',
              lineHeight: 1
            }}>
              {step.num}
            </div>
            <div>
              <h3 style={{
                color: '#39ff14',
                fontSize: 'clamp(1.15em, 3.5vw, 1.4em)',
                margin: '0 0 clamp(10px, 2vw, 14px) 0',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
              }}>
                {step.emoji} {step.title}
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.9,
                fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                margin: 0,
                whiteSpace: 'pre-line'
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.12) 0%, rgba(255, 215, 0, 0.08) 100%)',
        border: '2px solid rgba(57, 255, 20, 0.3)',
        borderRadius: 'clamp(14px, 3vw, 18px)',
        padding: 'clamp(25px, 5vw, 35px)',
        marginTop: 'clamp(40px, 8vw, 60px)',
        textAlign: 'center',
        maxWidth: 750,
        margin: 'clamp(40px, 8vw, 60px) auto 0'
      }}>
        <h3 style={{
          fontSize: 'clamp(1.2em, 3.5vw, 1.5em)',
          color: '#39ff14',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
        }}>
          💡 {t('importantTips')}
        </h3>
        <ul style={{
          textAlign: 'right',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 2,
          fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
          margin: 0,
          paddingLeft: 0,
          listStyle: 'none'
        }}>
          <li>✓ {t('tip1')}</li>
          <li>✓ {t('tip2')}</li>
          <li>✓ {t('tip3')}</li>
          <li>✓ {t('tip4')}</li>
        </ul>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: 'clamp(40px, 8vw, 60px)'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(1em, 2.5vw, 1.1em)',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          {t('readyToStart')}
        </p>
        <Link href="/products" className="btn" style={{
          fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
          padding: 'clamp(14px, 3vw, 18px) clamp(30px, 7vw, 40px)',
          borderRadius: 'clamp(12px, 3vw, 16px)'
        }}>
          🛍️ {t('browseNow')}
        </Link>
      </div>
    </div>
  );
}
