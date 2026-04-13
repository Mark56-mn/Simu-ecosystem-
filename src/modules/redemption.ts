import { getAdjustedTime, CLOCK_DRIFT_BUFFER_MS } from '../utils/timeSync';
import { verifySignatureNative } from './crypto';

export type TxStatus = 'provisional' | 'confirmed' | 'high_confidence' | 'rolled_back';

export interface RedemptionResult {
  amount: number;
  status: TxStatus;
  signature: string;
}

/**
 * PROVISIONAL CREDIT STATE MACHINE
 * Africa-Context: Allows immediate exchange of goods offline (Provisional),
 * but requires sync for final settlement (Confirmed).
 */
export const redeemProvisional = async (
  qrData: string, 
  checkIfSpentLocally: (sig: string) => boolean,
  saveToLocalLedger: (tx: any) => void
): Promise<RedemptionResult> => {
  
  if (!qrData.startsWith('SIMU:')) {
    throw new Error('Invalid bearer code format');
  }

  const parts = qrData.split(':');
  if (parts.length !== 6) {
    throw new Error('Malformed bearer code');
  }

  const [prefix, amountStr, expiryStr, nonce, pubKeyB64, signature] = parts;
  const amount = parseInt(amountStr, 10);
  const expiry = parseInt(expiryStr, 10);
  
  // 1. Clock Drift Resilience Check
  const adjustedTime = getAdjustedTime();
  if (adjustedTime > expiry + CLOCK_DRIFT_BUFFER_MS) {
    throw new Error('Code expired');
  }

  // 2. Cryptographic Verification (Native Thread)
  const payload = `${amountStr}:${expiryStr}:${nonce}:${pubKeyB64}`;
  const isValid = await verifySignatureNative(payload, signature, pubKeyB64);
  
  if (!isValid) {
    throw new Error('Invalid cryptographic signature');
  }

  // 3. Local Double-Spend Check
  if (checkIfSpentLocally(signature)) {
    throw new Error('Code already redeemed locally');
  }

  // 4. State Machine: Enter as 'provisional'
  // The UI must show a yellow "Provisional" badge. The merchant accepts the risk
  // for small amounts, but should wait for "Confirmed" for large amounts.
  const tx = {
    id: nonce,
    amount,
    signature,
    status: 'provisional' as TxStatus,
    timestamp: Date.now()
  };

  saveToLocalLedger(tx);
    
  return { amount, status: 'provisional', signature };
};
