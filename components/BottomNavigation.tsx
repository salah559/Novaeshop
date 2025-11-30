import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { auth } from '@/lib/firebaseClient';
import { useLanguage } from '@/lib/LanguageContext';

export default function BottomNavigation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const centerRef = useRef<HTMLAnchorElement>(null);
  const navItemsRef = useRef<{ [key: string]: HTMLAnchorElement }>({});
  const animationRef = useRef<any>(null);
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

  const allItems = [...baseItems, centerItem, ...endItems];

  const isActive = (href: string) => router.pathname === href;

  useEffect(() => {
    const handleRouteChange = () => {
      const newIndex = allItems.findIndex(item => isActive(item.href));
      if (newIndex !== -1) {
        setActiveIndex(newIndex);
      }

      if (centerRef.current && animationRef.current === null) {
        const centerRect = centerRef.current.getBoundingClientRect();
        const targetItem = navItemsRef.current[router.pathname];
        
        if (targetItem) {
          const targetRect = targetItem.getBoundingClientRect();
          const centerX = centerRect.left + centerRect.width / 2;
          const targetX = targetRect.left + targetRect.width / 2;
          const distance = targetX - centerX;
          
          setIsTransitioning(true);
          
          const startTime = Date.now();
          const duration = 800;
          const easeFunc = (t: number) => {
            const c = 1.70158;
            const c3 = c + 1;
            return c3 * t * t * t - c * t * t;
          };
          
          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = easeFunc(progress);
            
            if (centerRef.current) {
              const rotation = easeProgress * 360;
              const moveDistance = distance * easeProgress;
              const scale = 1 + (Math.sin(easeProgress * Math.PI) * 0.15);
              
              centerRef.current.style.transform = `translateX(${moveDistance}px) rotate(${rotation}deg) scale(${scale})`;
            }
            
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            } else {
              if (centerRef.current) {
                centerRef.current.style.transform = 'none';
              }
              setIsTransitioning(false);
              animationRef.current = null;
            }
          };
          
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [router, allItems]);

  const NavItem = ({ item, idx }: any) => (
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
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          {baseItems.map((item, idx) => (
            <NavItem key={idx} item={item} idx={idx} />
          ))}
        </div>

        <Link
          ref={centerRef}
          href={centerItem.href}
          className={`nav-item-center ${isActive(centerItem.href) ? 'nav-item-active' : ''}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            textDecoration: 'none',
            color: isActive(centerItem.href) ? '#ffd700' : 'rgba(255, 255, 255, 0.6)',
            transition: isTransitioning ? 'none' : 'all 0.3s ease',
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            background: isActive(centerItem.href) 
              ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(57, 255, 20, 0.15))'
              : 'linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(255, 215, 0, 0.08))',
            border: '2px solid rgba(255, 215, 0, 0.3)',
            boxShadow: isActive(centerItem.href) 
              ? '0 0 30px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.15)'
              : '0 0 20px rgba(57, 255, 20, 0.15), inset 0 0 15px rgba(255, 215, 0, 0.05)',
            position: 'relative',
            zIndex: 10,
            marginBottom: '2px',
            fontSize: '0.7em',
            fontWeight: 600,
            willChange: isTransitioning ? 'transform' : 'auto',
            pointerEvents: 'auto'
          }}
        >
          <span style={{ 
            fontSize: '2.2em',
            transition: 'transform 0.4s ease, filter 0.3s ease',
            display: 'inline-block',
            transform: isActive(centerItem.href) ? 'scale(1.15)' : 'scale(1)',
            filter: isActive(centerItem.href) ? 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))' : 'none'
          }}>
            {centerItem.icon}
          </span>
        </Link>

        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          {endItems.map((item, idx) => (
            <NavItem key={idx} item={item} idx={idx + baseItems.length + 1} />
          ))}
        </div>
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

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(57, 255, 20, 0.15), inset 0 0 15px rgba(255, 215, 0, 0.05);
          }
          50% {
            box-shadow: 0 0 35px rgba(57, 255, 20, 0.25), inset 0 0 20px rgba(255, 215, 0, 0.1);
          }
        }

        .nav-item {
          animation: slideInUp 0.5s ease-out both;
        }

        .nav-item-center {
          animation: slideInUp 0.5s ease-out 0.15s both;
        }

        .nav-item-center:not(.nav-item-active) {
          animation: pulseGlow 3s ease-in-out infinite;
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
          .nav-item-center {
            width: 60px;
            height: 60px;
          }

          .nav-item-center span:first-child {
            font-size: 2em !important;
          }
        }
      `}</style>
    </nav>
  );
}
