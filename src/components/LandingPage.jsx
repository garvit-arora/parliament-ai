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
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-6 md:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Council X" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(234,58,91,0.4)]" />
            <span className="font-black text-xl md:text-2xl tracking-tighter uppercase whitespace-nowrap">
               <span className="text-white">Council</span>
               <span className="text-[#ea3a5b] ml-1">X</span>
            </span>
          </div>
          
          <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-auto mr-12 hidden md:flex">
            <a href="#logic" className="hover:text-[#ea3a5b] transition-all hover:tracking-[0.6em]">The Logic</a>
            <a href="#models" className="hover:text-[#ea3a5b] transition-all hover:tracking-[0.6em]">Models</a>
            <a href="#pricing" className="hover:text-[#ea3a5b] transition-all hover:tracking-[0.6em]">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/login'} className="px-6 md:px-8 py-3 bg-[#ea3a5b] text-white rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#ea3a5b]/20 whitespace-nowrap">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="relative pt-40 pb-20 md:pt-64 md:pb-40 px-6 md:px-12 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-[#ea3a5b] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Forensic Logic Protocol Active</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-8 text-white">
            UNBIASED <span className="text-white/10">TRUTH</span><br />
            AT SCALE.
          </h1>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/40 font-medium leading-relaxed mb-12">
            The world's first adversarial AI orchestration engine. We pit models against each other to purge bias and extract the objective core of any inquiry.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button onClick={onLoginClick} className="group relative bg-[#ea3a5b] hover:bg-[#ff4e6e] text-white font-bold px-12 py-5 rounded-2xl transition-all shadow-[0_15px_60px_-15px_rgba(234,58,91,0.5)] flex items-center gap-3">
              Start The Debate
              <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Logic Breakdown */}
      <section id="logic" className="py-20 md:py-40 border-t border-white/5 bg-[#09090b] relative">
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row gap-20 items-center">
               <div className="flex-1">
                  <div className="text-[#ea3a5b] font-bold text-xs uppercase tracking-[0.3em] mb-6">Built with LangGraph.</div>
                  <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-10 leading-[1] text-white">Adversarial by Design.</h2>
                  <p className="text-white/50 text-lg md:text-xl leading-relaxed mb-10 font-light">
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
      <section id="models" className="py-20 md:py-40 bg-white text-black rounded-[40px] md:rounded-[80px] mx-4 my-10 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
        <div className="max-w-7xl mx-auto px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-24 gap-8">
              <div className="max-w-2xl">
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">The roster of giants.</h2>
                 <p className="text-black/50 text-lg md:text-xl font-medium">We only recruit the top 0.1% of weights available today.</p>
              </div>
              <button onClick={onLoginClick} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">View Full Spec Sheet</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20">
              {[
                 { n: 'GPT-4o', p: 'OpenAI', i: '/chatgpt-icon.webp', c: 'Sense Maker', bg: 'bg-white' },
                 { n: 'Grok-Beta', p: 'xAI', i: '/grok-icon.webp', c: 'Real-time Logic', bg: 'bg-black' },
                 { n: 'DeepSeek', p: 'DeepSeek', i: '/deepseek-logo-icon.webp', c: 'Pure Reason', bg: 'bg-[#001428]' },
                 { n: 'Phi-4', p: 'Microsoft', i: '/chatgpt-icon.webp', c: 'Verification', bg: 'bg-white' },
                 { n: 'Ministral', p: 'Mistral', i: '/grok-icon.webp', c: 'Final Arbiter', bg: 'bg-black' }
               ].map((m, idx) => (
                 <div key={idx} className="p-8 rounded-[40px] border border-black/10 bg-neutral-50 hover:bg-black hover:text-white transition-all duration-500 group shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center p-2 mb-6 group-hover:rotate-12 transition-transform shadow-lg border border-black/5`}>
                       <img src={m.i} className="w-full h-full object-contain" alt="" />
                    </div>
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

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="glass-strong p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-white/5 flex flex-col items-center text-center">
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-white/20 mb-10">THE CITIZEN TIER</div>
                 <div className="text-6xl md:text-7xl font-bold mb-4">$0</div>
                 <p className="text-white/40 mb-12 text-base md:text-lg">Validate claims with peer consensus.</p>
                 <div className="w-full h-[1px] bg-white/5 mb-12" />
                 <ul className="space-y-6 mb-16 text-left w-full">
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> 15 Verified Deliberations</li>
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> Full access to the Flow Canvas</li>
                    <li className="flex items-center gap-4 text-white/70 font-bold text-sm"><span className="text-[#ea3a5b]">✓</span> Dynamic Shared Archives</li>
                 </ul>
                 <button onClick={onLoginClick} className="w-full py-5 rounded-3xl border border-white/10 font-bold hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-xs">Access Now</button>
              </div>
              
              <div className="glass-strong p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-[#ea3a5b]/30 flex flex-col items-center text-center relative shadow-[0_0_100px_rgba(234,58,91,0.1)]">
                 <div className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#ea3a5b] text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest animate-bounce">ELITE ACCESS</div>
                 <div className="text-xs font-black tracking-[0.4em] uppercase text-[#ea3a5b] mb-10">THE COUNCIL MEMBER</div>
                 <div className="text-6xl md:text-7xl font-bold mb-4">$49</div>
                 <p className="text-white/60 mb-12 text-base md:text-lg font-medium">Unrestricted truth orchestration.</p>
                 <div className="w-full h-[1px] bg-white/5 mb-12" />
                 <ul className="space-y-6 mb-16 text-left w-full">
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Unlimited Deliberations</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Priority Reasoning (Tier 4 Arbiter)</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Custom Deliberation Personas</li>
                    <li className="flex items-center gap-4 text-white font-black text-sm"><span className="text-[#ea3a5b]">✓</span> Private Data Vector Indexing</li>
                 </ul>
                 <button onClick={onLoginClick} className="w-full py-5 rounded-3xl bg-[#ea3a5b] text-white font-black hover:bg-[#ff4e6e] transition-all uppercase tracking-[0.2em] text-xs shadow-2xl">Upgrade to Elite</button>
              </div>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 border-t border-white/5 bg-[#09090b] relative">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between gap-16 md:gap-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div>
               <div className="flex items-center gap-3 mb-6">
                 <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain opacity-80" />
                 <span className="font-bold text-xs uppercase tracking-widest text-white">Council <span className="text-[#ea3a5b]">X</span></span>
               </div>
               <p className="max-w-xs text-[11px] leading-loose uppercase tracking-widest">A stateful orchestration protocol for unbiased deliberative AI reasoning.</p>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-x-20 gap-y-12">
               <div className="space-y-4">
                  <div className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 whitespace-nowrap">Technology</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">LangGraph Core</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Azure OpenAI</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Vector Verification</div>
               </div>
               <div className="space-y-4">
                  <div className="font-black text-[10px] uppercase tracking-[0.3em] mb-6 whitespace-nowrap">Legal</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Privacy Matrix</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Usage Agreement</div>
                  <div className="text-[10px] font-bold uppercase hover:text-white transition-colors cursor-pointer">Ethics Protocol</div>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-8 mt-32 text-center text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
            © 2026 COUNCIL X SYSTEMS • WORLD CIVILIZATION PROTOCOL 01
         </div>
      </footer>
    </div>
  );
}
