import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '32mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'ImgBB API key not configured' });
    }

    const formData = new FormData();
    formData.append('image', image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!data.success) {
      console.error('ImgBB upload failed:', data);
      return res.status(500).json({ error: 'Failed to upload image to ImgBB', details: data });
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
