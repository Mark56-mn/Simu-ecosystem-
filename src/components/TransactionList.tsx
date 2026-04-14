import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Droplet, RefreshCw } from 'lucide-react';

export const TransactionList = ({ transactions, onRefresh, refreshing }: any) => {
  const getIcon = (type: string) => {
    if (type === 'faucet') return <Droplet className="w-5 h-5 text-blue-400" />;
    if (type === 'credit') return <ArrowDownLeft className="w-5 h-5 text-emerald-400" />;
    return <ArrowUpRight className="w-5 h-5 text-white" />;
  };

  const getBadge = (status: string) => {
    switch (status) {
      case 'provisional': return <span className="text-[#FFC107] bg-[#FFC107]/10 px-2 py-1 rounded text-xs border border-[#FFC107]/20" title="Pending sync">🟡 Provisional</span>;
      case 'confirmed': return <span className="text-[#00A86B] bg-[#00A86B]/10 px-2 py-1 rounded text-xs border border-[#00A86B]/20" title="Validated">🟢 Confirmed</span>;
      case 'rolled_back': return <span className="text-[#E53935] bg-[#E53935]/10 px-2 py-1 rounded text-xs border border-[#E53935]/20" title="Conflict - funds reverted">🔴 Rolled Back</span>;
      default: return <span className="text-zinc-500 bg-zinc-800 px-2 py-1 rounded text-xs border border-zinc-700">⚪ Unknown</span>;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-zinc-400">Recent Transactions</h2>
        <button onClick={onRefresh} disabled={refreshing} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors border border-zinc-800">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
        {transactions.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No transactions yet. Claim faucet or receive SIMU!</p>
        ) : (
          transactions.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className={`text-lg font-bold ${item.type === 'credit' || item.type === 'faucet' ? 'text-emerald-400' : 'text-white'}`}>
                    {item.type === 'credit' || item.type === 'faucet' ? '+' : '-'}{item.amount}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <div className="text-xs font-medium">
                {getBadge(item.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
