import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, signInWithGoogle, logout } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';
import { isAdmin } from '@/lib/adminCheck';

export default function Header(){
  const [user, setUser] = useState<any>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
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
      padding: '20px 0',
      borderBottom: '1px solid rgba(0, 255, 136, 0.2)',
      background: 'rgba(10, 15, 20, 0.6)',
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
        gap: 20,
        flexWrap: 'wrap'
      }}>
        <Link href="/" style={{display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none'}}>
          <img 
            src="/enova-logo.png" 
            alt="Enova" 
            style={{
              width: 70,
              height: 70,
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
              fontSize: '1.8em',
              background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {t('siteName')}
            </h1>
            <small style={{color: '#00ff88', fontWeight: 500}}>{t('tagline')}</small>
          </div>
        </Link>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          <Link href="/" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>{t('home')}</Link>
          <Link href="/products" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>{t('products')}</Link>
          <Link href="/cart" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>{t('cart')}</Link>
          <Link href="/mypurchases" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>{t('myPurchases')}</Link>
          <Link href="/contact" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>{t('contact')}</Link>
          {isAdminUser && (
            <Link href="/admin" style={{
              color: '#00ff88',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 8,
              transition: 'all 0.3s ease'
            }}>{t('admin')}</Link>
          )}

          <div style={{display: 'flex', gap: 8, marginLeft: 10}}>
            <button 
              onClick={() => setLanguage('ar')}
              style={{
                padding: '6px 12px',
                background: language === 'ar' ? '#00ff88' : 'transparent',
                color: language === 'ar' ? '#0a0f14' : '#c0c0c0',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9em'
              }}>
              ع
            </button>
            <button 
              onClick={() => setLanguage('en')}
              style={{
                padding: '6px 12px',
                background: language === 'en' ? '#00ff88' : 'transparent',
                color: language === 'en' ? '#0a0f14' : '#c0c0c0',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9em'
              }}>
              EN
            </button>
            <button 
              onClick={() => setLanguage('fr')}
              style={{
                padding: '6px 12px',
                background: language === 'fr' ? '#00ff88' : 'transparent',
                color: language === 'fr' ? '#0a0f14' : '#c0c0c0',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9em'
              }}>
              FR
            </button>
          </div>

          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{
                color: '#00ff88',
                padding: '6px 12px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: 6,
                fontSize: '0.9em'
              }}>{user.email}</span>
              <button onClick={logout} style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(200, 0, 0, 0.2) 100%)',
                color: '#ff6b6b',
                borderRadius: 8,
                fontWeight: 600,
                border: '1px solid rgba(255, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}>{t('logout')}</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="btn" style={{
              padding: '10px 24px',
              fontSize: '0.9em'
            }}>{t('login')}</button>
          )}
        </nav>
      </div>
    </header>
  );
}