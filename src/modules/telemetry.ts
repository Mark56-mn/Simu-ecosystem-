/**
 * BETA ANALYTICS & BUG REPORTING
 * Africa-Context: Low-bandwidth telemetry. Captures minimal state for debugging.
 */

// In-memory rolling log of the last 5 actions
const actionLog: string[] = [];

export const logEvent = (type: 'faucet_claim' | 'bearer_generate' | 'redeem_success' | 'sync_conflict', payload: any) => {
  actionLog.push(type);
  if (actionLog.length > 5) actionLog.shift();
  
  // Fire and forget telemetry
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload })
  }).catch(() => { /* Ignore network failures for telemetry */ });
};

export const shakeToReport = (deviceId: string) => {
  // Triggered by device shake (react-native-shake)
  const report = {
    deviceId,
    recentActions: [...actionLog],
    deviceInfo: navigator.userAgent, // In RN, use expo-device
    timestamp: Date.now()
  };
  
  fetch('/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'bug_report', payload: report })
  });
  
  return report;
};
