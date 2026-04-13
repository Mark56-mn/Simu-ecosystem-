/**
 * SOCIAL RECOVERY SCAFFOLD
 * Africa-Context: Users often lose devices or forget PINs. 
 * We use a 2-of-3 trusted contact recovery system via offline QR handshakes.
 */

export interface TrustedContact {
  id: string;
  name: string;
  pubKey: string;
}

export const initiateRecovery = (contacts: TrustedContact[]) => {
  if (contacts.length !== 3) {
    throw new Error('Must have exactly 3 trusted contacts');
  }
  
  // Generate a recovery session ID
  const sessionId = Math.random().toString(36).substring(2, 10);
  
  return {
    sessionId,
    status: 'pending_approvals',
    approvals: 0
  };
};

export const processRecoveryApproval = async (
  qrData: string, 
  currentApprovals: number,
  contactId: string // The ID of the contact who scanned the QR
): Promise<{ success: boolean, newApprovals: number, isRecovered: boolean }> => {
  
  const isValid = qrData.startsWith('SIMU_RECOVERY:');
  if (!isValid) return { success: false, newApprovals: currentApprovals, isRecovered: false };
  
  const newApprovals = currentApprovals + 1;
  const isRecovered = newApprovals >= 2;

  // Testnet: Reward the honest contact with +50 SIMU
  if (isRecovered) {
    try {
      await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: contactId, type: 'task', taskId: 'recovery_assist' })
      });
    } catch (e) {
      console.warn('Failed to issue recovery reward', e);
    }
  }
  
  return { success: true, newApprovals, isRecovered };
};
