export const checkConsensusThreshold = (trustedNodesTotal: number, agreeingNodes: number): boolean => {
  if (trustedNodesTotal === 0) return false;
  return (agreeingNodes / trustedNodesTotal) >= 0.6;
};

export const snapshotBalance = (txId: string, accountId: string, balance: number) => {
  const snapshots = JSON.parse(localStorage.getItem('balance_snapshots') || '{}');
  if (!snapshots[txId]) snapshots[txId] = {};
  snapshots[txId][accountId] = balance;
  localStorage.setItem('balance_snapshots', JSON.stringify(snapshots));
  console.log(`[CONSENSUS] 📸 Snapshot saved for TX ${txId}, Account ${accountId}`);
};

export const rollbackBalances = async (txId: string): Promise<boolean> => {
  const snapshots = JSON.parse(localStorage.getItem('balance_snapshots') || '{}');
  const txSnapshots = snapshots[txId];
  
  if (!txSnapshots) {
    console.error(`[CONSENSUS] ❌ No snapshot found for TX ${txId}`);
    return false;
  }

  console.log(`[CONSENSUS] ⏪ ATOMIC ROLLBACK INITIATED for TX ${txId}`);
  
  // Simulate atomic restoration
  for (const [accountId, balance] of Object.entries(txSnapshots)) {
    console.log(`   -> Restored ${accountId} to ${balance} SIMU`);
    // In a real app, update SQLite/Supabase here
  }

  // Audit Log
  const auditLog = JSON.parse(localStorage.getItem('audit_log') || '[]');
  auditLog.push({
    id: crypto.randomUUID(),
    type: 'ROLLBACK',
    txId,
    timestamp: Date.now(),
    details: txSnapshots
  });
  localStorage.setItem('audit_log', JSON.stringify(auditLog));
  
  // Clean up snapshot
  delete snapshots[txId];
  localStorage.setItem('balance_snapshots', JSON.stringify(snapshots));

  return true;
};
