import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.status(200).json({
    status: 'online',
    api: 'SIMU Gateway',
    version: '1.0.0',
    endpoints: {
      balance: 'GET /v1/wallet/balance?address=bsm1...',
      send: 'POST /v1/wallet/send',
      transactions: 'GET /v1/transactions/list?address=...'
    },
    auth: 'Required: Authorization: Bearer YOUR_API_KEY'
  });
}
