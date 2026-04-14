import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountPage({ user, onUpdate, onLogout }) {
  const navigate = useNavigate();
  const [name, setName] = useState(user.displayName || '');
  const [instructions, setInstructions] = useState(user.customInstructions || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
       onUpdate({ ...user, displayName: name, customInstructions: instructions });
       setIsSaving(false);
       navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto pt-20">
        <header className="flex items-center justify-between mb-20">
           <div>
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white mb-6 text-sm font-bold transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Return to Assembly
              </button>
              <h1 className="text-5xl font-black tracking-tighter">Sovereign Identity</h1>
           </div>
           <div className="w-24 h-24 rounded-full border border-white/10 overflow-hidden shadow-2xl">
              {user.photoURL ? <img src={user.photoURL} alt="" /> : <div className="w-full h-full bg-indigo-600" />}
           </div>
        </header>

        <div className="space-y-12">
           <section className="bg-[#0d0d12] border border-white/5 rounded-[32px] p-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Personal Details</h3>
              <div className="space-y-8">
                 <div>
                    <label className="block text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Display Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-blue-500/50 outline-none transition-all font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase text-white/40 mb-3 tracking-widest">Email Address</label>
                    <input 
                      type="text" 
                      disabled 
                      value={user.email} 
                      className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white/30 outline-none font-bold cursor-not-allowed"
                    />
                 </div>
              </div>
           </section>

           <section className="bg-[#0d0d12] border border-white/5 rounded-[32px] p-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-8">Core Instructions</h3>
              <p className="text-xs text-white/40 mb-6 font-medium">Define how the Parliament should perceive your inquiries. These will be injected into every deliberation layer.</p>
              <textarea 
                rows={6}
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Ex: Always prioritize long-term economic scalability over short-term gains..."
                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-white text-sm focus:border-blue-500/50 outline-none transition-all font-medium resize-none shadow-inner"
              />
           </section>
        </div>

         <div className="mt-12 flex justify-between items-center">
            <button 
              onClick={onLogout}
              className="px-8 py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/5"
            >
               Terminate Session
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-12 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-xl disabled:opacity-50"
            >
               {isSaving ? 'Encrypting Changes...' : 'Save Configuration'}
            </button>
         </div>
      </div>
    </div>
  );
}
