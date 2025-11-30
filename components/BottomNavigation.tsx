import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNavigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  const navItems = [
    { href: '/', icon: '🏠', label: language === 'ar' ? 'الرئيسية' : 'Home' },
    { href: '/products', icon: '🛍️', label: language === 'ar' ? 'المنتجات' : 'Products' },
    { href: '/how-to-buy', icon: '❓', label: language === 'ar' ? 'الشراء' : 'Guide' },
    { href: '/contact', icon: '📞', label: language === 'ar' ? 'تواصل' : 'Contact' },
    ...(user ? [{ href: '/account', icon: '👤', label: language === 'ar' ? 'حسابي' : 'Account' }] : [])
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      background: 'transparent',
      padding: '0 20px 25px 20px',
      zIndex: 95,
      height: 'auto',
      pointerEvents: 'none'
    }} className="bottom-nav">
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(5, 7, 8, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '30px 30px 0 0',
        boxShadow: '0 -10px 50px rgba(57, 255, 20, 0.15)',
        height: '90px',
        zIndex: -1
      }} />
      {navItems.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={`nav-item nav-item-${idx}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 16px 8px 16px',
            textDecoration: 'none',
            color: isActive(item.href) ? '#39ff14' : 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderRadius: '16px',
            flex: 1,
            fontSize: '0.65em',
            fontWeight: isActive(item.href) ? 700 : 500,
            background: isActive(item.href) ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
            border: 'none',
            boxShadow: isActive(item.href) ? '0 8px 25px rgba(57, 255, 20, 0.3), inset 0 0 15px rgba(57, 255, 20, 0.1)' : 'none',
            transform: isActive(item.href) ? 'translateY(-12px) scale(1.12)' : 'translateY(0) scale(1)',
            position: 'relative',
            overflow: 'visible',
            pointerEvents: 'all',
            cursor: 'pointer'
          }}
        >
          <span style={{ 
            fontSize: '1.8em',
            transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isActive(item.href) ? 'scale(1.3) rotate(0deg)' : 'scale(1) rotate(0deg)',
            display: 'inline-block',
            filter: isActive(item.href) ? 'drop-shadow(0 0 12px rgba(57, 255, 20, 0.5))' : 'none'
          }}>
            {item.icon}
          </span>
          <span style={{
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: isActive(item.href) ? 1 : 0.7,
            letterSpacing: isActive(item.href) ? '0.5px' : '0px',
            fontWeight: isActive(item.href) ? 700 : 500
          }}>
            {item.label}
          </span>
        </Link>
      ))}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(57, 255, 20, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(57, 255, 20, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(57, 255, 20, 0);
          }
        }

        .nav-item {
          animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .nav-item-0 { animation-delay: 0.1s; }
        .nav-item-1 { animation-delay: 0.15s; }
        .nav-item-2 { animation-delay: 0.2s; }
        .nav-item-3 { animation-delay: 0.25s; }
        .nav-item-4 { animation-delay: 0.3s; }

        .nav-item:hover {
          transform: translateY(-16px) scale(1.15) !important;
          color: #ffd700 !important;
        }

        .nav-item:active {
          animation: ripple 0.6s ease-out;
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
            padding: 10px 12px 6px 12px;
            font-size: 0.6em;
          }

          .nav-item span:first-child {
            font-size: 1.5em !important;
          }

          .nav-item:hover {
            transform: translateY(-14px) scale(1.12) !important;
          }
        }
      `}</style>
    </nav>
  );
}
