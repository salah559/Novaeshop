
import Link from 'next/link';

export default function Home(){
  return (
    <div>
      <section className="card" style={{padding:24,marginBottom:20}}>
        <h2>مرحباً في DZ Digital Market</h2>
        <p>بيع وشراء منتجات رقمية قانونية. الدفع يدوي عبر بريدي موب.</p>
        <Link href="/products"><a className="btn">تصفح المنتجات</a></Link>
      </section>

      <section className="card">
        <h3>أشهر الباقات</h3>
        <div style={{display:'flex',gap:12,marginTop:12}}>
          <div style={{flex:1}} className="card">
            <h4>باك 30 مليون</h4>
            <p>مجموعة ضخمة لبدء متجرك الرقمي</p>
          </div>
          <div style={{flex:1}} className="card">
            <h4>باك 15 مليون</h4>
            <p>باقة متوسطة بجودة عالية</p>
          </div>
          <div style={{flex:1}} className="card">
            <h4>باك الفيديوهات</h4>
            <p>100,000 فيديوهات عالية الجودة</p>
          </div>
        </div>
      </section>
    </div>
  );
}
