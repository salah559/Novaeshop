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
  purchaseContent?: string;
}

export default function AdminProducts(){
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    fileUrl: '',
    purchaseContent: ''
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

  async function uploadImageFile(file: File): Promise<string> {
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64str = (reader.result as string).split(',')[1];
          resolve(base64str);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      return data.url;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload image');
    }
  }

  async function handleImageChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);
      setFormData({...formData, imageUrl: url});
      alert('✅ تم رفع الصورة');
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingFile(true);
    try {
      const url = await uploadImageFile(file);
      setFormData({...formData, fileUrl: url});
      alert('✅ تم رفع الملف');
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleSubmit(e: any){
    e.preventDefault();
    try {
      if (!formData.imageUrl || !formData.fileUrl) {
        alert('❌ رفع الصورة والملف مطلوب');
        return;
      }
      
      const { id, ...productData } = formData as any;
      if (editingProduct?.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        alert('✅ تم التحديث');
      } else {
        await addDoc(collection(db, 'products'), productData);
        alert('✅ تم الإضافة');
      }
      resetForm();
      loadProducts();
    } catch(e) {
      alert('❌ حدث خطأ');
      console.error(e);
    }
  }

  async function handleDelete(id: string){
    if(!window.confirm('تأكيد الحذف؟')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('✅ تم الحذف');
      await loadProducts();
    } catch(e: any) {
      alert(`❌ ${e.message}`);
      console.error(e);
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
      fileUrl: product.fileUrl,
      purchaseContent: product.purchaseContent || ''
    });
    setShowForm(true);
  }

  function resetForm(){
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
      fileUrl: '',
      purchaseContent: ''
    });
    setShowForm(false);
  }

  if (!user || !isAuthorized) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#39ff14', marginBottom: 20 }}>🚫 غير مصرح</h2>
        <p style={{ color: '#ccc' }}>هذه الصفحة للمسؤولين فقط</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#39ff14', marginBottom: 30 }}>📦 إدارة المنتجات</h2>

      <div style={{ marginBottom: 30 }}>
        <Link href="/admin" style={{ color: '#39ff14', marginRight: 20 }}>الطلبات</Link>
        <span style={{ color: '#39ff14', fontWeight: 'bold' }}>المنتجات</span>
      </div>

      <button 
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: '12px 24px',
          background: '#39ff14',
          color: '#000',
          border: 'none',
          borderRadius: 8,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 30
        }}
      >
        {showForm ? '✕ إلغاء' : '+ منتج جديد'}
      </button>

      {showForm && (
        <div style={{
          maxWidth: 600,
          margin: '0 auto 40px',
          background: 'rgba(57, 255, 20, 0.05)',
          border: '2px solid rgba(57, 255, 20, 0.3)',
          borderRadius: 8,
          padding: 20
        }}>
          <h3 style={{ color: '#39ff14', marginBottom: 20 }}>
            {editingProduct ? 'تعديل' : 'إضافة'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <input 
              type="text"
              placeholder="اسم المنتج"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              style={{
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                borderRadius: 6,
                color: '#fff'
              }}
            />

            <textarea 
              placeholder="الوصف"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
              style={{
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                borderRadius: 6,
                color: '#fff'
              }}
            />

            <input 
              type="number"
              placeholder="السعر"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              required
              style={{
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                borderRadius: 6,
                color: '#fff'
              }}
            />

            <input 
              type="text"
              placeholder="الفئة"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              required
              style={{
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                borderRadius: 6,
                color: '#fff'
              }}
            />

            <div>
              <label style={{ color: '#39ff14', display: 'block', marginBottom: 8 }}>الصورة</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploadingImage}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(57, 255, 20, 0.4)',
                  borderRadius: 6,
                  color: '#fff'
                }}
              />
              {uploadingImage && <p style={{ color: '#ffd700', marginTop: 8 }}>⏳ رفع...</p>}
              {formData.imageUrl && <p style={{ color: '#39ff14', marginTop: 8 }}>✅ تم</p>}
            </div>

            <div>
              <label style={{ color: '#39ff14', display: 'block', marginBottom: 8 }}>الملف</label>
              <input 
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                disabled={uploadingFile}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(57, 255, 20, 0.4)',
                  borderRadius: 6,
                  color: '#fff'
                }}
              />
              {uploadingFile && <p style={{ color: '#ffd700', marginTop: 8 }}>⏳ رفع...</p>}
              {formData.fileUrl && <p style={{ color: '#39ff14', marginTop: 8 }}>✅ تم</p>}
            </div>

            <textarea 
              placeholder="محتوى الشراء (نص طويل مع روابط - سيظهر للعميل بعد الشراء)"
              value={formData.purchaseContent}
              onChange={e => setFormData({...formData, purchaseContent: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(57, 255, 20, 0.4)',
                borderRadius: 6,
                color: '#fff'
              }}
            />

            <button 
              type="submit"
              style={{
                padding: '12px',
                background: '#39ff14',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✓ {editingProduct ? 'حفظ' : 'إضافة'}
            </button>
            <button 
              type="button"
              onClick={resetForm}
              style={{
                padding: '12px',
                background: 'rgba(255,0,0,0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(255,0,0,0.3)',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕ إلغاء
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#39ff14', textAlign: 'center' }}>جاري التحميل...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 20
        }}>
          {products.map(product => (
            <div key={product.id} style={{
              background: 'rgba(15, 15, 30, 0.7)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              borderRadius: 8,
              padding: 15
            }}>
              <img src={product.imageUrl} alt={product.name} style={{width: '100%', height: 150, objectFit: 'cover', borderRadius: 6, marginBottom: 10}} />
              <h4 style={{color: '#39ff14', marginBottom: 8}}>{product.name}</h4>
              <p style={{color: '#ccc', fontSize: '0.9em', marginBottom: 10}}>{product.description?.substring(0, 60)}...</p>
              <div style={{marginBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#39ff14'}}>{product.price} دج</span>
                <span style={{color: '#888'}}>{product.category}</span>
              </div>
              <div style={{display: 'flex', gap: 8}}>
                <button onClick={() => startEdit(product)} style={{flex: 1, padding: '8px', background: 'rgba(57, 255, 20, 0.2)', color: '#39ff14', border: '1px solid rgba(57, 255, 20, 0.3)', borderRadius: 6, cursor: 'pointer'}}>✏️ تعديل</button>
                <button onClick={() => handleDelete(product.id!)} style={{flex: 1, padding: '8px', background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', border: '1px solid rgba(255, 0, 0, 0.3)', borderRadius: 6, cursor: 'pointer'}}>🗑️ حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
