import { useEffect, useState, memo } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { isAdmin } from '@/lib/adminCheck';
import Link from 'next/link';

const ProductCardAdmin = memo(({ product, onEdit, onDelete }: any) => (
  <div style={{
    background: 'rgba(15, 15, 30, 0.7)',
    border: '1px solid rgba(57, 255, 20, 0.3)',
    borderRadius: 12,
    padding: 20,
    backdropFilter: 'blur(20px)'
  }}>
    <img src={product.imageUrl} alt={product.name} style={{width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12}} />
    <h3 style={{color: '#39ff14', marginBottom: 8}}>{product.name}</h3>
    <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 12}}>{product.description?.substring(0, 80)}...</p>
    <div style={{marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(57, 255, 20, 0.2)'}}>
      <span style={{color: '#39ff14', fontWeight: 700}}>{product.price} دج</span> • <span style={{color: '#888'}}>{product.category}</span>
    </div>
    <div style={{display: 'flex', gap: 8}}>
      <button onClick={() => onEdit(product)} style={{flex: 1, padding: '10px', background: 'rgba(57, 255, 20, 0.2)', color: '#39ff14', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, cursor: 'pointer'}}>✏️ تعديل</button>
      <button onClick={() => onDelete(product.id)} style={{flex: 1, padding: '10px', background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: 8, cursor: 'pointer'}}>🗑️ حذف</button>
    </div>
  </div>
));

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  successMessage: string;
}

export default function AdminProducts(){
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    successMessage: ''
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
    if(!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('✅ تم حذف المنتج بنجاح');
      await loadProducts();
    } catch(e: any) {
      alert(`❌ حدث خطأ في حذف المنتج: ${e.message}`);
      console.error('Delete error:', e);
    }
  }

  function startEdit(product: Product){
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      successMessage: product.successMessage
    });
    setShowForm(true);
  }

  async function handleImageUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData
      });
      
      const data = await response.json();
      if (data.success) {
        setFormData({...formData, imageUrl: data.url});
        alert('✅ تم رفع الصورة بنجاح');
      } else {
        alert(`❌ فشل رفع الصورة: ${data.error}`);
      }
    } catch(e: any) {
      alert(`❌ خطأ في رفع الصورة: ${e.message}`);
      console.error('Upload error:', e);
    } finally {
      setUploadingImage(false);
    }
  }

  function resetForm(){
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      successMessage: ''
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
                  صورة المنتج
                </label>
                <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(57, 255, 20, 0.3)',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: '1rem',
                      cursor: uploadingImage ? 'not-allowed' : 'pointer'
                    }}
                  />
                </div>
                {formData.imageUrl && (
                  <div style={{marginTop: 12}}>
                    <img src={formData.imageUrl} alt="Preview" style={{width: 100, height: 100, borderRadius: 8, objectFit: 'cover'}} />
                  </div>
                )}
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>
                  نص بعد الشراء
                </label>
                <textarea 
                  value={formData.successMessage}
                  onChange={e => setFormData({...formData, successMessage: e.target.value})}
                  required
                  rows={3}
                  placeholder="مثال: شكراً لك على الشراء! رابط التحميل: ..."
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
            <ProductCardAdmin 
              key={product.id}
              product={product}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
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
