import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const DEVICE_ID = 'device-123';

const setSecure = async (key: string, val: string) => {
  try { await SecureStore.setItemAsync(key, val); } 
  catch { localStorage.setItem(key, val); }
};

const getSecure = async (key: string) => {
  try { return await SecureStore.getItemAsync(key); } 
  catch { return localStorage.getItem(key); }
};

export const initWallet = async (pin: string) => {
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin + DEVICE_ID);
  await setSecure('pin_hash', hash);
  await setSecure('priv_key', 'mock_encrypted_ecdsa_key');
  localStorage.setItem('has_wallet', 'true');
};

export const verifyPin = async (pin: string) => {
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin + DEVICE_ID);
  const stored = await getSecure('pin_hash');
  return hash === stored;
};

export const enableBiometric = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Login to SIMU' });
      return result.success;
    }
  } catch (e) { console.warn('Biometrics not supported in this environment'); }
  return false;
};

export const addRecoveryContact = (pubKey: string) => {
  const contacts = JSON.parse(localStorage.getItem('recovery_contacts') || '[]');
  contacts.push({ pubKey, status: 'active' });
  localStorage.setItem('recovery_contacts', JSON.stringify(contacts));
};

export const verifyRecovery = (signatures: string[]) => signatures.length >= 2;
