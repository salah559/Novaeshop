import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, signInWithGoogle, logout } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function Header(){
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();
  
  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
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
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5em',
            color: '#0a0f14',
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.5)'
          }}>DZ</div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.8em',
              background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>DZ Digital Market</h1>
            <small style={{color: '#00ff88', fontWeight: 500}}>الدفع ببريدي موب - منصة رقمية متقدمة</small>
          </div>
        </div>
        
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
          }}>الرئيسية</Link>
          <Link href="/products" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>المنتجات</Link>
          <Link href="/mypurchases" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>مشترياتي</Link>
          <Link href="/contact" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'
          }}>تواصل</Link>
          <Link href="/admin" style={{
            color: '#e0e0e0',
            fontWeight: 500,
            padding: '8px 16px',
            borderRadius: 8,
            transition: 'all 0.3s ease'

            }}>
              {t('siteName')}
            </h1>
            <p style={{margin: 0, color: '#c0c0c0', fontSize: '0.9em'}}>Digital Marketplace</p>
          </div>
        </div>

        <nav style={{display: 'flex', alignItems: 'center', gap: 25, flexWrap: 'wrap'}}>
          <Link href="/" style={{color: '#e0e0e0', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s'}}>{t('home')}</Link>
          <Link href="/products" style={{color: '#e0e0e0', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s'}}>{t('products')}</Link>
          <Link href="/cart" style={{color: '#e0e0e0', textDecoration: 'none', fontWeight: 500, transition: 'color 0.3s'}}>{t('cart')}</Link>
          {user && (
            <>
              <Link href="/mypurchases" style={{color: '#e0e0e0', textDecoration: 'none', fontWeight: 500}}>{t('myPurchases')}</Link>
              {user.email === 'admin@dzmarket.dz' && (
                <Link href="/admin" style={{color: '#00ff88', textDecoration: 'none', fontWeight: 600}}>{t('admin')}</Link>
              )}
            </>
          )}
          <Link href="/contact" style={{color: '#e0e0e0', textDecoration: 'none', fontWeight: 500}}>{t('contact')}</Link>
          
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
            <button onClick={logout} className="btn" style={{padding: '10px 24px', fontSize: '0.95em'}}>
              {t('logout')}
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="btn" style={{padding: '10px 24px', fontSize: '0.95em'}}>
              {t('login')}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

          }}>لوحة الأدمن</Link>
          
          {user ? (
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span style={{
                color: '#00ff88',
                padding: '6px 12px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: 6,
                fontSize: '0.9em'
              }}>{user.email}</span>
              <button onClick={()=>logout()} style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.2) 0%, rgba(200, 0, 0, 0.2) 100%)',
                color: '#ff6b6b',
                borderRadius: 8,
                fontWeight: 600,
                border: '1px solid rgba(255, 0, 0, 0.3)',
                transition: 'all 0.3s ease'
              }}>خروج</button>
            </div>
          ) : (
            <button onClick={()=>signInWithGoogle()} className="btn" style={{
              padding: '10px 24px',
              fontSize: '0.9em'
            }}>تسجيل Google</button>
          )}
        </nav>
      </div>
    </header>
  );
}
