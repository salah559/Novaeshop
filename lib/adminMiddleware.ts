import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from './firebaseAdmin';
import { ADMIN_EMAILS } from './adminCheck';

export async function verifyAdmin(req: NextApiRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const email = decodedToken.email;
    
    if (!email || !ADMIN_EMAILS.includes(email.toLowerCase())) {
      return null;
    }
    
    return email;
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

export function requireAdmin(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const adminEmail = await verifyAdmin(req);
    
    if (!adminEmail) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }
    
    return handler(req, res);
  };
}
