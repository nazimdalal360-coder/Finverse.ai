/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import MarketData from "./MarketData";

import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Shield, 
  Zap, 
  Bell, 
  Settings, 
  Search, 
  PieChart, 
  Activity,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  User,
  Wallet, 
  History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceArea,
  Label
} from 'recharts';
import { cn } from './lib/utils';
import { generateTradingAnalysis } from './services/geminiService';
import { TradingStyle, RiskProfile, UserProfile, MarketAnalysis } from './types';

// Mock data for the chart
const mockChartData = [
  { time: '09:15', price:{livePrice},
  { time: '10:00', price:{livePrice},
  { time: '11:00', price:{livePrice},
  { time: '12:00', price:{livePrice},
  { time: '13:00', price:{livePrice},
  { time: '14:00', price:{livePrice},
  { time: '15:00', price:{livePrice},
  { time: '15:30', price:{livePrice},
];
const sectorData = [
  { 
    name: 'Nifty IT', 
    change:{livePrice}, 
    status: 'Strong', 
    rotation: 'Leading',
    stocks: [
      { symbol: 'TCS', change:{livePrice}, status: 'Bullish' },
      { symbol: 'INFY', change:{livePrice}, status: 'Strong Bullish' },
      { symbol: 'WIPRO', change:{livePrice}, status: 'Neutral' }
    ]
  },
  { 
    name: 'Nifty Bank', 
    change: {livePrice}, 
    status: 'Weak' 
    rotation: 'Lagging'
    stocks: [
      { symbol: 'HDFCBANK', change:{livePrice}, status: 'Bearish' },
      { symbol: 'ICICIBANK', change:{livePrice}, status: 'Neutral' },
      { symbol: 'SBIN', change:{livePrice}, status: 'Weak' }
    ]
  },
  { 
    name: 'Nifty Auto', 
    change:{livePrice}, 
    status: 'Neutral', 
    rotation: 'Improving',
    stocks: [
      { symbol: 'TATAMOTORS', change:{livePrice}, status: 'Strong Bullish' },
      { symbol: 'M&M', change:{livePrice}, status: 'Neutral' },
      { symbol: 'MARUTI', change:{livePrice}, status: 'Weak' }
    ]
  },
  { 
    name: 'Nifty Pharma', 
    change:{livePrice}, 
    status: 'Strong', 
    rotation: 'Leading',
    stocks: [
      { symbol: 'SUNPHARMA', change:{livePrice}, status: 'Strong Bullish' },
      { symbol: 'DRREDDY', change:{livePrice}, status: 'Bullish' },
      { symbol: 'CIPLA', change:{livePrice}, status: 'Neutral' }
    ]
  },
  { 
    name: 'Nifty FMCG', 
    change:{livePrice}, 
    status: 'Neutral', 
    rotation: 'Weakening',
    stocks: [
      { symbol: 'HUL', change:{livePrice}, status: 'Neutral' },
      { symbol: 'ITC', change:{livePrice}, status: 'Bullish' },
      { symbol: 'NESTLEIND', change:{livePrice}, status: 'Neutral' }
    ]
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analysis' | 'backtest' | 'alerts'>('dashboard');
  const [symbol, setSymbol] = useState('NIFTY 50');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysis | null>(null);
  const [backtestEnabled, setBacktestEnabled] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    style: 'Intraday',
    risk: 'Medium',
    capital: 100000,
    experience: 'Intermediate',
    preferredAssets: ['Equities', 'Options'],
    maxDrawdown: 10,
    riskPerTrade: 1,
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'BUY', message: 'NIFTY at 22250 | SL: 22180 | T1: 22350', time: '10 mins ago' },
    { id: 2, type: 'ALERT', message: 'Liquidity Sweep detected in BANKNIFTY near 47500', time: '25 mins ago' },
    { id: 3, type: 'TARGET', message: 'RELIANCE Target 1 Hit! (2950)', time: '1 hour ago' },
  ]);

  const handleAnalyze = async (targetSymbol?: string) => {
    const symbolToAnalyze = targetSymbol || symbol;
    if (!symbolToAnalyze) return;
    
    if (targetSymbol) setSymbol(targetSymbol);
    
    setIsAnalyzing(true);
    setActiveTab('analysis');
    try {
      const result = await generateTradingAnalysis(symbolToAnalyze, userProfile, backtestEnabled);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Profile Modal */}
      <MarketData />
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0f1218] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="text-blue-500" />
                  Institutional Profile Configuration
                </h2>
                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-500 hover:text-white">
                  <RefreshCw size={20} className="rotate-45" />
                </button>
              </div><MarketData />
              
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trading Capital (₹)</span>
                      <input 
                        type="number" 
                        value={userProfile.capital}
                        onChange={(e) => setUserProfile({...userProfile, capital: Number(e.target.value)})}
                        className="w-full mt-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trading Style</span>
                      <select 
                        value={userProfile.style}
                        onChange={(e) => setUserProfile({...userProfile, style: e.target.value as any})}
                        className="w-full mt-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>Scalping</option>
                        <option>Intraday</option>
                        <option>Swing</option>
                        <option>Positional</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Experience Level</span>
                      <select 
                        value={userProfile.experience}
                        onChange={(e) => setUserProfile({...userProfile, experience: e.target.value as any})}
                        className="w-full mt-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                      </select>
                    </label>
                  </div>

                  {/* Risk Management */}
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Risk Profile</span>
                      <div className="flex gap-2 mt-1">
                        {['Low', 'Medium', 'High'].map((r) => (
                          <button
                            key={r}
                            onClick={() => setUserProfile({...userProfile, risk: r as any})}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                              userProfile.risk === r 
                                ? "bg-blue-600 border-blue-500 text-white" 
                                : "bg-[#161b22] border-gray-800 text-gray-500 hover:border-gray-700"
                            )}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Risk/Trade (%)</span>
                        <input 
                          type="number" 
                          value={userProfile.riskPerTrade}
                          onChange={(e) => setUserProfile({...userProfile, riskPerTrade: Number(e.target.value)})}
                          className="w-full mt-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Drawdown (%)</span>
                        <input 
                          type="number" 
                          value={userProfile.maxDrawdown}
                          onChange={(e) => setUserProfile({...userProfile, maxDrawdown: Number(e.target.value)})}
                          className="w-full mt-1 bg-[#161b22] border border-gray-800 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Asset Classes */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Preferred Asset Classes</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Equities', 'Options', 'Futures', 'Crypto', 'Forex', 'Commodities'].map((asset) => (
                      <button
                        key={asset}
                        onClick={() => {
                          const current = userProfile.preferredAssets;
                          const next = current.includes(asset as any) 
                            ? current.filter(a => a !== asset)
                            : [...current, asset as any];
                          setUserProfile({...userProfile, preferredAssets: next});
                        }}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                          userProfile.preferredAssets.includes(asset as any)
                            ? "bg-blue-600/10 border-blue-500 text-blue-400"
                            : "bg-[#161b22] border-gray-800 text-gray-500 hover:border-gray-700"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center",
                          userProfile.preferredAssets.includes(asset as any) ? "bg-blue-500 border-blue-500" : "border-gray-700"
                        )}>
                          {userProfile.preferredAssets.includes(asset as any) && <Zap size={10} className="text-white fill-white" />}
                        </div>
                        {asset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-800 bg-[#161b22]/50 flex justify-end gap-3">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f1218] border-r border-gray-800/50 z-50 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Finverse.Ai
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Market Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Advanced Analysis" 
            active={activeTab === 'analysis'} 
            onClick={() => setActiveTab('analysis')} 
          />
          <NavItem 
            icon={<History size={20} />} 
            label="Backtesting Mode" 
            active={activeTab === 'backtest'} 
            onClick={() => setActiveTab('backtest')} 
          />
          <NavItem 
            icon={<Bell size={20} />} 
            label="Live Alerts" 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')} 
          />
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800/50">
          <div className="bg-[#161b22] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <User size={14} />
              <span>User Profile</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Style</span>
                <span className="text-blue-400 font-medium">{userProfile.style}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Risk</span>
                <span className="text-orange-400 font-medium">{userProfile.risk}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Capital</span>
                <span className="text-green-400 font-medium">₹{userProfile.capital.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={14} />
              Edit Profile
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search Symbol (e.g. NIFTY, RELIANCE, BTC)..." 
                className="w-full bg-[#161b22] border border-gray-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-500">Market Open</span>
            </div>
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Market Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="NIFTY 50" value="22,326.90" change="+1.24%" isUp={true} />
                  <StatCard title="BANK NIFTY" value="47,286.40" change="-0.15%" isUp={false} />
                  <StatCard title="FII Net Flow" value="+₹1,240 Cr" change="Strong" isUp={true} />
                  <StatCard title="Market Sentiment" value="Greed" change="72/100" isUp={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Chart */}
                  <div className="lg:col-span-2 bg-[#0f1218] border border-gray-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold">{symbol} Performance</h3>
                        <p className="text-sm text-gray-500">Real-time institutional flow tracking</p>
                      </div>
                      <div className="flex gap-2">
                        {['1M', '5M', '15M', '1H', 'D'].map(tf => (
                          <button key={tf} className="px-3 py-1 text-xs font-medium rounded-md bg-gray-800 hover:bg-gray-700 transition-colors">
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                          <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                            itemStyle={{ color: '#3b82f6' }}
                          />
                          <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Sector Rotation & Strong Stocks */}
                  <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <PieChart size={20} className="text-blue-500" />
                        Sector Rotation & Institutional Flow
                      </h3>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-md border border-green-500/20 uppercase">Leading</span>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded-md border border-blue-500/20 uppercase">Improving</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectorData.map((sector) => (
                        <div key={sector.name} className="p-4 bg-[#161b22] rounded-2xl border border-gray-800/30 hover:border-blue-500/30 transition-all group">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{sector.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "text-[10px] font-black px-1.5 py-0.5 rounded uppercase",
                                  sector.rotation === 'Leading' ? 'bg-green-500/20 text-green-500' : 
                                  sector.rotation === 'Improving' ? 'bg-blue-500/20 text-blue-500' : 
                                  sector.rotation === 'Weakening' ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'
                                )}>
                                  {sector.rotation}
                                </span>
                                <span className={cn(
                                  "text-xs font-bold",
                                  sector.change > 0 ? 'text-green-500' : 'text-red-500'
                                )}>
                                  {sector.change > 0 ? '+' : ''}{sector.change}%
                                </span>
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-all">
                              {sector.change > 0 ? <TrendingUp size={14} className="text-green-500" /> : <TrendingDown size={14} className="text-red-500" />}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Top Institutional Picks</p>
                            {sector.stocks.map((stock) => (
                              <div key={stock.symbol} className="flex items-center justify-between p-2 bg-[#0a0c10]/50 rounded-lg border border-gray-800/50 hover:border-gray-700 transition-all">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-white">{stock.symbol}</span>
                                  <span className={cn(
                                    "text-[10px] font-medium",
                                    stock.change > 0 ? 'text-green-500' : 'text-red-500'
                                  )}>
                                    {stock.change > 0 ? '+' : ''}{stock.change}%
                                  </span>
                                </div>
                                <button 
                                  onClick={() => handleAnalyze(stock.symbol)}
                                  className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                                >
                                  Analyze <ChevronRight size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* News Sentiment */}
                  <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-orange-500" />
                      AI News Sentiment
                    </h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#161b22] rounded-xl border-l-4 border-green-500">
                        <p className="text-xs font-bold text-green-500 mb-1">BULLISH • 08:45 AM</p>
                        <p className="text-sm font-medium">US Fed hints at potential rate cuts by Q3 2026; Global markets rally.</p>
                      </div>
                      <div className="p-3 bg-[#161b22] rounded-xl border-l-4 border-orange-500">
                        <p className="text-xs font-bold text-orange-500 mb-1">NEUTRAL • 09:12 AM</p>
                        <p className="text-sm font-medium">Oil prices stabilize after OPEC+ meeting; Energy stocks expected to remain sideways.</p>
                      </div>
                      <div className="p-3 bg-[#161b22] rounded-xl border-l-4 border-red-500">
                        <p className="text-xs font-bold text-red-500 mb-1">BEARISH • 10:30 AM</p>
                        <p className="text-sm font-medium">Regulatory concerns rise for major tech firms regarding AI data privacy.</p>
                      </div>
                    </div>
                  </div>

                  {/* Liquidity Heatmap */}
                  <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Shield size={20} className="text-blue-500" />
                      Liquidity Heatmap
                    </h3>
                    <div className="space-y-2">
                      {[
                        { price: '22,450', strength: 85, type: 'Sell Side' },
                        { price: '22,380', strength: 60, type: 'Sell Side' },
                        { price: '22,250', strength: 95, type: 'Buy Side' },
                        { price: '22,180', strength: 40, type: 'Buy Side' },
                      ].map((zone, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-500 w-12">{zone.price}</span>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${zone.strength}%` }}
                              className={cn(
                                "h-full rounded-full",
                                zone.type === 'Buy Side' ? 'bg-green-500/50' : 'bg-red-500/50'
                              )}
                            />
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase",
                            zone.type === 'Buy Side' ? 'text-green-500' : 'text-red-500'
                          )}>{zone.strength}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-4 text-center italic">
                      * High density liquidity detected at 22,250 (Institutional Demand)
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analysis' && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-6xl mx-auto space-y-6"
              >
                <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Activity className="text-blue-500" />
                        Institutional Analysis Engine
                      </h2>
                      <p className="text-gray-500 mt-1">SMC + Volume + Institutional Flow Analysis for {symbol}</p>
                    </div>
                    <button 
                      onClick={() => handleAnalyze()}
                      disabled={isAnalyzing}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                      {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                      {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
                    </button>
                  </div>

                  {isAnalyzing ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-medium">Processing Institutional Data...</p>
                        <p className="text-sm text-gray-500">Scanning Order Blocks, FVG, and Liquidity Zones</p>
                      </div>
                    </div>
                  ) : analysisResult ? (
                    <div className="space-y-8">
                      {/* Recommendation Header */}
                      <div className={cn(
                        "p-6 rounded-2xl border flex items-center justify-between",
                        analysisResult.recommendation.action === 'BUY' ? "bg-green-500/10 border-green-500/30" : 
                        analysisResult.recommendation.action === 'SELL' ? "bg-red-500/10 border-red-500/30" : "bg-gray-500/10 border-gray-500/30"
                      )}>
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                            analysisResult.recommendation.action === 'BUY' ? "bg-green-600" : 
                            analysisResult.recommendation.action === 'SELL' ? "bg-red-600" : "bg-gray-600"
                          )}>
                            {analysisResult.recommendation.action === 'BUY' ? <TrendingUp size={32} /> : 
                             analysisResult.recommendation.action === 'SELL' ? <TrendingDown size={32} /> : <Activity size={32} />}
                          </div>
                          <div>
                            <h3 className="text-3xl font-black tracking-tighter">
                              {analysisResult.recommendation.action} RECOMMENDATION
                            </h3>
                            <p className="text-gray-400 font-medium">
                              Zone: <span className="text-white">{analysisResult.recommendation.priceRange}</span> • 
                              Timeframe: <span className="text-white">{analysisResult.recommendation.timeframe}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confidence Score</p>
                          <p className="text-4xl font-black text-blue-500">{analysisResult.confidenceScore}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Analysis Chart */}
                        <div className="lg:col-span-3 bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BarChart3 size={16} className="text-blue-500" />
                            Institutional Price Action Visualization
                          </h4>
                          <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={mockChartData}>
                                <defs>
                                  <linearGradient id="colorPriceAnalysis" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                  itemStyle={{ color: '#3b82f6' }}
                                />
                                
                                {/* Order Blocks Visualization */}
                                {analysisResult.smc.orderBlocks.map((ob, i) => (
                                  <ReferenceArea 
                                    key={`ob-${i}`}
                                    y1={ob.low} 
                                    y2={ob.high} 
                                    fill="#3b82f6" 
                                    fillOpacity={0.15} 
                                    stroke="#3b82f6"
                                    strokeDasharray="3 3"
                                  >
                                    <Label 
                                      value={ob.label || "Order Block"} 
                                      position="insideLeft" 
                                      fill="#3b82f6" 
                                      fontSize={10} 
                                      fontWeight="bold"
                                    />
                                  </ReferenceArea>
                                ))}

                                {/* FVG Visualization */}
                                {analysisResult.smc.fvg.map((gap, i) => (
                                  <ReferenceArea 
                                    key={`fvg-${i}`}
                                    y1={gap.low} 
                                    y2={gap.high} 
                                    fill="#f97316" 
                                    fillOpacity={0.1} 
                                    stroke="#f97316"
                                    strokeDasharray="2 2"
                                  >
                                    <Label 
                                      value={gap.label || "FVG"} 
                                      position="insideRight" 
                                      fill="#f97316" 
                                      fontSize={10} 
                                      fontWeight="bold"
                                    />
                                  </ReferenceArea>
                                ))}

                                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPriceAnalysis)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex gap-4 mt-4 text-[10px] uppercase font-bold tracking-widest">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/40 rounded" />
                              <span className="text-blue-400">Order Blocks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-orange-500/20 border border-orange-500/40 rounded" />
                              <span className="text-orange-400">Fair Value Gaps</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:col-span-3">
                          {/* SMC Panel */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Shield size={16} className="text-blue-500" />
                              Smart Money Concepts (SMC)
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-xs font-bold text-gray-500 uppercase">Market Structure</span>
                                  <p className={cn(
                                    "text-lg font-bold",
                                    analysisResult.smc.marketStructure === 'Bullish' ? 'text-green-500' : 'text-red-500'
                                  )}>{analysisResult.smc.marketStructure}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-gray-500 uppercase">Trend Shift</span>
                                  <p className="text-lg font-bold text-blue-400">{analysisResult.smc.trendShift}</p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <span className="text-xs font-bold text-gray-500 uppercase">Order Blocks</span>
                                  <ul className="mt-1 space-y-1">
                                    {analysisResult.smc.orderBlocks.map((ob, i) => (
                                      <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full" /> 
                                        {ob.label || 'OB'}: {ob.low} - {ob.high}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-800">
                              <span className="text-xs font-bold text-gray-500 uppercase">Fair Value Gaps (FVG)</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {analysisResult.smc.fvg.map((gap, i) => (
                                  <span key={i} className="px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-xs font-bold">
                                    {gap.label || 'FVG'}: {gap.low} - {gap.high}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Trade Setups */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                              <Zap size={16} className="text-yellow-500" />
                              Execution Setups
                            </h4>
                            {analysisResult.tradeSetups.map((setup, i) => (
                              <div key={i} className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase">
                                    {setup.type}
                                  </span>
                                  <span className="text-xs font-bold text-gray-500">RR {setup.rr}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Entry</span>
                                    <p className="text-lg font-bold text-white">{setup.entry}</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Stop Loss</span>
                                    <p className="text-lg font-bold text-red-500">{setup.sl}</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Targets</span>
                                    <p className="text-lg font-bold text-green-500">{setup.targets.join(' | ')}</p>
                                  </div>
                                </div>
                                <div className="p-4 bg-black/20 rounded-xl border border-gray-800/50">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Execution Logic</span>
                                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{setup.logic}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Institutional Sidebar */}
                        <div className="space-y-6">
                          <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <BarChart3 size={16} className="text-green-500" />
                              Institutional Data
                            </h4>
                            <div className="space-y-6">
                              <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">FII/DII Flow</span>
                                <p className="text-sm text-gray-300 mt-1">{analysisResult.institutionalData.fiiDii}</p>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-gray-500 uppercase">OI Build-up</span>
                                <p className="text-sm text-gray-300 mt-1">{analysisResult.institutionalData.oiBuildUp}</p>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                                <span className="text-xs font-bold text-gray-500 uppercase">Put-Call Ratio (PCR)</span>
                                <span className="text-xl font-black text-blue-400">{analysisResult.institutionalData.pcr}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">AI Final Bias</h4>
                            <p className="text-4xl font-black tracking-tighter">{analysisResult.finalBias}</p>
                            <p className="text-xs mt-4 opacity-70 leading-relaxed">
                              Based on multi-timeframe confluence and institutional liquidity sweeps.
                            </p>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl">
                      <BarChart3 className="mx-auto text-gray-700 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-400">No analysis generated yet</h3>
                      <p className="text-sm text-gray-600 mt-2">Enter a symbol and click "Generate Analysis" to start</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'backtest' && (
              <motion.div 
                key="backtest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto space-y-6"
              >
                <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                        <History className="text-orange-500" />
                        Strategy Backtesting
                      </h2>
                      <p className="text-gray-500 mt-1">Validate your SMC setups against historical data</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#161b22] p-1 rounded-lg border border-gray-800">
                      <button 
                        onClick={() => setBacktestEnabled(false)}
                        className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", !backtestEnabled ? "bg-gray-800 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}
                      >
                        Live
                      </button>
                      <button 
                        onClick={() => setBacktestEnabled(true)}
                        className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", backtestEnabled ? "bg-orange-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-300")}
                      >
                        Backtest
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-[#161b22] rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 uppercase font-bold">Historical Win Rate</p>
                      <p className="text-2xl font-bold text-green-500">74.2%</p>
                    </div>
                    <div className="p-4 bg-[#161b22] rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 uppercase font-bold">Avg Risk:Reward</p>
                      <p className="text-2xl font-bold text-blue-500">1:3.4</p>
                    </div>
                    <div className="p-4 bg-[#161b22] rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 uppercase font-bold">Max Drawdown</p>
                      <p className="text-2xl font-bold text-red-500">8.5%</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Recent Backtest Runs</h4>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-4 bg-[#161b22]/50 hover:bg-[#161b22] transition-colors rounded-xl border border-gray-800/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="text-green-500" size={20} />
                          </div>
                          <div>
                            <p className="font-bold">NIFTY SMC Breakout</p>
                            <p className="text-xs text-gray-500">Mar 20 - Mar 30, 2026 • 15m Timeframe</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-500 font-bold">+₹24,500</p>
                          <p className="text-xs text-gray-500">12 Trades • 9 Win</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div 
                key="alerts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-2xl mx-auto space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Bell className="text-blue-500" />
                    Live Trade Alerts
                  </h2>
                  <span className="text-xs text-gray-500">Last updated: Just now</span>
                </div>
                
                {alerts.map((alert) => (
                  <motion.div 
                    key={alert.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden group"
                  >
                    <div className={cn(
                      "w-1 h-full absolute left-0 top-0",
                      alert.type === 'BUY' ? 'bg-green-500' : alert.type === 'TARGET' ? 'bg-blue-500' : 'bg-orange-500'
                    )} />
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      alert.type === 'BUY' ? 'bg-green-500/10 text-green-500' : alert.type === 'TARGET' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                    )}>
                      {alert.type === 'BUY' ? <TrendingUp size={24} /> : alert.type === 'TARGET' ? <Zap size={24} /> : <AlertTriangle size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">{alert.type} SIGNAL</span>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                      <p className="text-lg font-bold mt-1">{alert.message}</p>
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-xs font-medium transition-colors">View Chart</button>
                        <button className="px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md text-xs font-medium transition-colors">Execute Trade</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Status Bar */}
        <footer className="h-10 border-t border-gray-800/50 bg-[#0f1218] px-6 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              AI Core: Online
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Data Source: Institutional API
            </span>
          </div>
          <div>
            © 2026 Finverse.Ai • Confidential Institutional Access
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        active 
          ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm" 
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
      )}
    >
      <span className={cn("transition-colors", active ? "text-blue-400" : "text-gray-500")}>
        {icon}
      </span>
      {label}
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </button>
  );
}

function StatCard({ title, value, change, isUp }: { title: string, value: string, change: string, isUp: boolean }) {
  return (
    <div className="bg-[#0f1218] border border-gray-800/50 rounded-2xl p-5 hover:border-gray-700/50 transition-all group">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-xl font-bold tracking-tight">{value}</h4>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full",
          isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </div>
      </div>
    </div>
  );
}
