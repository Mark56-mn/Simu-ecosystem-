export const config = { runtime: 'edge' };

// Simple in-memory rate limiting for Edge (resets on cold start, but good enough for MVP)
const rateLimits = new Map<string, { count: number, resetAt: number }>();

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { code, deviceId } = await req.json();
  
  if (!code || !deviceId) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  // 1. Rate Limiting: 5 requests / minute per device
  const now = Date.now();
  const limit = rateLimits.get(deviceId);
  if (limit && now < limit.resetAt) {
    if (limit.count >= 5) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429 });
    }
    limit.count++;
  } else {
    rateLimits.set(deviceId, { count: 1, resetAt: now + 60000 });
  }

  // 2. Supabase Initialization
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 3. Lookup the PIN in the active_pins table (you would create this table in Supabase)
  // For the MVP, we assume the generator registered the PIN to `active_pins`.
  const { data: pinRecord, error } = await supabase
    .from('active_pins')
    .select('*')
    .eq('pin', code)
    .single();

  if (error || !pinRecord) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid or expired code' }), { status: 404 });
  }

  // 4. Check Expiry (Server-side)
  if (Date.now() > pinRecord.expiry) {
    return new Response(JSON.stringify({ valid: false, error: 'Code expired' }), { status: 400 });
  }

  // 5. Check Double-Spend
  const { data: spentRecord } = await supabase
    .from('spent_codes')
    .select('signature')
    .eq('signature', pinRecord.signature)
    .single();

  if (spentRecord) {
    return new Response(JSON.stringify({ valid: false, error: 'Code already redeemed' }), { status: 400 });
  }

  // 6. Mark as Spent
  await supabase
    .from('spent_codes')
    .insert([{ 
      signature: pinRecord.signature, 
      redeemer_device_id: deviceId, 
      amount: pinRecord.amount 
    }]);

  // 7. Cleanup the PIN so it can't be used again
  await supabase.from('active_pins').delete().eq('pin', code);

  return new Response(JSON.stringify({ 
    valid: true, 
    amount: pinRecord.amount, 
    signature: pinRecord.signature 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
