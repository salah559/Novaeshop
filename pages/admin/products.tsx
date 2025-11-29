import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebaseClient';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { isAdmin } from '@/lib/adminCheck';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authorized, setAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      console.log('Current user email:', u?.email);
      const isAdminUser = u ? isAdmin(u.email) : false;
      console.log('Is admin:', isAdminUser, 'Email:', u?.email);
      setAuthorized(isAdminUser);
      if (isAdminUser) {
        loadProducts();
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch(e) {
      console.error(e);
      alert('خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        alert('✅ تم رفع الصورة');
      } else {
        alert('❌ خطأ: ' + data.error);
      }
    } catch(e: any) {
      alert('❌ خطأ: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImageUrl('');
    setSuccessMessage('');
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim() || !price || !category.trim() || !imageUrl.trim() || !successMessage.trim()) {
      alert('❌ ملء جميع الحقول مطلوب');
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl,
      successMessage
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'products', editing), productData);
        alert('✅ تم التحديث');
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('✅ تم الإضافة');
      }
      resetForm();
      loadProducts();
    } catch(e) {
      console.error(e);
      alert('❌ خطأ');
    }
  };

  const handleEdit = (product: any) => {
    setEditing(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setImageUrl(product.imageUrl);
    setSuccessMessage(product.successMessage);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('حذف هذا المنتج؟')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('✅ تم الحذف');
      loadProducts();
    } catch(e: any) {
      alert('❌ خطأ: ' + e.message);
    }
  };

  if (!user || !authorized) {
    return (
      <div>
        <div style={{textAlign: 'center', marginBottom: 40, padding: '30px 20px', background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)', borderRadius: 16}}>
          <h2 style={{fontSize: '2.5em', marginBottom: 10, background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>غير مصرح</h2>
        </div>
        <div className="card" style={{textAlign: 'center', padding: 60, maxWidth: 600, margin: '0 auto'}}>
          <div style={{fontSize: '4em', marginBottom: 20}}>🚫</div>
          <h3 style={{color: '#39ff14', marginBottom: 15}}>وصول محظور</h3>
          <p style={{color: '#c0c0c0'}}>هذه الصفحة للمدراء فقط</p>
          {user && <p style={{color: '#ffd700', marginTop: 20, fontSize: '0.9em'}}>البريد المسجل: <strong>{user.email}</strong></p>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{textAlign: 'center', marginBottom: 40, padding: '30px 20px', background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0) 100%)', borderRadius: 16}}>
        <h2 style={{fontSize: '2.5em', marginBottom: 10, background: 'linear-gradient(135deg, #39ff14 0%, #39ff14 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>إدارة المنتجات</h2>
        <p style={{color: '#c0c0c0'}}>إضافة وتعديل وحذف المنتجات</p>
      </div>

      <div style={{display: 'flex', gap: 15, marginBottom: 30, justifyContent: 'center', flexWrap: 'wrap'}}>
        <Link href="/admin" style={{padding: '12px 24px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#c0c0c0', fontWeight: 600, textDecoration: 'none'}}>📦 الطلبات</Link>
        <div style={{padding: '12px 24px', background: '#39ff14', borderRadius: 8, color: '#0a0f14', fontWeight: 600}}>🛍️ المنتجات</div>
      </div>

      <div style={{marginBottom: 30, textAlign: 'center'}}>
        <button onClick={() => setShowForm(!showForm)} className="btn" style={{padding: '14px 30px', fontSize: '1.1em', boxShadow: '0 0 30px rgba(57, 255, 20, 0.4)'}}>
          {showForm ? '✕ إلغاء' : '+ إضافة منتج جديد'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{maxWidth: 800, margin: '0 auto 40px', background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)', border: '2px solid rgba(57, 255, 20, 0.4)'}}>
          <h3 style={{color: '#39ff14', marginBottom: 25}}>{editing ? '✏️ تعديل منتج' : '➕ إضافة منتج جديد'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gap: 20}}>
              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>اسم المنتج</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="أدخل اسم المنتج"
                  style={{width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#fff', fontSize: '1rem', boxSizing: 'border-box'}} 
                />
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>الوصف</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="أدخل وصف المنتج"
                  rows={4}
                  style={{width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#fff', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box'}} 
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
                <div>
                  <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>السعر (دج)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="0"
                    min="0"
                    style={{width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#fff', fontSize: '1rem', boxSizing: 'border-box'}} 
                  />
                </div>

                <div>
                  <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>الفئة</label>
                  <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder="أدخل الفئة"
                    style={{width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#fff', fontSize: '1rem', boxSizing: 'border-box'}} 
                  />
                </div>
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>صورة المنتج</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  style={{width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '2px solid rgba(57, 255, 20, 0.4)', borderRadius: 8, color: '#39ff14', fontSize: '1rem', cursor: 'pointer', boxSizing: 'border-box'}} 
                />
                {imageUrl && <div style={{marginTop: 12}}><img src={imageUrl} alt="معاينة" style={{width: 100, height: 100, borderRadius: 8, objectFit: 'cover'}} /></div>}
              </div>

              <div>
                <label style={{display: 'block', color: '#39ff14', marginBottom: 8, fontWeight: 600}}>نص بعد الشراء</label>
                <textarea 
                  value={successMessage} 
                  onChange={(e) => setSuccessMessage(e.target.value)} 
                  placeholder="النص الذي يظهر للمشتري"
                  rows={3}
                  style={{width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, color: '#fff', fontSize: '1rem', resize: 'vertical', boxSizing: 'border-box'}} 
                />
              </div>

              <div style={{display: 'flex', gap: 15, marginTop: 10}}>
                <button type="submit" className="btn" style={{flex: 1, padding: '14px', fontSize: '1.1em'}}>
                  {editing ? '✓ حفظ التعديلات' : '✓ إضافة المنتج'}
                </button>
                <button type="button" onClick={resetForm} style={{flex: 1, padding: '14px', background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: 8, fontWeight: 600, fontSize: '1.1em', cursor: 'pointer'}}>✕ إلغاء</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{textAlign: 'center', padding: 60}}>
          <div style={{width: 60, height: 60, border: '4px solid rgba(57, 255, 20, 0.2)', borderTop: '4px solid #39ff14', borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite'}}></div>
          <p style={{color: '#39ff14'}}>جاري التحميل...</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 25}}>
          {products.length > 0 ? products.map(p => (
            <div key={p.id} style={{background: 'rgba(15, 15, 30, 0.7)', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 12, padding: 20, backdropFilter: 'blur(20px)'}}>
              <img src={p.imageUrl} alt={p.name} style={{width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12}} />
              <h3 style={{color: '#39ff14', marginBottom: 8}}>{p.name}</h3>
              <p style={{color: '#c0c0c0', fontSize: '0.9em', marginBottom: 12}}>{p.description?.substring(0, 80)}...</p>
              <div style={{marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(57, 255, 20, 0.2)'}}>
                <span style={{color: '#39ff14', fontWeight: 700}}>{p.price} دج</span>
                <span style={{color: '#888', marginLeft: 8}}>•</span>
                <span style={{color: '#888', marginLeft: 8}}>{p.category}</span>
              </div>
              <div style={{display: 'flex', gap: 8}}>
                <button onClick={() => handleEdit(p)} style={{flex: 1, padding: '10px', background: 'rgba(57, 255, 20, 0.2)', color: '#39ff14', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 8, cursor: 'pointer', fontWeight: 600}}>✏️ تعديل</button>
                <button onClick={() => handleDelete(p.id)} style={{flex: 1, padding: '10px', background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: 8, cursor: 'pointer', fontWeight: 600}}>🗑️ حذف</button>
              </div>
            </div>
          )) : <div style={{gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#c0c0c0'}}>لا توجد منتجات</div>}
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
