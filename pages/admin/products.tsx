import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { isAdmin } from '@/lib/adminCheck';
import Link from 'next/link';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  fileUrl: string;
}

export default function AdminProducts(){
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    fileUrl: ''
  });

  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      const authorized = u ? isAdmin(u.email) : false;
      setIsAuthorized(authorized);
      if (authorized) {
        loadProducts();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  },[]);

  async function loadProducts(){
    setLoading(true);
    try{
      const snap = await getDocs(collection(db, 'products'));
      const productsList = snap.docs.map(d => ({id: d.id, ...d.data()} as Product));
      setProducts(productsList);
    }catch(e){
      console.error(e);
      alert('حدث خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: any){
    e.preventDefault();
    try {
      const { id, ...productData } = formData as any;
      if (editingProduct?.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('✅ تم تحديث المنتج بنجاح');
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('✅ تم إضافة المنتج بنجاح');
      }
      resetForm();
      loadProducts();
    } catch(e) {
      alert('❌ حدث خطأ');
      console.error(e);
    }
  }

  async function handleDelete(id: string){
    console.log('Delete button clicked for product:', id);
    if(!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      console.log('User cancelled delete');
      return;
    }
    
    try {
      console.log('Deleting product from Firebase...');
      await deleteDoc(doc(db, 'products', id));
      alert('✅ تم حذف المنتج بنجاح');
      console.log('Product deleted, reloading...');
      await loadProducts();
    } catch(e: any) {
      console.error('Delete error:', e);
      alert(`❌ حدث خطأ في حذف المنتج: ${e.message}`);
    }
  }

  function startEdit(product: Product){
    console.log('Starting edit for product:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      fileUrl: product.fileUrl
    });
    setShowForm(true);
    console.log('Form should be shown now');
  }

  function resetForm(){
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      fileUrl: ''
    });
    setShowForm(false);
  }

  if (!user || !isAuthorized) {
    return (
      <div>
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          padding: '30px 20px',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
          borderRadius: 16
        }}>
          <h2 style={{
            fontSize: '2.5em',
            marginBottom: 10,
            background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>غير مصرح</h2>
        </div>
        <div className="card" style={{
          textAlign: 'center',
          padding: 60,
          maxWidth: 600,
          margin: '0 auto'
        }}>
          <div style={{fontSize: '4em', marginBottom: 20}}>🚫</div>
          <h3 style={{color: '#39ff14', marginBottom: 15}}>وصول محظور</h3>
          <p style={{color: '#c0c0c0'}}>هذه الصفحة مخصصة للمدراء فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        padding: '30px 20px',
        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 10,
          background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>إدارة المنتجات</h2>
        <p style={{color: '#c0c0c0'}}>إضافة، تعديل، وحذف المنتجات</p>
      </div>

      <div style={{
        display: 'flex',
        gap: 15,
        marginBottom: 30,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Link href="/admin" style={{
          padding: '12px 24px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(57, 255, 20, 0.3)',
          borderRadius: 8,
          color: '#c0c0c0',
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          📦 الطلبات
        </Link>
        <div style={{
          padding: '12px 24px',
          background: '#39ff14',
          border: '1px solid #39ff14',
          borderRadius: 8,
          color: '#0a0f14',
          fontWeight: 600
        }}>
          🛍️ المنتجات
        </div>
      </div>

      <div style={{marginBottom: 30, textAlign: 'center'}}>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn"
          style={{
            padding: '14px 30px',
            fontSize: '1.1em',
            boxShadow: '0 0 30px rgba(57, 255, 20, 0.4)'
          }}
        >
          {showForm ? '✕ إلغاء' : '+ إضافة منتج جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{
          maxWidth: 800,
          margin: '0 auto 40px',
          background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '2px solid rgba(57, 255, 20, 0.4)'
        }}>
          <h3 style={{color: '#39ff14', marginBottom: 25}}>
            {editingProduct ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gap: 20}}>
              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                  اسم المنتج
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                  الوصف
                </label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div>
                  <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                    السعر (دج)
                  </label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                    الفئة
                  </label>
                  <input 
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                  رابط الصورة (URL)
                </label>
                <input 
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  required
                  placeholder="https://example.com/image.jpg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                  رابط التحميل (URL)
                </label>
                <input 
                  type="url"
                  value={formData.fileUrl}
                  onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                  required
                  placeholder="https://drive.google.com/..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{display: 'flex', gap: 15, marginTop: 10}}>
                <button 
                  type="submit"
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '1.1em'
                  }}
                >
                  {editingProduct ? '✓ حفظ التعديلات' : '✓ إضافة المنتج'}
                </button>
                <button 
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'rgba(255, 0, 0, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '1.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✕ إلغاء
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{textAlign: 'center', padding: 60}}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(57, 255, 20, 0.2)',
            borderTop: '4px solid #39ff14',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{color: '#39ff14'}}>جاري تحميل المنتجات...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 25
        }}>
          {products.map(product => (
            <div key={product.id} className="card" style={{
              background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
              border: '1px solid rgba(57, 255, 20, 0.3)'
            }}>
              <img 
                src={product.imageUrl} 
                alt={product.name}
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 12,
                  marginBottom: 15
                }}
              />
              <h3 style={{color: '#39ff14', marginBottom: 10, fontSize: '1.2em'}}>
                {product.name}
              </h3>
              <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 15, lineHeight: 1.6}}>
                {product.description?.substring(0, 100) || 'لا يوجد وصف'}...
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15,
                paddingTop: 15,
                borderTop: '1px solid rgba(57, 255, 20, 0.2)'
              }}>
                <span style={{color: '#39ff14', fontWeight: 700, fontSize: '1.3em'}}>
                  {product.price} دج
                </span>
                <span style={{
                  color: '#888',
                  fontSize: '0.85em',
                  background: 'rgba(57, 255, 20, 0.1)',
                  padding: '4px 12px',
                  borderRadius: 6
                }}>
                  {product.category}
                </span>
              </div>
              <div style={{display: 'flex', gap: 10}}>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Edit button clicked');
                    startEdit(product);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(57, 255, 20, 0.2)',
                    color: '#39ff14',
                    border: '1px solid rgba(57, 255, 20, 0.4)',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(57, 255, 20, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
                  }}
                >
                  ✏️ تعديل
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Delete button clicked');
                    handleDelete(product.id!);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255, 0, 0, 0.2)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    borderRadius: 8,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.2)';
                  }}
                >
                  🗑️ حذف
                </button>
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
