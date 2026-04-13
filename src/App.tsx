import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { testConnection } from './lib/supabase';
import { 
  Shield, 
  Cpu, 
  Smartphone, 
  Globe, 
  Activity, 
  Wallet, 
  ArrowRightLeft, 
  Settings as SettingsIcon, 
  Menu,
  X,
  Zap,
  QrCode,
  WifiOff,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Droplet,
  CheckSquare,
  Square,
  UserCog
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import Asset from './pages/Asset';
import BugReport from './pages/BugReport';
import Settings from './pages/Settings';
import AgentScreen from './pages/AgentScreen';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AuthFlow } from './screens/AuthFlow';

const networkData = [
  { time: '00:00', cpuNodes: 1200, mobileNodes: 4500 },
  { time: '04:00', cpuNodes: 1350, mobileNodes: 5200 },
  { time: '08:00', cpuNodes: 1800, mobileNodes: 8900 },
  { time: '12:00', cpuNodes: 2100, mobileNodes: 12400 },
  { time: '16:00', cpuNodes: 2400, mobileNodes: 15600 },
  { time: '20:00', cpuNodes: 1900, mobileNodes: 11200 },
  { time: '24:00', cpuNodes: 1500, mobileNodes: 7800 },
];

type TxStatus = 'Provisional' | 'Confirmed' | 'Rolled Back';

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  status: TxStatus;
  time: string;
}

