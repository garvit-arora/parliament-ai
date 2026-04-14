import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ResponsePanel({ messages, onViewFlow }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (messages && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!messages || messages.length === 0) return null;

  return (
    <div className="w-full space-y-8">
      {messages.map((msg, index) => (
        <div key={index} className="flex flex-col space-y-6">
          
          {/* USER MESSAGE BUBBLE */}
          <div className="flex w-full">
            <div className="w-full bg-[#20212a] rounded-[20px] p-6 text-[15px] leading-relaxed text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-white/5">
               <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-white/30 uppercase tracking-widest">
                  <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center text-[10px]">U</div>
                  User Inquiry
               </div>
               {msg.prompt}
            </div>
          </div>

          {/* AI SPEAKER MESSAGE BUBBLE */}
          <div className="flex w-full gap-5 bg-[#171821] p-6 rounded-[20px] border border-[#ea3a5b]/20 shadow-[0_8px_30px_rgba(234,58,91,0.05)] relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#ea3a5b] to-purple-500" />
             <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_25px_rgba(234,58,91,0.2)] border border-[#ea3a5b]/30">
                <img src="/logo.png" className="w-6 h-6 object-contain filter drop-shadow-[0_2px_5px_rgba(234,58,91,0.5)]" alt="Council" />
             </div>
             
             <div className="flex-1 w-full pt-1">
                {msg.isProcessing ? (
                   <div className="bg-[#1e1f2b] border border-white/5 shadow-lg rounded-2xl p-5 text-sm text-white/90 inline-flex items-center gap-2">
                       <span className="text-white/50">Processing Parliament Pipeline</span>
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                       <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                   </div>
                ) : (
                   <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#ea3a5b] uppercase tracking-widest mb-1">
                         Parliament Final Verdict
                      </div>
                      <div className="prose prose-invert max-w-none text-white/90">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.responseL4 ? msg.responseL4.response : "Error delivering Final Verdict."}
                         </ReactMarkdown>
                      </div>

                      {/* QUICK ACTION BUTTON */}
                      <div className="flex items-center gap-2 mt-2">
                         <button
                           onClick={() => onViewFlow(index)}
                           className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/60 bg-[#1e1f2b] hover:text-white hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                         >
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="5" cy="12" r="2" />
                              <circle cx="19" cy="6" r="2" />
                              <circle cx="19" cy="18" r="2" />
                              <line x1="7" y1="12" x2="17" y2="6" />
                              <line x1="7" y1="12" x2="17" y2="18" />
                           </svg>
                           View Full Flow Process
                         </button>
                      </div>
                   </div>
                )}
             </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
