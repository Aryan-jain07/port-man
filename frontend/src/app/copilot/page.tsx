"use client";

import { useState } from "react";
import { Brain, Sparkles, Send, ArrowLeft, ShieldAlert } from "lucide-react";

export default function CopilotChat() {
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Welcome to your Wealth Co-Pilot terminal. Ask me anything regarding your volatility indices, sector concentrations, or specific ticker positions." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Setup an internal simulated message array chunk for responsive presentation metrics
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "assistant",
        text: "Analyzing your matrix allocations... Structural tech cluster concentration remains at 85.2%. To reduce your portfolio variance footprint, I recommend migrating 5% weight allocations into low-beta assets."
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 flex flex-col justify-between max-w-screen-xl mx-auto">
      {/* Navigation Header */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"><ArrowLeft className="w-4 h-4 text-slate-400" /></a>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2"><Brain className="w-5 h-5 text-violet-400" /> AI Agent Terminal</h1>
            <p className="text-xs text-slate-500">Natural Language Portfolio Control</p>
          </div>
        </div>
        <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider">Active</span>
      </header>

      {/* Chat History View Box */}
      <div className="flex-1 my-6 overflow-y-auto bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 space-y-4 max-h-[60vh]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-md p-4 rounded-xl text-xs leading-relaxed shadow-lg ${m.sender === "user" ? "bg-violet-600 text-white rounded-br-none" : "bg-slate-900 border border-slate-800/80 text-slate-300 rounded-bl-none"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Chat Input Dock */}
      <div className="flex gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Rebalance my portfolio to minimize volatility..."
          className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none px-2"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
