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
      padding: '15px 0',
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
        gap: 15
      }}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none'}}>
          <img 
            src="/enova-logo.png" 
            alt="Enova" 
            style={{
              width: 50,
              height: 50,
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(0, 255, 136, 0.4))'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.2em, 4vw, 1.8em)',
              background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {t('siteName')}
            </h1>
            <small style={{color: '#00ff88', fontWeight: 500, fontSize: 'clamp(0.7em, 2vw, 0.9em)'}}>{t('tagline')}</small>
          </div>
        </Link>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 8
          }}
          className="mobile-menu-btn"
        >
          <span style={{
            width: 25,
            height: 3,
            background: '#00ff88',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(45deg) translateY(8px)' : 'none'
          }}></span>
          <span style={{
            width: 25,
            height: 3,
            background: '#00ff88',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1
          }}></span>
          <span style={{
            width: 25,
            height: 3,
            background: '#00ff88',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none'
          }}></span>
        </button>

        <nav className={mobileMenuOpen ? 'mobile-nav-open' : ''} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap'
        }}>
          <Link href="/" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
          <Link href="/products" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('products')}</Link>
          <Link href="/how-to-buy" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>كيف تشتري؟</Link>
          <Link href="/cart" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('cart')}</Link>
          {user && (
            <Link href="/orders" style={{
              color: '#e0e0e0',
              fontWeight: 500,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85em, 2vw, 1em)'
            }} onClick={() => setMobileMenuOpen(false)}>طلباتي</Link>
          )}
          <Link href="/mypurchases" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('myPurchases')}</Link>
          <Link href="/contact" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'all 0.3s ease',
            fontSize: 'clamp(0.85em, 2vw, 1em)'
          }} onClick={() => setMobileMenuOpen(false)}>{t('contact')}</Link>
          {isAdminUser && (
            <Link href="/admin" style={{
              color: '#00ff88',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.85em, 2vw, 1em)'
            }} onClick={() => setMobileMenuOpen(false)}>{t('admin')}</Link>
          )}

          <div style={{position: 'relative', marginLeft: 10}}>
            <button 
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                padding: '8px 14px',
                background: 'rgba(0, 255, 136, 0.1)',
                color: '#00ff88',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'clamp(0.85em, 2vw, 0.95em)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.3s ease'
              }}>
              🌐 {language === 'ar' ? 'عربي' : language === 'en' ? 'English' : 'Français'}
              <span style={{
                fontSize: '0.7em',
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
                background: 'rgba(10, 15, 20, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                minWidth: 150,
                zIndex: 1000
              }}>
                <button 
                  onClick={() => {
                    setLanguage('ar');
                    setLangMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: language === 'ar' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'ar' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'ar' ? 600 : 500,
                    fontSize: '0.95em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    if (language !== 'ar') {
                      e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'ar') {
                      e.currentTarget.style.background = 'transparent';
                    }
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
                    padding: '12px 16px',
                    background: language === 'en' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'en' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'en' ? 600 : 500,
                    fontSize: '0.95em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    if (language !== 'en') {
                      e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'en') {
                      e.currentTarget.style.background = 'transparent';
                    }
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
                    padding: '12px 16px',
                    background: language === 'fr' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                    color: language === 'fr' ? '#00ff88' : '#c0c0c0',
                    border: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontWeight: language === 'fr' ? 600 : 500,
                    fontSize: '0.95em',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseEnter={(e) => {
                    if (language !== 'fr') {
                      e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (language !== 'fr') {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}>
                  {language === 'fr' && '✓'} Français
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
              <span style={{
                color: '#00ff88',
                padding: '6px 10px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: 6,
                fontSize: 'clamp(0.75em, 2vw, 0.9em)',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>{user.email}</span>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(200, 0, 0, 0.2) 100%)',
                color: '#ff6b6b',
                borderRadius: 8,
                fontWeight: 600,
                border: '1px solid rgba(255, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                fontSize: 'clamp(0.8em, 2vw, 0.9em)'
              }}>{t('logout')}</button>
            </div>
          ) : (
            <button onClick={() => { signInWithGoogle(); setMobileMenuOpen(false); }} className="btn" style={{
              padding: '8px 20px',
              fontSize: 'clamp(0.8em, 2vw, 0.9em)'
            }}>{t('login')}</button>
          )}
        </nav>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          
          nav {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(10, 15, 20, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            align-items: stretch !important;
            padding: 20px;
            gap: 15px !important;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            border-bottom: 1px solid rgba(0, 255, 136, 0.2);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          }
          
          nav.mobile-nav-open {
            max-height: calc(100vh - 80px);
            overflow-y: auto;
          }
          
          nav a, nav button {
            width: 100%;
            text-align: center;
          }
          
          nav > div {
            width: 100%;
            justify-content: center;
            margin: 0 !important;
          }
        }
      `}</style>
    </header>
  );
}
