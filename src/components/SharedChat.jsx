import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedChat } from '../api/council';
import FlowCanvas from './FlowCanvas';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function SharedChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const data = await getSharedChat(sessionId);
        if (data.chat) {
          setChat(data.chat);
        }
      } catch (err) {
        toast.error("Could not find the shared deliberation.");
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-white">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-white/40 uppercase tracking-widest animate-pulse">Retrieving Logic Archive...</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#09090b] text-white p-10 text-center">
        <h1 className="text-6xl font-black mb-4 tracking-tighter">404</h1>
        <p className="text-white/40 mb-10 text-lg">This deliberation session does not exist or has been retracted.</p>
        <button onClick={() => navigate('/')} className="px-12 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest shadow-2xl">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-white font-sans selection:bg-blue-500 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-[#09090b]/40 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5">
             <img src="/logo.png" alt="Council X" className="w-12 h-12 object-contain filter drop-shadow-[0_5px_15px_rgba(59,130,246,0.3)]" />
             <div>
                <h1 className="text-xl font-black tracking-tighter leading-none uppercase"><span className="text-white">Council</span> <span className="text-[#ea3a5b]">X</span></h1>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] mt-1">Immutable Consensus Archive</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/10">VERIFIED LOGIC</div>
             <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Start Your Own</button>
          </div>
        </div>
      </header>

      <main className="pt-48 pb-32 px-10">
         <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center max-w-4xl mx-auto mb-32">
               <div className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Subject Matter Deliberation</div>
               <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">{chat.title}</h2>
               <div className="flex items-center justify-center gap-6 mt-12 overflow-hidden">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] whitespace-nowrap">Logic preserved at {new Date().toLocaleDateString()}</p>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
               </div>
            </div>
            
            <div className="space-y-40">
               {chat.messages.map((msg, idx) => (
                  <div key={idx} className="space-y-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                     <div className="flex items-center gap-4 opacity-50">
                        <div className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full border border-white/5">Message 0{idx+1}</div>
                        <div className="text-sm font-medium text-white/30">{msg.prompt}</div>
                     </div>
                     
                     <div className="space-y-12">
                        <FlowCanvas 
                           prompt={msg.prompt} 
                           responsesL1={msg.responsesL1} 
                           responseL2={msg.responseL2} 
                           responseL3={msg.responseL3} 
                           responseL4={msg.responseL4} 
                           isThinking={false} 
                           phase="done" 
                           config={{}} // Shared view uses stored responses
                        />
                        
                        {msg.responseL4 && (
                          <div className="bg-[#0d0d12] border border-white/5 rounded-[48px] p-12 lg:p-20 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <img src="/logo.png" className="w-32 h-32 object-contain" alt="" />
                             </div>
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-10">
                                   <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981]" />
                                   <span className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Protocol Resolution</span>
                                </div>
                                <div className="prose prose-invert prose-p:leading-relaxed prose-lg max-w-none prose-strong:text-blue-400">
                                   <ReactMarkdown>{msg.responseL4.response}</ReactMarkdown>
                                </div>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="pt-40 pb-20 text-center">
               <div className="w-20 h-20 rounded-2xl border border-white/5 flex items-center justify-center mx-auto mb-10 p-4 opacity-20 bg-white/5">
                  <img src="/logo.png" className="w-full h-full object-contain grayscale" alt="" />
               </div>
               <p className="text-[12px] font-black text-white/10 uppercase tracking-[0.8em]">End of Verified Logic Chain</p>
            </div>
         </div>
      </main>
    </div>
  );
}
