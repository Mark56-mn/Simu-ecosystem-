export class SimuMobileClient {
  private apiKey: string;
  private baseUrl = 'https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/functions/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithRetry(endpoint: string, options: RequestInit, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers: { ...options.headers, 'x-api-key': this.apiKey, 'Content-Type': 'application/json' },
          signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
      }
    }
  }

  async getBalance(address: string): Promise<number> {
    const res = await this.fetchWithRetry(`/dapp-balance?address=${address}`, { method: 'GET' });
    return res.balance;
  }

  async send(from: string, to: string, amount: number, signature: string): Promise<string> {
    const res = await this.fetchWithRetry(`/dapp-send`, {
      method: 'POST',
      body: JSON.stringify({ from, to, amount, signature })
    });
    return res.txId;
  }
}
