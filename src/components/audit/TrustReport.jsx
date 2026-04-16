import React, { useState, useEffect } from 'react';
import { getChats } from '../../api/council';
import { Search as SearchIcon, Download as DownloadIcon, ShieldCheck as ShieldIcon, User as UserIcon, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrustReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('parliament_user') || '{}');
    if (user.uid) {
      getChats(user.uid).then(data => {
        if (data.status === 'success') {
           // Sort by date descending
           const sorted = data.chats.sort((a,b) => new Date(b.updated_at || b.timestamp) - new Date(a.updated_at || a.timestamp));
           setSessions(sorted);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);

  const handleIndividualDownload = (s) => {
    const forensicReport = [{
       audit_id: s._id || s.id,
       title: s.title,
       timestamp: s.timestamp || s.updated_at,
       deliberation_history: (s.messages || []).map(m => ({
          user_input: m.prompt,
          council_response: typeof m.responseL2 === 'string' ? m.responseL2 : m.responseL2?.response
       })),
       audit_grade: s.audit_grade || 'A'
    }];

    const blob = new Blob([JSON.stringify(forensicReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forensic_Report_${s.title.replace(/\s+/g, '_')}.json`;
    a.click();
    toast.success("Forensic Report Exported.");
  };

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col py-8 px-10 h-screen overflow-y-auto bg-[#09090b]">
      <div className="w-full">
        {/* SEARCH ZONE */}
        <div className="mb-10">
           <div className="relative group">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#ea3a5b] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search audit node..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-sm outline-none transition-all"
              />
           </div>
        </div>

        {/* AUDIT LIST with BRIGHT DOWNLOADS */}
        <div className="space-y-4">
          {loading ? (
             <div className="py-20 text-center text-white/5 text-[10px] font-black uppercase tracking-widest">Syncing Nodes...</div>
          ) : filteredSessions.map((s) => (
            <div key={s._id || s.id} className="group p-8 bg-white/[0.02] border border-white/5 rounded-none flex items-center justify-between hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center text-emerald-500 border border-white/5 text-xl font-black shadow-2xl">
                  {s.audit_grade || 'A'}
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-[#ea3a5b] transition-colors">{s.title}</h3>
                   <div className="flex items-center gap-6 text-[10px] text-white/20 font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2 italic"><UserIcon size={12} /> {s.messages?.length || 0} Deliberations</span>
                      <span className="flex items-center gap-2 italic text-emerald-500/40"><ShieldIcon size={12} /> Forensic Vetted</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-10">
                 <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/40 mb-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                       <Calendar size={12} className="text-[#ea3a5b]" />
                       {new Date(s.updated_at || s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <button 
                      onClick={() => handleIndividualDownload(s)}
                      className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white bg-[#ea3a5b] px-6 py-3 rounded-xl shadow-2xl shadow-[#ea3a5b]/40 hover:bg-[#ff4e6e] hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                       <DownloadIcon size={14} />
                       Download Report
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
