import { db } from './db';
import { products } from '@shared/schema';

async function seed() {
  console.log('Seeding database...');

  const sampleProducts = [
    {
      name: 'كورس تطوير الويب الشامل 2024',
      description: 'كورس كامل لتعلم تطوير الويب من الصفر حتى الاحتراف، يشمل HTML, CSS, JavaScript, React, Node.js وقواعد البيانات',
      price: 15000,
      category: 'courses',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      downloadUrl: 'https://drive.google.com/file/example1',
      isFeatured: 1,
      soldCount: 45,
    },
    {
      name: 'مجموعة فيديوهات 4K للمونتاج',
      description: 'مكتبة ضخمة تحتوي على أكثر من 500 فيديو 4K عالي الجودة للاستخدام في المونتاج والإعلانات',
      price: 25000,
      category: 'videos',
      imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      downloadUrl: 'https://drive.google.com/file/example2',
      isFeatured: 1,
      soldCount: 38,
    },
    {
      name: 'كتاب البرمجة بلغة Python',
      description: 'كتاب شامل يغطي جميع جوانب البرمجة بلغة Python من الأساسيات إلى المواضيع المتقدمة',
      price: 5000,
      category: 'books',
      imageUrl: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800',
      downloadUrl: 'https://drive.google.com/file/example3',
      isFeatured: 0,
      soldCount: 67,
    },
    {
      name: 'قوالب WordPress احترافية - باك 10 قوالب',
      description: '10 قوالب WordPress احترافية جاهزة للاستخدام، مناسبة للمدونات، المتاجر الإلكترونية، والشركات',
      price: 30000,
      category: 'wordpress',
      imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
      downloadUrl: 'https://drive.google.com/file/example4',
      isFeatured: 1,
      soldCount: 23,
    },
    {
      name: 'أدوات وPrompts متقدمة لـ ChatGPT',
      description: 'مجموعة من 200+ prompt احترافي لاستخدام ChatGPT في التسويق، البرمجة، الكتابة والتصميم',
      price: 8000,
      category: 'chatgpt',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      downloadUrl: 'https://drive.google.com/file/example5',
      isFeatured: 0,
      soldCount: 89,
    },
    {
      name: 'كورس تصميم UI/UX',
      description: 'تعلم تصميم واجهات المستخدم وتجربة المستخدم باستخدام Figma، Adobe XD وأفضل الممارسات العالمية',
      price: 12000,
      category: 'courses',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      downloadUrl: 'https://drive.google.com/file/example6',
      isFeatured: 0,
      soldCount: 56,
    },
    {
      name: 'مكتبة الموسيقى الخالية من الحقوق',
      description: '300+ مقطع موسيقي احترافي خالي من حقوق الملكية للاستخدام في مشاريعك',
      price: 18000,
      category: 'videos',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800',
      downloadUrl: 'https://drive.google.com/file/example7',
      isFeatured: 0,
      soldCount: 34,
    },
    {
      name: 'Pack كامل للمطورين - 30 منتج',
      description: 'حزمة شاملة تحتوي على كورسات، كتب، أدوات وقوالب للمطورين - وفر 50% عند شراء الباقة',
      price: 50000,
      category: 'packs',
      imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800',
      downloadUrl: 'https://drive.google.com/file/example8',
      isFeatured: 1,
      soldCount: 15,
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product);
  }

  console.log(`✓ Seeded ${sampleProducts.length} products`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed!', err);
  process.exit(1);
});
