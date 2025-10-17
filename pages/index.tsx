
import Link from 'next/link';
export default function Home(){
  return (
    <div>
      <section className="card" style={{padding:24,marginBottom:20}}>
        <h2>مرحباً في DZ Digital Market</h2>
        <p>بيع وشراء منتجات رقمية. الدفع يدوي عبر بريدي موب، والتوثيق عبر Firebase.</p>
        <Link href="/products"><a className="btn">تصفح المنتجات</a></Link>
      </section>
    </div>
  );
}
