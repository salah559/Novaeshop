// Script to add products to Firestore using Client SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Products data
const products = [
  {
    name: "باقة 30 مليون منتج رقمي",
    description: "باقة ضخمة تحتوي على أكثر من 30 مليون منتج رقمي قابل لإعادة البيع. اشترِ مرة واحدة وبع إلى ما لا نهاية! تشمل كورسات، قوالب، كتب إلكترونية، أدوات تسويق وأكثر بكثير.",
    price: 5000,
    category: "باقات شاملة",
    imageUrl: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/1liSsIt4Mdy5Fef3KZIF50AlRnEOMll8V"
  },
  {
    name: "هدية - 15 مليون منتج رقمي مجاناً",
    description: "مجموعة هائلة من المنتجات الرقمية المجانية. تحتوي على الآلاف من المنتجات الجيدة القابلة للبيع بسهولة. فرصة ذهبية لبدء عملك الرقمي!",
    price: 0,
    category: "باقات شاملة",
    imageUrl: "https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg",
    fileUrl: "https://docs.google.com/document/u/0/d/1LyvKwMTlR8E0KaQET3ON5wZarUxwszM5kygX8CCwmFk/mobilebasic"
  },
  {
    name: "+4500 قالب ووردبريس مميز",
    description: "مجموعة احترافية من أكثر من 4500 قالب WordPress متنوع وعالي الجودة. قوالب جاهزة للاستخدام في جميع المجالات: مدونات، متاجر، شركات، بورتفوليو والمزيد.",
    price: 2500,
    category: "قوالب ويب",
    imageUrl: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/1Qx71H1sXgbOXaqNavmsAYL_jkT_Nzstt"
  },
  {
    name: "كورس تيك توك ادس - استهداف الجزائر",
    description: "كورس متكامل لتعلم إعلانات TikTok Ads مع التركيز على استهداف السوق الجزائري. طرق مجربة وفعالة لتحقيق أفضل النتائج من حملاتك الإعلانية.",
    price: 1500,
    category: "كورسات تسويق",
    imageUrl: "https://images.pexels.com/photos/5198239/pexels-photo-5198239.jpeg",
    fileUrl: "https://mega.nz/folder/tzdWCSJD#FqYekGdchqNHP_N76xKSFg"
  },
  {
    name: "100,000 فيديو للمحتوى الرقمي",
    description: "مكتبة ضخمة تحتوي على 100,000 فيديو عالي الجودة (4K) في مجالات متعددة: تحفيزية، سيارات فاخمة، طبيعة، رياضة ورفاهية. مثالية لصناع المحتوى على يوتيوب، تيك توك، إنستقرام وفيسبوك. جميع الفيديوهات مع حقوق ملكية مجانية.",
    price: 3000,
    category: "فيديوهات",
    imageUrl: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg",
    fileUrl: "https://drive.google.com/file/d/1y-cnoP9I1Td9DaNm18qLM66lJ2q2sh5w"
  },
  {
    name: "2000 فكرة منتج رقمي Etsy",
    description: "أكثر من 2000 فكرة منتج رقمي جاهزة للبيع على Etsy. اشترِ مرة واحدة وأعد بيعها بلا حدود. أفكار مربحة ومجربة لزيادة أرباحك.",
    price: 1800,
    category: "أفكار منتجات",
    imageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    fileUrl: "https://2u.pw/M3bSNXm7"
  },
  {
    name: "250 ثيم Shopify احترافي",
    description: "مجموعة مميزة من 250 قالب Shopify احترافي لتعزيز حضور متجرك الإلكتروني. قوالب مثالية لجميع المجالات والصناعات لإطلاق متجر ناجح أو تطوير متجر موجود.",
    price: 2200,
    category: "قوالب متاجر",
    imageUrl: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/1ZcopdM1WLEMfGzwEbtlKIguG38npcNYh"
  },
  {
    name: "كورس الترويج في فيسبوك وانستقرام",
    description: "كورس شامل خطوة بخطوة لتعلم الترويج الاحترافي على فيسبوك وانستقرام. استراتيجيات فعالة لزيادة المبيعات والوصول للجمهور المستهدف.",
    price: 1200,
    category: "كورسات تسويق",
    imageUrl: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/1Yb5wndl6NIyTYAcKvwS53ACA021Upswp"
  },
  {
    name: "كورس تيك توك بيطا الشامل",
    description: "كورس متكامل لتعلم TikTok Beta وإنشاء حسابات TikTok Ads. طرق مجربة لتحقيق أرباح من المنصة مع جميع الشروحات اللازمة.",
    price: 1500,
    category: "كورسات تسويق",
    imageUrl: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/15yd281JiwrbUxuFN7A50kEhZXWT4QGIe"
  },
  {
    name: "كورس بيع الكتب الإلكترونية",
    description: "كورس احترافي يعلمك كيفية بيع الكتب الإلكترونية بنجاح. استراتيجيات تسويق فعالة وطرق مجربة لتحقيق أرباح مستدامة من بيع الكتب.",
    price: 1000,
    category: "كورسات تسويق",
    imageUrl: "https://images.pexels.com/photos/159621/open-book-library-education-read-159621.jpeg",
    fileUrl: "https://www.mediafire.com/folder/i703o5qu36pld/"
  },
  {
    name: "+400,000 كتاب إلكتروني",
    description: "مكتبة عملاقة تحتوي على أكثر من 400,000 كتاب إلكتروني في جميع المجالات. مصدر ممتاز للمحتوى أو لإعادة البيع أو للاستفادة الشخصية.",
    price: 2800,
    category: "كتب إلكترونية",
    imageUrl: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg",
    fileUrl: "https://drive.google.com/drive/folders/1IFsntCAPKHEtzZP1dHRJulqyY-mz4_k7"
  },
  {
    name: "+10,000 قالب Canva جاهز",
    description: "مجموعة ضخمة من أكثر من 10,000 قالب Canva احترافي جاهز للاستخدام. قوالب لجميع الأغراض: سوشيال ميديا، بوسترات، لوجوهات، عروض تقديمية والمزيد.",
    price: 1600,
    category: "قوالب تصميم",
    imageUrl: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    fileUrl: "https://drive.google.com/file/d/1wdjP-yySPaH_tMAqmpN2TFiQhQVDAYDE"
  },
  {
    name: "100,000 ChatGPT Prompt",
    description: "مجموعة هائلة من 100,000 prompt لـ ChatGPT تغطي 180+ مهمة مختلفة. أداة قوية لتحسين إنتاجيتك وإبداعك في استخدام الذكاء الاصطناعي.",
    price: 1400,
    category: "أدوات AI",
    imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    fileUrl: "https://sintralabs.notion.site/Customer-Support-999-Ultimate-ChatGPT-Prompts-To-Copy-Paste-180-tasks-f86d39b2ba1d479685894932dfb1b81a"
  },
  {
    name: "كورسات شاملة - مجموعة كاملة",
    description: "مجموعة كاملة من الكورسات التعليمية: إنشاء حسابات TikTok Ads، TikTok Beta، وجميع الكورسات المذكورة. باقة متكاملة للمسوقين الرقميين.",
    price: 3500,
    category: "باقات كورسات",
    imageUrl: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
    fileUrl: "https://mega.nz/folder/4ytwjQjK#0HIvAJjg4_OmYWca8rVA_A"
  }
];

// Add products to Firestore
async function addProducts() {
  console.log('🚀 بدء إضافة المنتجات إلى Firestore...\n');
  
  const productsRef = collection(db, 'products');
  
  for (const product of products) {
    try {
      await addDoc(productsRef, product);
      console.log(`✅ تمت إضافة: ${product.name}`);
    } catch (error) {
      console.error(`❌ خطأ في إضافة ${product.name}:`, error.message);
    }
  }
  
  console.log(`\n🎉 تم! تمت إضافة ${products.length} منتج بنجاح إلى Firestore!`);
  process.exit(0);
}

addProducts().catch(error => {
  console.error('❌ خطأ في إضافة المنتجات:', error);
  process.exit(1);
});
