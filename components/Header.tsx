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
      padding: '14px 0',
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
        gap: 10
      }}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flex: '0 1 auto'}}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #39ff14, #ffd700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6em',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.5)',
            fontWeight: 800
          }}>E</div>
          <div className="logo-text">
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.3em, 3.5vw, 1.8em)',
              background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 50%, #00ff88 100%)',
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
              fontSize: 'clamp(0.65em, 1.8vw, 0.9em)'
            }}>
              {t('tagline')}
            </small>
          </div>
        </Link>

        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          flexWrap: 'nowrap'
        }}>
          {[
            { href: '/', label: t('home') },
            { href: '/products', label: t('products') },
            { href: '/how-to-buy', label: 'كيف تشتري؟' },
            { href: '/cart', label: t('cart') },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500,
              padding: '8px 14px',
              borderRadius: 10,
              transition: 'all 0.3s ease',
              fontSize: '0.95em',
              whiteSpace: 'nowrap'
            }}>{item.label}</Link>
          ))}
          {user && (
            <Link href="/orders" style={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500,
              padding: '8px 14px',
              borderRadius: 10,
              transition: 'all 0.3s ease',
              fontSize: '0.95em',
              whiteSpace: 'nowrap'
            }}>طلباتي</Link>
          )}
          <Link href="/mypurchases" style={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            padding: '8px 14px',
            borderRadius: 10,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('myPurchases')}</Link>
          <Link href="/contact" style={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            padding: '8px 14px',
            borderRadius: 10,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('contact')}</Link>
          {isAdminUser && (
            <Link href="/admin" style={{
              color: '#39ff14',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: 10,
              transition: 'all 0.3s ease',
              fontSize: '0.95em',
              whiteSpace: 'nowrap',
              background: 'rgba(57, 255, 20, 0.1)',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
            }}>{t('admin')}</Link>
          )}
        </nav>

        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{position: 'relative'}}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="lang-btn"
              style={{
                padding: '8px 12px',
                background: 'rgba(57, 255, 20, 0.1)',
                color: '#39ff14',
                border: '2px solid rgba(57, 255, 20, 0.3)',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)'
              }}>
              <span className="lang-icon">🌐</span>
              <span className="lang-text">{language === 'ar' ? 'عربي' : language === 'en' ? 'EN' : 'FR'}</span>
              <span style={{
                fontSize: '0.65em',
                transform: langMenuOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease'
              }}>▼</span>
            </button>
            
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: 'rgba(5, 7, 8, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(57, 255, 20, 0.2)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(57, 255, 20, 0.2)',
                minWidth: 140,
                zIndex: 1000
              }}>
                {[
                  { code: 'ar', label: 'عربي' },
                  { code: 'en', label: 'English' },
                  { code: 'fr', label: 'Français' }
                ].map((lang) => (
                  <button 
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: language === lang.code ? 'rgba(57, 255, 20, 0.15)' : 'transparent',
                      color: language === lang.code ? '#39ff14' : 'rgba(255,255,255,0.7)',
                      border: 'none',
                      textAlign: 'right',
                      cursor: 'pointer',
                      fontWeight: language === lang.code ? 600 : 500,
                      fontSize: '0.9em',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                    {language === lang.code && '✓'} {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <button 
              onClick={() => logout()} 
              className="auth-btn"
              style={{
                padding: '8px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ff6b6b',
                borderRadius: 10,
                fontWeight: 600,
                border: '2px solid rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontSize: '0.85em',
                whiteSpace: 'nowrap'
              }}>
              <span className="auth-text">{t('logout')}</span>
            </button>
          ) : (
            <Link 
              href="/login"
              className="btn"
              style={{
                padding: '8px 18px',
                fontSize: '0.85em',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                borderRadius: 10
              }}>
              <span className="auth-text">{t('login')}</span>
            </Link>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 5,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <span style={{
              width: 24,
              height: 2.5,
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}></span>
            <span style={{
              width: 24,
              height: 2.5,
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1,
              boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}></span>
            <span style={{
              width: 24,
              height: 2.5,
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              boxShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
            }}></span>
          </button>
        </div>
      </div>

      <nav className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`} style={{
        position: 'fixed',
        top: 73,
        left: 0,
        right: 0,
        background: 'rgba(5, 7, 8, 0.98)',
        backdropFilter: 'blur(20px)',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: mobileMenuOpen ? '20px' : '0 20px',
        gap: 10,
        maxHeight: mobileMenuOpen ? 'calc(100vh - 73px)' : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
        borderBottom: mobileMenuOpen ? '2px solid rgba(57, 255, 20, 0.15)' : 'none',
        boxShadow: mobileMenuOpen ? '0 0 40px rgba(57, 255, 20, 0.2)' : 'none',
        zIndex: 99,
        pointerEvents: mobileMenuOpen ? 'auto' : 'none'
      }}>
        {[
          { href: '/', label: t('home') },
          { href: '/products', label: t('products') },
          { href: '/how-to-buy', label: 'كيف تشتري؟' },
          { href: '/cart', label: t('cart') },
          { href: '/mypurchases', label: t('myPurchases') },
          { href: '/contact', label: t('contact') }
        ].map((item, i) => (
          <Link key={i} href={item.href} style={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            padding: '14px 18px',
            borderRadius: 12,
            transition: 'all 0.3s ease',
            fontSize: '1em',
            textAlign: 'center',
            background: 'rgba(57, 255, 20, 0.05)',
            border: '1px solid rgba(57, 255, 20, 0.1)'
          }} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
        ))}
        
        {user && (
          <Link href="/orders" style={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
            padding: '14px 18px',
            borderRadius: 12,
            transition: 'all 0.3s ease',
            fontSize: '1em',
            textAlign: 'center',
            background: 'rgba(57, 255, 20, 0.05)',
            border: '1px solid rgba(57, 255, 20, 0.1)'
          }} onClick={() => setMobileMenuOpen(false)}>طلباتي</Link>
        )}
        
        {isAdminUser && (
          <Link href="/admin" style={{
            color: '#39ff14',
            fontWeight: 600,
            padding: '14px 18px',
            borderRadius: 12,
            transition: 'all 0.3s ease',
            fontSize: '1em',
            textAlign: 'center',
            background: 'rgba(57, 255, 20, 0.1)',
            border: '2px solid rgba(57, 255, 20, 0.3)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('admin')}</Link>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-nav.mobile-nav-open {
            max-height: calc(100vh - 73px);
            overflow-y: auto;
            display: flex;
          }
          
          .logo-text small.tagline {
            display: none;
          }
          
          .lang-btn .lang-text {
            font-size: 0.75em;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
          
          nav a:hover {
            background: rgba(57, 255, 20, 0.1) !important;
            color: #39ff14 !important;
            text-shadow: 0 0 10px rgba(57, 255, 20, 0.5) !important;
          }
        }
        
        .lang-btn:hover {
          background: rgba(57, 255, 20, 0.2) !important;
          border-color: rgba(57, 255, 20, 0.5) !important;
          box-shadow: 0 0 25px rgba(57, 255, 20, 0.4) !important;
        }
      `}</style>
    </header>
  );
}
