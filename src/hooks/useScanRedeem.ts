import { useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';

export const useScanRedeem = (deviceId: string, onComplete: () => void) => {
  const [loading, setLoading] = useState(false);
  const db = SQLite.openDatabaseSync('simu.db');

  const redeem = async (code: string, isUssd: boolean) => {
    setLoading(true);
    try {
      const net = await NetInfo.fetch();
      let amount = 0, sig = code;
      
      if (isUssd && net.isConnected) {
        const res = await (await fetch('/api/ussd', { method: 'POST', body: JSON.stringify({ code, deviceId }) })).json();
        if (!res.valid) throw new Error('Invalid code');
        amount = res.amount;
      } else if (!isUssd) {
        const parts = code.split(':'); 
        amount = parseInt(parts[1], 10);
        sig = parts[5];
      } else throw new Error('Offline USSD not supported');

      db.runSync("INSERT INTO ledger (id, amount, type, status, timestamp) VALUES (?, ?, 'credit', 'provisional', ?)", [sig, amount, Date.now()]);
      onComplete();
    } catch (e) {
      alert('Redemption failed');
    }
    setLoading(false);
  };

  return { redeem, loading };
};
