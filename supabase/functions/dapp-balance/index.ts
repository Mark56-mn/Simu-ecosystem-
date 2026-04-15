import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const address = url.searchParams.get('address');
    const apiKey = req.headers.get('x-api-key');

    if (!address || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing address or API key' }), { status: 400, headers: corsHeaders });
    }

    // Rate limiting & API key validation logic would go here
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('ledger')
      .select('type, amount')
      .eq('wallet_address', address)
      .in('status', ['confirmed', 'provisional']);

    if (error) throw error;

    const balance = data.reduce((acc: number, tx: any) => tx.type === 'credit' ? acc + tx.amount : acc - tx.amount, 0);

    return new Response(JSON.stringify({ balance }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
