import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { auth } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNavigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const navItemsRef = useRef<{ [key: string]: HTMLAnchorElement }>({});
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

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      // Handle route change if needed
    });
    return () => {
      router.events.off('routeChangeStart', () => {});
    };
  }, [router]);

  const NavItem = ({ item }: any) => (
    <Link
      ref={(el) => {
        if (el) navItemsRef.current[item.href] = el;
      }}
      href={item.href}
      className={`nav-item ${isActive(item.href) ? 'nav-item-active' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 12px',
        textDecoration: 'none',
        color: isActive(item.href) ? '#ffd700' : 'rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        borderRadius: '14px',
        fontSize: '0.65em',
        fontWeight: isActive(item.href) ? 700 : 400,
        position: 'relative',
        overflow: 'visible',
        background: isActive(item.href) ? 'rgba(255, 215, 0, 0.08)' : 'transparent'
      }}
    >
      <span style={{ 
        fontSize: '1.8em',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
        display: 'inline-block',
        transform: isActive(item.href) ? 'scale(1.25) translateY(-4px)' : 'scale(1)',
        filter: isActive(item.href) ? 'drop-shadow(0 0 8px #ffd700)' : 'none'
      }}>
        {item.icon}
      </span>
      <span style={{
        fontSize: '0.75em',
        fontWeight: 600,
        letterSpacing: '0.5px',
        transition: 'all 0.3s ease'
      }}>
        {item.label}
      </span>
    </Link>
  );

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      background: 'transparent',
      padding: '0',
      zIndex: 95,
      height: 'auto',
      pointerEvents: 'none'
    }} className="bottom-nav">
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(180deg, rgba(20, 25, 40, 0), rgba(10, 15, 25, 0.95) 30%)',
        backdropFilter: 'blur(30px)',
        height: '120px',
        zIndex: -1,
        pointerEvents: 'auto'
      }} />

      <div style={{
        position: 'relative',
        bottom: '10px',
        background: 'rgba(15, 20, 35, 0.7)',
        backdropFilter: 'blur(25px)',
        borderRadius: '30px',
        border: '1px solid rgba(57, 255, 20, 0.1)',
        boxShadow: '0 20px 60px rgba(57, 255, 20, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        padding: '12px 8px',
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pointerEvents: 'auto'
      }}>
        {[...baseItems, centerItem, ...endItems].map((item, idx) => (
          <NavItem key={idx} item={item} />
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

        .nav-item {
          animation: slideInUp 0.5s ease-out both;
        }

        .nav-item:hover {
          transform: translateY(-2px) scale(1.05) !important;
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
          .nav-item {
            padding: 8px 10px;
          }
        }
      `}</style>
    </nav>
  );
}
