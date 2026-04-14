export const config = { runtime: 'edge' };
import { validateApiRequest, corsHeaders } from '../../../lib/auth';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const auth = await validateApiRequest(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: corsHeaders });

  const address = new URL(req.url).searchParams.get('address');
  if (!address) return new Response(JSON.stringify({ error: 'Missing address' }), { status: 400, headers: corsHeaders });

  return new Response(JSON.stringify({ address, balance: 1500.5, pending: 0, confirmed: 1500.5 }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
