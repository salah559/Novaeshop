import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, getDocs } from 'firebase/firestore';

export default function Products(){
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high'>('default');
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(()=> {
    async function load(){
      const snap = await getDocs(collection(db, 'products'));
      const productsData = snap.docs.map(d=>({id:d.id, ...d.data()}));
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      const uniqueCategories = Array.from(new Set(productsData.map((p: any) => p.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);
      
      setLoading(false);
    }
    load();
  },[]);
  
  useEffect(() => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (sortBy === 'price_low') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);
  
  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 'clamp(30px, 6vw, 50px)',
        padding: 'clamp(30px, 6vw, 50px) clamp(15px, 3vw, 20px)',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.08) 0%, rgba(255, 215, 0, 0.05) 100%)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        border: '2px solid rgba(57, 255, 20, 0.2)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #39ff14, transparent)',
          animation: 'shine 2s infinite'
        }}></div>
        <h2 style={{
          fontSize: 'clamp(2em, 7vw, 3em)',
          marginBottom: 'clamp(12px, 2vw, 18px)',
          background: 'linear-gradient(135deg, #39ff14 0%, #ffd700 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(57, 255, 20, 0.3)'
        }}>المنتجات الرقمية</h2>
        <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(1em, 2.5vw, 1.15em)'}}>اختر من مجموعتنا المتنوعة من المنتجات الرقمية عالية الجودة</p>
      </div>

      <div style={{
        marginBottom: 'clamp(25px, 5vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(15px, 3vw, 22px)'
      }} className="filters-section">
        <div style={{
          display: 'flex',
          gap: 'clamp(12px, 3vw, 18px)',
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 'min(260px, 100%)',
              padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 22px)',
              background: 'rgba(57, 255, 20, 0.05)',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 'clamp(10px, 2vw, 14px)',
              color: '#fff',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 22px)',
              background: 'rgba(57, 255, 20, 0.05)',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 'clamp(10px, 2vw, 14px)',
              color: '#fff',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              cursor: 'pointer',
              minWidth: 'min(160px, 100%)',
              flex: 1,
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)'
            }}
          >
            <option value="all">كل الفئات</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: 'clamp(12px, 2.5vw, 16px) clamp(14px, 3vw, 22px)',
              background: 'rgba(57, 255, 20, 0.05)',
              border: '2px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 'clamp(10px, 2vw, 14px)',
              color: '#fff',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              cursor: 'pointer',
              minWidth: 'min(160px, 100%)',
              flex: 1,
              boxShadow: '0 0 15px rgba(57, 255, 20, 0.1)'
            }}
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price_low">السعر: من الأرخص</option>
            <option value="price_high">السعر: من الأغلى</option>
          </select>
        </div>
        
        <div style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.95em',
          textAlign: 'center'
        }}>
          {filteredProducts.length === products.length ? (
            `عرض جميع المنتجات (${products.length})`
          ) : (
            `تم العثور على ${filteredProducts.length} من أصل ${products.length} منتج`
          )}
        </div>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(50px, 10vw, 80px) 20px',
          color: '#39ff14',
          fontSize: '1.2em'
        }}>
          <div className="spinner" style={{margin: '0 auto 20px'}}></div>
          جاري تحميل المنتجات...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(18px, 4vw, 28px)'
        }}>
          {filteredProducts.length === 0 && (
            <div className="card animate-scaleIn" style={{
              textAlign: 'center',
              padding: 'clamp(40px, 8vw, 60px) 20px',
              gridColumn: '1 / -1'
            }}>
              <div style={{fontSize: 'clamp(2.5em, 8vw, 3.5em)', marginBottom: 20}}>🔍</div>
              <h3 style={{color: '#39ff14', marginBottom: 10, textShadow: '0 0 15px rgba(57, 255, 20, 0.4)'}}>لا توجد نتائج</h3>
              <p style={{color: 'rgba(255,255,255,0.6)'}}>جرب تغيير البحث أو الفلتر</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSortBy('default');
                }}
                className="btn"
                style={{marginTop: 20}}
              >
                🔄 إعادة تعيين الفلاتر
              </button>
            </div>
          )}
          {filteredProducts.map((p, idx) => (
            <div key={p.id} className="card animate-fadeInUp" style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              padding: 0,
              animationDelay: `${idx * 0.05}s`,
              opacity: 0
            }}>
              <div style={{
                width: '100%',
                height: 'clamp(160px, 30vw, 220px)',
                background: `linear-gradient(135deg, rgba(57, 255, 20, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%), url(${p.imageUrl || '/placeholder.png'}) center/cover`,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'linear-gradient(135deg, #39ff14, #ffd700)',
                  color: '#000',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontWeight: 700,
                  fontSize: 'clamp(0.9em, 2.5vw, 1em)',
                  boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
                }}>
                  {p.price} دج
                </div>
                {p.category && (
                  <div style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#39ff14',
                    padding: '6px 14px',
                    borderRadius: 14,
                    fontSize: '0.85em',
                    border: '1px solid rgba(57, 255, 20, 0.4)',
                    fontWeight: 500
                  }}>
                    {p.category}
                  </div>
                )}
              </div>
              <div style={{padding: 'clamp(16px, 3vw, 22px)', flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 style={{
                  color: '#fff',
                  marginBottom: 'clamp(8px, 2vw, 12px)',
                  fontSize: 'clamp(1.05em, 3.5vw, 1.25em)',
                  lineHeight: 1.4
                }}>{p.name}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.65)',
                  fontSize: 'clamp(0.9em, 2.5vw, 0.95em)',
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: 'clamp(14px, 3vw, 20px)'
                }}>{p.description?.substring(0, 100)}...</p>
                <Link 
                  href={`/products/${p.id}`}
                  className="btn"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: 'clamp(12px, 2vw, 16px)',
                    fontSize: 'clamp(0.95em, 2.5vw, 1.05em)',
                    borderRadius: '12px'
                  }}
                >
                  🛍️ عرض التفاصيل
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @media (max-width: 600px) {
          .filters-section > div {
            flex-direction: column;
          }
          
          .filters-section input,
          .filters-section select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
