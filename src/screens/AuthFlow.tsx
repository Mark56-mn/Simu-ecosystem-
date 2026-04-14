import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Shield, Fingerprint, Users } from 'lucide-react';
import { enableBiometric } from '../modules/auth';

export const AuthFlow = () => {
  const { hasWallet, login, setup } = useAuth();
  const [pin, setPin] = useState('');
  const [step, setStep] = useState(hasWallet ? 'login' : 'setup');

  const handleSetup = async () => {
    if (pin.length === 4) await setup(pin);
  };

  const handleLogin = async () => {
    const success = await login(pin);
    if (!success) alert('Invalid PIN');
  };

  const handleBio = async () => {
    const success = await enableBiometric();
    if (success) {
      await login();
    } else {
      alert('Biometric failed or unavailable');
    }
  };

  if (step === 'recovery') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm text-center">
          <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Social Recovery</h1>
          <p className="text-zinc-400 mb-6 text-sm">Have 2 of your 3 trusted contacts scan your recovery QR code to reset your PIN.</p>
          <div className="w-48 h-48 bg-white mx-auto rounded-xl mb-6 flex items-center justify-center">
            <span className="text-zinc-500 font-mono text-xs">QR CODE</span>
          </div>
          <button onClick={() => setStep('login')} className="text-zinc-500">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm text-center">
        <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-white mb-6">SIMU {hasWallet ? 'Login' : 'Setup'}</h1>
        
        <input 
          type="password" 
          maxLength={4} 
          value={pin} 
          onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl mb-6 text-center text-3xl tracking-[1em] font-mono focus:outline-none focus:border-emerald-500"
          placeholder="****"
        />

        {hasWallet ? (
          <div className="space-y-3">
            <button onClick={handleLogin} disabled={pin.length !== 4} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors">
              Use PIN
            </button>
            <button onClick={handleBio} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Fingerprint className="w-5 h-5" /> Use Biometric
            </button>
            <button onClick={() => setStep('recovery')} className="text-zinc-500 text-sm mt-4 hover:text-white">Forgot PIN?</button>
          </div>
        ) : (
          <button onClick={handleSetup} disabled={pin.length !== 4} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-xl disabled:opacity-50 transition-colors">
            Create PIN
          </button>
        )}
      </div>
    </div>
  );
};
