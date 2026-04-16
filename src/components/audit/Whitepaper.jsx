import React, { useEffect } from 'react';
import { ArrowLeft, FileText, Activity, Network, Users, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Whitepaper() {
  const navigate = useNavigate();

  useEffect(() => {
     window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-serif pb-32">
       
       <header className="sticky top-0 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-black/5 z-50">
          <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-sans font-bold text-slate-500 hover:text-black transition-colors">
                <ArrowLeft size={16} /> Returns to Dashboard
             </button>
             <div className="font-black text-sm uppercase tracking-[0.2em] text-slate-300 font-sans">
                Council<span className="text-[#ea3a5b]">X</span>
             </div>
          </div>
       </header>

       <article className="max-w-3xl mx-auto px-8 pt-20">
          
          <div className="text-center mb-20 space-y-6">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ea3a5b]/10 text-[#ea3a5b] rounded-full text-xs font-sans font-bold uppercase tracking-widest mb-4">
                <FileText size={14} /> Official Whitepaper
             </div>
             <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                Algorithmic Neutrality & The Forensic Neural Map
             </h1>
             <p className="text-xl text-slate-500 italic max-w-2xl mx-auto leading-relaxed">
                A quantitative breakdown of the multi-layered bias detection calculus powering the CouncilX infrastructure.
             </p>
             <div className="pt-8 flex items-center justify-center gap-8 text-sm font-sans font-medium text-slate-400">
                <span>Published: 2026</span>
                <span>Version: 2.1.0</span>
                <span>Author: CouncilX Research Array</span>
             </div>
          </div>

          <div className="prose prose-lg prose-slate max-w-none">
             
             <section className="mb-16">
                <h2 className="text-2xl font-bold font-sans tracking-tight border-b border-black/10 pb-4 mb-8 flex items-center gap-3">
                   <Calculator className="text-[#ea3a5b]" /> 1. Mathematical Calculation of Bias
                </h2>
                <p className="leading-loose mb-6">
                   The Bias Scores rendered on the Live Bias Map are not generated randomly. They are the result of a rigorous multi-layered probabilistic evaluation running beneath every user session in the CouncilX Parliament.
                </p>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 mb-6 font-sans">
                   <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">The Calculation Pipeline</h4>
                   <ol className="space-y-4 text-sm text-slate-600">
                      <li className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-900 shrink-0">1</div>
                         <div><strong>Tier 1 Inference Variance:</strong> The root prompt is processed simultaneously by multiple disparate LLMs (Layer 1). We measure the cosine similarity between their output embeddings.</div>
                      </li>
                      <li className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-900 shrink-0">2</div>
                         <div><strong>Sentiment Extraction:</strong> The Layer 2 Arbiter parses the semantic payload of each Tier 1 response, grading ideological leaning, emotional charge, and absolute historical neutrality.</div>
                      </li>
                      <li className="flex items-start gap-4">
                         <div className="w-6 h-6 rounded-full bg-[#ea3a5b]/10 flex items-center justify-center font-bold text-[#ea3a5b] shrink-0">3</div>
                         <div><strong>Global Normalization:</strong> The extracted vector scores are constrained via a sigmoid function outputting a precise ratio between <code className="bg-slate-100 px-1 py-0.5 rounded text-[#ea3a5b]">0.00</code> (Absolute Neutrality) and <code className="bg-slate-100 px-1 py-0.5 rounded text-[#ea3a5b]">1.00</code> (Critical Bias/Anomaly).</div>
                      </li>
                   </ol>
                </div>
             </section>

             <section className="mb-16">
                <h2 className="text-2xl font-bold font-sans tracking-tight border-b border-black/10 pb-4 mb-8 flex items-center gap-3">
                   <Network className="text-blue-500" /> 2. 3D Spatial Geometry Mapping
                </h2>
                <p className="leading-loose mb-6">
                   To visualize the algorithmic calculations, CouncilX employs a GPU-accelerated spherical plotting engine. 
                </p>
                <p className="leading-loose mb-6">
                   Instead of traditional 2D flat graphing, every decision node is assigned a <code className="bg-black/5 px-2 py-1 rounded text-sm">(x, y, z)</code> coordinate matrix. Nodes are plotted across an intersecting Cartesian plane where the distance from the zero-point genesis hub corresponds to thematic drift. If a node strays too far into extreme polarization, its internal gravity fails, allowing the <span className="font-bold text-[#ea3a5b]">Variance Detected</span> threshold to flag it as an anomaly.
                </p>
             </section>

             <section className="mb-16">
                <h2 className="text-2xl font-bold font-sans tracking-tight border-b border-black/10 pb-4 mb-8 flex items-center gap-3">
                   <Activity className="text-emerald-500" /> 3. Current Limitations & Areas for Improvement
                </h2>
                <p className="leading-loose mb-6">
                   While highly accurate, the current Forensic Neural Map architecture is constrained by recursive context limits:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                   <div className="bg-white p-6 rounded-2xl border border-black/5">
                      <h4 className="font-bold text-slate-800 mb-2">Token Truncation</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Long-chain logic audits occasionally drop early context windows. Future updates will transition to an infinitely scrolling Vector DB structure.</p>
                   </div>
                   <div className="bg-white p-6 rounded-2xl border border-black/5">
                      <h4 className="font-bold text-slate-800 mb-2">Subjective Sarcasm</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">Models occasionally struggle resolving extreme sarcasm, causing false-positive bias anomalies. We are currently training an adversarial neural network to offset this.</p>
                   </div>
                </div>
             </section>

             <section className="mb-16">
                <h2 className="text-2xl font-bold font-sans tracking-tight border-b border-black/10 pb-4 mb-8 flex items-center gap-3">
                   <Users className="text-purple-500" /> 4. User Contribution Protocols
                </h2>
                <p className="leading-loose mb-6">
                   CouncilX operates as a decentralized auditing collective. As a user, your daily interactions organically improve the overarching algorithm in multiple ways:
                </p>
                <ul className="space-y-4 font-sans text-slate-600">
                   <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-black/5">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                      <span className="text-sm"><strong>Prompt Dialectics:</strong> Every diverse philosophical query you enter forces the Tier 1 models to expand their baseline vocabulary, smoothing future variance distributions.</span>
                   </li>
                   <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-black/5">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                      <span className="text-sm"><strong>Custom Heuristics:</strong> Your personal Custom Instructions override the Arbiter's default logic checks. This crowd-sources the definition of "Bias", organically shifting the global system toward true neutrality.</span>
                   </li>
                   <li className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-black/5">
                      <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                      <span className="text-sm"><strong>Anomaly Verification:</strong> By tracking false positives generated by the 3D map, the community provides active feedback telemetry to our LLM fine-tuning pipelines.</span>
                   </li>
                </ul>
             </section>

          </div>
          
          <div className="mt-20 py-12 border-t border-black/10 text-center font-sans">
             <div className="w-12 h-12 bg-black rounded-xl text-white flex items-center justify-center font-black mx-auto mb-6 shadow-xl">
                 X
             </div>
             <p className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-2">The Truth is Verifiable.</p>
             <p className="text-xs text-slate-300">© 2026 CouncilX Research Array</p>
          </div>

       </article>
    </div>
  );
}
