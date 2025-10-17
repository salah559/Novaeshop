
import Link from 'next/link';

export default function Header(){
  return (
    <header className="card header" style={{marginBottom:20}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:48,height:48,background:'#ffffff33',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>DZ</div>
        <div>
          <h1 style={{margin:0}}>DZ Digital Market</h1>
          <small>منتجات رقمية قانونية - الدفع ببريدي موب</small>
        </div>
      </div>
      <nav>
        <Link href="/"><a style={{marginRight:12}}>الرئيسية</a></Link>
        <Link href="/products"><a style={{marginRight:12}}>المنتجات</a></Link>
        <Link href="/mypurchases"><a style={{marginRight:12}}>مشترياتي</a></Link>
        <Link href="/contact"><a style={{marginRight:12}}>تواصل معنا</a></Link>
        <Link href="/admin"><a>لوحة الأدمن</a></Link>
      </nav>
    </header>
  );
}
