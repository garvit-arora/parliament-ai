import React, { useState, useEffect, useRef } from 'react';
import { Target, Shield, Zap, ChevronDown, Menu, X, ArrowRight, Scale, Eye, Database, BarChart3, Sliders, CheckCircle2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const heroFadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars = [];
    const numStars = width < 768 ? 40 : 130; // Reduced density on mobile

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.3, // Very small sizes
        vx: (Math.random() - 0.5) * 0.15, // Slightly faster drift
        vy: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.3 + 0.1, // Low opacity 0.1-0.4
      });
    }

    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - width / 2) * 0.03; // Subtle parallax
      mouseY = (e.clientY - height / 2) * 0.03;
    };

    const handleScroll = () => {
      scrollY = window.scrollY * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // Apply drift
        star.x += star.vx;
        star.y += star.vy;

        // Apply parallax offsets
        let drawX = star.x - mouseX * (star.radius * 0.5);
        let drawY = star.y - mouseY * (star.radius * 0.5) - scrollY * (star.radius * 0.5);

        // Seamless infinite wrapping for both drift and parallax scrolling
        drawX = ((drawX % width) + width) % width;
        drawY = ((drawY % height) + height) % height;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default function LandingPage({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-[#ea3a5b] selection:text-white overflow-x-hidden relative z-0">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <Starfield />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ea3a5b]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <Navbar variant="landing" onLoginClick={onLoginClick} />

      {/* HERO SECTION */}
      <header className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 md:px-6 pt-20 md:pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto z-10 w-full relative"
        >
          {/* Subtle Radial Glow Behind Hero Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] bg-blue-300/15 blur-[120px] rounded-full pointer-events-none -z-10" />

          <motion.h1 variants={heroFadeUpVariants} className="text-[2.5rem] leading-[1.1] md:text-8xl md:leading-tight font-medium tracking-tight mb-6 md:mb-10 text-white text-balance relative z-10">
            Neutralize Bias in <br />
            Automated Decisions.
          </motion.h1>
          <motion.p variants={heroFadeUpVariants} className="max-w-2xl mx-auto text-[15px] md:text-2xl text-white/90 md:text-white font-normal leading-relaxed mb-8 md:mb-16 px-2 md:px-0 text-balance">
            When programs decide who gets a job or a loan, historical data flaws become discriminatory mistakes. We build the layer that detects and fixes bias before it impacts lives.
          </motion.p>
          <motion.div variants={heroFadeUpVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 w-[90%] mx-auto sm:w-auto">
            <button onClick={onLoginClick} className="w-full sm:w-auto justify-center bg-[#ea3a5b] text-white font-semibold px-6 py-3.5 md:px-10 md:py-4 rounded-full transition-all hover:bg-[#ff4e6e] active:scale-95 flex items-center gap-3 text-[15px] md:text-lg shadow-xl shadow-[#ea3a5b]/20 hover:scale-105">
              Run a Bias Audit
              <Zap size={20} />
            </button>
            <a href="#logic" className="text-base md:text-lg font-medium text-white hover:text-white transition-colors flex items-center gap-2 group">
              How it works
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* FORENSIC LOGIC SECTION */}
      <section id="logic" className="min-h-screen flex items-center py-10 md:py-20 relative">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col items-center w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 md:mb-24 max-w-3xl"
          >
            <motion.div variants={fadeUpVariants} className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ea3a5b] mb-4 md:mb-6">Forensic Architecture</motion.div>
            <motion.h2 variants={fadeUpVariants} className="text-[2rem] leading-tight md:text-6xl font-medium tracking-tight text-white mb-6 md:mb-8 text-balance">Inspect models for hidden unfairness.</motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="w-full max-w-5xl mb-12 md:mb-24 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"
          >

            {/* --- Pipeline 1: Standard Chat --- */}
            <motion.div variants={fadeUpVariants} className="relative bg-[#0d0d12] border border-white/10 rounded-[28px] md:rounded-[32px] p-5 md:p-8 overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute top-6 left-6 text-[9px] font-black uppercase tracking-[0.3em] text-[#ea3a5b] flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ea3a5b] animate-pulse" />
                Standard Audit
              </div>
              <div className="mt-10 flex flex-col gap-3">
                {/* User Prompt */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-lg">💬</div>
                  <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white mb-1">User Prompt</div>
                    <div className="text-xs font-medium text-white italic">"Was the hiring process biased?"</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Layer 1 Models */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-lg">🧠</div>
                  <div className="flex-1 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Layer 1 — 3 AI Models Deliberate</div>
                    <div className="flex gap-2 flex-wrap">
                      {['GPT', 'Grok', 'DeepSeek'].map(m => (
                        <span key={m} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-[9px] font-bold rounded-md uppercase tracking-widest">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Final Arbiter */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ea3a5b]/10 border border-[#ea3a5b]/30 flex items-center justify-center shrink-0 text-lg">⚖️</div>
                  <div className="flex-1 bg-[#ea3a5b]/5 border border-[#ea3a5b]/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#ea3a5b] mb-1">Layer 2 — Final Arbiter</div>
                    <div className="text-xs text-white">Synthesizes, detects bias, outputs verdict</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Output */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-lg">✅</div>
                  <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Bias-Corrected Answer</div>
                    <div className="text-xs text-white">Neutral, verified, forensically graded</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* --- Pipeline 2: RAG Augmented --- */}
            <motion.div variants={fadeUpVariants} className="relative bg-[#0d0d12] border border-white/10 rounded-[28px] md:rounded-[32px] p-5 md:p-8 overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="absolute top-6 left-6 text-[9px] font-black uppercase tracking-[0.3em] text-purple-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                RAG Augmented Audit
              </div>
              <div className="mt-10 flex flex-col gap-3">
                {/* User uploads doc */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-lg">📄</div>
                  <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white mb-1">Document Upload</div>
                    <div className="text-xs font-medium text-white italic">loan_applications_2023.csv</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Vector DB */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0"><Database size={18} className="text-purple-400" /></div>
                  <div className="flex-1 bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Data Scanner — Vector Index</div>
                    <div className="text-xs text-white">Chunks embedded into searchable memory</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Models + RAG context */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-lg">🧠</div>
                  <div className="flex-1 bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Layer 1 — Grounded on Your Data</div>
                    <div className="text-xs text-white">Models receive retrieved data context alongside prompt</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-4 bg-white/20" />
                    <svg width="10" height="6" viewBox="0 0 10 6" className="text-white"><path d="M0 0L5 6L10 0" fill="currentColor" /></svg>
                  </div>
                </div>

                {/* Arbiter */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ea3a5b]/10 border border-[#ea3a5b]/30 flex items-center justify-center shrink-0 text-lg">⚖️</div>
                  <div className="flex-1 bg-[#ea3a5b]/5 border border-[#ea3a5b]/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#ea3a5b] mb-1">Arbiter — Dataset-Grounded Bias Grade</div>
                    <div className="text-xs text-white">Cites specific rows, scores disparity rates</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center"
          >
            {[
              { t: 'Measure Fairness', d: 'Quantify discrimination across race, gender, and age using statistical disparity metrics.', i: <Scale size={24} className="text-[#ea3a5b]" /> },
              { t: 'Flag Disparities', d: 'Instantly isolate when automated decisions produce unequal outcomes for marginalized groups.', i: <Eye size={24} className="text-[#ea3a5b]" /> },
              { t: 'Mitigate Harm', d: 'Implement real-time neural adjustments to neutralize historical flaws and ensure equity.', i: <Shield size={24} className="text-[#ea3a5b]" /> }
            ].map((f, idx) => (
              <motion.div key={idx} variants={fadeUpVariants} className="space-y-6 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#ea3a5b]/10 flex items-center justify-center mb-2">{f.i}</div>
                <h4 className="text-xl font-bold text-white">{f.t}</h4>
                <p className="text-white text-sm leading-relaxed max-w-xs">{f.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SAFETY & TRUST */}
      <section className="min-h-screen flex items-center py-10 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto px-5 md:px-8 text-center w-full"
        >
          <motion.h2 variants={fadeUpVariants} className="text-[2rem] leading-tight md:text-6xl font-medium tracking-tight text-white mb-6 md:mb-10 text-balance">A foundation built on <br /><span className="text-[#ea3a5b]">objective truth.</span></motion.h2>
          <motion.p variants={fadeUpVariants} className="text-[15px] md:text-xl text-white/90 md:text-white leading-relaxed font-normal mb-10 md:mb-20 max-w-2xl mx-auto text-balance">
            Our auditing protocol is hard-coded to prioritize equitable outcomes over flawed historical inputs.
          </motion.p>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 text-left">
            <motion.div variants={fadeUpVariants} className="p-6 md:p-10 rounded-[28px] md:rounded-3xl bg-[#0d0d12] border border-white/5 hover:bg-[#12121a] transition-all cursor-default">
              <h4 className="text-[15px] md:text-lg font-bold text-white mb-3 md:mb-4 uppercase tracking-widest text-xs">Constitutional Neutrality</h4>
              <p className="text-[13px] md:text-sm text-white/80 md:text-white leading-relaxed">Models are hard-coded to ignore demographic proxies that drive unfair rejection or acceptance rates.</p>
            </motion.div>
            <motion.div variants={fadeUpVariants} className="p-6 md:p-10 rounded-[28px] md:rounded-3xl bg-[#0d0d12] border border-white/5 hover:bg-[#12121a] transition-all cursor-default">
              <h4 className="text-[15px] md:text-lg font-bold text-white mb-3 md:mb-4 uppercase tracking-widest text-xs">Zero-Bias Persistence</h4>
              <p className="text-[13px] md:text-sm text-white/80 md:text-white leading-relaxed">Every forensic audit is stateful but ephemeral—your sensitive data is processed for verification, never stored for model training.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="min-h-screen flex items-center py-10 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12 md:mb-24"
          >
            <motion.h2 variants={fadeUpVariants} className="text-[2.5rem] leading-[1.1] md:text-8xl font-black tracking-tighter mb-4 italic uppercase">Pricing</motion.h2>
            <motion.p variants={fadeUpVariants} className="text-white/90 md:text-white text-[13px] md:text-lg uppercase tracking-widest font-bold">Scale your auditing protocols.</motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeUpVariants} className="p-6 md:p-12 rounded-[32px] md:rounded-[40px] bg-[#0d0d12] border border-white/5 flex flex-col items-center text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white mb-8">Auditor</div>
              <div className="text-7xl font-medium mb-10 text-white leading-none tracking-tighter">$0</div>
              <ul className="space-y-6 mb-16 text-left w-full text-white text-sm font-medium">
                <li className="flex items-center gap-4 border-b border-white/5 pb-4 tracking-widest uppercase text-[10px]">○ 10 Fairness Scans</li>
                <li className="flex items-center gap-4 border-b border-white/5 pb-4 tracking-widest uppercase text-[10px]">○ Standard Reporting</li>
                <li className="flex items-center gap-4 tracking-widest uppercase text-[10px]">○ Public Record</li>
              </ul>
              <button onClick={onLoginClick} className="w-full py-5 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">Start Audit</button>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="p-6 md:p-12 rounded-[32px] md:rounded-[40px] bg-[#0d0d12] border border-[#ea3a5b]/30 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform"><Zap className="text-[#ea3a5b]" size={60} /></div>
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#ea3a5b] mb-8 mt-4">Compliance Hero</div>
              <div className="text-7xl font-medium mb-10 text-white leading-none tracking-tighter">$49</div>
              <ul className="space-y-6 mb-16 text-left w-full text-white text-sm font-medium">
                <li className="flex items-center gap-4 border-b border-white/5 pb-4 tracking-widest uppercase text-[10px]">● Unlimited Audit Sessions</li>
                <li className="flex items-center gap-4 border-b border-white/5 pb-4 tracking-widest uppercase text-[10px]">● Full Adversarial Arbiter</li>
                <li className="flex items-center gap-4 border-b border-white/5 pb-4 tracking-widest uppercase text-[10px]">● Private Dataset Isolation</li>
                <li className="flex items-center gap-4 tracking-widest uppercase text-[10px]">● Board-Ready Compliance PDFs</li>
              </ul>
              <button onClick={onLoginClick} className="w-full py-5 rounded-2xl bg-[#ea3a5b] text-white font-black text-xs uppercase tracking-widest hover:bg-[#ff4e6e] transition-all shadow-xl shadow-[#ea3a5b]/30">Unlock Full Protocol</button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 md:pt-20 pb-10 md:pb-20 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-full px-5 md:px-20 text-center"
        >
          <motion.h1 variants={fadeUpVariants} className="text-[15vw] font-[1000] tracking-[-0.08em] leading-[0.8] uppercase text-white select-none pointer-events-none opacity-90 mb-20">
            COUNCIL<span className="text-[#ea3a5b]">X</span>
          </motion.h1>
          <motion.div variants={fadeUpVariants} className="flex flex-col md:flex-row justify-between items-center pt-8 md:pt-10 border-t border-white/10 gap-5 md:gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white">
              © 2026 COUNCILX SYSTEMS • GLOBAL PROTOCOL 01
            </div>
            <div className="flex gap-10">
              {['Twitter', 'Discord', 'Github'].map(s => (
                <div key={s} className="text-[10px] font-black uppercase tracking-[0.5em] text-white hover:text-white transition-colors cursor-pointer">{s}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}
