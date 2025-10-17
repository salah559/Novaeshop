
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, adminStorage } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { orderId } = req.body;
  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const doc = await orderRef.get();
    if(!doc.exists) return res.status(404).json({ error: 'not found' });
    const order = doc.data();
    const items = order.items || [];
    for(const it of items){
      const prodSnap = await adminDb.collection('products').doc(it.id).get();
      if(!prodSnap.exists) continue;
      const prod = prodSnap.data();
      let downloadUrl = prod.filePath || prod.fileUrl || null;
      if(prod.filePath) {
        const bucket = adminStorage.bucket();
        const file = bucket.file(prod.filePath);
        const [url] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 1000*60*60*24 });
        downloadUrl = url;
      }
      await adminDb.collection('purchases').add({
        userId: order.userId || null,
        productId: prodSnap.id,
        name: prod.name || it.name,
        downloadUrl,
        createdAt: new Date()
      });
    }
    await orderRef.update({ status: 'confirmed', confirmedAt: new Date() });
    res.json({ ok: true });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
}
