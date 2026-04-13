import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Clock } from 'lucide-react';

export default function AgentScreen() {
  const agentId = 'agent-123';
  const [qrGenerated, setQrGenerated] = useState(false);
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateQR = () => {
    setQrGenerated(true);
    // Simulate user scanning and initiating a transaction after 5 seconds
    setTimeout(() => {
      setPendingTx({ id: 'tx-8899', amount: 500, user: 'device-456' });
      setQrGenerated(false);
    }, 5000);
  };

  const confirmTx = async () => {
    setLoading(true);
    try {
      await fetch('/api/agent/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, amount: pendingTx.amount, status: 'completed' })
      });
      alert('Transaction Confirmed & Settled via Mobile Money');
      setPendingTx(null);
    } catch (e) {
      alert('Webhook failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Agent Dashboard</h1>
      <p className="text-zinc-400 mb-8">Initiate Cash-In for users.</p>

      {!qrGenerated && !pendingTx && (
        <button 
          onClick={generateQR}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-colors"
        >
          Generate Cash-In QR
        </button>
      )}

      {qrGenerated && (
        <div className="text-center bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-lg font-bold text-white mb-6">Have user scan this QR</h2>
          <div className="bg-white p-4 rounded-2xl inline-block mb-6">
            <QRCodeSVG value={`SIMU:AGENT:${agentId}`} size={200} />
          </div>
          <p className="text-zinc-400 text-sm flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 animate-spin" /> Waiting for user...
          </p>
        </div>
      )}

      {pendingTx && (
        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Cash-In Request</h2>
          <div className="text-4xl font-bold text-emerald-400 mb-6">{pendingTx.amount} SIMU</div>
          <p className="text-zinc-400 mb-8 text-sm">User {pendingTx.user} is requesting cash-in. Collect cash before confirming.</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setPendingTx(null)}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={confirmTx}
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
            >
              {loading ? 'Settling...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
