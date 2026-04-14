import nacl from 'tweetnacl';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const verifyCrossAppAuth = async (targetApp: string, challenge: string): Promise<boolean> => {
  try {
    // Mock dual verification logic
    // 1. ECDSA Verification (Simulated)
    const ecdsaValid = challenge.length > 0;
    
    // 2. Ed25519 Verification (Simulated with tweetnacl/noble)
    const keyPair = nacl.sign.keyPair();
    const msg = new TextEncoder().encode(challenge);
    const sig = nacl.sign.detached(msg, keyPair.secretKey);
    const ed25519Valid = nacl.sign.detached.verify(msg, sig, keyPair.publicKey);

    return ecdsaValid && ed25519Valid;
  } catch (e) {
    console.error('[IPC] Verification failed', e);
    return false;
  }
};

export const createSecureBridge = (targetApp: string, sessionKey: string) => {
  console.log(`[IPC] 🌉 Secure bridge established with ${targetApp}. Session: ${sessionKey}`);
  localStorage.setItem(`ipc_bridge_${targetApp}`, sessionKey);
};

export const establishBridgeWithRetry = async (targetApp: string, sessionKey: string): Promise<boolean> => {
  const backoffs = [1000, 2000, 4000];
  let successes = 0;

  for (let i = 0; i < 3; i++) {
    try {
      console.log(`[IPC] Verification attempt ${i + 1} for ${targetApp}...`);
      const valid = await verifyCrossAppAuth(targetApp, `challenge_${Date.now()}`);
      if (valid) successes++;
      
      if (successes >= 2) {
        createSecureBridge(targetApp, sessionKey);
        return true;
      }
    } catch (e) {
      console.warn(`[IPC] Attempt ${i + 1} failed`);
    }
    if (i < 2) await sleep(backoffs[i]);
  }

  console.log(`[IPC] ⚠️ Fallback: Target app ${targetApp} not responding. Queueing intent.`);
  const queued = JSON.parse(localStorage.getItem('queued_intents') || '[]');
  queued.push({ targetApp, sessionKey, timestamp: Date.now() });
  localStorage.setItem('queued_intents', JSON.stringify(queued));
  
  return false;
};
