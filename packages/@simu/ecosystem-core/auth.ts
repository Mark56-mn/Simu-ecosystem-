export interface SimuIdentity {
  simuId: string;
  deviceFingerprint: string;
  publicKey: string;
}

export const generateDeviceFingerprint = (): string => {
  // Mock fingerprint generation
  return `fp_${Math.random().toString(36).substring(2, 15)}`;
};

export const getIdentity = (): SimuIdentity | null => {
  try {
    const stored = localStorage.getItem('simu_identity');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to read identity', e);
  }
  return null;
};

export const createIdentity = (simuId: string): SimuIdentity => {
  const identity: SimuIdentity = {
    simuId,
    deviceFingerprint: generateDeviceFingerprint(),
    publicKey: `pub_${Math.random().toString(36).substring(2, 15)}`
  };
  localStorage.setItem('simu_identity', JSON.stringify(identity));
  return identity;
};
