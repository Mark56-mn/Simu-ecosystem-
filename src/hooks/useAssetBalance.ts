import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

export const useAssetBalance = (deviceId: string) => {
  const [balance, setBalance] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);
  const db = SQLite.openDatabaseSync('simu.db');

  const loadLedger = () => {
    const credits = db.getAllSync<{sum: number}>("SELECT SUM(amount) as sum FROM ledger WHERE status IN ('confirmed','provisional') AND type='credit'")[0]?.sum || 0;
    const debits = db.getAllSync<{sum: number}>("SELECT SUM(amount) as sum FROM ledger WHERE status IN ('confirmed','provisional') AND type='debit'")[0]?.sum || 0;
    setBalance(credits - debits);
    setTxs(db.getAllSync("SELECT * FROM ledger ORDER BY timestamp DESC LIMIT 50"));
  };

  const sync = async () => {
    try {
      const claims = await (await fetch(`/api/faucet/claims?deviceId=${deviceId}`)).json();
      db.withTransactionSync(() => {
        claims.forEach((c: any) => db.runSync("INSERT OR IGNORE INTO ledger (id, amount, type, status, timestamp) VALUES (?, ?, 'credit', 'confirmed', ?)", [c.id, c.amount, Date.now()]));
      });
      await fetch('/api/sync', { method: 'POST', body: JSON.stringify({ deviceId }) });
      loadLedger();
    } catch (e) {}
  };

  useEffect(() => {
    db.execSync("CREATE TABLE IF NOT EXISTS ledger (id TEXT PRIMARY KEY, amount INTEGER, type TEXT, status TEXT, timestamp INTEGER)");
    loadLedger();
    sync();
    const unsub = NetInfo.addEventListener(s => {
      if (s.isConnected) sync();
    });
    return unsub;
  }, []);

  return { balance, txs, refresh: loadLedger };
};
