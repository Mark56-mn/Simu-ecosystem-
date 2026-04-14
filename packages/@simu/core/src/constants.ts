export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.simu.network';

export const RATE_LIMITS = {
  FREE: 100,
  DEV: 1000
};

export const APP_SCHEMES = {
  WALLET: 'simu-wallet://',
  BROWSER: 'simu-browser://',
  NODES: 'simu-nodes://'
};
