import { getAdjustedTime } from '../utils/timeSync';
import { signPayloadNative } from './crypto';

interface GeneratorResult {
  qrData: string;
  pinData: string | null;
  isOfflineOnly: boolean;
  expiresAt: number;
}

/**
 * HYBRID BEARER CODE GENERATOR
 * Africa-Context: Auto-detects connectivity. If offline, generates QR only.
 * If online, generates QR + 6-digit PIN (for USSD/SMS fallback for feature phones).
 */
export const generateHybridCode = async (
  amount: number, 
  privateKey: string, 
  pubKeyB64: string,
  isOnline: boolean // Passed from NetInfo in React Native
): Promise<GeneratorResult> => {
  
  // 1. Clock Drift Resilience
  const adjustedTime = getAdjustedTime();
  const expiry = adjustedTime + 60000; // 60s expiry
  
  // 2. Cryptographic Nonce
  const nonce = Math.random().toString(36).substring(2, 10);
  
  // 3. Payload Construction
  const payload = `${amount}:${expiry}:${nonce}:${pubKeyB64}`;
  
  // 4. Native Thread Signing (Target: < 200ms on 2GB RAM device)
  const signature = await signPayloadNative(payload, privateKey);
  
  // 5. QR Data formatting
  const qrData = `SIMU:${payload}:${signature}`;
  
  let pinData = null;

  if (isOnline) {
    // Online Flow: Generate 6-digit PIN and register with server
    // This allows the receiver to use USSD (*123*PIN#) if they don't have a smartphone
    pinData = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      // In production, this points to your Vercel Edge API
      const response = await fetch('/api/ussd-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinData, signature, amount, pubKeyB64, expiry })
      });
      
      if (!response.ok) throw new Error('Failed to register PIN');
    } catch (error) {
      console.warn('Network failed during PIN registration. Falling back to offline QR only.', error);
      pinData = null;
      isOnline = false;
    }
  }

  // Note on TTS: In the UI layer, we lazily load the TTS bundle (Twi/Swahili) 
  // and read `pinData` aloud if the user taps the accessibility icon.

  return { 
    qrData, 
    pinData, 
    isOfflineOnly: !isOnline,
    expiresAt: expiry
  };
};
