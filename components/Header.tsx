import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, logout } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';
import { isAdmin } from '@/lib/adminCheck';

export default function Header(){
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      setIsAdminUser(isAdmin(u?.email));
    });
    return () => unsub();
  },[]);

  return (
    <header style={{
      padding: 'clamp(12px, 2vw, 18px) 0',
      borderBottom: '2px solid rgba(57, 255, 20, 0.15)',
      background: 'rgba(5, 7, 8, 0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 0 30px rgba(57, 255, 20, 0.1)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'clamp(10px, 2vw, 20px)'
      }}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)', textDecoration: 'none', flex: '0 0 auto'}}>
          <div style={{
            width: 'clamp(45px, 8vw, 60px)',
            height: 'clamp(45px, 8vw, 60px)',
            borderRadius: 'clamp(10px, 2vw, 14px)',
            background: 'url(/enova-logo.png) center/contain no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(57, 255, 20, 0.4)'
          }}></div>
          <div className="logo-text" style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.2em, 4vw, 1.8em)',
              background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              fontWeight: 800,
              textShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
            }}>
              {t('siteName')}
            </h1>
            <small className="tagline" style={{
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
              fontSize: 'clamp(0.65em, 1.8vw, 0.8em)'
            }}>
              {t('tagline')}
            </small>
          </div>
        </Link>

        <nav className="desktop-nav" style={{
          alignItems: 'center',
          gap: 'clamp(5px, 1vw, 10px)',
          flexWrap: 'nowrap'
        } as any}>
          {[
            { href: '/', label: t('home') },
            { href: '/products', label: t('products') },
            { href: '/how-to-buy', label: 'كيف تشتري؟' },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 500,
              padding: 'clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px)',
              borderRadius: 'clamp(8px, 1vw, 10px)',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85em, 1.5vw, 1em)',
              whiteSpace: 'nowrap',
              border: '1px solid transparent'
            }} className="nav-link">{item.label}</Link>
          ))}
          <Link href="/contact" style={{
            color: 'rgba(255,255,255,0.75)',
            fontWeight: 500,
            padding: 'clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px)',
            borderRadius: 'clamp(8px, 1vw, 10px)',
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 1.5vw, 1em)',
            whiteSpace: 'nowrap'
          }}>{t('contact')}</Link>
          {isAdminUser && (
            <Link href="/admin" style={{
              color: '#39ff14',
              fontWeight: 600,
              padding: 'clamp(8px, 1.5vw, 12px) clamp(10px, 2vw, 16px)',
              borderRadius: 'clamp(8px, 1vw, 10px)',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85em, 1.5vw, 1em)',
              whiteSpace: 'nowrap',
              background: 'rgba(57, 255, 20, 0.1)',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)',
              border: '1px solid rgba(57, 255, 20, 0.3)'
            }}>{t('admin')}</Link>
          )}
        </nav>

        <div style={{display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)'}}>
          <Link 
            href="/cart"
            style={{
              padding: 'clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 16px)',
              background: 'rgba(57, 255, 20, 0.1)',
              color: '#39ff14',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 'clamp(8px, 1vw, 10px)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'clamp(0.9em, 2vw, 1em)',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 1vw, 6px)',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
            }}
          >
            🛒 السلة
          </Link>

          <div style={{position: 'relative'}}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="lang-btn"
              style={{
                padding: 'clamp(8px, 1.5vw, 10px) clamp(10px, 2vw, 12px)',
                background: 'rgba(57, 255, 20, 0.1)',
                color: '#39ff14',
                border: '2px solid rgba(57, 255, 20, 0.3)',
                borderRadius: 'clamp(8px, 1vw, 10px)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'clamp(0.75em, 1.5vw, 0.9em)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
              }}>
              <span className="lang-icon">🌐</span>
              <span className="lang-text">{language === 'ar' ? 'عربي' : language === 'en' ? 'EN' : 'FR'}</span>
              <span style={{
                fontSize: '0.6em',
                transform: langMenuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease'
              }}>▼</span>
            </button>
            
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                background: 'rgba(15, 15, 20, 0.98)',
                border: '2px solid rgba(57, 255, 20, 0.3)',
                borderRadius: 'clamp(8px, 1vw, 10px)',
                padding: 'clamp(8px, 1.5vw, 10px)',
                minWidth: 140,
                zIndex: 1000,
                boxShadow: '0 8px 32px rgba(57, 255, 20, 0.2)'
              }}>
                {['ar', 'en', 'fr'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang as any);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      padding: 'clamp(8px, 1.5vw, 10px)',
                      background: language === lang ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
                      color: language === lang ? '#39ff14' : 'rgba(255,255,255,0.7)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: 'clamp(0.85em, 1.5vw, 0.95em)',
                      fontWeight: language === lang ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {language === lang ? '✓ ' : ''}{lang === 'ar' ? 'العربية' : lang === 'en' ? 'English' : 'Français'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <Link 
              href="/account"
              className="btn"
              style={{
                fontSize: 'clamp(0.85em, 1.5vw, 0.95em)',
                padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 18px)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                display: 'inline-block'
              } as any}
            >
              👤 حسابي
            </Link>
          ) : (
            <Link 
              href="/login"
              className="btn"
              style={{
                fontSize: 'clamp(0.85em, 1.5vw, 0.95em)',
                padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 18px)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                display: 'inline-block'
              } as any}
            >
              🔑 دخول
            </Link>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 'clamp(8px, 1vw, 10px)',
              padding: 'clamp(8px, 1.5vw, 10px)',
              color: '#39ff14',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: '4px',
              fontSize: '1.2em',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            } as any}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(15px, 3vw, 20px)',
          gap: 'clamp(10px, 2vw, 14px)',
          borderTop: '1px solid rgba(57, 255, 20, 0.1)',
          background: 'rgba(15, 15, 20, 0.98)',
          maxHeight: 'calc(100vh - 150px)',
          overflowY: 'auto'
        }}>
          {[
            { href: '/', label: t('home') },
            { href: '/products', label: t('products') },
            { href: '/how-to-buy', label: 'كيف تشتري؟' },
            { href: '/cart', label: t('cart') },
            { href: '/contact', label: t('contact') },
            ...(user ? [
              { href: '/account', label: 'حسابي' },
              { href: '/mypurchases', label: t('myPurchases') },
              { href: '/orders', label: 'طلباتي' }
            ] : []),
            ...(isAdminUser ? [{ href: '/admin', label: t('admin') }] : [])
          ].map((item, i) => (
            <Link 
              key={i} 
              href={item.href} 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: isAdminUser && item.label === t('admin') ? '#39ff14' : 'rgba(255,255,255,0.8)',
                fontWeight: isAdminUser && item.label === t('admin') ? 600 : 500,
                padding: 'clamp(10px, 2vw, 12px)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                borderLeft: '3px solid rgba(57, 255, 20, 0.2)'
              }}
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              style={{
                color: '#ff6b6b',
                fontWeight: 600,
                padding: 'clamp(10px, 2vw, 12px)',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                borderLeft: '3px solid rgba(255, 107, 107, 0.3)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'right'
              }}
            >
              🚪 تسجيل الخروج
            </button>
          )}
        </nav>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        
        .nav-link:hover {
          color: #39ff14 !important;
          background: rgba(57, 255, 20, 0.1) !important;
          border: 1px solid rgba(57, 255, 20, 0.3) !important;
          box-shadow: 0 0 12px rgba(57, 255, 20, 0.2) !important;
        }
      `}</style>
    </header>
  );
}
