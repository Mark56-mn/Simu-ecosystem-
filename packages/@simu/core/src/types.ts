export type SimuAddress = string;

export interface Transfer {
  id: string;
  from: SimuAddress;
  to: SimuAddress;
  amount: number;
  status: 'provisional' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface NodeStats {
  nodeId: string;
  reputation: number;
  validationsToday: number;
  simuEarned: number;
  uptime: number;
  status: 'active' | 'paused' | 'offline';
}

export type AdminRole = 'super' | 'sub';

export interface Game {
  id: string;
  name: string;
  sizeMB: number;
  iconUrl: string;
  downloadUrl: string;
  offlineReady: boolean;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  upvotes: number;
  timestamp: number;
}
