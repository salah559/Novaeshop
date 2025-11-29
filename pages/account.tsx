import { useEffect, useState } from 'react';
import { auth, logout } from '@/lib/firebaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
      if (!u) {
        router.push('/login');
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 'clamp(50px, 10vw, 80px)'}}>
        <div style={{
          width: 60,
          height: 60,
          border: '4px solid rgba(57, 255, 20, 0.2)',
          borderTop: '4px solid #39ff14',
          borderRadius: '50%',
          margin: '0 auto 20px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{color: '#39ff14', fontSize: 'clamp(1em, 2.5vw, 1.1em)'}}>جاري التحميل...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'clamp(50px, 10vw, 80px)'
      }}>
        <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 30}}>جاري إعادة التوجيه...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(30px, 6vw, 50px)',
        padding: 'clamp(30px, 6vw, 50px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        border: '2px solid rgba(57, 255, 20, 0.2)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2em, 7vw, 3em)',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>👤 حسابي</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>إدارة حسابك والمشتريات</p>
      </div>

      <div style={{
        maxWidth: 800,
        margin: '0 auto'
      }}>
        {/* User Info Card */}
        <div className="card" style={{
          padding: 'clamp(25px, 5vw, 35px)',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.2)',
          marginBottom: 'clamp(25px, 5vw, 35px)',
          borderRadius: 'clamp(12px, 3vw, 16px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(20px, 4vw, 28px)',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #39ff14, #ffd700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(2em, 5vw, 2.5em)',
              boxShadow: '0 0 25px rgba(57, 255, 20, 0.4)',
              flexShrink: 0
            }}>
              👤
            </div>
            <div>
              <p style={{color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: 'clamp(0.9em, 2.5vw, 1em)'}}>اسم الحساب</p>
              <h3 style={{
                color: '#39ff14',
                margin: 0,
                fontSize: 'clamp(1.2em, 4vw, 1.6em)',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
              }}>
                {user.displayName || user.email || 'مستخدم'}
              </h3>
              <p style={{color: 'rgba(255,255,255,0.5)', margin: '4px 0 0 0', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)'}}>
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: 'clamp(16px, 3vw, 22px)',
          marginBottom: 'clamp(25px, 5vw, 35px)'
        }}>
          <Link href="/mypurchases" className="card" style={{
            padding: 'clamp(20px, 4vw, 28px)',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            transition: 'all 0.3s ease',
            border: '2px solid rgba(57, 255, 20, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 16px)'
          }}>
            <div style={{fontSize: 'clamp(2.5em, 8vw, 3.5em)'}}>📦</div>
            <div>
              <h3 style={{
                color: '#39ff14',
                margin: 0,
                fontSize: 'clamp(1.1em, 3vw, 1.3em)',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
              }}>مشترياتي</h3>
              <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)', margin: '4px 0 0 0'}}>المنتجات المشتراة</p>
            </div>
          </Link>

          <Link href="/orders" className="card" style={{
            padding: 'clamp(20px, 4vw, 28px)',
            textAlign: 'center',
            textDecoration: 'none',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            transition: 'all 0.3s ease',
            border: '2px solid rgba(57, 255, 20, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 16px)'
          }}>
            <div style={{fontSize: 'clamp(2.5em, 8vw, 3.5em)'}}>📋</div>
            <div>
              <h3 style={{
                color: '#39ff14',
                margin: 0,
                fontSize: 'clamp(1.1em, 3vw, 1.3em)',
                textShadow: '0 0 10px rgba(57, 255, 20, 0.2)'
              }}>طلباتي</h3>
              <p style={{color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85em, 2.5vw, 0.95em)', margin: '4px 0 0 0'}}>تتبع الطلبات</p>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn"
          style={{
            width: '100%',
            fontSize: 'clamp(1.05em, 2.5vw, 1.2em)',
            padding: 'clamp(14px, 3vw, 18px)',
            borderRadius: 'clamp(12px, 3vw, 16px)',
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
            border: '2px solid rgba(255, 107, 107, 0.4)',
            color: '#ff6b6b',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
