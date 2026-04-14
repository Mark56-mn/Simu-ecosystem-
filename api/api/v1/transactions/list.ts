export const config = { runtime: 'edge' };
import { validateApiRequest, corsHeaders } from '../../../lib/auth';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const auth = await validateApiRequest(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: corsHeaders });

  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  const limit = parseInt(searchParams.get('limit') || '50');

  return new Response(JSON.stringify({ transactions: [], hasMore: false }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
