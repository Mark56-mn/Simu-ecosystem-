import React, { useState } from 'react';
import { useAssetBalance } from '../hooks/useAssetBalance';
import { useScanRedeem } from '../hooks/useScanRedeem';
import { SmartScanner } from '../components/SmartScanner';
import { ArrowUpRight, ArrowDownLeft, X, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { downloadQR } from '../utils/downloadQR';

export default function Asset() {
  const deviceId = 'device-123';
  const { balance, txs, refresh } = useAssetBalance(deviceId);
  const [scanMode, setScanMode] = useState(false);
  const [sendMode, setSendMode] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [agentScanData, setAgentScanData] = useState<string | null>(null);
  const [agentAmount, setAgentAmount] = useState('');
  const [ussdCode, setUssdCode] = useState('');
  const { redeem, loading } = useScanRedeem(deviceId, () => { setScanMode(false); refresh(); });

  const handleScan = (data: string) => {
    if (data.startsWith('SIMU:AGENT:')) {
      setAgentScanData(data);
    } else {
      redeem(data, false);
    }
  };

  const handleAgentPay = () => {
    const amount = parseInt(agentAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      alert('Invalid amount or insufficient balance');
      return;
    }
    // Deduct locally
    const stored = localStorage.getItem('simu_ledger');
    const ledger = stored ? JSON.parse(stored) : [];
    ledger.push({
      id: `agent-pay-${Date.now()}`,
      amount,
      type: 'debit',
      status: 'provisional',
      timestamp: Date.now()
    });
    localStorage.setItem('simu_ledger', JSON.stringify(ledger));
    refresh();
    alert('Payment sent to agent. Waiting for agent confirmation.');
    setAgentScanData(null);
    setScanMode(false);
  };
  const getBadge = (status: string) => {
    const colors: any = { provisional: '🟡 Provisional', confirmed: '🟢 Confirmed', rolled_back: '🔴 Rolled Back' };
    return colors[status] || '⚪ Unknown';
  };

  const handleSend = () => {
    const amount = parseInt(sendAmount, 10);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      alert('Invalid amount or insufficient balance');
      return;
    }

    const timestamp = Date.now();
    const sig = Math.random().toString(36).substring(2, 10); // Mock signature
    const qrPayload = `SIMU:${amount}:${timestamp}:${deviceId}:pubkey123:${sig}=`;
    const shortCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

    // Deduct locally
    const stored = localStorage.getItem('simu_ledger');
    const ledger = stored ? JSON.parse(stored) : [];
    ledger.push({
      id: sig,
      amount,
      type: 'debit',
      status: 'provisional',
      timestamp
    });
    localStorage.setItem('simu_ledger', JSON.stringify(ledger));
    refresh();

    setGeneratedCode({ qr: qrPayload, short: shortCode });
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">SIMU Asset</h1>
        <div className="text-5xl font-bold text-emerald-400 mb-8">{balance.toLocaleString()} <span className="text-2xl">SIMU</span></div>

        <div className="flex gap-4 mb-8">
          <button 
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            onClick={() => setSendMode(true)}
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

      {sendMode && (
        <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Send SIMU</h2>
            <button onClick={() => { setSendMode(false); setGeneratedCode(null); setSendAmount(''); }} className="p-2 bg-zinc-900 rounded-full text-white hover:bg-zinc-800">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!generatedCode ? (
            <div className="flex-1">
              <p className="text-zinc-400 mb-2">Enter Amount</p>
              <input 
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-6 text-3xl font-bold focus:outline-none focus:border-emerald-500"
                value={sendAmount} 
                onChange={(e) => setSendAmount(e.target.value)} 
                placeholder="0"
              />
              <button 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
                onClick={handleSend} 
                disabled={!sendAmount || parseInt(sendAmount) <= 0}
              >
                Generate Code
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-2xl mb-6">
                <QRCodeSVG id="send-qr" value={generatedCode.qr} size={200} />
              </div>
              <p className="text-zinc-400 mb-2">Or use 6-digit code:</p>
              <div className="text-4xl font-mono font-bold text-emerald-400 tracking-widest mb-8">
                {generatedCode.short}
              </div>
              <button 
                onClick={() => downloadQR('send-qr')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download QR
              </button>
            </div>
          )}
        </div>
      )}

      {scanMode && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col">
          {agentScanData ? (
            <div className="flex-1 bg-zinc-950 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Pay Agent</h2>
              <p className="text-zinc-400 text-center mb-8">Agent ID: {agentScanData.split(':')[2]}</p>
              <input 
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl mb-6 text-3xl font-bold text-center focus:outline-none focus:border-emerald-500"
                value={agentAmount} 
                onChange={(e) => setAgentAmount(e.target.value)} 
                placeholder="Amount to pay"
              />
              <div className="flex gap-4">
                <button 
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors"
                  onClick={() => { setAgentScanData(null); setAgentAmount(''); }}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
                  onClick={handleAgentPay} 
                  disabled={!agentAmount || parseInt(agentAmount) <= 0}
                >
                  Confirm Pay
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 relative">
                <SmartScanner onScan={handleScan} onClose={() => setScanMode(false)} />
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
