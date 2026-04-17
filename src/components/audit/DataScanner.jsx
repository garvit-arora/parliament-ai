import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Shield, Database, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataScanner() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`${selectedFile.name} added.`);
    }
  };

  const startScan = () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setIsUploading(true);
    toast.loading("Starting Audit...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Audit complete.");
      setIsUploading(false);
      navigate('/');
    }, 3000);
  };

  const modelIcons = [
    { name: 'GPT-4o', path: '/chatgpt-icon.webp' },
    { name: 'DeepSeek', path: '/deepseek-logo-icon.webp' },
    { name: 'Grok', path: '/grok-icon.webp' }
  ];

  return (
    <div className="flex flex-col py-10 px-10 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
        {/* UPLOAD ZONE */}
        <div 
          className={`h-[450px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-12 transition-all cursor-pointer bg-white/[0.01] rounded-[32px] group hover:border-[#ea3a5b]/40 hover:bg-white/[0.03] ${file ? 'border-[#ea3a5b]/50 bg-[#ea3a5b]/5' : ''}`}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:bg-[#ea3a5b] group-hover:text-white group-hover:shadow-2xl group-hover:shadow-[#ea3a5b]/20 ${file ? 'bg-[#ea3a5b] text-white shadow-xl' : 'bg-white/5 text-white/20'}`}>
            <Upload size={32} />
          </div>
          {file ? (
            <div className="text-center">
               <p className="text-xl font-bold text-white tracking-tight">{file.name}</p>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ea3a5b] mt-3">Ready</p>
            </div>
          ) : (
            <p className="text-xs text-white/10 font-bold uppercase tracking-widest">Select File</p>
          )}
        </div>

        {/* CONFIG ZONE */}
        <div className="space-y-10">
          <div className="p-10 bg-white/[0.02] border border-white/5 rounded-3xl space-y-10">
             <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Custom Instructions</span>
                <div className="flex -space-x-2">
                   {modelIcons.map(m => (
                      <div key={m.name} className="w-10 h-10 rounded-full border-2 border-[#0d0d12] bg-white overflow-hidden shadow-xl" title={m.name}>
                         <img src={m.path} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>
             </div>
             
             <div className="space-y-4">
                <textarea 
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder=""
                  className="w-full h-40 bg-transparent border border-white/5 rounded-2xl px-6 py-5 text-sm outline-none focus:border-white/10 transition-all resize-none italic text-white/60"
                />
             </div>
          </div>

          <button 
            onClick={startScan}
            disabled={isUploading || !file}
            className="w-full py-6 bg-[#ea3a5b] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#ff4e6e] transition-all disabled:opacity-20 flex items-center justify-center gap-4 shadow-2xl shadow-[#ea3a5b]/30 group"
          >
             {isUploading ? "Starting..." : "Scan Now"}
             <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
