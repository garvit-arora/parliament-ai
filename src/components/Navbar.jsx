import React from 'react';
import { ChevronDown, Database, Sliders, Eye, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ variant = 'landing', onLoginClick }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-[100] bg-[#09090b]/80 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-5 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <div
            className="flex items-center gap-3 md:gap-4 cursor-pointer group"
            onClick={() => {
              if (variant === 'landing') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
          >
            <img src="/logo.png" alt="CouncilX Logo" className="w-7 h-7 md:w-10 md:h-10 object-contain group-hover:scale-110 transition-transform duration-500" />
            <span className="font-black text-lg md:text-xl tracking-tighter uppercase text-white">
              Council<span className="text-[#ea3a5b]">X</span>
            </span>
          </div>

          {variant === 'landing' && (
            <div className="hidden lg:flex items-center gap-8 ml-4">
              <div className="relative group/menu py-6">
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors flex items-center gap-1">
                  Audit Tools <ChevronDown className="w-3 h-3 group-hover/menu:rotate-180 transition-transform" />
                </button>
                {/* MEGA MENU */}
                <div className="absolute top-full left-0 w-72 bg-[#0d0d12] border border-white/10 rounded-2xl p-4 mt-2 shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all duration-300">
                  <div className="text-[9px] font-bold text-white uppercase tracking-widest mb-4 px-2">Available Tools</div>
                  <div className="space-y-1">
                    {[
                      { name: 'Data Scanner', icon: <Database size={14} />, desc: 'Index and scan forensic datasets' },
                      { name: 'Bias Tuner', icon: <Sliders size={14} />, desc: 'Fine-tune bias detection thresholds' },
                      { name: 'Unbiased News', icon: <Eye size={14} />, desc: 'Politically neutral news feed' },
                      { name: 'Bias Reports', icon: <FileText size={14} />, desc: 'Full forensic audit transcripts' },
                      { name: 'Fairness Map', icon: <Scale size={14} />, desc: 'Live 3D bias visualization' },
                    ].map((t) => (
                      <button key={t.name} onClick={onLoginClick} className="w-full text-left px-3 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-[#ea3a5b]/10 text-[#ea3a5b] flex items-center justify-center shrink-0 group-hover:bg-[#ea3a5b] group-hover:text-white transition-colors">
                          {t.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-white transition-colors">{t.name}</div>
                          <div className="text-[10px] text-white mt-0.5">{t.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <a href="#logic" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors">Technology</a>
              <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors">Pricing</a>
              <button
                onClick={() => window.open('/whitepaper', '_blank')}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:text-white transition-colors"
              >
                Whitepaper
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {variant === 'landing' ? (
            <button onClick={onLoginClick} className="px-6 py-2 md:px-8 md:py-2.5 bg-white text-black rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-[#ea3a5b] hover:text-white active:scale-95 transition-all shadow-xl shadow-white/5">
              Login
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all whitespace-nowrap">
              Home
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
