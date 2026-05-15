"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
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

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const holdings = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    shares: 42,
    avgBuy: 487.32,
    currentPrice: 894.5,
    allocation: 28.4,
    sector: "Technology",
    change: 8.12,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    shares: 85,
    avgBuy: 172.14,
    currentPrice: 211.84,
    allocation: 23.1,
    sector: "Technology",
    change: 1.34,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    shares: 30,
    avgBuy: 381.27,
    currentPrice: 425.62,
    allocation: 19.3,
    sector: "Technology",
    change: 0.87,
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    shares: 18,
    avgBuy: 453.9,
    currentPrice: 528.14,
    allocation: 14.4,
    sector: "Technology",
    change: 2.41,
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    shares: 22,
    avgBuy: 178.43,
    currentPrice: 198.72,
    allocation: 9.2,
    sector: "Consumer Disc.",
    change: -0.63,
  },
  {
    ticker: "BRK.B",
    name: "Berkshire Hathaway",
    shares: 10,
    avgBuy: 351.2,
    currentPrice: 382.5,
    allocation: 5.6,
    sector: "Financials",
    change: 0.22,
  },
];

const sparklineData = [42, 38, 45, 41, 49, 44, 52, 48, 56, 53, 61, 58, 67, 63, 72, 69, 78, 74, 82, 88];

const allocationBars = [
  { label: "Technology", pct: 85.2, color: "from-violet-500 to-indigo-500" },
  { label: "Consumer Disc.", pct: 9.2, color: "from-sky-500 to-cyan-500" },
  { label: "Financials", pct: 5.6, color: "from-emerald-500 to-teal-500" },
];

const insightBullets = [
  {
    icon: "alert",
    text: "Portfolio is 85.2% concentrated in Technology — exceeds recommended 60% sector cap. Consider rebalancing into Healthcare or Energy.",
  },
  {
    icon: "check",
    text: "NVDA earnings beat by 18% last quarter. Position up +83.6% from cost basis — trailing stop-loss recommended at $820.",
  },
  {
    icon: "alert",
    text: "AAPL services revenue growth slowing to 12% YoY vs 22% prior year. Watch for margin compression in Q3.",
  },
  {
    icon: "check",
    text: "META ad revenue reacceleration (+27% YoY) signals strong macro demand recovery. AI infrastructure spend on track.",
  },
];

