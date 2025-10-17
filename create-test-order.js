// Create a test order in Firestore
const admin = require('firebase-admin');

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
const serviceAccount = JSON.parse(serviceAccountJson);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();

async function createTestOrder() {
  try {
    console.log('🔨 Creating test order...\n');
    
    const testOrder = {
      userId: 'test-user-123',
      email: 'test@example.com',
      items: [
        {
          id: 'test-product-1',
          name: 'منتج تجريبي',
          price: 1000
        }
      ],
      total: 1000,
      paymentImageUrl: 'https://example.com/receipt.jpg',
      status: 'pending',
      createdAt: admin.firestore.Timestamp.now()
    };
    
    const docRef = await db.collection('orders').add(testOrder);
    
    console.log('✅ Test order created successfully!');
    console.log(`   Order ID: ${docRef.id}`);
    console.log(`   Status: pending`);
    console.log(`   Email: ${testOrder.email}`);
    console.log(`   Total: ${testOrder.total} دج\n`);
    
    // Verify it exists
    const ordersSnapshot = await db.collection('orders').where('status', '==', 'pending').get();
    console.log(`📋 Total pending orders now: ${ordersSnapshot.size}`);
    
  } catch (error) {
    console.error('❌ Error creating test order:', error.message);
    console.error('Full error:', error);
  }
}

createTestOrder().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
