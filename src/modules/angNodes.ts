import { verifyPin } from './auth';

const isWeb = true;

export interface ValidationInput {
  txId: string;
  payload: string;
  signature: string;
  expiry: number;
  deviceId: string;
}

export interface ValidationOutput {
  txId: string;
  result: 'valid' | 'invalid';
  timestamp: number;
  nodeSignature: string;
}

export interface NodeStats {
  deviceId: string;
  validationsCount: number;
  accuracyRate: number;
  totalEarned: number;
  reputationScore: number;
  status: 'active' | 'throttled' | 'paused';
}

export const checkDeviceHealth = async (): Promise<boolean> => {
  if (isWeb) return true;
  return true;
};

export const validateTransaction = async (input: ValidationInput): Promise<ValidationOutput | null> => {
  const isHealthy = await checkDeviceHealth();
  if (!isHealthy) return null;

  const now = Date.now();
  if (now > input.expiry) {
    return { txId: input.txId, result: 'invalid', timestamp: now, nodeSignature: 'mock_sig' };
  }

  const isValid = Math.random() > 0.1;

  return {
    txId: input.txId,
    result: isValid ? 'valid' : 'invalid',
    timestamp: now,
    nodeSignature: `sig_${input.txId}_${now}`
  };
};

export const updateReputation = (stats: NodeStats, serverMatch: boolean): NodeStats => {
  let newStats = { ...stats };
  newStats.validationsCount += 1;
  
  if (serverMatch) {
    newStats.totalEarned += 0.5;
    newStats.reputationScore = Math.min(100, newStats.reputationScore + 1);
  } else {
    newStats.reputationScore = Math.max(0, newStats.reputationScore - 5);
  }
  
  newStats.accuracyRate = (newStats.accuracyRate * (newStats.validationsCount - 1) + (serverMatch ? 100 : 0)) / newStats.validationsCount;
  
  localStorage.setItem('node_stats', JSON.stringify(newStats));
  return newStats;
};

export const getNodeStats = (): NodeStats => {
  const stored = localStorage.getItem('node_stats');
  if (stored) return JSON.parse(stored);
  
  return {
    deviceId: 'device-123',
    validationsCount: 0,
    accuracyRate: 100,
    totalEarned: 0,
    reputationScore: 100,
    status: navigator.onLine ? 'active' : 'paused'
  };
};

export const toggleNodeMode = (enabled: boolean) => {
  localStorage.setItem('ang_node_enabled', enabled ? 'true' : 'false');
};

export const isNodeEnabled = () => {
  return localStorage.getItem('ang_node_enabled') === 'true';
};
