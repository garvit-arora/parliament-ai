import React, { useState } from 'react';
import { Sliders, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

export default function BiasFixer() {
  const [fairness, setFairness] = useState(62);
  const [params, setParams] = useState({
    gender: 40,
    age: 20,
    location: 80,
    history: 50
  });

  const handleSlider = (key, val) => {
    setParams(prev => ({ ...prev, [key]: val }));
    // Simulate fairness improvement logic
    setFairness(Math.min(98, 50 + (Object.values(params).reduce((a, b) => a + b, 0) / 10)));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8 md:p-20 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-3 text-purple-500 font-bold text-[10px] uppercase tracking-widest mb-4">
            <Sliders size={16} />
            Bias Fixer 1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6">What-If Engine.</h1>
          <p className="text-white/40 text-xl max-w-2xl">Tune your model's neural weights to observe real-time fairness outcomes. Fix discrimination before it occurs.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Controls */}
          <div className="space-y-12">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-10">Neural Parameter Weights</h4>
              <div className="space-y-12">
                {Object.keys(params).map((key) => (
                  <div key={key} className="space-y-6">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>Attribute: {key}</span>
                      <span className="text-purple-500">{params[key]}.00%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={params[key]}
                      onChange={(e) => handleSlider(key, parseInt(e.target.value))}
                      className="w-full accent-purple-500 bg-white/5 h-1 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
              <RefreshCw size={14} />
              Reset All weights
            </button>
          </div>

          {/* Outcome Preview */}
          <div className="relative">
            <div className="sticky top-20 p-12 rounded-[50px] bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-12">Projected Fairness Score</div>
               
               <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                    <circle 
                      cx="128" 
                      cy="128" 
                      r="120" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      className="text-purple-500 transition-all duration-1000" 
                      strokeDasharray="753.6" 
                      strokeDashoffset={753.6 * (1 - fairness / 100)} 
                    />
                  </svg>
                  <div className="text-7xl font-bold tracking-tighter">{fairness}%</div>
               </div>

               <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full ${fairness > 80 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} text-[10px] font-bold uppercase tracking-widest mb-12`}>
                  {fairness > 80 ? <CheckCircle2 size={14} /> : <Zap size={14} />}
                  {fairness > 80 ? 'Equitable Decision Zone' : 'Potential Bias Risk'}
               </div>

               <button className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-purple-500/20">Apply Neural Mitigation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
