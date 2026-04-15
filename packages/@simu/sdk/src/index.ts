import { SimuBrowserClient } from './browser';
import { SimuMobileClient } from './mobile';

export function createSimuClient(apiKey: string, env: 'browser' | 'mobile' = 'browser') {
  if (env === 'browser') {
    return new SimuBrowserClient(apiKey);
  }
  return new SimuMobileClient(apiKey);
}

export * from './browser';
export * from './mobile';
