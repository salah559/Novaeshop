import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const router = useRouter();

  const breadcrumbMap: { [key: string]: BreadcrumbItem[] } = {
    '/products': [
      { label: 'الرئيسية', href: '/' },
      { label: 'المنتجات' }
    ],
    '/checkout': [
      { label: 'الرئيسية', href: '/' },
      { label: 'المنتجات', href: '/products' },
      { label: 'الدفع' }
    ],
    '/account': [
      { label: 'الرئيسية', href: '/' },
      { label: 'حسابي' }
    ],
    '/orders': [
      { label: 'الرئيسية', href: '/' },
      { label: 'طلباتي' }
    ]
  };

  const breadcrumbs = breadcrumbMap[router.pathname] || [];

  if (breadcrumbs.length === 0) return null;

  return (
    <div
      style={{
        padding: '12px clamp(15px, 3vw, 30px)',
        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
        color: 'rgba(255, 255, 255, 0.6)',
        borderBottom: '1px solid rgba(57, 255, 20, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}
    >
      {breadcrumbs.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.href ? (
            <Link href={item.href} style={{ color: '#39ff14', textDecoration: 'none' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: '#ffd700', fontWeight: 500 }}>{item.label}</span>
          )}
          {index < breadcrumbs.length - 1 && <span>/</span>}
        </div>
      ))}
    </div>
  );
}
