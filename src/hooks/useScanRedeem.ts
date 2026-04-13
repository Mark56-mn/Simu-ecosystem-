import { useState } from 'react';

export const useScanRedeem = (deviceId: string, onComplete: () => void) => {
  const [loading, setLoading] = useState(false);

  const redeem = async (code: string, isUssd: boolean) => {
    setLoading(true);
    try {
      const isOnline = navigator.onLine;
      let amount = 0, sig = code;
      
      if (isUssd && isOnline) {
        const res = await fetch('/api/ussd', { method: 'POST', body: JSON.stringify({ code, deviceId }) });
        const data = await res.json();
        if (!data.valid) throw new Error('Invalid code');
        amount = data.amount;
      } else if (!isUssd) {
        const parts = code.split(':'); 
        amount = parseInt(parts[1], 10);
        sig = parts[5];
      } else {
        throw new Error('Offline USSD not supported');
      }

      const stored = localStorage.getItem('simu_ledger');
      const ledger = stored ? JSON.parse(stored) : [];
      
      // Prevent double scan locally
      if (ledger.find((t: any) => t.id === sig)) {
        throw new Error('Already redeemed locally');
      }

      ledger.push({
        id: sig,
        amount,
        type: 'credit',
        status: 'provisional',
        timestamp: Date.now()
      });
      
      localStorage.setItem('simu_ledger', JSON.stringify(ledger));
      onComplete();
    } catch (e: any) {
      alert(e.message || 'Redemption failed');
    }
    setLoading(false);
  };

  return { redeem, loading };
};
