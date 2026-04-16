import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, ShieldCheck, ExternalLink, Newspaper, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsProtocol() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const mockNews = [
          {
            id: 1,
            title: "Global Markets Flux Amidst Neural Regulation Talks",
            source: "Reuters",
            biasScore: 0.12,
            isSuspicious: false,
            url: "https://reuters.com",
            summary: "Market volatility is increasing as international bodies discuss the first major regulatory framework.",
            category: "Economics"
          },
          {
            id: 2,
            title: "New Policy Draft Leaked: Potential Bias in Algorithmic Taxing",
            source: "Unknown/Leaked",
            biasScore: 0.65,
            isSuspicious: true,
            url: "https://leak.org",
            summary: "A leaked document suggests that the new taxing algorithm may disproportionately weight geographic markers.",
            category: "Politics"
          },
          {
            id: 3,
            title: "AI Council Successfully Audits Major Financial Institution",
            source: "CouncilX Press",
            biasScore: 0.05,
            isSuspicious: false,
            url: "https://councilx.ai",
            summary: "The first large-scale forensic audit using multi-model deliberation has been completed.",
            category: "Tech"
          }
        ];
        setTimeout(() => {
          setNews(mockNews);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleOpenSource = (url) => {
     window.open(url, '_blank', 'noopener,noreferrer');
     toast.success("Source node opened.");
  };

  const filteredNews = filter === 'all' ? news : news.filter(n => filter === 'suspicious' ? n.isSuspicious : n.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="flex flex-col py-10 px-10 h-full overflow-y-auto">
      <div className="flex justify-end mb-16 mt-2">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
           <button onClick={() => setFilter('all')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${filter === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>All Feed</button>
           <button onClick={() => setFilter('suspicious')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${filter === 'suspicious' ? 'bg-rose-500 text-white' : 'text-rose-500/40 hover:text-rose-500'}`}>Suspicious</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-40 text-center text-white/5 text-[10px] font-black uppercase tracking-widest">Nodes Syncing...</div>
        ) : filteredNews.map((n) => (
          <div key={n.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col justify-between gap-6 hover:bg-white/[0.04] transition-all group">
             <div className="space-y-4">
                <div className="flex justify-between items-start">
                   <span className={`text-[9px] font-black uppercase tracking-widest ${n.isSuspicious ? 'text-rose-500' : 'text-white/20'}`}>{n.source}</span>
                   {n.isSuspicious && <AlertTriangle size={14} className="text-rose-500" />}
                </div>
                <h2 className="text-xl font-bold leading-snug">{n.title}</h2>
                <p className="text-white/40 text-xs leading-relaxed">{n.summary}</p>
             </div>
             <button 
               onClick={() => handleOpenSource(n.url)}
               className="text-[9px] font-black uppercase tracking-widest text-[#ea3a5b] opacity-40 group-hover:opacity-100 hover:text-white flex items-center gap-2 transition-all bg-[#ea3a5b]/5 px-4 py-2 rounded-xl border border-[#ea3a5b]/10"
             >
                Open Story <ExternalLink size={12} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
}
