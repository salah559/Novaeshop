import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, signInWithGoogle, logout } from '@/lib/firebaseClient';
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
      padding: '12px 0',
      borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
      background: 'rgba(10, 15, 20, 0.95)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }}>
        {/* Logo */}
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: '0 1 auto'}}>
          <img 
            src="/enova-logo.png" 
            alt="Enova" 
            style={{
              width: 45,
              height: 45,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.4))'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="logo-text">
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.1em, 3.5vw, 1.6em)',
              background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2
            }}>
              {t('siteName')}
            </h1>
            <small className="tagline" style={{color: '#00ff88', fontWeight: 500, fontSize: 'clamp(0.65em, 1.8vw, 0.85em)'}}>
              {t('tagline')}
            </small>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'nowrap'
        }}>
          <Link href="/" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('home')}</Link>
          <Link href="/products" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('products')}</Link>
          <Link href="/how-to-buy" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>كيف تشتري؟</Link>
          <Link href="/cart" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('cart')}</Link>
          {user && (
            <Link href="/orders" style={{
              color: '#e0e0e0',
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
              fontSize: '0.95em',
              whiteSpace: 'nowrap'
            }}>طلباتي</Link>
          )}
          <Link href="/mypurchases" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('myPurchases')}</Link>
          <Link href="/contact" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '0.95em',
            whiteSpace: 'nowrap'
          }}>{t('contact')}</Link>
          {isAdminUser && (
            <Link href="/admin" style={{
              color: '#00ff88',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
              fontSize: '0.95em',
              whiteSpace: 'nowrap'
            }}>{t('admin')}</Link>
          )}
        </nav>

        {/* Right Actions (Always Visible) */}
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          {/* Language Dropdown */}
          <div style={{position: 'relative'}}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="lang-btn"
              style={{
                padding: '7px 10px',
                background: 'rgba(0, 255, 136, 0.1)',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85em',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
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
                marginTop: 6,
                background: 'rgba(10, 15, 20, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                minWidth: 130,
                zIndex: 1000
              }}>
                <button 
                  onClick={() => {
                    setLanguage('ar');
                    setLangMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: language === 'ar' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'ar' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'ar' ? 600 : 500,
                    fontSize: '0.9em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                  {language === 'ar' && '✓'} عربي
                </button>
                <button 
                  onClick={() => {
                    setLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: language === 'en' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'en' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'en' ? 600 : 500,
                    fontSize: '0.9em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                  {language === 'en' && '✓'} English
                </button>
                <button 
                  onClick={() => {
                    setLanguage('fr');
                    setLangMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: language === 'fr' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'fr' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'fr' ? 600 : 500,
                    fontSize: '0.9em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                  {language === 'fr' && '✓'} Français
                </button>
              </div>
            )}
          </div>

          {/* Login/Logout Button */}
          {user ? (
            <button 
              onClick={() => logout()} 
              className="auth-btn"
              style={{
                padding: '7px 12px',
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(200, 0, 0, 0.2) 100%)',
                color: '#ff6b6b',
                borderRadius: 8,
                fontWeight: 600,
                border: '1px solid rgba(255, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontSize: '0.85em',
                whiteSpace: 'nowrap'
              }}>
              <span className="auth-text">{t('logout')}</span>
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle} 
              className="auth-btn btn"
              style={{
                padding: '7px 14px',
                fontSize: '0.85em',
                whiteSpace: 'nowrap',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
              }}>
              <span className="auth-text">{t('login')}</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: 4,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 6
            }}
          >
            <span style={{
              width: 22,
              height: 2.5,
              background: '#00ff88',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none'
            }}></span>
            <span style={{
              width: 22,
              height: 2.5,
              background: '#00ff88',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1
            }}></span>
            <span style={{
              width: 22,
              height: 2.5,
              background: '#00ff88',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none'
            }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav-open' : ''}`} style={{
        position: 'fixed',
        top: 70,
        left: 0,
        right: 0,
        background: 'rgba(10, 15, 20, 0.98)',
        backdropFilter: 'blur(20px)',
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: mobileMenuOpen ? '16px 20px' : '0 20px',
        gap: 12,
        maxHeight: mobileMenuOpen ? 'calc(100vh - 70px)' : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
        borderBottom: mobileMenuOpen ? '1px solid rgba(0, 255, 136, 0.2)' : 'none',
        boxShadow: mobileMenuOpen ? '0 10px 40px rgba(0, 0, 0, 0.5)' : 'none',
        zIndex: 99,
        pointerEvents: mobileMenuOpen ? 'auto' : 'none'
      }}>
        <Link href="/" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
        
        <Link href="/products" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>{t('products')}</Link>
        
        <Link href="/how-to-buy" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>كيف تشتري؟</Link>
        
        <Link href="/cart" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>{t('cart')}</Link>
        
        {user && (
          <Link href="/orders" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '12px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '1em',
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.05)'
          }} onClick={() => setMobileMenuOpen(false)}>طلباتي</Link>
        )}
        
        <Link href="/mypurchases" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>{t('myPurchases')}</Link>
        
        <Link href="/contact" style={{
          color: '#e0e0e0',
          fontWeight: 500,
          padding: '12px 16px',
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '1em',
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.05)'
        }} onClick={() => setMobileMenuOpen(false)}>{t('contact')}</Link>
        
        {isAdminUser && (
          <Link href="/admin" style={{
            color: '#00ff88',
            fontWeight: 600,
            padding: '12px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: '1em',
            textAlign: 'center',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid rgba(0, 255, 136, 0.3)'
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
            max-height: calc(100vh - 70px);
            overflow-y: auto;
            display: flex;
          }
          
          .logo-text small.tagline {
            display: none;
          }
          
          .lang-btn .lang-text {
            font-size: 0.75em;
          }
          
          .auth-btn .auth-text {
            font-size: 0.8em;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
