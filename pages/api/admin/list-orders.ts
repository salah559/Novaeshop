
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const snap = await adminDb.collection('orders').orderBy('createdAt','desc').limit(100).get();
    const orders:any[] = [];
    snap.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(orders);
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
}
