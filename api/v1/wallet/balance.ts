import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../lib/supabase';
import { extractBearerToken, validateApiKey } from '../../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = extractBearerToken(req.headers.authorization);
  if (!token || !(await validateApiKey(token))) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }

  const address = req.query.address as string;
  if (!address) {
    return res.status(400).json({ error: 'Missing address parameter' });
  }

  const { data, error } = await supabase
    .from('ledger')
    .select('type, amount, status')
    .eq('wallet_address', address)
    .in('status', ['confirmed', 'provisional']);

  if (error) {
    return res.status(500).json({ error: 'Database query failed' });
  }

  const balance = data.reduce((acc, tx) => {
    return tx.type === 'credit' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  res.status(200).json({ address, balance, currency: 'SIMU' });
}
