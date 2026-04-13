// Mocking the native thread offloading for the web preview environment.
// In the actual React Native app, this would use react-native-quick-crypto or libsodium-wrappers via JSI.

export const signPayloadNative = async (payload: string, privateKey: string): Promise<string> => {
  // SIMULATED NATIVE DELAY: Keep under 200ms for Samsung A03 Core target
  await new Promise(resolve => setTimeout(resolve, 50)); 
  
  // In production: Ed25519 signature generation
  return `sig_${btoa(payload).substring(0, 15)}_${Math.random().toString(36).substring(2, 8)}`;
};

export const verifySignatureNative = async (payload: string, signature: string, publicKey: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  // In production: Ed25519 signature verification
  return signature.startsWith('sig_');
};
