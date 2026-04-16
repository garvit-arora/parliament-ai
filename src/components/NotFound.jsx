import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-white p-12 text-center font-sans overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,58,91,0.03)_0,transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-2xl px-6">
        <div className="flex flex-col items-center gap-6 mb-16">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group">
               <img src="/logo.png" alt="CouncilX" className="w-10 h-10 object-contain" />
               <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center border-4 border-[#09090b]">
                  <AlertTriangle size={12} className="text-white" />
               </div>
            </div>
            <div>
                <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Forensic Alert</h1>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">NODE RESOLUTION <span className="text-[#ea3a5b]">FAILURE</span></h2>
            </div>
        </div>

        <div className="space-y-8">
            <p className="text-white/40 text-lg font-medium leading-relaxed">
                The requested deliberation path does not exist in the active consensus archive. The target node might have been purged or relocated during forensic rebalancing.
            </p>
            <div className="h-[1px] w-12 bg-white/10 mx-auto" />
            <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
               <div className="w-2 h-2 rounded-full bg-[#ea3a5b]" />
               ERR_NODE_PURGED_V404
            </div>
        </div>

        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#ea3a5b] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
                <Home size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                Return to Command
            </button>
            <button 
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Previous State
            </button>
        </div>
      </div>

      <div className="absolute bottom-12 w-full text-center">
         <div className="flex items-center justify-center gap-6 opacity-10">
            <Search size={24} />
            <div className="w-[1px] h-6 bg-white" />
            <div className="text-[10px] font-black uppercase tracking-[1em]">Termination Logic Protocol</div>
         </div>
      </div>
    </div>
  );
}
