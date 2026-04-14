import { rollbackBalances } from './consensusEngine';

export interface ThreatAlert {
  type: string;
  nodeId: string;
  txId: string;
  proof: any;
  timestamp: number;
}

export const gossipThreatAlert = (alert: ThreatAlert) => {
  console.log('[ATRP] 🚨 PRIORITY GOSSIP ALERT:', alert);
  // In a real P2P network, this broadcasts to all active nodes
};

export const slashReputation = (nodeId: string) => {
  console.log(`[ATRP] ⚔️ SLASHING: Node ${nodeId} reputation -20%, reward lock 24h`);
  const statsStr = localStorage.getItem('node_stats');
  if (statsStr) {
    const stats = JSON.parse(statsStr);
    if (stats.deviceId === nodeId) {
      stats.reputationScore = Math.max(0, stats.reputationScore - 20);
      localStorage.setItem('node_stats', JSON.stringify(stats));
    }
  }
};

export const declareInvalidTX = async (txId: string, consensusProof: any) => {
  console.log(`[ATRP] ❌ INVALID TX DECLARED: ${txId}`, consensusProof);
  await rollbackBalances(txId);
};

export const detectMaliciousNode = (nodeId: string, txId: string, proof: any) => {
  console.log(`[ATRP] 🛑 MALICIOUS NODE DETECTED: ${nodeId} for TX ${txId}`);
  
  // Quarantine
  const quarantined = JSON.parse(localStorage.getItem('quarantined_nodes') || '[]');
  quarantined.push({ nodeId, txId, timestamp: Date.now(), lockedUntil: Date.now() + 86400000 });
  localStorage.setItem('quarantined_nodes', JSON.stringify(quarantined));

  slashReputation(nodeId);
  gossipThreatAlert({ type: 'MALICIOUS_NODE', nodeId, txId, proof, timestamp: Date.now() });
};
