export class SimuBrowserClient {
  private apiKey: string;
  private timeoutMs = 10000;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timeoutId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Request timed out')), this.timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
  }

  async getBalance(): Promise<number> {
    if (typeof window !== 'undefined' && (window as any).simu) {
      const res = await this.withTimeout((window as any).simu.getBalance());
      return res.balance;
    }
    throw new Error('SIMU Wallet not found. Please install SIMU Testnet.');
  }

  async send(to: string, amount: number): Promise<string> {
    if (typeof window !== 'undefined' && (window as any).simu) {
      const res = await this.withTimeout((window as any).simu.send(to, amount));
      return res.txId;
    }
    throw new Error('SIMU Wallet not found.');
  }

  async requestPermissions(): Promise<{ granted: boolean; address: string }> {
    if (typeof window !== 'undefined' && (window as any).simu) {
      return await this.withTimeout((window as any).simu.requestPermissions());
    }
    throw new Error('SIMU Wallet not found.');
  }
}
