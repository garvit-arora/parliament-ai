import React from 'react';

export default function PremiumModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      features: [
        "15 Deliberations/month",
        "Standard Reasoning Models",
        "Community Log Access",
        "Public Persistence"
      ],
      cta: "Current Plan",
      featured: false,
      color: "white/20"
    },
    {
      name: "Pro",
      price: "$29",
      period: "Lifetime",
      features: [
        "Infinite Deliberations",
        "Priority Model Access",
        "Private Persona Logic",
        "Deep Research Models (o1)",
        "Advanced Canvas Sync"
      ],
      cta: "Unlock Power",
      featured: true,
      color: "blue-600"
    },
    {
      name: "Assembly",
      price: "$99",
      period: "year",
      features: [
        "Full Team Workspace",
        "Custom API Integration",
        "Governance Audit Trails",
        "Dedicated Cluster Support",
        "Enterprise Security Compliance"
      ],
      cta: "Contact Sales",
      featured: false,
      color: "purple-600"
    }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl">
      <div className="w-full max-w-7xl relative">
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all">
          Close Assembly <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Choose your level of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-black">Sovereignty</span></h2>
          <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px]">Scale your adversarial logic capabilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative group p-10 rounded-[48px] border transition-all duration-500 overflow-hidden ${plan.featured ? 'bg-gradient-to-b from-blue-600/10 to-transparent border-blue-500/30 shadow-[0_40px_100px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20' : 'bg-[#0b0c14] border-white/5 hover:border-white/10'}`}>
              
              {plan.featured && (
                <div className="absolute top-6 right-8 bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-xl">Most Effective</div>
              )}

              <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-6xl font-black ${plan.featured ? 'text-white' : 'text-white/90'}`}>{plan.price}</span>
                  <span className="text-white/20 text-xs font-black uppercase tracking-widest">{plan.period ? `/ ${plan.period}` : ''}</span>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className={`w-2 h-2 rounded-full ${plan.featured ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-white/10'}`} />
                    <span className="text-sm font-medium text-white/60 group-hover/item:text-white transition-colors">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                className={`w-full py-6 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-300 ${plan.featured 
                  ? 'bg-white text-black hover:scale-[1.02] shadow-[0_20px_50px_rgba(255,255,255,0.15)]' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
              >
                {plan.cta}
              </button>

              <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[80px] -z-10 transition-opacity duration-1000 opacity-20 ${plan.featured ? 'bg-blue-600' : 'bg-white/10 opacity-0 group-hover:opacity-10'}`} />
            </div>
          ))}
        </div>
        
        <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Enterprise security. Statistically objective billing. No hidden logic.</p>
      </div>
    </div>
  );
}
