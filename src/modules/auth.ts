const DEVICE_ID = 'device-123';

const setSecure = async (key: string, val: string) => {
  localStorage.setItem(key, val);
};

const getSecure = async (key: string) => {
  return localStorage.getItem(key);
};

const digestStringAsync = async (str: string) => {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const initWallet = async (pin: string) => {
  const hash = await digestStringAsync(pin + DEVICE_ID);
  await setSecure('pin_hash', hash);
  await setSecure('priv_key', 'mock_encrypted_ecdsa_key');
  localStorage.setItem('has_wallet', 'true');
};

export const verifyPin = async (pin: string) => {
  const hash = await digestStringAsync(pin + DEVICE_ID);
  const stored = await getSecure('pin_hash');
  return hash === stored;
};

export const enableBiometric = async () => {
  // Mock biometric for web preview
  console.warn('Biometrics not supported in web preview');
  return false;
};

export const addRecoveryContact = (pubKey: string) => {
  const contacts = JSON.parse(localStorage.getItem('recovery_contacts') || '[]');
  contacts.push({ pubKey, status: 'active' });
  localStorage.setItem('recovery_contacts', JSON.stringify(contacts));
};

export const verifyRecovery = (signatures: string[]) => signatures.length >= 2;
