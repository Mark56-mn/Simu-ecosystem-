import { supabase } from '../lib/supabase';

export interface TransactionPayload {
  from_address: string;
  to_address: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  status: string;
  wallet_address: string;
  created_at: string;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
    }
  }
  throw new Error('Retry failed');
}

export async function getBalance(address: string): Promise<number> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('ledger')
      .select('type, amount')
      .eq('wallet_address', address)
      .in('status', ['confirmed', 'provisional']);

    if (error) throw new Error(`Failed to fetch balance: ${error.message}`);

    return (data || []).reduce((acc, tx) => {
      return tx.type === 'credit' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  });
}

export async function sendTransaction(payload: TransactionPayload): Promise<Transaction> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('ledger')
      .insert([
        {
          wallet_address: payload.from_address,
          type: 'debit',
          amount: payload.amount,
          status: 'pending',
          to_address: payload.to_address
        }
      ])
      .select()
      .single();

    if (error) throw new Error(`Transaction failed: ${error.message}`);
    return data as Transaction;
  });
}
