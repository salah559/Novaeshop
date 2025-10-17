import Link from 'next/link';

export default function Cart(){
  const items = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')||'[]') : [];
  const total = items.reduce((s: number, i: any)=>s+(i.price||0),0);
  
  return (
    <div>
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        padding: '30px 20px',
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        borderRadius: 16
      }}>
        <h2 style={{
          fontSize: '2.5em',
          marginBottom: 10,
          background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>سلة التسوق</h2>
        <p style={{color: '#c0c0c0'}}>راجع منتجاتك قبل الدفع</p>
      </div>

      <div className="card" style={{
        maxWidth: 800,
        margin: '0 auto'
      }}>
        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{fontSize: '4em', marginBottom: 20}}>🛒</div>
            <h3 style={{color: '#00ff88', marginBottom: 15}}>السلة فارغة</h3>
            <p style={{color: '#c0c0c0', marginBottom: 30}}>لم تقم بإضافة أي منتجات بعد</p>
            <Link href="/products" className="btn">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div style={{marginBottom: 30}}>
              {items.map((it:any, idx:number)=>(
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: idx < items.length - 1 ? '1px solid rgba(0, 255, 136, 0.1)' : 'none'
                }}>
                  <div>
                    <h4 style={{color: '#fff', marginBottom: 8}}>{it.name}</h4>
                    <p style={{color: '#c0c0c0', fontSize: '0.9em'}}>منتج رقمي</p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.1) 100%)',
                    padding: '8px 20px',
                    borderRadius: 8,
                    color: '#00ff88',
                    fontWeight: 700,
                    fontSize: '1.1em'
                  }}>
                    {it.price} دج
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              borderTop: '2px solid rgba(0, 255, 136, 0.3)',
              paddingTop: 25,
              marginTop: 25
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30
              }}>
                <strong style={{fontSize: '1.4em', color: '#fff'}}>المجموع الكلي</strong>
                <strong style={{
                  fontSize: '1.8em',
                  background: 'linear-gradient(135deg, #00ff88 0%, #39ff14 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>{total} دج</strong>
              </div>
              
              <Link href="/checkout" className="btn" style={{
                width: '100%',
                textAlign: 'center',
                display: 'block',
                fontSize: '1.1em',
                padding: '16px',
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)'
              }}>
                متابعة الدفع →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
