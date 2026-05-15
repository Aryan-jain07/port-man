// src/lib/mockData.ts

export interface StockHolding {
  ticker: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  allocation: number; // percentage
}

export const mockPortfolio = {
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
  ] as StockHolding[],
  chartData: [
    { date: "Mon", value: 81200 },
    { date: "Tue", value: 82100 },
    { date: "Wed", value: 81900 },
    { date: "Thu", value: 82900 },
    { date: "Fri", value: 84320.50 }
  ]
};

export const mockAiBrief = {
  vibe: "Highly Bullish",
  summary: "Your portfolio is surging driven by NVIDIA's strong data center tailwinds. However, your tech concentration risk is high at 85%. Consider rebalancing into defensive sectors before earnings week.",
  bullets: [
    "NVIDIA reached an all-time high, driving 65% of your daily gains.",
    "Tesla remains a drag; production delays drag sentiment to 'Bearish'.",
    "Suggested action: Allocate $2,000 of your cash balance to an Index ETF."
  ]
};