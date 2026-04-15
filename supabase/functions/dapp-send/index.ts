import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { from, to, amount, signature } = await req.json();
    const apiKey = req.headers.get('x-api-key');

    if (!from || !to || !amount || !signature || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400, headers: corsHeaders });
    }

    // Cryptographic signature validation goes here
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Requires service role to insert on behalf of user via API
    );

    const { data, error } = await supabaseClient
      .from('ledger')
      .insert([{ wallet_address: from, to_address: to, type: 'debit', amount, status: 'pending' }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ txId: data.id, status: 'pending' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