// ─── SPARKLINE ────────────────────────────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 220;
  const h = 56;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const areaClose = `${w},${h} 0,${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${areaClose}`} fill="url(#sparkGrad)" />
      <polyline points={pts} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* last dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = w;
        const y = h - ((last - min) / range) * h;
        return <circle cx={x} cy={y} r="3" fill="#818cf8" />;
      })()}
    </svg>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [aiPulse, setAiPulse] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [showInsightFull, setShowInsightFull] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleAI = () => {
    setAiPulse(true);
    setTimeout(() => setAiPulse(false), 2000);
  };
  const handleRebalance = () => {
    setRebalancing(true);
    setTimeout(() => setRebalancing(false), 2500);
  };

  const totalValue = holdings.reduce((s, h) => s + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgBuy, 0);
  const totalGainPct = ((totalValue - totalCost) / totalCost) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* ambient glow layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-sky-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/40">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                AI Wealth Co-Pilot
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Live · {time || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAI}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${aiPulse
                  ? "bg-violet-500 text-white scale-95 shadow-lg shadow-violet-500/30"
                  : "bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 border border-violet-500/30 hover:border-violet-400/50"
                }`}
            >
              <Brain className={`w-4 h-4 ${aiPulse ? "animate-spin" : ""}`} />
              Ask AI Co-Pilot
              {aiPulse && (
                <span className="absolute -inset-0.5 rounded-xl bg-violet-500/20 animate-ping" />
              )}
            </button>

            <button
              onClick={handleRebalance}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${rebalancing
                  ? "bg-emerald-500 text-white scale-95"
                  : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 hover:border-emerald-400/50"
                }`}
            >
              <RefreshCw className={`w-4 h-4 ${rebalancing ? "animate-spin" : ""}`} />
              {rebalancing ? "Rebalancing…" : "Rebalance Portfolio"}
            </button>
          </div>
        </header>

        {/* ── METRICS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* NAV Card */}
          <div className="col-span-1 bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Net Asset Value
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +{totalGainPct.toFixed(2)}%
              </span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <Sparkline data={sparklineData} />
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">
                +${(totalValue - totalCost).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
              &nbsp;unrealized gain
            </div>
          </div>

          {/* Cash Balance */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Cash Balance
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-white">$14,302.88</p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Buying Power</span>
                <span className="text-sky-400 font-semibold">$28,605.76</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-1.5 rounded-full" style={{ width: "32%" }} />
              </div>
              <p className="text-xs text-slate-600">32% of portfolio in liquid assets</p>
            </div>
          </div>

          {/* AI Market Vibe */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                AI Market Vibe
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-white">Highly Bullish</p>
              <span className="mb-0.5 text-xs font-bold text-violet-300 bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 rounded-full">
                92 / 100
              </span>
            </div>
            {/* vibe meter */}
            <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-violet-500 to-violet-400"
                style={{ width: "92%" }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/60 rounded-full"
                style={{ left: "92%" }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
            <p className="text-xs text-slate-500">
              Fed pivot signals, strong earnings season, and declining VIX drive sentiment.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Smart Insights */}
          <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-white">Smart Insights</span>
              </div>
              <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI Agent
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-violet-600/50 pl-3">
              Based on Q2 earnings transcripts, macro indicators, and your current positions, here's what your Co-Pilot flagged this morning:
            </p>

            <div className="space-y-3">
              {insightBullets.slice(0, showInsightFull ? 4 : 2).map((b, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {b.icon === "alert" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowInsightFull(!showInsightFull)}
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              {showInsightFull ? (
                <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> Show 2 more insights</>
              )}
            </button>

            {/* Sector allocation bars */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector Breakdown</span>
              </div>
              {allocationBars.map((b) => (
                <div key={b.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{b.label}</span>
                    <span className="text-slate-300 font-semibold">{b.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${b.color} transition-all duration-700`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 flex gap-2 items-start">
              <Shield className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300/80">
                <span className="font-semibold text-amber-300">Concentration Risk:</span> Your tech exposure is 25% above the optimal threshold. AI recommends trimming NVDA by ~8 shares.
              </p>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur border border-slate-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-white">Current Holdings</span>
                <span className="text-xs text-slate-600">({holdings.length} positions)</span>
              </div>
              <span className="text-xs text-slate-500">
                Total Cost Basis: ${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {["Ticker", "Shares", "Avg. Buy", "Mkt. Price", "Gain / Loss", "Allocation"].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-semibold uppercase tracking-widest text-slate-600 pb-3 px-2 first:pl-0 last:pr-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {holdings.map((h) => {
                    const gain = ((h.currentPrice - h.avgBuy) / h.avgBuy) * 100;
                    const isUp = gain >= 0;
                    return (
                      <tr
                        key={h.ticker}
                        className="group hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Ticker */}
                        <td className="py-3.5 px-2 pl-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border border-slate-700/50 text-[10px] font-black text-slate-300">
                              {h.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{h.ticker}</p>
                              <p className="text-[10px] text-slate-600 truncate max-w-[90px]">{h.name}</p>
                            </div>
                          </div>
                        </td>

                        {/* Shares */}
                        <td className="py-3.5 px-2">
                          <span className="text-xs font-semibold text-slate-300">{h.shares}</span>
                        </td>

                        {/* Avg Buy */}
                        <td className="py-3.5 px-2">
                          <span className="text-xs text-slate-400">${h.avgBuy.toFixed(2)}</span>
                        </td>

                        {/* Current Price */}
                        <td className="py-3.5 px-2">
                          <div>
                            <span className="text-xs font-semibold text-white">${h.currentPrice.toFixed(2)}</span>
                            <span
                              className={`ml-1.5 text-[10px] font-semibold ${h.change >= 0 ? "text-emerald-400" : "text-red-400"
                                }`}
                            >
                              {h.change >= 0 ? "+" : ""}{h.change}%
                            </span>
                          </div>
                        </td>

                        {/* Gain / Loss */}
                        <td className="py-3.5 px-2">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${isUp
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                              }`}
                          >
                            {isUp ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {isUp ? "+" : ""}{gain.toFixed(1)}%
                          </div>
                        </td>

                        {/* Allocation pill */}
                        <td className="py-3.5 px-2 pr-0">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 max-w-[60px] h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                style={{ width: `${(h.allocation / 30) * 100}%` }}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${h.allocation > 20
                                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                                  : h.allocation > 10
                                    ? "bg-sky-500/15 text-sky-300 border border-sky-500/20"
                                    : "bg-slate-700/50 text-slate-400 border border-slate-700"
                                }`}
                            >
                              {h.allocation}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
                  Heavy (≥20%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                  Medium (10–20%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
                  Light (&lt;10%)
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Portfolio Value:</span>
                <span className="font-bold text-white text-sm">
                  ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{totalGainPct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="text-center text-[11px] text-slate-700 pb-2">
          AI Wealth Co-Pilot · For demonstration purposes only · Not financial advice ·{" "}
          <span className="text-slate-600">Data simulated</span>
        </footer>
      </div>
    </div>
  );
}