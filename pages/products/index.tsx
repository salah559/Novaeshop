import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

export default function Products(){
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=> {
    async function load(){
      const snap = await getDocs(collection(db, 'products'));
      setProducts(snap.docs.map(d=>({id:d.id, ...d.data()})));
      setLoading(false);
    }
    load();
  },[]);
  
  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 50,
        padding: '40px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 15,
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>المنتجات الرقمية</h2>
        <p style={{color: '#c0c0c0', fontSize: '1.1em'}}>اختر من مجموعتنا المتنوعة من المنتجات الرقمية عالية الجودة</p>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#00ff88',
          fontSize: '1.2em'
        }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(0, 255, 136, 0.2)',
            borderTop: '4px solid #00ff88',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          جاري تحميل المنتجات...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 25
        }}>
          {products.length === 0 && (
            <div className="card" style={{
              textAlign: 'center',
              padding: 60,
              gridColumn: '1 / -1'
            }}>
              <div style={{fontSize: '3em', marginBottom: 20}}>📦</div>
              <h3 style={{color: '#00ff88', marginBottom: 10}}>لا توجد منتجات</h3>
              <p style={{color: '#c0c0c0'}}>سيتم إضافة المنتجات قريباً</p>
            </div>
          )}
          {products.map(p => (
            <div key={p.id} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              padding: 0
            }}>
              <div style={{
                width: '100%',
                height: 200,
                background: `linear-gradient(135deg, rgba(0, 255, 136, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%), url(${p.imageUrl || '/placeholder.png'}) center/cover`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 15,
                  right: 15,
                  background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
                  color: '#0a0f14',
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: '0.9em',
                  boxShadow: '0 4px 15px rgba(0, 255, 136, 0.4)'
                }}>
                  {p.price} دج
                </div>
              </div>
              <div style={{padding: 20, flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 style={{
                  color: '#fff',
                  marginBottom: 12,
                  fontSize: '1.3em'
                }}>{p.name}</h3>
                <p style={{
                  color: '#c0c0c0',
                  marginBottom: 20,
                  flex: 1,
                  fontSize: '0.95em',
                  lineHeight: 1.6
                }}>{p.description || 'منتج رقمي عالي الجودة'}</p>
                <Link href={`/products/${p.id}`} className="btn" style={{
                  width: '100%',
                  textAlign: 'center'
                }}>
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
