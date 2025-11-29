import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs/promises';
import FormData from 'form-data';

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
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    
    const fileArray = files.image as any[];
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = fileArray[0];
    const fileData = await fs.readFile(file.filepath);
    const base64 = fileData.toString('base64');

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      console.error('IMGBB_API_KEY not found');
      return res.status(500).json({ error: 'ImgBB API key not configured' });
    }

    // Use form-data to create proper multipart/form-data request
    const formData = new FormData();
    formData.append('image', base64);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData as any,
    });

    const data = await response.json();
    console.log('ImgBB response status:', response.status, 'Success:', data.success);

    if (!data.success) {
      console.error('ImgBB upload failed:', data);
      return res.status(500).json({ error: data.error?.message || 'Failed to upload image to ImgBB' });
    }

    return res.status(200).json({
      success: true,
      url: data.data.display_url,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
}
