"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Wallet,
  Brain,
  RefreshCw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Activity,
  Clock,
  DollarSign,
} from "lucide-react";

// Initial seed arrays
const INITIAL_HOLDINGS = [
  { ticker: "NVDA", name: "NVIDIA Corporation", shares: 42, avgBuy: 487.32, currentPrice: 894.50, allocation: 28.4, sector: "Technology", change: 8.12 },
  { ticker: "AAPL", name: "Apple Inc.", shares: 85, avgBuy: 172.14, currentPrice: 211.84, allocation: 23.1, sector: "Technology", change: 1.34 },
  { ticker: "MSFT", name: "Microsoft Corp.", shares: 30, avgBuy: 381.27, currentPrice: 425.62, allocation: 19.3, sector: "Technology", change: 0.87 },
  { ticker: "META", name: "Meta Platforms", shares: 18, avgBuy: 453.90, currentPrice: 528.14, allocation: 14.4, sector: "Technology", change: 2.41 },
  { ticker: "AMZN", name: "Amazon.com Inc.", shares: 22, avgBuy: 178.43, currentPrice: 198.72, allocation: 9.2, sector: "Consumer Disc.", change: -0.63 },
  { ticker: "BRK.B", name: "Berkshire Hathaway", shares: 10, avgBuy: 351.20, currentPrice: 382.50, allocation: 5.6, sector: "Financials", change: 0.22 },
];

const sparklineData = [42, 38, 45, 41, 49, 44, 52, 48, 56, 53, 61, 58, 67, 63, 72, 69, 78, 74, 82, 88];

