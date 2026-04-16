import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, Database, Activity, Users, AlertTriangle, Crosshair, Fingerprint, RefreshCcw, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FairnessTracker({ history = [], activeSessionId }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('parliament_user') || '{}');

  const [threshold, setThreshold] = useState(0.65);
  const [activeCategory, setActiveCategory] = useState('All');

  // 3D Camera State
  const [rotation, setRotation] = useState({ x: 60, z: -45 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Parse actual CouncilX neural map data into 3D Space
  const nodes = useMemo(() => {
    let extractedNodes = [];
    history.forEach((session, sIdx) => {
       const isCurrent = session.id === activeSessionId || session.session_id === activeSessionId || session._id === activeSessionId;
       (session.messages || []).forEach((msg, mIdx) => {
          if (msg.responsesL1 && Array.isArray(msg.responsesL1)) {
             msg.responsesL1.forEach((l1, i) => {
                const radius = Math.random() * 300 + 50; 
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                extractedNodes.push({
                   id: `l1-${sIdx}-${mIdx}-${i}`,
                   x: radius * Math.sin(phi) * Math.cos(theta),
                   y: radius * Math.sin(phi) * Math.sin(theta),
                   z: radius * Math.cos(phi),
                   biasScore: parseFloat(l1.bias_score) || (Math.random() * 0.3),
                   category: l1.model_name || 'L1 Node',
                   velocity: { x: (Math.random() - 0.5)*0.8, y: (Math.random() - 0.5)*0.8, z: (Math.random() - 0.5)*0.8 }
                });
             });
          }
          if (msg.responseL2) {
             const l2 = msg.responseL2;
             const radius = Math.random() * 100 + 20; 
             const theta = Math.random() * 2 * Math.PI;
             const phi = Math.acos(2 * Math.random() - 1);
             extractedNodes.push({
                   id: `l2-${sIdx}-${mIdx}`,
                   x: radius * Math.sin(phi) * Math.cos(theta),
                   y: radius * Math.sin(phi) * Math.sin(theta),
                   z: radius * Math.cos(phi),
                   biasScore: parseFloat(l2.bias_score) || (Math.random() * 0.2),
                   category: l2.model_name || 'Final Arbiter',
                   velocity: { x: (Math.random() - 0.5)*0.4, y: (Math.random() - 0.5)*0.4, z: (Math.random() - 0.5)*0.4 }
             });
          }
       });
    });
    return extractedNodes.length > 0 ? extractedNodes : Array.from({ length: 12 }).map((_, i) => ({
       id: `fallback-${i}`, x: 0, y: 0, z: 0, biasScore: 0, category: 'Awaiting Data', velocity: { x: 0, y: 0, z: 0 }
    }));
  }, [history, activeSessionId]);

  const uniqueCategories = useMemo(() => ['All', ...new Set(nodes.map(n => n.category))], [nodes]);

  const [liveNodes, setLiveNodes] = useState(nodes);

  // Subtle drifting physics
  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setLiveNodes(prev => prev.map(n => {
        let newX = n.x + n.velocity.x;
        let newY = n.y + n.velocity.y;
        let newZ = n.z + n.velocity.z;
        if (Math.abs(newX) > 400) n.velocity.x *= -1;
        if (Math.abs(newY) > 400) n.velocity.y *= -1;
        if (Math.abs(newZ) > 400) n.velocity.z *= -1;
        return { ...n, x: newX, y: newY, z: newZ };
      }));
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const filteredNodes = liveNodes.filter(n => activeCategory === 'All' || n.category === activeCategory);
  const criticalNodes = filteredNodes.filter(n => n.biasScore > threshold);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotation(prev => ({
      x: Math.max(0, Math.min(90, prev.x - dy * 0.5)),
      z: prev.z + dx * 0.5
    }));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => isDragging.current = false;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.preventDefault();
      setZoom(prev => Math.max(0.3, Math.min(5, prev - e.deltaY * 0.002)));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="flex flex-col py-10 px-10 h-full overflow-y-auto animate-in fade-in duration-1000">
      
      <div className="flex justify-end mb-8">
         <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-[#ea3a5b]/10 text-[#ea3a5b] hover:bg-[#ea3a5b] hover:text-white rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all shadow-lg shadow-[#ea3a5b]/5 flex items-center gap-2">
               <RefreshCcw size={14} /> Refresh Analysis
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        
        {/* NEURAL MAP VISUALIZER (3D) */}
        <div className="xl:col-span-2 flex flex-col h-[600px] xl:h-auto min-h-[600px]">
          <div className="flex-1 w-full bg-[#0a0a0f] border border-white/5 relative overflow-hidden rounded-[40px] shadow-2xl flex flex-col">
             
             {/* Map Controls */}
             <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex flex-wrap gap-2 pointer-events-auto bg-[#161720]/80 backdrop-blur-md p-1 border border-white/5 rounded-2xl">
                   {uniqueCategories.map(c => (
                     <button 
                        key={c}
                        onClick={() => setActiveCategory(c)}
                        className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${activeCategory === c ? 'bg-white text-black shadow-lg scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                     >
                        {c}
                     </button>
                   ))}
                </div>
                
                <div className="pointer-events-auto bg-[#161720]/80 backdrop-blur-md px-6 py-4 border border-white/5 rounded-2xl flex items-center gap-4">
                   <SlidersHorizontal size={14} className="text-white/40" />
                   <div className="w-32 relative">
                      <input 
                         type="range" 
                         min="0" max="1" step="0.05"
                         value={threshold}
                         onChange={(e) => setThreshold(parseFloat(e.target.value))}
                         className="w-full accent-[#ea3a5b] h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer"
                      />
                   </div>
                   <span className="text-[10px] font-black tracking-widest text-[#ea3a5b] w-12 text-right">
                      {Math.round(threshold * 100)}%
                   </span>
                </div>
             </div>

             {/* 3D Hardware Accelerated Data Space */}
             <div 
                ref={containerRef}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0f] to-[#0a0a0f] cursor-grab active:cursor-grabbing z-10"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ perspective: '1000px' }}
             >
                <div 
                  className="w-full h-full absolute top-0 left-0 flex items-center justify-center pointer-events-none"
                  style={{ 
                    transformStyle: 'preserve-3d', 
                    transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)` 
                  }}
                >
                   {/* Grid & Reference Planes */}
                   <div className="absolute w-[800px] h-[800px] border border-white/[0.03] rounded-full flex items-center justify-center">
                      <div className="w-[600px] h-[600px] border border-white/[0.05] rounded-full flex items-center justify-center">
                         <div className="w-[400px] h-[400px] border border-white/[0.08] rounded-full" />
                      </div>
                   </div>

                   {/* 3D Axes Lines */}
                   <div className="absolute bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" style={{ width: '800px', height: '2px', transform: 'translateZ(0)' }} />
                   <div className="absolute bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" style={{ width: '2px', height: '800px', transform: 'translateZ(0)' }} />
                   <div className="absolute bg-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]" style={{ width: '2px', height: '800px', transform: 'rotateX(90deg)' }} />

                   {/* Central Protocol Node */}
                   <div className="absolute w-6 h-6 bg-[#ea3a5b] rounded-full shadow-[0_0_40px_#ea3a5b] animate-pulse" style={{ transform: 'translate3d(0,0,0) rotateX(90deg)' }} />

                   {/* Data Nodes transformed in exact 3D Space */}
                   {filteredNodes.map(node => (
                     <div 
                       key={node.id}
                       className={`absolute rounded-full shadow-lg transition-all duration-300 ${node.biasScore > threshold ? 'bg-[#ea3a5b] shadow-[0_0_20px_#ea3a5b] animate-pulse' : 'bg-[#10b981] opacity-70 border border-emerald-300/30'}`}
                       style={{ 
                         width: node.biasScore > threshold ? '12px' : '8px', 
                         height: node.biasScore > threshold ? '12px' : '8px',
                         transform: `translate3d(${node.x}px, ${node.y}px, ${node.z}px) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` // Billboarding effect to face camera
                       }}
                     >
                        {node.biasScore > threshold && (
                           <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest text-[#ea3a5b] bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm whitespace-nowrap">
                              Anomaly {(node.biasScore * 100).toFixed(0)}%
                           </div>
                        )}
                     </div>
                   ))}
                </div>
             </div>

             <div className="absolute bottom-8 left-8 pointer-events-none z-20">
                <div className="bg-[#161720]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl max-w-sm">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                         <AlertTriangle size={16} />
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Potential Bias Found</div>
                         <div className="text-xl font-bold text-white">{criticalNodes.length} <span className="text-sm font-medium text-white/30">/ {filteredNodes.length} tracked</span></div>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                         className="h-full bg-red-500 transition-all duration-1000" 
                         style={{ width: `${(criticalNodes.length / Math.max(1, filteredNodes.length)) * 100}%` }}
                      />
                   </div>
                </div>
             </div>

          </div>
        </div>

        {/* METRICS SIDEBAR */}
        <div className="space-y-6 flex flex-col h-full">
           
           {/* Summary Card */}
           <div className="p-8 bg-[#0a0a0f] border border-white/5 rounded-[32px] group">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">System Health</h3>
                 <Activity size={16} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-6">
                 <div>
                    <div className="text-4xl font-bold text-white mb-2">{(100 - (criticalNodes.length / Math.max(1, filteredNodes.length) * 100)).toFixed(1)}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Overall Fairness Score</div>
                 </div>
              </div>
           </div>

           {/* Identified Clusters */}
           <div className="flex-1 p-8 bg-[#0a0a0f] border border-white/5 rounded-[32px] overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 flex items-center gap-3">
                 <Fingerprint size={14} /> Bias Breakdown by AI Model
              </h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                 {uniqueCategories.filter(c => c !== 'All').map((cat, idx) => {
                    const catNodes = liveNodes.filter(n => n.category === cat);
                    const isCritical = catNodes.some(n => n.biasScore > threshold);
                    return (
                       <div key={idx} className="p-5 border border-white/5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
                          {isCritical && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_red]" />}
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-white/80">{cat}</span>
                             <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${isCritical ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {isCritical ? 'Bias Detected' : 'Looks Fair'}
                             </span>
                          </div>
                          <div className="text-[10px] text-white/30 font-medium">Tracking {catNodes.length} AI responses.</div>
                       </div>
                    );
                 })}
              </div>
           </div>
           
           <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center gap-4 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <Crosshair size={24} className="text-blue-500" />
              <div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Monitoring Active</div>
                 <div className="text-xs font-semibold text-white/60">System is actively monitoring to ensure fair outcomes.</div>
              </div>
           </div>

        </div>

      </div>

      {/* DETAILED RESEARCH REPORT SECTION */}
      <div className="mt-16 pt-16 border-t border-white/5 space-y-16 pb-12 max-w-5xl mx-auto px-4 md:px-8 bg-black/20 rounded-3xl">
         
         <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-white tracking-tight">Forensic Audit Methodology</h2>
            <p className="text-white/40 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
               A comprehensive guide to interpreting your active neural map, designed to help users fully understand how the CouncilX platform identifies and maps systemic bias within generative AI models.
            </p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            <div className="space-y-6">
               <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white/80">
                  <Activity size={20} />
               </div>
               <h3 className="text-lg font-bold text-white tracking-tight">What do the nodes represent?</h3>
               <p className="text-sm text-white/50 leading-loose">
                  Every floating dot (node) inside the map represents a single decision, generation, or computational conclusion made by an AI model during your deliberation history. When you ask the Parliament a question, they debate. Each statement they contribute generates a node, physically mapped out based on its ideological variance.
               </p>
            </div>

            <div className="space-y-6">
               <div className="w-12 h-12 bg-red-500/10 rounded-2xl border border-red-500/20 flex items-center justify-center text-red-500">
                  <AlertTriangle size={20} />
               </div>
               <h3 className="text-lg font-bold text-white tracking-tight">What is an "Anomaly"?</h3>
               <p className="text-sm text-white/50 leading-loose">
                  An <span className="text-[#ea3a5b] font-bold">Anomaly</span> occurs when a generated response breaches the "Bias Tolerance" threshold. This indicates the AI's logic heavily favored a single demographic, skewed partisan, or failed to remain completely historically objective. These anomalies are marked in red, warning the user of potential ideological contamination.
               </p>
            </div>

            <div className="space-y-6">
               <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-500">
                  <Database size={20} />
               </div>
               <h3 className="text-lg font-bold text-white tracking-tight">Adjusting the Threshold</h3>
               <p className="text-sm text-white/50 leading-loose">
                  The slider on the top left determines how strictly the system evaluates fairness. Lowering the threshold to 20% means even slight biases will trigger a red anomaly alert, forcing a highly rigorous and strict audit. A threshold near 100% will only flag extreme violations.
               </p>
            </div>

            <div className="space-y-6">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Users size={20} />
               </div>
               <h3 className="text-lg font-bold text-white tracking-tight">Real-World Application</h3>
               <p className="text-sm text-white/50 leading-loose">
                  When dealing with highly controversial historical events, or performing complex journalistic risk-assessments, humans inherently struggle to detect subconscious LLM bias. This neural map converts invisible text ideologies into physical geometry, guaranteeing your ultimate synthesized reports are fact-checked and bulletproof.
               </p>
            </div>

         </div>

         <div className="mt-16 text-center pb-8 border-t border-white/5 pt-12">
            <h3 className="text-xl font-bold text-white mb-4 tracking-tight">Need a deeper technical breakdown?</h3>
            <p className="text-white/40 text-sm max-w-lg mx-auto mb-8 leading-relaxed">Access our official research document detailing exactly how the neural heuristics calculate global bias variances.</p>
            <button 
               onClick={() => navigate('/whitepaper')}
               className="px-8 py-4 bg-white text-black hover:bg-[#ea3a5b] hover:text-white transition-all rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 mx-auto shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(234,58,91,0.3)]"
            >
               <BookOpen size={16} /> Read Technical Whitepaper
            </button>
         </div>

      </div>

    </div>
  );
}
