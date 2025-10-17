// Test Firestore connection and check orders
const admin = require('firebase-admin');

// Parse service account
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountJson) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT not found');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (e) {
  console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
  process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

const db = admin.firestore();

async function testFirestore() {
  try {
    console.log('🔍 Testing Firestore connection...\n');
    
    // Test 1: Check products collection
    console.log('📦 Checking products collection...');
    const productsSnapshot = await db.collection('products').limit(5).get();
    console.log(`   Found ${productsSnapshot.size} products`);
    if (productsSnapshot.size > 0) {
      productsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - ${data.name} (${data.price} دج)`);
      });
    }
    
    console.log('');
    
    // Test 2: Check orders collection
    console.log('📋 Checking orders collection...');
    const ordersSnapshot = await db.collection('orders').get();
    console.log(`   Total orders: ${ordersSnapshot.size}`);
    
    if (ordersSnapshot.size > 0) {
      console.log('\n   📌 All orders:');
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`   - Order ID: ${doc.id}`);
        console.log(`     Status: ${data.status}`);
        console.log(`     Email: ${data.email}`);
        console.log(`     Total: ${data.total} دج`);
        console.log(`     Items: ${data.items?.length || 0}`);
        console.log('');
      });
      
      // Check pending orders specifically
      const pendingSnapshot = await db.collection('orders').where('status', '==', 'pending').get();
      console.log(`   ⏳ Pending orders: ${pendingSnapshot.size}`);
    } else {
      console.log('   ⚠️ No orders found in database!');
    }
    
    console.log('');
    
    // Test 3: Check purchases collection
    console.log('🎁 Checking purchases collection...');
    const purchasesSnapshot = await db.collection('purchases').limit(5).get();
    console.log(`   Found ${purchasesSnapshot.size} purchases\n`);
    
    console.log('✅ Firestore connection successful!');
    
  } catch (error) {
    console.error('❌ Error testing Firestore:', error.message);
    console.error('Full error:', error);
  }
}

testFirestore().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
