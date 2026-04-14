import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-white p-10 text-center font-sans overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ea3a5b]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-center gap-4 mb-12">
            <img src="/logo.png" alt="Council X" className="w-16 h-16 object-contain filter drop-shadow-[0_0_30px_rgba(234,58,91,0.5)]" />
            <div className="text-left">
                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Council <span className="text-[#ea3a5b]">X</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">Logic Termination Error</p>
            </div>
        </div>

        <h2 className="text-[12rem] font-black leading-none tracking-tighter text-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">404</h2>
        
        <div className="space-y-6">
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter">ENDPOINT <span className="text-[#ea3a5b]">NOT FOUND</span></h3>
            <p className="text-white/40 max-w-md mx-auto text-lg font-medium leading-relaxed">
                The requested deliberation path does not exist or has been purged from the active consensus archive.
            </p>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
                onClick={() => navigate('/')}
                className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
            >
                Return to Assembly
            </button>
            <button 
                onClick={() => navigate(-1)}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
                Previous State
            </button>
        </div>
      </div>

      <div className="absolute bottom-10 w-full text-center">
         <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.8em]">ERR_PATH_RESOLUTION_FAILED_V4</p>
      </div>
    </div>
  );
}
