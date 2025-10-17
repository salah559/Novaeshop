import { Link } from 'wouter';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/products', label: 'المنتجات' },
    { path: '/contact', label: 'تواصل معنا' },
    { path: '/purchases', label: 'مشترياتي' },
  ];

  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              DZ Digital Market
            </h3>
            <p className="text-muted-foreground text-sm">
              منصة بيع منتجات رقمية جزائرية احترافية. كل شيء قانوني، آمن، ومباشر بالدينار الجزائري.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@dzdigital.dz</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>0555 123 456</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>الجزائر العاصمة، الجزائر</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DZ Digital Market. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
