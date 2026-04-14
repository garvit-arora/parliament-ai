import React from 'react';

export default function LandingPage({ onLoginClick }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#ea3a5b] selection:text-white overflow-x-hidden">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ea3a5b]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ea3a5b] to-[#ff4e6e] flex items-center justify-center font-black text-xl shadow-[0_5px_20px_rgba(234,58,91,0.3)]">P</div>
            <span className="font-bold text-xl tracking-tighter uppercase whitespace-nowrap">AI Parliament</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
            <a href="#logic" className="hover:text-white transition-colors">The Logic</a>
            <a href="#models" className="hover:text-white transition-colors">Models</a>
            <a href="#scaling" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onLoginClick} className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">Sign In</button>
            <button onClick={onLoginClick} className="text-xs font-bold uppercase tracking-[0.15em] bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-all shadow-xl active:scale-95">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          


          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-10 max-w-5xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            TRUTH THROUGH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">CONTRADICTION.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/40 max-w-3xl mb-14 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Parliament is the world’s first adversarial AI orchestration layer. We don't just ask one AI; we force the smartest models on earth into a stateful debate to find the objective truth.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button onClick={onLoginClick} className="group relative bg-[#ea3a5b] hover:bg-[#ff4e6e] text-white font-bold px-12 py-5 rounded-2xl transition-all shadow-[0_15px_60px_-15px_rgba(234,58,91,0.5)] flex items-center gap-3">
              Start The Debate
              <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
            <div className="flex -space-x-4 opacity-60">
               <div className="w-12 h-12 rounded-full border-4 border-[#09090b] bg-[#1a1b23] flex items-center justify-center text-xl">🧠</div>
               <div className="w-12 h-12 rounded-full border-4 border-[#09090b] bg-[#1a1b23] flex items-center justify-center text-xl">🚀</div>
               <div className="w-12 h-12 rounded-full border-4 border-[#09090b] bg-[#1a1b23] flex items-center justify-center text-xl">🐋</div>
               <div className="w-12 h-12 rounded-full border-4 border-[#09090b] bg-[#1a1b23] flex items-center justify-center text-xl">🌩️</div>
            </div>
            <span className="text-xs font-bold text-white/20 uppercase tracking-widest">+ 5 Models Deliberating</span>
          </div>

          {/* Visual Showcase: The Canvas Preview */}
          <div className="mt-32 w-full max-w-6xl relative animate-in fade-in zoom-in-95 duration-1000 delay-500">
             <div className="absolute inset-0 bg-gradient-to-t from-[#ea3a5b]/20 via-transparent to-transparent blur-3xl -z-10" />
             <div className="glass-strong border border-white/10 rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-6 group">
                {/* Mock Flow Canvas Header */}
                <div className="flex items-center justify-between px-6 mb-10">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-white/10" />
                     <div className="w-3 h-3 rounded-full bg-white/10" />
                     <div className="w-3 h-3 rounded-full bg-white/10" />
                   </div>
                   <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">Protocol • Consensus_V4</div>
                   <div className="text-[10px] font-bold text-[#ea3a5b] bg-[#ea3a5b]/10 px-3 py-1 rounded-full">ACTIVE_STREAMING</div>
                </div>
                {/* Visual Pipeline nodes */}
                <div className="p-10 flex flex-wrap lg:flex-nowrap items-center justify-center gap-4 lg:gap-0 relative">
                   <div className="w-32 h-20 glass rounded-2xl flex flex-col items-center justify-center border border-white/5 relative z-10 transition-transform hover:scale-110">
                      <div className="text-[8px] font-black text-white/20 mb-1">INPUT</div>
                      <div className="text-white/60 text-[10px]">User Inquiry</div>
                   </div>
                   <div className="h-[2px] w-12 bg-gradient-to-r from-white/5 via-[#ea3a5b]/40 to-white/5" />
                   <div className="grid grid-cols-1 gap-3 relative">
                      <div className="absolute inset-0 bg-[#ea3a5b]/5 blur-2xl rounded-full" />
                      <div className="w-40 py-3 glass rounded-xl border border-[#ea3a5b]/30 flex items-center gap-3 px-4 relative z-10 transition-all hover:translate-x-2">
                         <span className="text-lg">🧠</span>
                         <div className="text-left"><div className="text-[8px] font-bold opacity-30">TIER 1</div><div className="text-xs font-bold">GPT-4o</div></div>
                      </div>
                      <div className="w-40 py-3 glass rounded-xl border border-white/5 flex items-center gap-3 px-4 relative z-10 transition-all hover:translate-x-2">
                         <span className="text-lg">🚀</span>
                         <div className="text-left"><div className="text-[8px] font-bold opacity-30">TIER 1</div><div className="text-xs font-bold">Grok</div></div>
                      </div>
                      <div className="w-40 py-3 glass rounded-xl border border-white/5 flex items-center gap-3 px-4 relative z-10 transition-all hover:translate-x-2">
                         <span className="text-lg">🐋</span>
                         <div className="text-left"><div className="text-[8px] font-bold opacity-30">TIER 1</div><div className="text-xs font-bold">DeepSeek</div></div>
                      </div>
                   </div>
                   <div className="h-[2px] w-12 bg-gradient-to-r from-white/5 via-[#ea3a5b]/40 to-white/5" />
                   <div className="w-48 py-5 glass-strong rounded-3xl border border-blue-500/40 relative z-10 transition-transform hover:scale-105 shadow-[0_0_50px_rgba(59,130,246,0.1)] text-center">
                      <div className="text-[9px] font-black text-blue-400 mb-2 uppercase tracking-[0.2em]">Tier 3: The Auditor</div>
                      <div className="text-xs font-medium text-white/80 px-4">Detecting Bias Matrix...</div>
                      <div className="mt-3 text-[10px] text-emerald-400 font-bold">99.2% Objective</div>
                   </div>
                   <div className="h-[2px] w-12 bg-gradient-to-r from-white/5 via-[#ea3a5b]/40 to-white/5" />
                   <div className="w-40 py-4 glass rounded-[20px] border border-white/20 flex items-center justify-center relative z-10 bg-white/5">
                      <div className="text-sm font-black italic tracking-tighter">FINAL VERDICT</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </header>

      {/* Logic Breakdown */}
      <section id="logic" className="py-40 border-t border-white/5 bg-[#09090b] relative">
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row gap-20 items-center">
               <div className="flex-1">
                  <div className="text-[#ea3a5b] font-bold text-xs uppercase tracking-[0.3em] mb-6">Built with LangGraph.</div>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-10 leading-[1] text-white">Adversarial by Design.</h2>
                  <p className="text-white/50 text-xl leading-relaxed mb-10 font-light">
                     Most AI systems give the first answer that feels right. Parliament is built differently. We use recursive loops where models audit their peers, forcing reconsiderations until consensus is mathematically logically sound.
                  </p>
                  <div className="space-y-6">
                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl">🛡️</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Bias Erasure</h4>
                           <p className="text-white/40 text-sm">Our "Auditor" node is instructed to perform forensic logic checks, striking down any subjectivity.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 text-xl">⚡</div>
                        <div>
                           <h4 className="font-bold text-lg mb-1">Async Deliberation</h4>
                           <p className="text-white/40 text-sm">Parallel execution across Azure OpenAI and Google clusters ensures speed without compromising consensus.</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 w-full max-w-lg aspect-square glass rounded-[60px] border border-white/5 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-[#ea3a5b]/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="text-9xl group-hover:scale-125 transition-transform duration-700">⚖️</div>
               </div>
            </div>
         </div>
      </section>

      {/* Model Roster */}
      <section id="models" className="py-40 bg-white text-black rounded-[80px] mx-4 my-10 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
              <div className="max-w-2xl">
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">The roster of giants.</h2>
                 <p className="text-black/50 text-xl font-medium">We only recruit the top 0.1% of weights available today.</p>
              </div>
              <button onClick={onLoginClick} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">View Full Spec Sheet</button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { n: 'GPT-4o', p: 'OpenAI', i: '🧠', c: 'Sense Maker' },
                { n: 'Grok-Beta', p: 'xAI', i: '🚀', c: 'Real-time Logic' },
                { n: 'DeepSeek', p: 'DeepSeek', i: '🐋', c: 'Pure Reason' },
                { n: 'Phi-4', p: 'Microsoft', i: '🌩️', c: 'Verification' },
                { n: 'Ministral', p: 'Mistral', i: '🌪️', c: 'Final Arbiter' }
              ].map((m, idx) => (
                <div key={idx} className="p-8 rounded-[40px] border border-black/10 bg-neutral-50 hover:bg-black hover:text-white transition-all duration-500 group shadow-sm">
                   <div className="text-4xl mb-6 group-hover:rotate-12 transition-transform">{m.i}</div>
                   <div className="font-black text-xl mb-1">{m.n}</div>
                   <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-4 group-hover:text-white/60">{m.p}</div>
                   <div className="text-[9px] font-black uppercase tracking-[0.2em] py-2 px-3 bg-black/5 group-hover:bg-white/10 rounded-lg inline-block">{m.c}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-40 relative">
        <div className="max-w-7xl mx-auto px-8">
           <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">Pricing for Precedence</h2>
              <p className="text-white/40 text-xl">Limited access for free thinkers, unlimited for power players.</p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="glass p-16 rounded-[60px] border border-white/5 flex flex-col items-center text-center">
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-white/20 mb-10">THE CITIZEN TIER</div>
                 <div className="text-7xl font-bold mb-4">$0</div>
                 <p className="text-white/40 mb-12 text-lg">Perfect for validating simple claims.</p>
                 <div className="w-full h-[1px] bg-white/5 mb-12" />
                 <ul className="space-y-6 mb-16 text-left w-full">
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> 15 Verified Inquiries per account</li>
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> Full access to the Flow Canvas</li>
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> Google Login & Persistence</li>
                 </ul>
                 <button onClick={onLoginClick} className="w-full py-5 rounded-3xl border border-white/10 font-bold hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-xs">Start Now</button>
              </div>
              
              <div className="glass-strong p-16 rounded-[60px] border border-[#ea3a5b]/30 flex flex-col items-center text-center relative shadow-[0_0_100px_rgba(234,58,91,0.1)]">
                 <div className="absolute top-10 right-10 bg-[#ea3a5b] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest animate-bounce">THE ONLY OPTION</div>
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-[#ea3a5b] mb-10">THE PARLIAMENTARIAN</div>
                 <div className="text-7xl font-bold mb-4">$29</div>
                 <p className="text-white/60 mb-12 text-lg font-medium">Unrestricted objective power.</p>
                 <div className="w-full h-[1px] bg-white/5 mb-12" />
                 <ul className="space-y-6 mb-16 text-left w-full">
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Unlimited Inquiries</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Priority Reasoning Architecture</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Custom Persona Templates</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Private Data Vector Vault</li>
                 </ul>
                 <button onClick={onLoginClick} className="w-full py-5 rounded-3xl bg-[#ea3a5b] text-white font-black hover:bg-[#ff4e6e] transition-all uppercase tracking-[0.2em] text-xs shadow-2xl">Claim the Throne</button>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 border-t border-white/5 bg-[#09090b] relative">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between gap-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs uppercase">P</div>
                 <span className="font-bold text-xs uppercase tracking-widest">AI Parliament</span>
               </div>
               <p className="max-w-xs text-[11px] leading-loose uppercase tracking-widest">A stateful orchestration protocol for unbiased deliberative AI reasoning.</p>
            </div>
            <div className="flex gap-20">
               <div className="space-y-4">
                  <div className="font-black text-[10px] uppercase tracking-[0.3em] mb-6">Technology</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">LangGraph Core</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Azure OpenAI</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Vector Verification</div>
               </div>
               <div className="space-y-4">
                  <div className="font-black text-[10px] uppercase tracking-[0.3em] mb-6">Legal</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Privacy Matrix</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Usage Agreement</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Ethics Protocol</div>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-8 mt-32 text-center text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
            © 2026 AI PARLIAMENT SYSTEMS • WORLD CIVILIZATION PROTOCOL 01
         </div>
      </footer>
    </div>
  );
}
