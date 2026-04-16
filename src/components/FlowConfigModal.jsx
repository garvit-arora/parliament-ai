import React, { useState, useMemo } from 'react';
import { AVAILABLE_MODELS, getModelById } from '../data/models';

export default function FlowConfigModal({ isOpen, onClose, config, onSave }) {
  const [localConfig, setLocalConfig] = useState(config);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('layer1'); // layer1, layer2, layer3, layer4

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
          if (prev.layer1.length >= 3) return prev; // Limit to 3
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
    { id: 'layer1', label: 'Tier 1: Deliberators', desc: 'Selection of primary perspectives.', state: localConfig.layer1.length > 0, count: localConfig.layer1.length },
    { id: 'layer2', label: 'Tier 2: Final Arbiter', desc: 'Synthesis & Quality Control.', state: !!localConfig.layer2, model: getModelById(localConfig.layer2) }
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-3xl animate-in fade-in duration-500">
      <div className="bg-[#09090b] border border-white/10 rounded-[48px] w-full max-w-6xl h-[85vh] flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden scale-in duration-300">
        
        {/* MODAL HEADER */}
        <div className="px-12 py-10 border-b border-white/[0.03] flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent">
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Stack Configuration</h2>
              <div className="flex items-center gap-3 text-white/30 font-bold text-[10px] uppercase tracking-widest">
                 <span>Architecture Protocol 2.5</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span>High Fidelity Weights</span>
              </div>
           </div>
           <button onClick={onClose} className="w-14 h-14 rounded-3xl bg-white/5 hover:bg-[#ea3a5b] hover:text-white flex items-center justify-center transition-all group border border-white/5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/20 group-hover:text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <div className="w-[340px] border-r border-white/[0.03] p-8 flex flex-col bg-white/[0.01]">
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {tabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-6 rounded-[32px] border transition-all relative ${activeTab === tab.id ? 'bg-blue-600 border-blue-400 shadow-[0_15px_40px_rgba(37,99,235,0.2)]' : 'bg-[#121217] border-white/5 hover:border-white/20'}`}
                    >
                       <div className="flex items-start justify-between mb-3">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeTab === tab.id ? 'text-white' : 'text-white/20'}`}>T-{i+1}</span>
                          {tab.state && <div className={`w-2 h-2 rounded-full ${activeTab === tab.id ? 'bg-white' : 'bg-emerald-500'} shadow-lg`} />}
                       </div>
                       <h4 className={`font-black text-sm mb-1 ${activeTab === tab.id ? 'text-white' : 'text-white/80'}`}>{tab.label}</h4>
                       <p className={`text-[10px] font-medium leading-relaxed ${activeTab === tab.id ? 'text-white/60' : 'text-white/30'}`}>{tab.desc}</p>
                       
                       {tab.id === 'layer1' && tab.state && (
                         <div className="mt-3 flex -space-x-2">
                             {localConfig.layer1.map(id => {
                                const m = getModelById(id);
                                return (
                                   <div key={id} className={`w-6 h-6 rounded-lg flex items-center justify-center p-1 border ${activeTab === tab.id ? 'bg-white/10 border-white/20' : `${m?.bg || 'bg-[#1a1a23]'} border-white/5 shadow-lg`}`}>
                                      <img src={m?.icon} className="w-full h-full object-contain" alt="" />
                                   </div>
                                );
                             })}
                         </div>
                       )}
                       {tab.id !== 'layer1' && tab.state && (
                         <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-400'}`}>
                            <img src={tab.model?.icon} className="w-3 h-3 object-contain" alt="" /> {tab.model?.name}
                         </div>
                       )}
                    </button>
                 ))}
              </div>

              <div className="mt-8">
                 <button
                   onClick={handleSave}
                   disabled={!isComplete}
                   className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${isComplete ? 'bg-white text-black hover:scale-[1.02] shadow-2xl active:scale-95' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                 >
                   Establish Stack
                 </button>
              </div>
           </div>

           {/* Content */}
           <div className="flex-1 p-12 flex flex-col overflow-hidden bg-[#0d0d12]/40 backdrop-blur-sm">
              <div className="mb-12 relative group">
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search high-stakes weights..."
                   className="w-full bg-[#121217] border border-white/5 rounded-3xl px-14 py-5 text-base text-white placeholder-white/20 outline-none focus:border-blue-500/30 focus:bg-[#18181f] transition-all font-bold"
                 />
                 <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                 {activeTab === 'layer1' && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Selected capacity</span>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => (
                             <div key={i} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${localConfig.layer1.length >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} />
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredModels.length > 0 ? filteredModels.map(model => (
                       <button
                         key={model.id}
                         onClick={() => handleSelect(model.id)}
                         className={`group p-8 rounded-[40px] border text-left transition-all relative flex flex-col ${isSelected(model.id) ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_20px_60px_rgba(37,99,235,0.05)]' : 'bg-[#121217] border-white/5 hover:border-white/10 hover:bg-[#1a1a23]'}`}
                       >
                          <div className="flex items-start justify-between mb-10">
                             <div className={`w-16 h-16 rounded-3xl flex items-center justify-center p-3 shadow-xl transition-all duration-500 ${isSelected(model.id) ? 'bg-white scale-110' : `${model.bg || 'bg-[#1a1a23]'} border border-white/5 grayscale group-hover:grayscale-0 group-hover:scale-105`}`}>
                                <img src={model.icon} className="w-full h-full object-contain" alt="" />
                             </div>
                             {isSelected(model.id) && (
                                <div className="w-8 h-8 rounded-2xl bg-blue-500 flex items-center justify-center text-white scale-in duration-300 shadow-lg">
                                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                             )}
                          </div>
                          
                          <h3 className={`font-black text-xl mb-1 ${isSelected(model.id) ? 'text-white' : 'text-white/60 group-hover:text-white'} transition-colors`}>{model.name}</h3>
                          <div className="flex items-center gap-3">
                             <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSelected(model.id) ? 'text-blue-400' : 'text-white/20 group-hover:text-white/40'}`}>{model.provider}</span>
                             <div className="w-1 h-1 rounded-full bg-white/10" />
                             <span className="text-[10px] font-bold text-white/10">{model.category}</span>
                          </div>
                          
                          {isSelected(model.id) && (
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px] opacity-50" />
                          )}
                       </button>
                    )) : (
                       <div className="col-span-full py-32 text-center">
                          <div className="text-4xl mb-6 opacity-20">📡</div>
                          <div className="opacity-20 font-black uppercase tracking-[0.4em] text-sm">Frequency Search: 0 Results</div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
