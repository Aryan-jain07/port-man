// src/app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BrainCircuit, Wallet, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [riskProfile, setRiskProfile] = useState("Moderate");

  // Local state initialized with mock data
  const [portfolio, setPortfolio] = useState({
    name: "Tech Growth Core",
    cashBalance: 12450.00,
    totalValue: 84320.50,
    dailyChange: 1420.30,
    dailyChangePercent: 1.71,
    holdings: [
      { ticker: "NVDA", name: "NVIDIA Corp", shares: 12, avgBuyPrice: 820.00, currentPrice: 910.50, allocation: 40 },
      { ticker: "AAPL", name: "Apple Inc.", shares: 35, avgBuyPrice: 172.50, currentPrice: 181.20, allocation: 25 },
      { ticker: "MSFT", name: "Microsoft Corp", shares: 15, avgBuyPrice: 395.00, currentPrice: 415.00, allocation: 20 },
      { ticker: "TSLA", name: "Tesla Inc.", shares: 25, avgBuyPrice: 190.00, currentPrice: 174.50, allocation: 15 }
    ]
  });

  const [aiBrief, setAiBrief] = useState({
    vibe: "Highly Bullish",
    summary: "Your portfolio is surging driven by NVIDIA's strong data center tailwinds. However, your tech concentration risk is high at 85%. Consider rebalancing into defensive sectors before earnings week.",
    bullets: [
      "NVIDIA reached an all-time high, driving 65% of your daily gains.",
      "Tesla remains a drag; production delays drag sentiment to 'Bearish'.",
      "Suggested action: Allocate $2,000 of your cash balance to an Index ETF."
    ]
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to call the FastAPI optimizer backend
  const handleRebalance = async () => {
    setIsOptimizing(true);
    try {
      const payload = {
        holdings: portfolio.holdings.map(h => ({ ticker: h.ticker, shares: h.shares })),
        risk_profile: riskProfile
      };

      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Optimization request failed");

      const data = await response.json();

      if (data.status === "success" && data.recommended_weights) {
        // Map the backend weights back to the frontend state allocations
        const updatedHoldings = portfolio.holdings.map(h => {
          const rawWeight = data.recommended_weights[h.ticker.upper ? h.ticker.upper() : h.ticker] || 0;
          return {
            ...h,
            allocation: Math.round(rawWeight * 100)
          };
        });

        setPortfolio(prev => ({ ...prev, holdings: updatedHoldings }));
        setAiBrief(prev => ({
          ...prev,
          summary: `Portfolio successfully optimized using Modern Portfolio Theory mathematically tailored for a ${riskProfile} risk profile. Allocation weights rebalanced.`
        }));
      }
    } catch (error) {
      console.error("Error optimizing portfolio:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Wealth Co-Pilot</h1>
          <p className="text-slate-400">Real-time optimization and intelligent execution.</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={riskProfile}
            onChange={(e) => setRiskProfile(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-100 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Conservative">Conservative (Min Volatility)</option>
            <option value="Moderate">Moderate (Max Sharpe)</option>
            <option value="Aggressive">Aggressive (High Return)</option>
          </select>
          <Button
            onClick={handleRebalance}
            disabled={isOptimizing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[160px]"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Optimizing...
              </>
            ) : (
              "Rebalance Portfolio"
            )}
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Net Asset Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolio.totalValue.toLocaleString()}</div>
            <p className="text-xs text-emerald-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +${portfolio.dailyChange} ({portfolio.dailyChangePercent}%) today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cash Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolio.cashBalance.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">Available for deployment</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-purple-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">AI Market Vibe</CardTitle>
            <BrainCircuit className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-300">{aiBrief.vibe}</div>
            <p className="text-xs text-slate-400 mt-1">Aggregated sentiment analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Visual Chart Placeholder */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-2 text-white">
          <CardHeader>
            <CardTitle>Asset Weight Matrix</CardTitle>
            <CardDescription className="text-slate-400">Visual comparison of portfolio distribution allocations</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end justify-around gap-2 pt-6">
            {portfolio.holdings.map((stock) => (
              <div key={stock.ticker} className="flex flex-col items-center gap-2 w-full max-w-[60px]">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-md transition-all duration-500 ease-out"
                  style={{ height: `${Math.max(stock.allocation * 2, 8)}px` }}
                />
                <span className="text-xs font-semibold">{stock.ticker}</span>
                <span className="text-[10px] text-slate-400">{stock.allocation}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Briefing Card */}
        <Card className="bg-slate-900 border-slate-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-400" /> Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {aiBrief.summary}
            </p>
            <div className="space-y-2">
              {aiBrief.bullets.map((bullet, idx) => (
                <div key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings Table */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-3 text-white">
          <CardHeader>
            <CardTitle>Current Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Shares</th>
                    <th className="py-3 px-4">Avg Buy</th>
                    <th className="py-3 px-4">Current Price</th>
                    <th className="py-3 px-4 text-right">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((stock) => (
                    <tr key={stock.ticker} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="py-3 px-4 font-semibold">
                        {stock.ticker} <span className="text-xs font-normal text-slate-400 ml-1">{stock.name}</span>
                      </td>
                      <td className="py-3 px-4">{stock.shares}</td>
                      <td className="py-3 px-4">${stock.avgBuyPrice}</td>
                      <td className="py-3 px-4 text-emerald-400">${stock.currentPrice}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                          {stock.allocation}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}