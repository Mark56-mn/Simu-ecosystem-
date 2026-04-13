import React, { useState } from 'react';
import { Bug } from 'lucide-react';

export default function BugReport() {
  const [issue, setIssue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!issue.trim()) return;
    try {
      await fetch('/api/beta/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bug_report', deviceId: 'device-123', payload: { issue } })
      });
      setSubmitted(true);
    } catch (e) {
      alert('Failed to submit report');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          <Bug className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Report a Bug</h1>
          <p className="text-zinc-400">Help us improve the SIMU Testnet Beta.</p>
        </div>
      </div>

      {submitted ? (
        <div className="bg-emerald-500/10 text-emerald-400 p-6 rounded-xl border border-emerald-500/20 text-center">
          <p className="font-bold text-lg mb-2">Thank you for your feedback!</p>
          <p className="text-sm opacity-80">Your report has been securely logged to our telemetry server.</p>
          <button onClick={() => { setSubmitted(false); setIssue(''); }} className="mt-4 px-4 py-2 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30 transition-colors">
            Submit Another
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea 
            value={issue} 
            onChange={e => setIssue(e.target.value)} 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white h-40 focus:outline-none focus:border-amber-500 resize-none"
            placeholder="Describe the issue, steps to reproduce, or suggest an improvement..."
          />
          <button 
            onClick={submit} 
            disabled={!issue.trim()}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-4 rounded-xl disabled:opacity-50 transition-colors"
          >
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
}
