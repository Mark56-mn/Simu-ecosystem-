export const config = { runtime: 'edge' };
import { validateApiRequest, corsHeaders } from '../../lib/auth';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  const auth = await validateApiRequest(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: corsHeaders });

  const nodeId = new URL(req.url).searchParams.get('nodeId');
  if (!nodeId) return new Response(JSON.stringify({ error: 'Missing nodeId' }), { status: 400, headers: corsHeaders });

  return new Response(JSON.stringify({ nodeId, reputation: 98, validations: 1420, earned: 50.5, status: 'active' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