const initialInsights = [
  { icon: "alert", text: "Portfolio is 85.2% concentrated in Technology — exceeds recommended 60% sector cap. Consider rebalancing into Healthcare or Energy." },
  { icon: "check", text: "NVDA earnings beat by 18% last quarter. Position up +83.6% from cost basis — trailing stop-loss recommended at $820." },
  { icon: "alert", text: "AAPL services revenue growth slowing to 12% YoY vs 22% prior year. Watch for margin compression in Q3." },
  { icon: "check", text: "META ad revenue reacceleration (+27% YoY) signals strong macro demand recovery. AI infrastructure spend on track." },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 220;
  const h = 56;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [aiPulse, setAiPulse] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [showInsightFull, setShowInsightFull] = useState(false);
  const [time, setTime] = useState("");
  const [riskProfile, setRiskProfile] = useState("Moderate");

  // Move arrays to active states so re-rendering modifies the interface layout
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
  const [insights, setInsights] = useState(initialInsights);
  const [aiVibeSummary, setAiVibeSummary] = useState(
    "Based on Q2 earnings transcripts, macro indicators, and your current positions, here's what your Co-Pilot flagged this morning:"
  );

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleAI = () => {
    setAiPulse(true);
    setTimeout(() => setAiPulse(false), 1500);
  };

  const handleRebalance = async () => {
    setRebalancing(true);
    try {
      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holdings: holdings.map(h => ({ ticker: h.ticker, shares: h.shares })),
          risk_profile: riskProfile
        })
      });

      if (!response.ok) throw new Error("API network layer rejection.");
      const data = await response.json();

      if (data.status === "success" && data.recommended_weights) {
        // Enforce safe uppercase mapping parameters
        const revisedHoldings = holdings.map(h => {
          const matchingKey = h.ticker.toUpperCase();
          const rawWeight = data.recommended_weights[matchingKey] ?? (h.allocation / 100);
          return {
            ...h,
            allocation: parseFloat((rawWeight * 100).toFixed(1))
          };
        });
        
        setHoldings(revisedHoldings);
        setAiVibeSummary(`Portfolio rebalanced successfully via standard algorithmic matrix models utilizing your requested ${riskProfile} risk framework constraints.`);
        setInsights([
          { icon: "check", text: "Mathematical optimization successfully converged. Volatility metrics re-weighted based on historical asset covariance." },
          ...initialInsights.slice(1)
        ]);
      }
    } catch (error) {
      console.error("Rebalancing connectivity pipeline issue:", error);
    } finally {
      setRebalancing(false);
    }
  };

  const totalValue = holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgBuy, 0);
  const totalGainPct = ((totalValue - totalCost) / totalCost) * 100;

  // Deriving breakdown parameters safely from active allocations
  const techPct = parseFloat(holdings.filter(h => h.sector === "Technology").reduce((sum, h) => sum + h.allocation, 0).toFixed(1));
  const consumerPct = parseFloat(holdings.filter(h => h.sector === "Consumer Disc.").reduce((sum, h) => sum + h.allocation, 0).toFixed(1));
  const financialPct = parseFloat(holdings.filter(h => h.sector === "Financials").reduce((sum, h) => sum + h.allocation, 0).toFixed(1));

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-violet-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">AI Wealth Co-Pilot</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Live · {time || "—"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={riskProfile} 
              onChange={(e) => setRiskProfile(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer"
            >
              <option value="Conservative">Conservative (Min Volatility)</option>
              <option value="Moderate">Moderate (Max Sharpe)</option>
              <option value="Aggressive">Aggressive (High Return)</option>
            </select>

            <button onClick={handleAI} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${aiPulse ? "bg-violet-500 text-white scale-95" : "bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30"}`}>
              <Brain className={`w-4 h-4 ${aiPulse ? "animate-spin" : ""}`} /> Ask AI Co-Pilot
            </button>

            <button onClick={handleRebalance} disabled={rebalancing} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${rebalancing ? "bg-emerald-500 text-white scale-95" : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"}`}>
              <RefreshCw className={`w-4 h-4 ${rebalancing ? "animate-spin" : ""}`} /> {rebalancing ? "Calculating..." : "Rebalance Portfolio"}
            </button>
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Net Asset Value</span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" />+{totalGainPct.toFixed(2)}%</span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <Sparkline data={sparklineData} />
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400 font-semibold">+${(totalValue - totalCost).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span> unrealized gain
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Cash Balance</span>
              <Wallet className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">$14,302.88</p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500"><span>Buying Power</span><span className="text-sky-400 font-semibold">$28,605.76</span></div>
              <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-1.5 rounded-full" style={{ width: "32%" }} /></div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">AI Market Vibe</span>
              <Activity className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex items-end gap-3"><p className="text-2xl font-bold text-white">Highly Bullish</p><span className="text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">92 / 100</span></div>
            <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-violet-500 to-violet-400" style={{ width: "92%" }} />
            </div>
            <p className="text-xs text-slate-500">Fed rates pivot indicators and solid earnings reports drive positive baseline equity flows.</p>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Smart Insights */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-violet-400" />Smart Insights</span>
              <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full font-bold">AI AGENT</span>
            </div>
            <p className="text-xs text-slate-400 border-l-2 border-violet-600/50 pl-3 leading-relaxed">{aiVibeSummary}</p>
            
            <div className="space-y-3 pt-2">
              {insights.slice(0, showInsightFull ? 4 : 2).map((b, i) => (
                <div key={i} className="flex gap-2.5 items-start">
                  {b.icon === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />}
                  <p className="text-xs text-slate-400 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowInsightFull(!showInsightFull)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
              {showInsightFull ? "Show less info" : `View ${insights.length - 2} more insights`}
            </button>

            {/* Breakdown progress matrix */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Live Sector Allocations</span>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-slate-400">Technology</span><span className="text-slate-300 font-semibold">{techPct}%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500" style={{ width: `${techPct}%` }} /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-slate-400">Consumer Disc.</span><span className="text-slate-300 font-semibold">{consumerPct}%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500" style={{ width: `${consumerPct}%` }} /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs"><span className="text-slate-400">Financials</span><span className="text-slate-300 font-semibold">{financialPct}%</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${financialPct}%` }} /></div>
              </div>
            </div>
          </div>

          {/* Holdings Layout */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800"><span className="text-sm font-bold text-white">Current Asset Allocations</span><span className="text-xs text-slate-500">Total Positions: {holdings.length}</span></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="pb-3 px-2 pl-0">Asset</th>
                    <th className="pb-3 px-2">Shares</th>
                    <th className="pb-3 px-2">Avg Buy</th>
                    <th className="pb-3 px-2">Mkt Price</th>
                    <th className="pb-3 px-2 text-right">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {holdings.map((h) => (
                    <tr key={h.ticker} className="hover:bg-slate-800/10 transition-colors">
                      <td className="py-3 px-2 pl-0 font-bold text-white">{h.ticker} <span className="text-[10px] text-slate-500 font-normal block">{h.name}</span></td>
                      <td className="py-3 px-2 text-slate-300">{h.shares}</td>
                      <td className="py-3 px-2 text-slate-400">${h.avgBuy.toFixed(2)}</td>
                      <td className="py-3 px-2 text-emerald-400 font-semibold">${h.currentPrice.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right"><span className="bg-slate-800 border border-slate-700 text-xs font-bold px-2 py-0.5 rounded-full text-violet-300">{h.allocation}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
