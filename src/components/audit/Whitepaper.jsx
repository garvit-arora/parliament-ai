import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Activity, Network, Users, ChevronRight, Calculator, CheckCircle2, Search, Book, Shield, Zap, Cpu, Globe, Scale, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { id: 'abstract', title: 'Abstract', icon: <Book size={16} /> },
  { id: 'calculation', title: '1. Mathematical Bias', icon: <Calculator size={16} /> },
  { id: 'geometry', title: '2. Spatial Mapping', icon: <Network size={16} /> },
  { id: 'arbiter', title: '3. Arbiter Protocol', icon: <Cpu size={16} /> },
  { id: 'limitations', title: '4. Current Limits', icon: <Activity size={16} /> },
  { id: 'user-protocol', title: '5. User Protocols', icon: <Users size={16} /> },
  { id: 'compliance', title: '6. Privacy & Ethics', icon: <Shield size={16} /> },
];

export default function Whitepaper() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('abstract');

  useEffect(() => {
     window.scrollTo(0, 0);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#ea3a5b] selection:text-white">
       
       {/* TOP NAV BAR */}
       <header className="sticky top-0 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 z-50 h-16">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
             <div className="flex items-center gap-8">
               <button onClick={() => navigate('/')} className="flex items-center gap-2 font-black text-sm uppercase tracking-[0.2em] text-white hover:text-[#ea3a5b] transition-colors">
                  Council<span className="text-[#ea3a5b]">X</span>
               </button>
               <div className="h-4 w-px bg-white/10 hidden md:block" />
               <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                  <FileText size={12} /> Documentation v2.1
               </div>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white" />
                  <input 
                    placeholder="Search docs..." 
                    className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-10 pr-4 text-xs focus:border-[#ea3a5b]/40 outline-none transition-all w-64"
                  />
                </div>
                <button onClick={() => navigate('/')} className="text-xs font-bold px-4 py-2 bg-[#ea3a5b] text-white rounded-lg hover:bg-[#ff4e6e] transition-all">
                  Back to App
                </button>
             </div>
          </div>
       </header>

       <div className="max-w-7xl mx-auto flex">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="hidden lg:block w-64 fixed top-16 bottom-0 overflow-y-auto border-r border-white/5 p-8 custom-scrollbar pt-12">
             <div className="space-y-8">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ea3a5b] mb-6">Introduction</div>
                   <div className="space-y-1">
                      {SECTIONS.slice(0, 1).map(s => (
                        <button 
                           key={s.id} 
                           onClick={() => scrollTo(s.id)}
                           className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === s.id ? 'bg-[#ea3a5b]/10 text-[#ea3a5b]' : 'text-white hover:bg-white/5 hover:text-white'}`}
                        >
                           {s.icon} {s.title}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Core Concepts</div>
                   <div className="space-y-1">
                      {SECTIONS.slice(1, 4).map(s => (
                        <button 
                           key={s.id} 
                           onClick={() => scrollTo(s.id)}
                           className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === s.id ? 'bg-[#ea3a5b]/10 text-[#ea3a5b]' : 'text-white hover:bg-white/5 hover:text-white'}`}
                        >
                           {s.icon} {s.title}
                        </button>
                      ))}
                   </div>
                </div>

                <div>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">Operations</div>
                   <div className="space-y-1">
                      {SECTIONS.slice(4).map(s => (
                        <button 
                           key={s.id} 
                           onClick={() => scrollTo(s.id)}
                           className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeSection === s.id ? 'bg-[#ea3a5b]/10 text-[#ea3a5b]' : 'text-white hover:bg-white/5 hover:text-white'}`}
                        >
                           {s.icon} {s.title}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 lg:ml-64 p-8 md:p-16 max-w-4xl pt-24 pb-32">
             
             {/* HEADER */}
             <div className="mb-20">
                <div className="text-xs font-bold text-[#ea3a5b] uppercase tracking-[0.3em] mb-4">Official Technical Paper</div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-8 leading-tight">
                   Algorithmic Neutrality & The Forensic Neural Map
                </h1>
                <p className="text-xl text-white italic leading-relaxed">
                   A quantitative breakdown of the multi-layered bias detection calculus powering the CouncilX infrastructure.
                </p>
             </div>

             <div className="space-y-24">
                
                {/* ABSTRACT */}
                <section id="abstract" className="scroll-mt-32">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                       <Book className="text-[#ea3a5b]" /> Abstract & Methodology
                    </h2>
                    <div className="prose prose-invert max-w-none text-white leading-loose space-y-4 text-base">
                       <p>
                          In the contemporary digital landscape, automated decision-making systems often inherit the subconscious biases of their creators or the skewed demographics of their training data. **CouncilX** is an adversarial auditing engine designed to intercept, analyze, and neutralize these ideological anomalies in real-time.
                       </p>
                       <p>
                          Our methodology relies on the principle of **Multi-LLM Deliberation**. By forcing disparate neural architectures (GPT, Grok, and DeepSeek) to cross-examine a single prompt, we create a forensic "Paper Trail" of algorithmic variance. This variance is then processed through a second Layer 2 Arbiter, which resolves contradictions into a single, unbiased verdict.
                       </p>
                    </div>
                </section>

                {/* SECTION 1 */}
                <section id="calculation" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Calculator className="text-[#ea3a5b]" /> 1. Mathematical Calculation of Bias
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-6">
                      <p>
                         The Bias Scores rendered on the Live Bias Map are not generated randomly. They are the result of a rigorous multi-layered probabilistic evaluation running beneath every user session in the CouncilX Parliament.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {[
                           { t: 'Tier 1 Variance', d: 'Inference variance between GPT, Grok, and DeepSeek measured via cosine similarity.', c: '0.00 - 0.30' },
                           { t: 'Arbiter Parsing', d: 'Layer 2 semantic payload grading of ideological charge and neutral logic.', c: '0.30 - 0.70' },
                           { t: 'Global Norm', d: 'Constrained sigmoid function outputting a precise ratio of neutrality.', c: '0.70 - 1.00' }
                         ].map(i => (
                           <div key={i.t} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                              <div className="text-[10px] font-black uppercase tracking-widest text-white mb-2">{i.t}</div>
                              <div className="text-lg font-bold text-white mb-2">{i.c}</div>
                              <p className="text-[10px] leading-relaxed italic">{i.d}</p>
                           </div>
                         ))}
                      </div>

                      <div className="bg-black/40 border border-[#ea3a5b]/20 p-8 rounded-2xl font-mono text-sm">
                         <div className="text-white mb-4 font-sans uppercase tracking-widest text-[9px] font-black">Simplified Bias Formula</div>
                         <div className="text-[#ea3a5b]">
                            B = σ( Σ(S<sub>i</sub> * W<sub>i</sub>) + Δ(T<sub>1</sub>) ) 
                         </div>
                         <div className="mt-4 text-white text-[10px] font-sans">
                            Where **S** is semantic charge, **W** is model weight, and **Δ(T<sub>1</sub>)** is cross-model variance.
                         </div>
                      </div>
                   </div>
                </section>

                {/* SECTION 2 */}
                <section id="geometry" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Network className="text-blue-500" /> 2. 3D Spatial Geometry Mapping
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-6">
                      <p>
                         To visualize the algorithmic calculations, CouncilX employs a GPU-accelerated spherical plotting engine. 
                      </p>
                      <p>
                         Instead of traditional 2D flat graphing, every decision node is assigned a <code className="bg-white/5 px-2 py-1 rounded text-sm text-[#ea3a5b]">(x, y, z)</code> coordinate matrix. Nodes are plotted across an intersecting Cartesian plane where the distance from the zero-point genesis hub corresponds to thematic drift. If a node strays too far into extreme polarization, its internal gravity fails, allowing the <span className="font-bold text-[#ea3a5b]">Variance Detected</span> threshold to flag it as an anomaly.
                      </p>
                      <div className="bg-[#ea3a5b]/10 border border-[#ea3a5b]/20 p-6 rounded-2xl flex items-center gap-6">
                         <div className="w-16 h-16 rounded-full bg-[#ea3a5b] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#ea3a5b]/20">
                            <Scale size={32} />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-white mb-1">Centripetal Neutrality</div>
                            <p className="text-xs italic leading-relaxed">The algorithm uses gravitational displacement to pull polarized nodes back toward the neutral baseline before final output.</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* SECTION 3 - NEW ARBITER */}
                <section id="arbiter" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Cpu className="text-[#ea3a5b]" /> 3. Arbiter Synthesis Protocol
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-4">
                      <p>
                         The **Final Arbiter (Layer 2)** is the critical link between raw AI deliberation and human-readable verdicts. Currently powered primarily by specialized Grok architectures, the Arbiter's role is not just to summarize, but to **mediate**.
                      </p>
                      <ul className="space-y-4 mt-6">
                         <li className="flex gap-4">
                            <div className="mt-1 text-[#ea3a5b]"><CheckCircle2 size={16} /></div>
                            <div><strong>Conflict Resolution:</strong> If GPT and DeepSeek disagree on a geopolitical fact, the Arbiter is hard-coded to favor the model that provides the most extensive forensic citations or the highest neutrality grade.</div>
                         </li>
                         <li className="gap-4 flex">
                            <div className="mt-1 text-[#ea3a5b]"><CheckCircle2 size={16} /></div>
                            <div><strong>Persona Management:</strong> The Arbiter suppresses the internal "AI-isms" and jargon of Tier 1 deliberators, delivering a direct, authoritative, and structured Grok-style response.</div>
                         </li>
                      </ul>
                   </div>
                </section>

                {/* SECTION 4 */}
                <section id="limitations" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Activity className="text-emerald-500" /> 4. Current Limitations & Frontiers
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-6">
                      <p>
                         While highly accurate, the current Forensic Neural Map architecture is constrained by recursive context limits:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                         <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2">
                               <Zap size={14} className="text-amber-500" /> Token Truncation
                            </h4>
                            <p className="text-xs leading-relaxed">Long-chain logic audits occasionally drop early context windows. Future updates will transition to an infinitely scrolling Vector DB structure utilizing Qdrant clusters.</p>
                         </div>
                         <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-[10px] flex items-center gap-2">
                               <Shield size={14} className="text-blue-400" /> Subjective Sarcasm
                            </h4>
                            <p className="text-xs leading-relaxed">Models occasionally struggle resolving extreme sarcasm, causing false-positive bias anomalies. We are currently training an adversarial neural network to offset this.</p>
                         </div>
                      </div>
                   </div>
                </section>

                {/* SECTION 5 */}
                <section id="user-protocol" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Users className="text-purple-500" /> 5. User Contribution Protocols
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-6">
                      <p>
                         CouncilX operates as a decentralized auditing collective. As a user, your daily interactions organically improve the overarching algorithm in multiple ways:
                      </p>
                      <div className="space-y-4">
                         {[
                           { t: 'Prompt Dialectics', d: 'Every diverse philosophical query you enter forces the Tier 1 models to expand their baseline vocabulary, smoothing future variance distributions.' },
                           { t: 'RLHF Feedback Loop', d: 'The "Like" and "Dislike" buttons in your transcript are fed directly into the reward_data collection to fine-tune the Layer 2 Arbiter\'s median drift.' },
                           { t: 'Anomaly Verification', d: 'By tracking false positives generated by the 3D map, the community provides active feedback telemetry to our fine-tuning pipelines.' }
                         ].map(u => (
                           <div key={u.t} className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-[#ea3a5b]/40 transition-all">
                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                 <Plus size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-white mb-1">{u.t}</div>
                                 <p className="text-xs text-white leading-relaxed">{u.d}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </section>

                {/* SECTION 6 - COMPLIANCE */}
                <section id="compliance" className="scroll-mt-32">
                   <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                      <Shield className="text-blue-500" /> 6. Privacy & Ethics Protocol
                   </h2>
                   <div className="prose prose-invert max-w-none text-white leading-loose space-y-6">
                      <p>
                         The CouncilX platform adheres to the **Principle of Ephemeral Forensics**. While we store transcripts for session persistence, raw forensic documents (PDFs, TXT) are shredded post-ingestion.
                      </p>
                      <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20">
                         <h4 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Core Compliance Standards</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <div className="text-xs font-bold text-white">Adversarial Privacy</div>
                               <p className="text-[10px] leading-relaxed">No data is utilized for pre-training external models. Your audit remains isolated to your unique session hash.</p>
                            </div>
                            <div className="space-y-2">
                               <div className="text-xs font-bold text-white">Neutrality Verification</div>
                               <p className="text-[10px] leading-relaxed">The arbiter is decoupled from corporate incentive structures, utilizing only clinical, fact-based scoring arrays.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </section>

             </div>
             
             <div className="mt-32 pt-20 border-t border-white/5 text-center">
                <div className="w-12 h-12 bg-[#ea3a5b] rounded-xl text-white flex items-center justify-center font-black mx-auto mb-6 shadow-xl shadow-[#ea3a5b]/20">
                    X
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white mb-4">Algorithmic Liberty Protocol</p>
                <p className="text-[10px] text-white uppercase tracking-widest">© 2026 CouncilX Research Array • forensic_id: 0x4fE92</p>
             </div>

          </main>

          {/* RIGHT SIDEBAR - TABLE OF CONTENTS (Optional but looks cool like Tailwind) */}
          <aside className="hidden xl:block w-64 fixed top-16 right-0 bottom-0 p-8 pt-12">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">On this page</div>
             <nav className="space-y-4">
                {SECTIONS.map(s => (
                   <button 
                      key={s.id} 
                      onClick={() => scrollTo(s.id)}
                      className={`block text-[10px] font-bold uppercase tracking-widest text-left transition-all ${activeSection === s.id ? 'text-[#ea3a5b]' : 'text-white hover:text-white'}`}
                   >
                      {s.title.replace(/[0-9.]/g, '').trim()}
                   </button>
                ))}
             </nav>
          </aside>
       </div>
    </div>
  );
}
