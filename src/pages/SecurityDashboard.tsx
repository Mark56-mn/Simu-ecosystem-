import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, AlertTriangle, RotateCcw, ServerCrash } from 'lucide-react';

export default function SecurityDashboard() {
  const [threats, setThreats] = useState<any[]>([]);
  const [quarantined, setQuarantined] = useState<any[]>([]);
  const [rollbacks, setRollbacks] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Load local mock data
    const loadData = () => {
      setQuarantined(JSON.parse(localStorage.getItem('quarantined_nodes') || '[]'));
      setRollbacks(JSON.parse(localStorage.getItem('audit_log') || '[]').filter((l: any) => l.type === 'ROLLBACK'));
      
      // Mock active threats
      setThreats([
        { id: 'th_1', nodeId: 'node_7x9a', txId: 'tx_9921', type: 'DOUBLE_SPEND', time: Date.now() - 300000 }
      ]);
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerMockAlert = () => {
    setToast("⚠️ Invalid TX detected from Node XYZ. Rollback initiated.");
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative">
      
      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-500/20 z-50 flex items-center gap-2 animate-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5" />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Security Core</h1>
            <p className="text-sm text-zinc-400">Active Threat Response & Consensus</p>
          </div>
        </div>
        <button onClick={triggerMockAlert} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-medium transition-colors border border-zinc-800">
          Simulate Threat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Active Threats</span>
          </div>
          <div className="text-3xl font-bold text-white">{threats.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <ServerCrash className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Quarantined</span>
          </div>
          <div className="text-3xl font-bold text-white">{quarantined.length}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Rollbacks (24h)</span>
          </div>
          <div className="text-3xl font-bold text-white">{rollbacks.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Network Health
          </h2>
          <div className="flex items-end gap-4 mb-6">
            <div className="text-5xl font-bold text-emerald-400">99.8%</div>
            <div className="text-zinc-400 mb-1">Trusted Consensus</div>
          </div>
          
          <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Node Reputation</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="font-mono text-sm">node_alpha_9</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">TRUSTED (98%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="font-mono text-sm">node_beta_2</span>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">CAUTION (65%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="font-mono text-sm">node_gamma_7</span>
              <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">BLOCKED (12%)</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recent Invalidation Audit</h2>
          {rollbacks.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <RotateCcw className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No rollbacks recorded.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rollbacks.slice(0, 5).map((log, i) => (
                <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-400">TX: {log.txId}</span>
                    <span className="text-xs text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Restored {Object.keys(log.details).length} accounts to pre-TX state.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
