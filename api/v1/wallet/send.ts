import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase';
import { extractBearerToken, validateApiKey } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = extractBearerToken(req.headers.authorization);
  if (!token || !(await validateApiKey(token))) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  const { from_address, to_address, amount } = req.body || {};
  if (!from_address || !to_address || !amount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Basic mock implementation for send
  return res.status(200).json({ 
    status: 'success',
    transaction_id: 'tx_' + Date.now(),
    from: from_address,
    to: to_address,
    amount: amount
  });
}
