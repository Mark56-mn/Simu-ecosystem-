import { supabase } from './supabase';
import crypto from 'crypto';

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) return false;
  
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data } = await supabase
    .from('api_keys')
    .select('id')
    .eq('key_hash', hash)
    .eq('status', 'active')
    .single();
    
  return !!data;
}

export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}
