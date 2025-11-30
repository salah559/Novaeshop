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
      alignItems: 'center',
      background: 'rgba(5, 7, 8, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '2px solid rgba(57, 255, 20, 0.15)',
      padding: '8px 0',
      zIndex: 95,
      boxShadow: '0 -4px 30px rgba(57, 255, 20, 0.1)',
      height: '70px'
    }} className="bottom-nav">
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
            gap: '4px',
            padding: '8px 12px',
            textDecoration: 'none',
            color: isActive(item.href) ? '#39ff14' : 'rgba(255, 255, 255, 0.6)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            borderRadius: '12px',
            flex: 1,
            fontSize: '0.7em',
            fontWeight: isActive(item.href) ? 600 : 500,
            background: isActive(item.href) ? 'rgba(57, 255, 20, 0.08)' : 'transparent',
            border: isActive(item.href) ? '1px solid rgba(57, 255, 20, 0.2)' : '1px solid transparent',
            boxShadow: isActive(item.href) ? '0 0 20px rgba(57, 255, 20, 0.25)' : 'none',
            transform: isActive(item.href) ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ 
            fontSize: '1.4em',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isActive(item.href) ? 'scale(1.15) rotate(10deg)' : 'scale(1) rotate(0deg)',
            display: 'inline-block'
          }}>
            {item.icon}
          </span>
          <span style={{
            transition: 'all 0.4s ease',
            opacity: 1
          }}>
            {item.label}
          </span>
        </Link>
      ))}

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

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 12px rgba(57, 255, 20, 0.15);
          }
          50% {
            box-shadow: 0 0 24px rgba(57, 255, 20, 0.35);
          }
        }

        @keyframes icon-bounce {
          0%, 100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.2) rotate(15deg);
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

        .nav-item:hover {
          transform: scale(1.15) translateY(-4px) !important;
          color: #ffd700 !important;
        }

        .nav-item:active {
          animation: icon-bounce 0.6s ease-in-out;
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
          .bottom-nav {
            height: 65px;
            padding: 6px 0;
          }

          .bottom-nav a span:last-child {
            font-size: 0.65em;
          }

          .nav-item:hover {
            transform: scale(1.12) translateY(-3px) !important;
          }
        }
      `}</style>
    </nav>
  );
}
