import React, { useState } from 'react';
import { useAssetBalance } from '../hooks/useAssetBalance';
import { useScanRedeem } from '../hooks/useScanRedeem';
import { SmartScanner } from '../components/SmartScanner';
import { ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';

export default function Asset() {
  const deviceId = 'device-123';
  const { balance, txs, refresh } = useAssetBalance(deviceId);
  const [scanMode, setScanMode] = useState(false);
  const [ussdCode, setUssdCode] = useState('');
  const { redeem, loading } = useScanRedeem(deviceId, () => { setScanMode(false); refresh(); });

  const getBadge = (status: string) => {
    const colors: any = { provisional: '🟡 Provisional', confirmed: '🟢 Confirmed', rolled_back: '🔴 Rolled Back' };
    return colors[status] || '⚪ Unknown';
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">SIMU Asset</h1>
        <div className="text-5xl font-bold text-emerald-400 mb-8">{balance.toLocaleString()} <span className="text-2xl">SIMU</span></div>

        <div className="flex gap-4 mb-8">
          <button 
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            onClick={() => alert('Navigate to Generate Flow')}
          >
            <ArrowUpRight className="w-5 h-5" />
            Send
          </button>
          <button 
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            onClick={() => setScanMode(true)}
          >
            <ArrowDownLeft className="w-5 h-5" />
            Receive
          </button>
        </div>

        <h2 className="text-lg font-medium mb-4 text-zinc-400">Recent Transactions</h2>
        <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
          {txs.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">No transactions yet</p>
          ) : (
            txs.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div>
                  <div className={`text-lg font-bold ${item.type === 'credit' ? 'text-emerald-400' : 'text-white'}`}>
                    {item.type === 'credit' ? '+' : '-'}{item.amount}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-xs font-medium bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">
                  {getBadge(item.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {scanMode && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
          <div className="flex-1 relative">
            <SmartScanner onScan={(data) => redeem(data, false)} onClose={() => setScanMode(false)} />
          </div>
          <div className="p-6 bg-zinc-900 border-t border-zinc-800">
            <p className="text-zinc-400 mb-3 text-sm">Or enter 6-digit code:</p>
            <input 
              type="text"
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl mb-4 text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-emerald-500"
              value={ussdCode} 
              onChange={(e) => setUssdCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
              placeholder="000000"
            />
            <button 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
              onClick={() => redeem(ussdCode, true)} 
              disabled={loading || ussdCode.length !== 6}
            >
              {loading ? 'Verifying...' : 'Redeem Code'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
