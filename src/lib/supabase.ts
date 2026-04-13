import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const testConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { 
      success: false, 
      message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.' 
    };
  }
  
  try {
    // A simple query to check connectivity. We query the 'wallets' table.
    const { data, error } = await supabase.from('wallets').select('*').limit(1);
    
    if (error) {
      return { success: false, message: `Connection failed: ${error.message}` };
    }
    return { success: true, message: 'Successfully connected to Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Unexpected error: ${err.message}` };
  }
};