const initialTransactions: Transaction[] = [
  { id: 'SM-8X92', from: 'Nairobi Hub', to: 'Lagos Node', amount: '45,000 SIMU', status: 'Confirmed', time: '2 mins ago' },
  { id: 'SM-3B11', from: 'Accra Node', to: 'Kigali Hub', amount: '12,500 SIMU', status: 'Confirmed', time: '15 mins ago' },
  { id: 'SM-9C44', from: 'Johannesburg', to: 'Cairo Node', amount: '89,200 SIMU', status: 'Provisional', time: '42 mins ago' },
  { id: 'SM-2A77', from: 'Addis Ababa', to: 'Dakar Node', amount: '3,400 SIMU', status: 'Confirmed', time: '1 hour ago' },
];

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'faucet' | 'infrastructure' | 'assets' | 'bug-report' | 'settings' | 'agent'>('dashboard');
  const [isAgent, setIsAgent] = useState(localStorage.getItem('agent_mode') === 'true');

  useEffect(() => {
    const handleStorage = () => setIsAgent(localStorage.getItem('agent_mode') === 'true');
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!isAuthenticated) {
    return <AuthFlow />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 z-50 transform lg:transform-none transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Globe className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="font-bold text-xl tracking-tight">Simu</span>
          </div>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem 
            icon={<Activity />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
          />
          <NavItem 
            icon={<Smartphone />} 
            label="Mobile Node Simulator" 
            active={activeTab === 'simulator'} 
            onClick={() => { setActiveTab('simulator'); setIsSidebarOpen(false); }}
          />
          <NavItem 
            icon={<Droplet />} 
            label="Testnet Faucet" 
            active={activeTab === 'faucet'} 
            onClick={() => { setActiveTab('faucet'); setIsSidebarOpen(false); }}
          />
          <NavItem 
            icon={<Wallet />} 
            label="Assets" 
            active={activeTab === 'assets'} 
            onClick={() => { setActiveTab('assets'); setIsSidebarOpen(false); }}
          />
          <NavItem 
            icon={<Cpu />} 
            label="Ang Infrastructure" 
            active={activeTab === 'infrastructure'} 
            onClick={() => { setActiveTab('infrastructure'); setIsSidebarOpen(false); }}
          />
          <NavItem 
            icon={<Shield />} 
            label="Security" 
          />
          <NavItem 
            icon={<AlertTriangle />} 
            label="Bug Report" 
            active={activeTab === 'bug-report'} 
            onClick={() => { setActiveTab('bug-report'); setIsSidebarOpen(false); }}
          />
          {isAgent && (
            <NavItem 
              icon={<UserCog />} 
              label="Agent Mode" 
              active={activeTab === 'agent'} 
              onClick={() => { setActiveTab('agent'); setIsSidebarOpen(false); }}
            />
          )}
          <NavItem 
            icon={<SettingsIcon />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Testnet v0.2</span>
            </div>
            <p className="text-xs text-zinc-400">Hybrid codes & Provisional states active.</p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium hidden sm:block">
              {activeTab === 'dashboard' ? 'Ecosystem Overview' : 
               activeTab === 'simulator' ? 'Mobile Node Simulator (v0.2)' : 
               activeTab === 'faucet' ? 'Testnet Faucet' : 
               'Ang Infrastructure'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ANG INFRA: SECURE
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'simulator' && <SimulatorView />}
          {activeTab === 'faucet' && <FaucetView />}
          {activeTab === 'infrastructure' && <InfrastructureView />}
          {activeTab === 'assets' && <Asset />}
          {activeTab === 'bug-report' && <BugReport />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'agent' && <AgentScreen />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function DashboardView() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Simu Ecosystem</h2>
          <p className="text-zinc-400">The next generation of digital assets for Africa.</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Simu Volume" 
          value="2.4M" 
          trend="+12.5%" 
          icon={<Activity className="w-5 h-5 text-emerald-400" />} 
          delay={0.1}
        />
        <StatCard 
          title="Active Ang Nodes" 
          value="23,400" 
          trend="+8.2%" 
          icon={<Smartphone className="w-5 h-5 text-amber-400" />} 
          delay={0.2}
          subtitle="75% Mobile / 25% CPU"
        />
        <StatCard 
          title="Security Protocol" 
          value="Hybrid v0.2" 
          trend="Optimal" 
          icon={<Shield className="w-5 h-5 text-blue-400" />} 
          delay={0.3}
          subtitle="QR Offline + USSD Online"
        />
      </div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium">Ang Infrastructure Load</h3>
            <p className="text-sm text-zinc-400">Mobile vs CPU nodes over 24 hours</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={networkData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#e4e4e7' }}
              />
              <Area type="monotone" dataKey="mobileNodes" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorMobile)" />
              <Area type="monotone" dataKey="cpuNodes" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

function SimulatorView() {
  const [balance, setBalance] = useState(5000);
  const [amount, setAmount] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [activeCode, setActiveCode] = useState<{qr: string, pin: string | null, expires: number} | null>(null);
  const [redeemInput, setRedeemInput] = useState('');
  const [clockDrift, setClockDrift] = useState(0);
  
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [logs, setLogs] = useState<{msg: string, type: 'info'|'success'|'error'|'warning', time: string}[]>([
    { msg: 'Local encrypted DB initialized.', type: 'info', time: new Date().toLocaleTimeString() }
  ]);

  const addLog = (msg: string, type: 'info'|'success'|'error'|'warning') => {
    setLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleGenerate = () => {
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0 || val > balance) {
      addLog('Invalid amount or insufficient funds.', 'error');
      return;
    }
    
    // Simulate ECDSA signature generation with clock drift
    const adjustedTime = Date.now() + clockDrift;
    const expiry = adjustedTime + 60000; // 60s expiry
    const mockSignature = `sig_${Math.random().toString(36).substring(2, 15)}`;
    const qrData = `SIMU:${val}:${expiry}:${mockSignature}`;
    
    // Hybrid Model: 6-digit PIN only available if online
    let pinData = null;
    if (isOnline) {
      pinData = Math.floor(100000 + Math.random() * 900000).toString();
      addLog(`Generated hybrid code. QR (Offline) + PIN (Online) registered to server.`, 'success');
    } else {
      addLog(`Generated offline QR code. 6-digit PIN disabled (requires connection).`, 'warning');
    }
    
    setBalance(prev => prev - val);
    setActiveCode({ qr: qrData, pin: pinData, expires: expiry });
    setAmount('');
  };

  const handleRedeem = () => {
    if (!redeemInput) return;
    
    // Simulate redemption verification
    if (redeemInput.startsWith('SIMU:')) {
      const parts = redeemInput.split(':');
      const val = parseInt(parts[1]);
      const expiry = parseInt(parts[2]);
      
      const adjustedTime = Date.now() + clockDrift;
      // Clock drift resilience: +15s buffer
      if (adjustedTime > expiry + 15000) {
        addLog('Bearer code expired (even with 15s drift buffer).', 'error');
        return;
      }
      
      setBalance(prev => prev + val);
      
      // Provisional Credit State Machine
      const newTx: Transaction = {
        id: `SM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        from: 'Local Scan',
        to: 'My Wallet',
        amount: `${val.toLocaleString()} SIMU`,
        status: isOnline ? 'Confirmed' : 'Provisional',
        time: 'Just now'
      };
      
      setTransactions(prev => [newTx, ...prev]);
      
      if (isOnline) {
        addLog(`Successfully verified and synced ${val} SIMU. State: Confirmed.`, 'success');
      } else {
        addLog(`Verified offline signature for ${val} SIMU. State: Provisional. Awaiting sync.`, 'warning');
      }
      setRedeemInput('');
    } else if (redeemInput.length === 6 && !isNaN(Number(redeemInput))) {
      // 6-digit PIN redemption
      if (!isOnline) {
        addLog('Cannot redeem 6-digit PIN while offline. Connect to network or use USSD.', 'error');
        return;
      }
      addLog(`Server verified 6-digit PIN. State: Confirmed.`, 'success');
      setRedeemInput('');
    } else {
      addLog('Invalid bearer code format.', 'error');
    }
  };

  const handleSync = () => {
    if (!isOnline) {
      addLog('Cannot sync while offline.', 'error');
      return;
    }
    
    addLog('Syncing with testnet server...', 'info');
    setTimeout(() => {
      setTransactions(prev => prev.map(tx => 
        tx.status === 'Provisional' ? { ...tx, status: 'Confirmed' } : tx
      ));
      addLog('Sync complete. Provisional credits moved to Confirmed.', 'success');
      
      // Simulate clock sync
      if (clockDrift !== 0) {
        setClockDrift(0);
        addLog('Local clock calibrated with server time-token.', 'info');
      }
    }, 1500);
  };

  // Timer for expiry
  useEffect(() => {
    if (!activeCode) return;
    const interval = setInterval(() => {
      const adjustedTime = Date.now() + clockDrift;
      if (adjustedTime > activeCode.expires) {
        setActiveCode(null);
        addLog('Generated code expired. Funds returned to local balance.', 'error');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCode, clockDrift]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-zinc-900 p-6 rounded-2xl border border-zinc-800 gap-4">
        <div>
          <h2 className="text-zinc-400 text-sm font-medium mb-1">Local Encrypted Balance</h2>
          <div className="text-4xl font-bold font-mono tracking-tight">{balance.toLocaleString()} <span className="text-emerald-400 text-2xl">SIMU</span></div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setClockDrift(prev => prev === 0 ? 20000 : 0)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              clockDrift !== 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{clockDrift !== 0 ? 'Drift: +20s' : 'Clock Synced'}</span>
          </button>

          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-sm font-medium">{isOnline ? 'Online (Hybrid)' : 'Offline (QR Only)'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Code */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Generate Bearer Code
          </h3>
          
          {!activeCode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider">Amount to send</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter SIMU amount"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <button 
                onClick={handleGenerate}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
              >
                Generate Code
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="bg-white p-4 rounded-xl">
                <QRCodeSVG value={activeCode.qr} size={160} />
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Voice / SMS PIN</p>
                {activeCode.pin ? (
                  <p className="text-3xl font-mono font-bold tracking-widest text-emerald-400">{activeCode.pin}</p>
                ) : (
                  <p className="text-sm font-medium text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full mt-2">Requires Internet</p>
                )}
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 60, ease: 'linear' }}
                  className="h-full bg-emerald-500"
                />
              </div>
              <p className="text-xs text-zinc-500">Expires in 60 seconds</p>
            </div>
          )}
        </div>

        {/* Redeem Code */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            Redeem Code
          </h3>
          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider">Scan QR or Enter 6-Digit PIN</label>
              <textarea 
                value={redeemInput}
                onChange={(e) => setRedeemInput(e.target.value)}
                placeholder="SIMU:... or 123456"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 font-mono h-24 resize-none"
              />
            </div>
            <button 
              onClick={handleRedeem}
              className="w-full bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold py-3 rounded-lg transition-colors"
            >
              Verify & Redeem
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Ledger */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">Local Ledger</h3>
            <button 
              onClick={handleSync}
              disabled={!isOnline}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isOnline ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              Sync Network
            </button>
          </div>
          <div className="overflow-y-auto max-h-64">
            <table className="w-full text-left border-collapse">
              <tbody className="text-sm">
                {transactions.map((tx, i) => (
                  <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="p-3 font-mono text-zinc-400 text-xs">{tx.id}</td>
                    <td className="p-3 font-medium text-emerald-400">{tx.amount}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'Confirmed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : tx.status === 'Provisional'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local Logs */}
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col">
          <h3 className="text-sm font-medium mb-4 text-zinc-400 uppercase tracking-wider">System Logs</h3>
          <div className="space-y-2 flex-1 overflow-y-auto max-h-48 font-mono text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded bg-zinc-950/50">
                <span className="text-zinc-600 shrink-0">{log.time}</span>
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                {log.type === 'info' && <Activity className="w-4 h-4 text-blue-500 shrink-0" />}
                <span className={
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-emerald-400' : 
                  log.type === 'warning' ? 'text-amber-400' : 
                  'text-zinc-300'
                }>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FaucetView() {
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [tasks, setTasks] = useState({
    onboarding: false,
    firstTransfer: false,
    inviteUser: false
  });

  const handleClaimDaily = () => {
    setClaimedDaily(true);
    // In a real app, this would update the local DB and sync with the server
  };

  const toggleTask = (task: keyof typeof tasks) => {
    setTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center">
        <Droplet className="w-12 h-12 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Testnet Faucet</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Claim mock SIMU to test the network. These tokens have no real-world value and are for testing purposes only.
        </p>

        <button 
          onClick={handleClaimDaily}
          disabled={claimedDaily}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-colors ${
            claimedDaily 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-400 text-zinc-950'
          }`}
        >
          {claimedDaily ? 'Daily Claimed (Come back tomorrow)' : 'Claim 1,000 Test SIMU'}
        </button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h3 className="text-lg font-medium mb-4">Testnet Tasks</h3>
        <div className="space-y-3">
          <TaskItem 
            title="Complete Onboarding" 
            reward="+200 SIMU" 
            completed={tasks.onboarding} 
            onClick={() => toggleTask('onboarding')} 
          />
          <TaskItem 
            title="Make First Transfer" 
            reward="+100 SIMU" 
            completed={tasks.firstTransfer} 
            onClick={() => toggleTask('firstTransfer')} 
          />
          <TaskItem 
            title="Invite a Test User" 
            reward="+300 SIMU" 
            completed={tasks.inviteUser} 
            onClick={() => toggleTask('inviteUser')} 
          />
        </div>
      </div>
    </div>
  );
}

function InfrastructureView() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setStatus(null);
    const result = await testConnection();
    setStatus(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ang Infrastructure</h2>
            <p className="text-zinc-400">Manage database connections and serverless endpoints.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950">
            <h3 className="text-lg font-medium mb-2">Supabase Connection Test</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Verify that your React Native / Web client can successfully connect to the Supabase PostgreSQL database using the Anon Key.
            </p>

            <button 
              onClick={handleTestConnection}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 ${
                loading 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-400 text-zinc-950'
              }`}
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              {loading ? 'Testing Connection...' : 'Test Database Connection'}
            </button>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg border flex items-start gap-3 ${
                  status.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {status.success ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium">{status.success ? 'Connection Successful' : 'Connection Failed'}</p>
                  <p className="text-sm opacity-80 mt-1">{status.message}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ title, reward, completed, onClick }: { title: string, reward: string, completed: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
        completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        {completed ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-zinc-500" />}
        <span className={`font-medium ${completed ? 'text-emerald-400' : 'text-zinc-300'}`}>{title}</span>
      </div>
      <span className="text-sm font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">{reward}</span>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active 
          ? 'bg-zinc-800 text-white' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, icon, delay, subtitle }: { title: string, value: string, trend: string, icon: React.ReactNode, delay: number, subtitle?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
          {icon}
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          {trend}
        </span>
      </div>
      <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {subtitle && <p className="text-xs text-zinc-500 mt-2">{subtitle}</p>}
      
      {/* Decorative background element */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-zinc-800/30 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}

