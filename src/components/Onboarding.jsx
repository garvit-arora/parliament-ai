import React, { useState } from 'react';

export default function Onboarding({ onComplete, user }) {
  const [step, setStep] = useState(1);

  const steps = [
    {
      title: "The Adversarial Mandate",
      desc: "Parliament isn't a chatbot. It's a structured deliberation engine. We pit multiple models against each other to find the absolute truth.",
      icon: "/logo.png"
    },
    {
      title: "Hierarchical Verification",
      desc: "Your prompt passes through 4 layers: Deliberation, Synthesis, Auditing, and Final Arbitration. Biases are purged at every step.",
      icon: "⚖️"
    },
    {
      title: "The Logic Feed",
      desc: "New prompts in a session stack vertically. You can watch the entire evolution of logic from the first query to the final conclusion.",
      icon: "⛓️"
    }
  ];

  return (
    <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center p-10 font-sans">
      <div className="max-w-xl w-full text-center">
        {steps[step-1].icon.startsWith('/') ? (
           <img src={steps[step-1].icon} className="w-32 h-32 object-contain mx-auto mb-12 animate-pulse-slow" alt="" />
        ) : (
           <div className="text-[120px] mb-12 animate-bounce-slow">{steps[step-1].icon}</div>
        )}
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ea3a5b] mb-4">Protocol Phase 0{step}</div>
        <h1 className="text-4xl font-black text-white mb-6 tracking-tighter transition-all">{steps[step-1].title}</h1>
        <p className="text-white/40 text-lg leading-relaxed mb-16 font-medium">{steps[step-1].desc}</p>
        
        <div className="flex flex-col gap-4">
           {step < 3 ? (
             <button 
               onClick={() => setStep(step + 1)}
               className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-2xl"
             >
                Continue Protocol
             </button>
           ) : (
             <button 
               onClick={onComplete}
               className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.3)]"
             >
                Enter the Assembly
             </button>
           )}
           <div className="flex justify-center gap-2 mt-8">
              {[1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'bg-white/10'}`} />)}
           </div>
        </div>
      </div>
    </div>
  );
}
