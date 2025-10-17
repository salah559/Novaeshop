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
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(productsData.map((p: any) => p.category).filter(Boolean)));
      setCategories(uniqueCategories as string[]);
      
      setLoading(false);
    }
    load();
  },[]);
  
  useEffect(() => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Sort
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
        marginBottom: 40,
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

      {/* Search and Filter Section */}
      <div style={{
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          gap: 15,
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="🔍 ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 250,
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              color: '#fff',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: 150
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
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(0, 255, 136, 0.3)',
              borderRadius: 12,
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer',
              minWidth: 150
            }}
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price_low">السعر: من الأرخص</option>
            <option value="price_high">السعر: من الأغلى</option>
          </select>
        </div>
        
        {/* Results count */}
        <div style={{
          color: '#c0c0c0',
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
          {filteredProducts.length === 0 && (
            <div className="card" style={{
              textAlign: 'center',
              padding: 60,
              gridColumn: '1 / -1'
            }}>
              <div style={{fontSize: '3em', marginBottom: 20}}>🔍</div>
              <h3 style={{color: '#00ff88', marginBottom: 10}}>لا توجد نتائج</h3>
              <p style={{color: '#c0c0c0'}}>جرب تغيير البحث أو الفلتر</p>
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
          {filteredProducts.map(p => (
            <div key={p.id} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              padding: 0,
              transition: 'all 0.3s ease'
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
                {p.category && (
                  <div style={{
                    position: 'absolute',
                    bottom: 15,
                    left: 15,
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#00ff88',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: '0.85em',
                    border: '1px solid rgba(0, 255, 136, 0.3)'
                  }}>
                    {p.category}
                  </div>
                )}
              </div>
              <div style={{padding: 20, flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h3 style={{
                  color: '#fff',
                  marginBottom: 12,
                  fontSize: '1.2em',
                  lineHeight: 1.4
                }}>{p.name}</h3>
                <p style={{
                  color: '#c0c0c0',
                  fontSize: '0.95em',
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: 20
                }}>{p.description?.substring(0, 100)}...</p>
                <Link 
                  href={`/products/${p.id}`}
                  className="btn"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    padding: '12px',
                    fontSize: '1em',
                    boxShadow: '0 4px 20px rgba(0, 255, 136, 0.3)'
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
