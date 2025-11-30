import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNavigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
    }
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsSpinning(true);
      const timer = setTimeout(() => setIsSpinning(false), 800);
      return () => clearTimeout(timer);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const baseItems = [
    { href: '/', icon: '🏠', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/products', icon: '🛍️', label: language === 'ar' ? 'المنتجات' : 'Products' },
  ];
  
  const centerItem = { href: '/how-to-buy', icon: '❓', label: language === 'ar' ? 'الشراء' : 'Guide' };
  
  const endItems = [
    { href: '/contact', icon: '📞', label: language === 'ar' ? 'تواصل' : 'Contact' },
    ...(user ? [{ href: '/account', icon: '👤', label: language === 'ar' ? 'حسابي' : 'Account' }] : [{ href: '/login', icon: '🔑', label: language === 'ar' ? 'دخول' : 'Login' }])
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      background: 'transparent',
      padding: '0 20px 20px 20px',
      zIndex: 95,
      height: 'auto',
      paddingBottom: '30px'
    }} className="bottom-nav">
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(20, 25, 40, 0.98)',
        backdropFilter: 'blur(20px)',
        height: '80px',
        borderRadius: '40px 40px 0 0',
        boxShadow: '0 -8px 40px rgba(57, 255, 20, 0.12)',
        zIndex: -1
      }} />

      <div style={{
        display: 'flex',
        gap: '10px',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'flex-end'
      }}>
        {baseItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`nav-item nav-item-${idx} ${isActive(item.href) ? 'nav-item-active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              color: isActive(item.href) ? '#ffd700' : 'rgba(255, 255, 255, 0.6)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderRadius: '12px',
              fontSize: '0.7em',
              fontWeight: isActive(item.href) ? 600 : 500,
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <span style={{ 
              fontSize: '1.6em',
              transition: 'transform 0.4s ease',
              display: 'inline-block'
            }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <Link
        href={centerItem.href}
        className={`nav-item-center ${isActive(centerItem.href) ? 'nav-item-active' : ''} ${isSpinning ? 'spinning' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          textDecoration: 'none',
          color: isActive(centerItem.href) ? '#ffd700' : 'rgba(255, 255, 255, 0.6)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: isActive(centerItem.href) ? 'linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(255, 215, 0, 0.1))' : 'rgba(30, 35, 50, 0.8)',
          border: isActive(centerItem.href) ? '2px solid rgba(255, 215, 0, 0.4)' : '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isActive(centerItem.href) ? '0 0 30px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.1)' : '0 -8px 20px rgba(57, 255, 20, 0.08)',
          position: 'relative',
          zIndex: 10,
          marginBottom: '15px',
          fontSize: '0.7em',
          fontWeight: isActive(centerItem.href) ? 600 : 500,
          animation: isSpinning ? 'wheelRotate 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' : 'none'
        }}
      >
        <span style={{ 
          fontSize: '2em',
          transition: 'transform 0.4s ease',
          display: 'inline-block'
        }}>
          {centerItem.icon}
        </span>
        <span style={{fontSize: '0.8em'}}>{centerItem.label}</span>
      </Link>

      <div style={{
        display: 'flex',
        gap: '10px',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'flex-end'
      }}>
        {endItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`nav-item nav-item-${baseItems.length + 1 + idx} ${isActive(item.href) ? 'nav-item-active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              textDecoration: 'none',
              color: isActive(item.href) ? '#ffd700' : 'rgba(255, 255, 255, 0.6)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderRadius: '12px',
              fontSize: '0.7em',
              fontWeight: isActive(item.href) ? 600 : 500,
              position: 'relative',
              overflow: 'visible'
            }}
          >
            <span style={{ 
              fontSize: '1.6em',
              transition: 'transform 0.4s ease',
              display: 'inline-block'
            }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-center {
          0%, 100% {
            box-shadow: 0 -8px 20px rgba(57, 255, 20, 0.08), 0 0 30px rgba(255, 215, 0, 0.2);
          }
          50% {
            box-shadow: 0 -8px 20px rgba(57, 255, 20, 0.08), 0 0 50px rgba(255, 215, 0, 0.4);
          }
        }

        @keyframes wheelRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(90deg) scale(1.05);
          }
          50% {
            transform: rotate(180deg) scale(1.08);
          }
          75% {
            transform: rotate(270deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        .nav-item {
          animation: slideInUp 0.5s ease-out both;
        }

        .nav-item-0 { animation-delay: 0.05s; }
        .nav-item-1 { animation-delay: 0.1s; }
        .nav-item-2 { animation-delay: 0.15s; }
        .nav-item-3 { animation-delay: 0.2s; }
        .nav-item-4 { animation-delay: 0.25s; }

        .nav-item-center {
          animation: slideInUp 0.5s ease-out 0.15s both;
        }

        .nav-item-center.nav-item-active:not(.spinning) {
          animation: pulse-center 2s ease-in-out infinite;
        }

        .nav-item:hover {
          transform: translateY(-4px);
          color: #ffd700 !important;
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex !important;
          }
        }
        
        @media (min-width: 769px) {
          .bottom-nav {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          .nav-item-center {
            width: 65px;
            height: 65px;
            margin-bottom: 12px;
          }

          .nav-item-center span:first-child {
            font-size: 1.8em !important;
          }
        }
      `}</style>
    </nav>
  );
}
