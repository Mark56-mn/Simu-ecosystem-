export interface IpcMessage {
  type: string;
  payload: any;
  signature: string;
  timestamp: number;
}

export const createMessage = (type: string, payload: any, privateKey: string): IpcMessage => {
  const timestamp = Date.now();
  const dataToSign = `${type}:${JSON.stringify(payload)}:${timestamp}`;
  // Mock signature generation
  const signature = `sig_${btoa(dataToSign).substring(0, 16)}`;
  return { type, payload, signature, timestamp };
};

export const verifyMessage = (message: IpcMessage, publicKey: string): boolean => {
  const { type, payload, signature, timestamp } = message;
  const now = Date.now();
  if (now - timestamp > 60000) return false; // 1 min expiry
  
  const dataToVerify = `${type}:${JSON.stringify(payload)}:${timestamp}`;
  const expectedSig = `sig_${btoa(dataToVerify).substring(0, 16)}`;
  return signature === expectedSig;
};
