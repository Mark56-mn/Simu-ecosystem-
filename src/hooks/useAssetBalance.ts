import { useState, useEffect } from 'react';

export const useAssetBalance = (deviceId: string) => {
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);

  const loadLedger = () => {
    const stored = localStorage.getItem('simu_ledger');
    const ledger = stored ? JSON.parse(stored) : [];
    
    const credits = ledger.filter((t: any) => t.type === 'credit' && ['confirmed', 'provisional'].includes(t.status)).reduce((acc: number, t: any) => acc + t.amount, 0);
    const debits = ledger.filter((t: any) => t.type === 'debit' && ['confirmed', 'provisional'].includes(t.status)).reduce((acc: number, t: any) => acc + t.amount, 0);
    
    setBalance(credits - debits);
    setTxs(ledger.sort((a: any, b: any) => b.timestamp - a.timestamp).slice(0, 50));
  };

  const sync = async () => {
    try {
      const res = await fetch(`/api/faucet/claims?deviceId=${deviceId}`);
      if (res.ok) {
        const claims = await res.json();
        const stored = localStorage.getItem('simu_ledger');
        const ledger = stored ? JSON.parse(stored) : [];
        
        let changed = false;
        claims.forEach((c: any) => {
          if (!ledger.find((t: any) => t.id === c.id)) {
            ledger.push({ id: c.id, amount: c.amount, type: 'credit', status: 'confirmed', timestamp: Date.now() });
            changed = true;
          }
        });
        
        if (changed) {
          localStorage.setItem('simu_ledger', JSON.stringify(ledger));
        }
      }
      
      await fetch('/api/sync', { method: 'POST', body: JSON.stringify({ deviceId }) });
      loadLedger();
    } catch (e) {}
  };

  useEffect(() => {
    loadLedger();
    sync();
    
    const handleOnline = () => sync();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return { balance, txs, refresh: loadLedger };
};
