
export const translations = {
  ar: {
    // Header
    siteName: 'Enova',
    tagline: 'متجرك الرقمي',
    home: 'الرئيسية',
    products: 'المنتجات',
    cart: 'السلة',
    myPurchases: 'مشترياتي',
    contact: 'تواصل معنا',
    admin: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    
    // Home page
    welcomeTitle: 'مرحباً في Enova',
    welcomeSubtitle: 'منصة رقمية متقدمة لبيع وشراء المنتجات الرقمية في الجزائر',
    paymentInfo: 'الدفع عبر بريدي موب - آمن وسريع',
    browseProducts: 'تصفح المنتجات',
    contactUs: 'تواصل معنا',
    
    // Features
    diverseProducts: 'منتجات رقمية متنوعة',
    diverseProductsDesc: 'مجموعة واسعة من المنتجات الرقمية عالية الجودة',
    securePayment: 'دفع آمن ببريدي موب',
    securePaymentDesc: 'نظام دفع محلي آمن وموثوق عبر بريدي موب',
    instantDelivery: 'تسليم فوري',
    instantDeliveryDesc: 'احصل على منتجاتك فوراً بعد تأكيد الدفع',
    
    // How it works
    howItWorks: 'كيف يعمل الموقع؟',
    step1: 'اختر المنتج',
    step1Desc: 'تصفح المنتجات واختر ما يناسبك',
    step2: 'ادفع ببريدي موب',
    step2Desc: 'قم بالدفع وارفع إيصال الدفع',
    step3: 'احصل على منتجك',
    step3Desc: 'بعد التأكيد، حمّل منتجك فوراً',
    
    // Cart
    shoppingCart: 'سلة التسوق',
    reviewProducts: 'راجع منتجاتك قبل الدفع',
    total: 'المجموع',
    proceedToCheckout: 'إتمام الطلب',
    emptyCart: 'السلة فارغة',
    
    // General
    price: 'السعر',
    currency: 'دج',
    addToCart: 'أضف للسلة',
    loading: 'جاري التحميل...',
  },
  
  en: {
    // Header
    siteName: 'Enova',
    tagline: 'Your Digital Store',
    home: 'Home',
    products: 'Products',
    cart: 'Cart',
    myPurchases: 'My Purchases',
    contact: 'Contact Us',
    admin: 'Admin Panel',
    login: 'Login',
    logout: 'Logout',
    
    // Home page
    welcomeTitle: 'Welcome to Enova',
    welcomeSubtitle: 'Advanced digital platform for buying and selling digital products in Algeria',
    paymentInfo: 'Payment via Baridi Mob - Safe and Fast',
    browseProducts: 'Browse Products',
    contactUs: 'Contact Us',
    
    // Features
    diverseProducts: 'Diverse Digital Products',
    diverseProductsDesc: 'Wide range of high-quality digital products',
    securePayment: 'Secure Payment with Baridi Mob',
    securePaymentDesc: 'Safe and reliable local payment system via Baridi Mob',
    instantDelivery: 'Instant Delivery',
    instantDeliveryDesc: 'Get your products instantly after payment confirmation',
    
    // How it works
    howItWorks: 'How Does It Work?',
    step1: 'Choose Product',
    step1Desc: 'Browse products and choose what suits you',
    step2: 'Pay with Baridi Mob',
    step2Desc: 'Make payment and upload receipt',
    step3: 'Get Your Product',
    step3Desc: 'After confirmation, download your product instantly',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    reviewProducts: 'Review your products before payment',
    total: 'Total',
    proceedToCheckout: 'Proceed to Checkout',
    emptyCart: 'Cart is empty',
    
    // General
    price: 'Price',
    currency: 'DZD',
    addToCart: 'Add to Cart',
    loading: 'Loading...',
  },
  
  fr: {
    // Header
    siteName: 'Enova',
    tagline: 'Votre Magasin Numérique',
    home: 'Accueil',
    products: 'Produits',
    cart: 'Panier',
    myPurchases: 'Mes Achats',
    contact: 'Contactez-nous',
    admin: 'Panneau Admin',
    login: 'Connexion',
    logout: 'Déconnexion',
    
    // Home page
    welcomeTitle: 'Bienvenue sur Enova',
    welcomeSubtitle: 'Plateforme numérique avancée pour acheter et vendre des produits numériques en Algérie',
    paymentInfo: 'Paiement via Baridi Mob - Sûr et Rapide',
    browseProducts: 'Parcourir les Produits',
    contactUs: 'Contactez-nous',
    
    // Features
    diverseProducts: 'Produits Numériques Divers',
    diverseProductsDesc: 'Large gamme de produits numériques de haute qualité',
    securePayment: 'Paiement Sécurisé avec Baridi Mob',
    securePaymentDesc: 'Système de paiement local sûr et fiable via Baridi Mob',
    instantDelivery: 'Livraison Instantanée',
    instantDeliveryDesc: 'Obtenez vos produits instantanément après confirmation du paiement',
    
    // How it works
    howItWorks: 'Comment Ça Marche ?',
    step1: 'Choisissez le Produit',
    step1Desc: 'Parcourez les produits et choisissez ce qui vous convient',
    step2: 'Payez avec Baridi Mob',
    step2Desc: 'Effectuez le paiement et téléchargez le reçu',
    step3: 'Obtenez Votre Produit',
    step3Desc: 'Après confirmation, téléchargez votre produit instantanément',
    
    // Cart
    shoppingCart: 'Panier',
    reviewProducts: 'Vérifiez vos produits avant le paiement',
    total: 'Total',
    proceedToCheckout: 'Passer à la Caisse',
    emptyCart: 'Le panier est vide',
    
    // General
    price: 'Prix',
    currency: 'DZD',
    addToCart: 'Ajouter au Panier',
    loading: 'Chargement...',
  }
};

export type Language = 'ar' | 'en' | 'fr';

export function getTranslation(lang: Language, key: keyof typeof translations.ar) {
  return translations[lang][key] || translations.ar[key];
}
