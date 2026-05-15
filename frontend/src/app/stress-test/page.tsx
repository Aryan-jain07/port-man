"use client";

import { useState } from "react";
import { ShieldAlert, ArrowLeft, Flame, TrendingDown, RefreshCw } from "lucide-react";

export default function StressTest() {
  const [simulation, setSimulation] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-screen-xl mx-auto space-y-6">
      <header className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <a href="/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"><ArrowLeft className="w-4 h-4 text-slate-400" /></a>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-500" /> Macro Stress Simulator</h1>
          <p className="text-xs text-slate-500">Black Swan System Backtesting Matrix</p>
        </div>
      </header>

      {/* Macro Scenario Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setSimulation("crash")} className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left transition-all space-y-2 group">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform"><Flame className="w-4 h-4" /></div>
          <h3 className="text-sm font-bold text-white">2008 Liquidity Crisis</h3>
          <p className="text-xs text-slate-500">Simulate systemic financial freeze parameters and high credit yield spread spikes.</p>
        </button>

        <button onClick={() => setSimulation("inflation")} className="bg-slate-900/50 hover:bg-slate-900 border border-slate-800 p-5 rounded-2xl text-left transition-all space-y-2 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform"><TrendingDown className="w-4 h-4" /></div>
          <h3 className="text-sm font-bold text-white">Hyperinflation Shock</h3>
          <p className="text-xs text-slate-500">Applies steep currency degradation vectors and sudden rate tightening models.</p>
        </button>
      </div>

      {/* Dynamic Results Projection Field */}
      {simulation && (
        <div className="bg-red-950/10 border border-red-950/40 rounded-2xl p-6 mt-4 space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-red-400 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Scenario Projections Loaded</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Applying historical drawdowns to your tech-heavy tech allocation model. Projected systemic drawdown is estimated at <span className="text-red-400 font-bold">-34.2%</span> over a trailing 90-day execution block.</p>
        </div>
      )}
    </div>
  );
}
