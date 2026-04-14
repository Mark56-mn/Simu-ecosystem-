export const config = { runtime: 'edge' };
import { validateApiRequest, corsHeaders } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  
  const auth = await validateApiRequest(req);
  if (auth.error) return new Response(JSON.stringify({ error: auth.error }), { status: auth.status, headers: corsHeaders });

  try {
    const { url, events } = await req.json();
    if (!url || !events || !Array.isArray(events)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: corsHeaders });
    }

    const secret = crypto.randomUUID().replace(/-/g, '');
    
    return new Response(JSON.stringify({ 
      webhookId: crypto.randomUUID(), 
      secret,
      status: 'active'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: corsHeaders });
  }
}
