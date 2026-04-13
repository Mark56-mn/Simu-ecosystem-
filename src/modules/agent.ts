/**
 * AGENT CASH-IN/OUT SCAFFOLD
 * Africa-Context: Agents are the bridge between mobile money (M-Pesa, MTN) and SIMU.
 */

export const generateAgentCashInQR = (agentId: string, amount: number) => {
  // Generates a specific QR format that the user scans to initiate cash-in
  return `SIMU_AGENT_CASHIN:${agentId}:${amount}:${Date.now()}`;
};

export const confirmAgentCashIn = async (agentId: string, amount: number, userDeviceId: string) => {
  // In production, this calls the mobile money API. For testnet, we mock it.
  const response = await fetch('/api/agent/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, amount, status: 'completed', userDeviceId })
  });
  
  return response.ok;
};
