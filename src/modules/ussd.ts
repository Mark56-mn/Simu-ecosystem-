/**
 * USSD/SMS FALLBACK MODULE
 * Africa-Context: Feature phone users dial *123*PIN# to claim funds.
 */

export const verifyUssdCode = async (code: string, deviceId: string) => {
  try {
    const response = await fetch('/api/ussd-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, deviceId })
    });
    
    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || 'Verification failed');
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('USSD Verification Error:', error.message);
    throw error;
  }
};

// UI Helper: Generates the dialer link
export const getUssdDialerLink = (pin: string) => `tel:*123*${pin}#`;
