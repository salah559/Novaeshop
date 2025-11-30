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
    let base64: string | null = null;

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
      base64 = data.image;
    } else {
      // Handle multipart/form-data (from admin/products)
      const form = new IncomingForm();
      const [fields, files] = await form.parse(req);
      
      const fileArray = files.image as any[];
      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const file = fileArray[0];
      const fileData = await fs.readFile(file.filepath);
      base64 = fileData.toString('base64');
    }

    if (!base64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Upload to ImgBB
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error('IMGBB_API_KEY not found');
      return res.status(500).json({ error: 'ImgBB API key not configured' });
    }

    console.log('Uploading to ImgBB, base64 length:', base64.length);

    // Send to ImgBB using URLSearchParams
    const formData = new URLSearchParams();
    formData.append('image', base64);

    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const imgbbData = await imgbbResponse.json();
    console.log('ImgBB response status:', imgbbResponse.status, 'data:', JSON.stringify(imgbbData).substring(0, 200));

    if (!imgbbData.success) {
      console.error('ImgBB upload failed:', imgbbData);
      return res.status(500).json({ error: imgbbData.error?.message || 'Failed to upload to ImgBB' });
    }

    const imageUrl = imgbbData.data.display_url;
    console.log('Image uploaded to ImgBB:', imageUrl);

    return res.status(200).json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
}
