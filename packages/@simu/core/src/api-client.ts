import { API_BASE_URL } from './constants';

export class ApiClient {
  constructor(private apiKey: string) {}

  private async fetchWithRetry(endpoint: string, options: RequestInit, retries = 3): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    for (let i = 0; i < retries; i++) {
      try {
        // 2G optimization: timeout after 15s to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(url, { ...options, headers, signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(error.message || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error: any) {
        if (i === retries - 1) throw error;
        // Exponential backoff for unreliable African networks
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
      }
    }
  }

  get(endpoint: string) {
    return this.fetchWithRetry(endpoint, { method: 'GET' });
  }

  post(endpoint: string, body: any) {
    return this.fetchWithRetry(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }
}

export const createApiClient = (apiKey?: string) => new ApiClient(apiKey || '');
