import React, { useState, useMemo } from 'react';
import { AVAILABLE_MODELS, getModelById } from '../data/models';
import { X, Search, Cpu, Check, Activity, Shield } from 'lucide-react';

export default function FlowConfigModal({ isOpen, onClose, config, onSave }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('layer1'); 

  const filteredModels = useMemo(() => AVAILABLE_MODELS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.provider.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (modelId) => {
    setLocalConfig(prev => {
      if (activeTab === 'layer1') {
        const isAlreadySelected = prev.layer1.includes(modelId);
        let newLayer1;
        if (isAlreadySelected) {
          newLayer1 = prev.layer1.filter(id => id !== modelId);
        } else {
          if (prev.layer1.length >= 3) return prev; 
          newLayer1 = [...prev.layer1, modelId];
        }
        return { ...prev, layer1: newLayer1 };
      } else {
        return { ...prev, [activeTab]: modelId };
      }
    });
  };

  const isSelected = (modelId) => {
    if (activeTab === 'layer1') return localConfig.layer1.includes(modelId);
    return localConfig[activeTab] === modelId;
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  const isComplete = localConfig.layer1.length > 0 && localConfig.layer2;

  const tabs = [
    { id: 'layer1', label: 'T1: First Level', desc: 'Select primary models.', state: localConfig.layer1.length > 0, count: localConfig.layer1.length },
    { id: 'layer2', label: 'T2: Level 2 Final', desc: 'Final verdict arbiter.', state: !!localConfig.layer2, model: getModelById(localConfig.layer2) }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0c0c14] border border-white/10 rounded-[24px] w-full max-w-4xl h-[65vh] flex flex-col shadow-2xl overflow-hidden scale-in duration-200">
        
        {/* MODAL HEADER - Compact */}
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#ea3a5b]/10 flex items-center justify-center text-[#ea3a5b]">
                 <Cpu size={18} />
              </div>
              <div>
                 <h2 className="text-xl font-bold tracking-tight text-white focus:outline-none">Select Models</h2>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all">
              <X size={20} />
           </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Sidebar - Compact */}
           <div className="w-[240px] border-r border-white/5 p-4 flex flex-col bg-black/20">
              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                 {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${activeTab === tab.id ? 'bg-[#ea3a5b]/10 border-[#ea3a5b]/30' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                       <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-[#ea3a5b]' : 'text-white/20'}`}>Tier {i+1}</span>
                          {tab.state && <Check size={12} className={activeTab === tab.id ? 'text-[#ea3a5b]' : 'text-emerald-500'} />}
                       </div>
                       <h4 className={`font-bold text-xs ${activeTab === tab.id ? 'text-white' : 'text-white/60'}`}>{tab.label}</h4>
                       
                       {tab.id === 'layer1' && tab.state && (
                         <div className="mt-2 flex -space-x-1.5">
                             {localConfig.layer1.map(id => {
                                const m = getModelById(id);
                                return (
                                   <div key={id} className="w-5 h-5 rounded bg-white/5 border border-white/10 p-1">
                                      <img src={m?.icon} className="w-full h-full object-contain" alt="" />
                                   </div>
                                );
                             })}
                         </div>
                       )}
                       {tab.id !== 'layer1' && tab.state && (
                         <div className="mt-2 text-[9px] font-bold text-white/40 flex items-center gap-1.5 truncate">
                            <img src={tab.model?.icon} className="w-3 h-3 object-contain" alt="" /> {tab.model?.name}
                         </div>
                       )}
                    </button>
                 ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                 <button
                   onClick={handleSave}
                   disabled={!isComplete}
                   className={`w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isComplete ? 'bg-white text-black hover:bg-[#ea3a5b] hover:text-white' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                 >
                   Apply Changes
                 </button>
              </div>
           </div>

           {/* Content area - Refined */}
           <div className="flex-1 p-8 flex flex-col overflow-hidden">
              <div className="mb-6 relative">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search AI deliberators..."
                   className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#ea3a5b]/40 outline-none transition-all"
                 />
                 {activeTab === 'layer1' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <span className="text-[8px] font-bold text-white/20 uppercase">Capacity</span>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => (
                             <div key={i} className={`w-3 h-1 rounded-full ${localConfig.layer1.length >= i ? 'bg-[#ea3a5b]' : 'bg-white/10'}`} />
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredModels.map(model => (
                       <button
                         key={model.id}
                         onClick={() => handleSelect(model.id)}
                         className={`group p-4 rounded-2xl border text-left transition-all flex flex-col relative ${isSelected(model.id) ? 'bg-[#ea3a5b]/5 border-[#ea3a5b]/40 shadow-lg shadow-black/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}`}
                       >
                          <div className="flex items-start justify-between mb-6">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 transition-all ${isSelected(model.id) ? 'bg-[#ea3a5b] shadow-lg shadow-[#ea3a5b]/20' : 'bg-white/5 grayscale group-hover:grayscale-0'}`}>
                                <img src={model.icon} className="w-full h-full object-contain" alt="" />
                             </div>
                             {isSelected(model.id) && <Check size={14} className="text-[#ea3a5b]" />}
                          </div>
                          
                          <h3 className="font-bold text-sm text-white mb-0.5">{model.name}</h3>
                          <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{model.provider}</div>
                          
                          <div className="mt-3 flex items-center gap-2">
                             <div className="text-[8px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5 font-bold uppercase tracking-wider">
                                {model.category}
                             </div>
                          </div>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
