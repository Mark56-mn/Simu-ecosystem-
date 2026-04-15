import { supabase } from '../lib/supabase';

export interface NodeStatus {
  id: string;
  status: string;
  uptime: number;
  last_ping: string;
}

export interface Receipt {
  node_id: string;
  work_done: number;
  proof: string;
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

export async function getNodeStatus(nodeId: string): Promise<NodeStatus> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('node_stats')
      .select('*')
      .eq('id', nodeId)
      .single();

    if (error) throw new Error(`Failed to fetch node status: ${error.message}`);
    return data as NodeStatus;
  });
}

export async function submitReceipt(receipt: Receipt): Promise<boolean> {
  return withRetry(async () => {
    const { error } = await supabase
      .from('node_receipts')
      .insert([{ ...receipt, created_at: new Date().toISOString() }]);

    if (error) throw new Error(`Failed to submit receipt: ${error.message}`);
    return true;
  });
}
