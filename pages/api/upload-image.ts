import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let imageBuffer: Buffer | null = null;
    let fileName: string = '';

    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON payload (from checkout.tsx)
      let body = '';
      await new Promise<void>((resolve, reject) => {
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', resolve);
        req.on('error', reject);
      });
      const data = JSON.parse(body);
      const base64 = data.image;
      
      if (!base64) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      imageBuffer = Buffer.from(base64, 'base64');
      fileName = `receipts/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    } else {
      // Handle multipart/form-data (from admin/products)
      const form = new IncomingForm();
      const [fields, files] = await form.parse(req);
      
      const fileArray = files.image as any[];
      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const file = fileArray[0];
      imageBuffer = await fs.readFile(file.filepath);
      fileName = `products/${Date.now()}-${file.originalFilename || 'image'}`;
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    console.log('Uploading to Firebase Storage:', fileName, 'size:', imageBuffer.length);

    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const encodedFileName = encodeURIComponent(fileName);
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedFileName}?uploadType=media&name=${encodedFileName}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: imageBuffer,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Firebase upload failed:', error);
      return res.status(500).json({ error: 'Failed to upload image to Firebase' });
    }

    const mediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedFileName}?alt=media`;
    console.log('Upload successful:', mediaUrl);

    return res.status(200).json({
      success: true,
      url: mediaUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
}
