import React, { useState } from 'react';
import { Shield, UserCog, CheckCircle, Bug } from 'lucide-react';
import { verifyPin } from '../modules/auth';

export default function Settings() {
  const [agentMode, setAgentMode] = useState(localStorage.getItem('agent_mode') === 'true');
  const [forceUssd, setForceUssd] = useState(localStorage.getItem('force_ussd') === 'true');
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleAgentMode = async () => {
    if (agentMode) {
      setAgentMode(false);
      localStorage.setItem('agent_mode', 'false');
    } else {
      setPinPrompt(true);
    }
  };

  const handleForceUssdToggle = () => {
    const newVal = !forceUssd;
    setForceUssd(newVal);
    localStorage.setItem('force_ussd', newVal ? 'true' : 'false');
  };

  const confirmPin = async () => {
    setLoading(true);
    const valid = await verifyPin(pin);
    setLoading(false);
    if (valid) {
      setAgentMode(true);
      localStorage.setItem('agent_mode', 'true');
      setPinPrompt(false);
      setPin('');
      // Force reload to show agent tab if needed, or handle via state
      window.dispatchEvent(new Event('storage'));
    } else {
      alert('Invalid PIN');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agent Mode</h2>
              <p className="text-sm text-zinc-400">Enable cash-in/out features for verified agents.</p>
            </div>
          </div>
          <button 
            onClick={toggleAgentMode}
            className={`w-14 h-8 rounded-full transition-colors relative ${agentMode ? 'bg-emerald-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${agentMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Bug className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Force USSD Fallback</h2>
              <p className="text-sm text-zinc-400">Route receive flows via 6-digit code</p>
            </div>
          </div>
          <button 
            onClick={handleForceUssdToggle}
            className={`w-14 h-8 rounded-full transition-colors relative ${forceUssd ? 'bg-emerald-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${forceUssd ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {pinPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm text-center">
            <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">Enter PIN</h2>
            <p className="text-zinc-400 mb-6 text-sm">Verify your identity to enable Agent Mode.</p>
            
            <input 
              type="password" 
              maxLength={4} 
              value={pin} 
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl mb-6 text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:border-emerald-500"
              placeholder="****"
            />
            
            <div className="flex gap-4">
              <button 
                onClick={() => { setPinPrompt(false); setPin(''); }}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPin}
                disabled={pin.length !== 4 || loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
