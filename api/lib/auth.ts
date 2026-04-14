import { supabase } from './supabase';
import { getRateLimiter } from './rateLimit';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-api-key',
};

export async function validateApiRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : req.headers.get('x-api-key');

  if (!token) return { error: 'Missing Authorization header or x-api-key', status: 401 };

  const { data: keyData } = await supabase
    .from('api_keys')
    .select('id, rate_limit, status')
    .eq('key_hash', token)
    .single();

  if (!keyData || keyData.status !== 'active') {
    return { error: 'Invalid or inactive API key', status: 401 };
  }

  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const ratelimit = getRateLimiter(keyData.rate_limit || 100);
  const { success } = await ratelimit.limit(`ratelimit_${token}_${ip}`);

  if (!success) return { error: 'Rate limit exceeded', status: 429 };

  return { keyId: keyData.id };
}
