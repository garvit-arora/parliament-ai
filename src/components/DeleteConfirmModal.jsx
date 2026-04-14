import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      <div className="w-full max-w-md bg-[#0d0d12] border border-white/10 rounded-[40px] p-10 shadow-3xl relative z-[310] animate-in zoom-in-95 fade-in duration-300">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-8 mx-auto border border-rose-500/20">
           <svg className="text-rose-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </div>
        
        <h2 className="text-2xl font-black text-center mb-4 tracking-tighter">Terminate Deliberation?</h2>
        <p className="text-center text-white/40 text-sm leading-relaxed mb-10 px-4">
           You are about to permanently erase <span className="text-white font-bold">"{title}"</span> from the sovereign registry. This action is irreversible.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={onClose}
             className="py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
           >
              Cancel
           </button>
           <button 
             onClick={() => { onConfirm(); onClose(); }}
             className="py-4 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20"
           >
              Confirm Deletion
           </button>
        </div>
      </div>
    </div>
  );
}
