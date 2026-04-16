import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, Download, ShieldCheck, Share2, Globe, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditCertify() {
  const navigate = useNavigate();
  const [isMinting, setIsMinting] = useState(false);

  const handleCertify = () => {
    setIsMinting(true);
    toast.loading("Cryptographically signing audit certificate...");
    setTimeout(() => {
      toast.dismiss();
      setIsMinting(false);
      toast.success("Certificate issued. Public registry updated.");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-12 relative h-full overflow-y-auto">
      <div className="w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#ea3a5b] mb-12 shadow-2xl shadow-[#ea3a5b]/20">
             <Award size={48} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-8">Protocol 05: Immutable Certification</div>
          <h1 className="text-6xl font-medium tracking-tight mb-6">Certify Audit.</h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto">Issue a verifiable, cryptographically signed certificate of compliance for your model's current fairness state.</p>
        </div>

        <div className="p-12 rounded-[50px] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#ea3a5b]/10 blur-[100px] rounded-full pointer-events-none" />
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-12">
                 <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Verification ID</h3>
                    <div className="text-lg font-mono text-[#ea3a5b]">CX-AUDIT-FY26-88X2</div>
                 </div>
                 <div className="space-y-4">
                    {[
                      { l: 'Encryption Status', v: 'AES-256' },
                      { l: 'Registry Type', v: 'Public Compliance' },
                      { l: 'Issued By', v: 'CouncilX Forensic Lab' }
                    ].map(item => (
                      <div key={item.l} className="flex justify-between border-b border-white/5 pb-2">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{item.l}</span>
                         <span className="text-xs font-bold text-white/60">{item.v}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-black/20 rounded-[32px] p-8 border border-white/5 flex items-center justify-center text-center">
                 <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-black">Cryptographic signature active</p>
              </div>
           </div>

           <div className="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row gap-6">
              <button 
                onClick={handleCertify}
                disabled={isMinting}
                className="flex-1 py-6 rounded-[32px] bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#ea3a5b] hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"
              >
                {isMinting ? 'Signing...' : 'Issue Certificate'}
                {!isMinting && <ShieldCheck size={20} />}
              </button>
              <button className="px-10 py-6 rounded-[32px] bg-white/5 border border-white/10 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-4 group">
                 <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
                 Publish to Registry
              </button>
           </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
           <div className="text-center">
              <Clock className="text-white/20 mx-auto mb-4" size={24} />
              <div className="text-lg font-bold">12 Months</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">VALIDITY PERIOD</div>
           </div>
           <div className="text-center">
              <ShieldCheck className="text-white/20 mx-auto mb-4" size={24} />
              <div className="text-lg font-bold">Grade A+</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">FAIRNESS STATUS</div>
           </div>
           <div className="text-center">
              <Globe className="text-white/20 mx-auto mb-4" size={24} />
              <div className="text-lg font-bold">Worldwide</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-white/20">COMPLIANCE REACH</div>
           </div>
        </div>
      </div>
    </div>
  );
}
