import React, { useState, useEffect } from 'react';
import { Shield, Activity, Bug, Upload, Link as LinkIcon, Server } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'health' | 'bugs' | 'apk' | 'links'>('health');
  
  // Mock data
  const healthStats = [
    { app: 'SIMU Testnet', status: '🟢 Online', version: '0.2.1', crashRate: '0.01%' },
    { app: 'SIMU Browser', status: '🟢 Online', version: '1.0.0', crashRate: '0.05%' },
    { app: 'Ang Nodes', status: '🟡 Degraded', version: '0.9.5', crashRate: '1.2%' },
  ];

  const [bugs, setBugs] = useState<any[]>([]);

  useEffect(() => {
    // Load mock telemetry
    const stored = localStorage.getItem('telemetry_events');
    if (stored) setBugs(JSON.parse(stored));
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-zinc-950 text-zinc-50 min-h-[600px] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-4">
        <Shield className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">SIM Dev Core</h1>
          <p className="text-sm text-zinc-400">Ecosystem Administration</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('health')} className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'health' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
          <Activity className="w-4 h-4" /> App Health
        </button>
        <button onClick={() => setActiveTab('bugs')} className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'bugs' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
          <Bug className="w-4 h-4" /> Bug Reports
        </button>
        <button onClick={() => setActiveTab('apk')} className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'apk' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
          <Upload className="w-4 h-4" /> APK Distributor
        </button>
        <button onClick={() => setActiveTab('links')} className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'links' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
          <LinkIcon className="w-4 h-4" /> Deep Links
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'health' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Ecosystem Status</h2>
            {healthStats.map(stat => (
              <div key={stat.app} className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-zinc-400" />
                  <div>
                    <div className="font-bold text-white">{stat.app}</div>
                    <div className="text-xs text-zinc-500">v{stat.version}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{stat.status}</div>
                  <div className="text-xs text-zinc-500">Crash Rate: {stat.crashRate}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white mb-4">Recent Reports</h2>
            {bugs.length === 0 ? (
              <p className="text-zinc-500 text-center py-8">No bug reports found.</p>
            ) : (
              bugs.map(bug => (
                <div key={bug.id} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-1 bg-red-500/10 text-red-400 rounded uppercase">{bug.type}</span>
                    <span className="text-xs text-zinc-500">{new Date(bug.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="font-medium text-white mb-1">{bug.appId} (v{bug.version})</div>
                  <pre className="text-xs text-zinc-400 bg-zinc-900 p-2 rounded overflow-x-auto">
                    {JSON.stringify(bug.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'apk' && (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Upload APK</h3>
            <p className="text-zinc-400 mb-6 text-sm">Distribute signed updates to the ecosystem.</p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-colors">
              Select File
            </button>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Intent Routes</h2>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                + Add Route
              </button>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <div className="font-mono text-sm text-emerald-400 mb-1">simu.browser.open</div>
                <div className="text-xs text-zinc-500">Target: com.simu.browser</div>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Active</span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <div className="font-mono text-sm text-emerald-400 mb-1">simu.nodes.validate</div>
                <div className="text-xs text-zinc-500">Target: com.simu.nodes</div>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
