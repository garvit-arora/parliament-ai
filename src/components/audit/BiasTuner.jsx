import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Zap, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BiasTuner() {
  const navigate = useNavigate();
  const [tuners, setTuners] = useState([
    { id: 'income', name: 'Income Weight', value: 85 },
    { id: 'gender', name: 'Gender Parity', value: 42 },
    { id: 'age', name: 'Age Gap', value: 65 },
    { id: 'race', name: 'Ethnicity Factor', value: 30 },
    { id: 'zip', name: 'Geography Seg.', value: 55 },
    { id: 'history', name: 'Credit Span', value: 75 },
  ]);

  const handleWeightChange = (id, newValue) => {
    setTuners(tuners.map(t => t.id === id ? { ...t, value: parseInt(newValue) } : t));
  };

  const handleAddCategory = () => {
    const name = prompt("Enter Forensic Category Name:");
    if (name) {
      const id = name.toLowerCase().replace(/\s+/g, '_');
      setTuners([...tuners, { id, name, value: 50 }]);
      toast.success(`Marker '${name}' added.`);
    }
  };

  const handleRemoveCategory = (id) => {
    setTuners(tuners.filter(t => t.id !== id));
    toast.error("Forensic marker removed.");
  };

  const handleApply = () => {
    toast.loading("Applying...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Neural calibration complete.");
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="flex flex-col py-10 px-10 h-full overflow-y-auto">
      <div className="flex justify-end mb-12">
        <button 
          onClick={handleAddCategory}
          className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 group"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
         {tuners.map((t) => (
            <div key={t.id} className="relative group p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center gap-8 hover:bg-white/[0.04] transition-all">
              <button 
                onClick={() => handleRemoveCategory(t.id)}
                className="absolute top-4 right-4 p-2 text-white/10 group-hover:text-white/40 hover:text-rose-500 transition-all rounded-full bg-white/5 border border-white/10"
              >
                <X size={14} />
              </button>
              
              <div className="h-64 w-10 bg-white/5 rounded-full relative border border-white/10">
                <div 
                  className="absolute bottom-0 w-full bg-[#ea3a5b] transition-all rounded-full shadow-[0_0_20px_rgba(234,58,91,0.4)]"
                  style={{ height: `${t.value}%` }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={t.value} 
                  onChange={(e) => handleWeightChange(t.id, e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ns-resize" 
                  style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
                />
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-2 leading-none">{t.value}%</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/20 truncate w-full px-2">{t.name}</div>
              </div>
            </div>
         ))}
      </div>

      <div className="flex justify-center flex-col items-center gap-8">
         <button 
           onClick={handleApply}
           className="px-14 py-5 bg-[#ea3a5b] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#ff4e6e] transition-all flex items-center gap-4 shadow-2xl shadow-[#ea3a5b]/20"
         >
           Apply Change
           <Zap size={16} />
         </button>
      </div>
    </div>
  );
}
