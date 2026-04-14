import React, { useState, useEffect } from 'react';
import { Server, Activity, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import { getNodeStats, toggleNodeMode, isNodeEnabled, NodeStats } from '../modules/angNodes';
import { verifyPin } from '../modules/auth';

export default function AngInfrastructure() {
  const [enabled, setEnabled] = useState(isNodeEnabled());
  const [stats, setStats] = useState<NodeStats>(getNodeStats());
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    const handleOnline = () => setStats(s => ({ ...s, status: 'active' }));
    const handleOffline = () => setStats(s => ({ ...s, status: 'paused' }));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggle = async () => {
    if (enabled) {
      setEnabled(false);
      toggleNodeMode(false);
    } else {
      setShowPinModal(true);
    }
  };

  const confirmEnable = async () => {
    const isValid = await verifyPin(pin);
    if (isValid) {
      setEnabled(true);
      toggleNodeMode(true);
      setShowPinModal(false);
      setPin('');
    } else {
      alert('Invalid PIN');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'throttled': return 'text-yellow-400';
      case 'paused': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Server className="w-6 h-6 text-emerald-400" />
          Ang Node
        </h1>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${enabled ? getStatusColor(stats.status) : 'text-zinc-600'}`}>
            {enabled ? (stats.status === 'active' ? '🟢 Active' : stats.status === 'throttled' ? '🟡 Throttled' : '🔴 Paused') : '⚪ Disabled'}
          </span>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Node Mode</h2>
            <p className="text-sm text-zinc-400">Validate transactions to earn SIMU</p>
          </div>
          <button 
            onClick={handleToggle}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Validations</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.validationsCount}</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Reputation</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">{stats.reputationScore}%</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Earned</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">+{stats.totalEarned} <span className="text-sm">SIMU</span></div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.accuracyRate.toFixed(1)}%</div>
            </div>
          </div>

          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors mt-4">
            View Validated Transactions
          </button>
        </div>
      )}

      {showPinModal && (
        <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-white mb-2">Enable Node Mode</h2>
            <p className="text-zinc-400 mb-6 text-sm">Enter PIN to authorize background validation.</p>
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl mb-6 text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:border-emerald-500"
              placeholder="****"
            />
            <div className="flex gap-4">
              <button onClick={() => setShowPinModal(false)} className="flex-1 bg-zinc-800 text-white font-bold py-4 rounded-xl">Cancel</button>
              <button onClick={confirmEnable} disabled={pin.length !== 4} className="flex-1 bg-emerald-500 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
