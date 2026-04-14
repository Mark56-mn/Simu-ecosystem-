export const config = { runtime: 'edge' };
import { validateApiRequest, corsHeaders } from '../../lib/auth';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  
  const auth = await validateApiRequest(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: corsHeaders });

  try {
    const { from, to, amount, signature } = await req.json();
    return new Response(JSON.stringify({ txId: crypto.randomUUID(), status: 'provisional', timestamp: Date.now() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: corsHeaders });
  }
}
