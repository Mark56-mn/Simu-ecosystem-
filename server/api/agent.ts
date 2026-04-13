export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { agentId, amount, status, userDeviceId } = await req.json();
  
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Log the agent transaction
  await supabase.from('agent_transactions').insert([{
    agent_id: agentId,
    amount,
    status
  }]);

  // 2. If successful, mint provisional SIMU to the user's wallet (Testnet only)
  if (status === 'completed') {
    // Note: In production, the agent's wallet balance would decrease, and the user's would increase.
    // For testnet, we just log it and assume the client updates its local ledger.
    console.log(`Mock Cash-In: ${amount} SIMU to ${userDeviceId} via Agent ${agentId}`);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
