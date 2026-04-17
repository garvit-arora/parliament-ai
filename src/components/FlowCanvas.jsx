import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getModelById } from '../data/models';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Plus, 
  Trash2, 
  Play, 
  Database, 
  Cpu, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  ArrowRight,
  Maximize2,
  FileText, 
  Zap, 
  Search, 
  MessageSquare, 
  X, 
  CheckCircle2 
} from 'lucide-react';

/**
 * RESTORED Flow Canvas UI: Initial Curved-Line Aesthetic
 * Merged with Forensic RAG & HUD Features
 */
export default function FlowCanvas({
  activeSessionId,
  responsesL1 = [],
  responseL2 = '',
  isThinking = false,
  phase = null,
  isFileAttached = false,
  currentPrompt = '',
  config = { layer1: ['gpt', 'grok', 'deepseek'], layer2: 'gpt' }
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 1200, h: 400 });
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Custom positions for nodes
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const [nodeWidth, setNodeWidth] = useState(220);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize positions
  useEffect(() => {
    // Make initialization fully responsive to the current container size, defaulting to 1000px if unmeasured
    const w = containerSize.w > 0 ? containerSize.w : 1000;
    const h = containerSize.h > 100 ? containerSize.h : 500; 
    const col0 = w * 0.08;
    const colR = w * 0.24;
    const colS = w * 0.44;
    const col1 = w * 0.68;
    const col2 = w * 0.90;

    // Calculate dynamic node width to fit
    const activeCols = isFileAttached ? 5 : 4;
    const calculatedWidth = Math.min(220, (w / activeCols) * 0.85);
    setNodeWidth(calculatedWidth);

    const initial = {};
    initial['input'] = { x: col0, y: h / 2 };
    initial['retrieval'] = { x: colR, y: h / 2 };
    initial['web-search'] = { x: colS, y: h / 2 };
    
    const l1Models = config?.layer1 || ['gpt', 'grok', 'deepseek'];
    const spacing = Math.min(150, (h - 140) / Math.max(1, l1Models.length - 1));
    const l1StartY = Math.max(80, (h / 2) - ((l1Models.length - 1) * spacing) / 2);
    
    l1Models.forEach((id, i) => {
      initial[`l1-${id}`] = { x: col1, y: l1StartY + i * spacing };
    });

    initial['l2'] = { x: col2, y: h / 2 };

    setNodePositions(prev => {
      // Break the loop if the coordinates are already synchronized
      const hasChanged = Object.keys(initial).some(k => 
        !prev[k] || Math.abs(prev[k].x - initial[k].x) > 1 || Math.abs(prev[k].y - initial[k].y) > 1
      );
      return hasChanged ? initial : prev;
    });
  }, [config, Math.round(containerSize.w / 20)]); // Bucket width changes to prevent jitters

  const handleMouseDown = (id, e) => {
    e.stopPropagation();
    setDraggingNode(id);
    const pos = nodePositions[id];
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: (e.clientX - rect.left) - pos.x,
      y: (e.clientY - rect.top) - pos.y
    };
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggingNode) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) - dragOffset.current.x;
    let y = (e.clientY - rect.top) - dragOffset.current.y;
    
    // Clamp to canvas boundaries to prevent nodes going out of box
    x = Math.max(nodeWidth / 2, Math.min(x, rect.width - nodeWidth / 2)); 
    y = Math.max(60, Math.min(y, rect.height - 60));
    
    setNodePositions(prev => ({
      ...prev,
      [draggingNode]: { x, y }
    }));
  }, [draggingNode]);

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const getL1Response = (modelId) => responsesL1?.find((r) => r.model_id === modelId || r.model === modelId);

  const getStatus = (nodeTier, modelId = null) => {
    if (!isThinking && phase !== 'done') return 'idle';
    if (nodeTier === 'input') return 'done';
    if (nodeTier === 'retrieval') return phase === 'reading_file' ? 'thinking' : (phase !== null && phase !== 'reading_file' && phase !== 'retrieving' ? 'done' : 'waiting');
    
    if (nodeTier === 'web-search') {
       if (phase === 'web_searching') return 'thinking';
       return (['querying_l1', 'querying_l2', 'done'].includes(phase) || !!responseL2) ? 'done' : 'waiting';
    }

    if (nodeTier === 'l1') {
       if (phase === 'querying_l1') return 'thinking';
       return (responsesL1 && responsesL1.length > 0) ? 'done' : 'waiting';
    }
    
    if (nodeTier === 'l2') {
       if (phase === 'querying_l2') return 'thinking';
       return (phase === 'done' || responseL2) ? 'done' : 'waiting';
    }
    return 'idle';
  };

  const l1Nodes = (config?.layer1 || ['gpt', 'grok', 'deepseek']).map(id => ({
    id: `l1-${id}`,
    modelId: id,
    model: getModelById(id)
  }));

  const l2Model = getModelById(config?.layer2 || 'gpt');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-full overflow-hidden bg-[#1a1b26]/30 rounded-[40px] border border-white/5 cursor-crosshair"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    >
      {/* HUD extracted to App.jsx for 'out of box' alignment */}


      {selectedNode && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-10 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedNode(null)}>
           <div className="bg-[#0f1115] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-white p-2 flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
                        <img src={selectedNode.icon} className="w-full h-full object-contain" alt="" />
                     </div>
                    <div>
                       <h2 className="text-xl font-black text-white">{selectedNode.modelName}</h2>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ea3a5b] mt-1 italic">{selectedNode.tier}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-3 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="p-12 overflow-y-auto prose prose-invert max-w-none custom-scrollbar">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedNode.content || "Generating logic stream..."}</ReactMarkdown>
              </div>
           </div>
        </div>
      )}

      <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
        {nodePositions['input'] && (
           <>
              {isFileAttached ? (
                 <>
                    <FlowLine x1={nodePositions['input'].x} y1={nodePositions['input'].y} x2={nodePositions['retrieval'].x} y2={nodePositions['retrieval'].y} isActive={isThinking} color="#10b981" />
                    <FlowLine x1={nodePositions['retrieval'].x} y1={nodePositions['retrieval'].y} x2={nodePositions['web-search'].x} y2={nodePositions['web-search'].y} isActive={['web_searching', 'querying_l1', 'querying_l2', 'done'].includes(phase)} color="#3b82f6" />
                    {l1Nodes.map((n) => (
                       nodePositions[n.id] && <FlowLine key={n.id} x1={nodePositions['web-search'].x} y1={nodePositions['web-search'].y} x2={nodePositions[n.id].x} y2={nodePositions[n.id].y} isActive={['querying_l1', 'querying_l2', 'done'].includes(phase)} color="#3b82f6" />
                    ))}
                 </>
              ) : (
                 <>
                    <FlowLine x1={nodePositions['input'].x} y1={nodePositions['input'].y} x2={nodePositions['web-search'].x} y2={nodePositions['web-search'].y} isActive={isThinking} color="#ea3a5b" />
                    {l1Nodes.map((n) => (
                       nodePositions[n.id] && <FlowLine key={n.id} x1={nodePositions['web-search'].x} y1={nodePositions['web-search'].y} x2={nodePositions[n.id].x} y2={nodePositions[n.id].y} isActive={['querying_l1', 'querying_l2', 'done'].includes(phase)} color="#3b82f6" />
                    ))}
                 </>
              )}
           </>
        )}
        {l1Nodes.map((n) => (
          nodePositions[n.id] && nodePositions['l2'] && <FlowLine key={`${n.id}-l2`} x1={nodePositions[n.id].x} y1={nodePositions[n.id].y} x2={nodePositions['l2'].x} y2={nodePositions['l2'].y} isActive={['querying_l2', 'done'].includes(phase) || !!responseL2} color={n.model?.color || '#3b82f6'} />
        ))}
      </svg>

      {nodePositions['input'] && (
        <AutomationNode x={nodePositions['input'].x} y={nodePositions['input'].y} nodeWidth={nodeWidth} status={getStatus('input')} title="Audit Input" subtitle="Registry" onMouseDown={(e) => handleMouseDown('input', e)}>
           <p className="opacity-50 truncate font-mono italic" style={{ fontSize: Math.max(7, nodeWidth / 25) }}>Awaiting Deliberation...</p>
        </AutomationNode>
      )}

      {isFileAttached && nodePositions['retrieval'] && (
        <AutomationNode x={nodePositions['retrieval'].x} y={nodePositions['retrieval'].y} nodeWidth={nodeWidth} status={getStatus('retrieval')} title="Forensic RAG" subtitle="Read Document" onMouseDown={(e) => handleMouseDown('retrieval', e)}>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1 text-[8px]">
              <div className={`h-full bg-emerald-500 transition-all duration-[2000ms] ${phase === 'reading_file' ? 'w-full' : 'w-0'}`} />
           </div>
        </AutomationNode>
      )}

      {nodePositions['web-search'] && (
        <AutomationNode x={nodePositions['web-search'].x} y={nodePositions['web-search'].y} nodeWidth={nodeWidth} status={getStatus('web-search')} title="Search Agent" subtitle="Web Research" icon="" onMouseDown={(e) => handleMouseDown('web-search', e)}>
           <div className="flex items-center gap-3">
              <Search size={Math.max(10, nodeWidth / 15)} className={`text-blue-500 ${phase === 'web_searching' ? 'animate-bounce' : ''}`} />
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full bg-blue-500 transition-all duration-[3000ms] ${phase === 'web_searching' ? 'w-full' : (['querying_l1', 'querying_l2', 'done'].includes(phase) ? 'w-full' : 'w-0')}`} />
              </div>
           </div>
        </AutomationNode>
      )}

      {l1Nodes.map(n => nodePositions[n.id] && (
        <AutomationNode key={n.id} x={nodePositions[n.id].x} y={nodePositions[n.id].y} nodeWidth={nodeWidth} status={getStatus('l1', n.modelId)} color={n.model?.color} title={n.model?.name} subtitle="Council Node" icon={n.model?.icon} onMouseDown={(e) => handleMouseDown(n.id, e)} onClick={() => setSelectedNode({ modelName: n.model?.name, icon: n.model?.icon, tier: 'Level 1 Analysis', content: getL1Response(n.modelId)?.response })}>
           {getStatus('l1') === 'thinking' && <div className="animate-pulse text-[#ea3a5b] font-black uppercase tracking-widest" style={{ fontSize: Math.max(6, nodeWidth / 25) }}>Deliberating...</div>}
           {getL1Response(n.modelId) && <div className="text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 italic" style={{ fontSize: Math.max(6, nodeWidth / 25) }}>Review Findings <ArrowRight size={8} /></div>}
        </AutomationNode>
      ))}

      {nodePositions['l2'] && (
        <AutomationNode x={nodePositions['l2'].x} y={nodePositions['l2'].y} nodeWidth={nodeWidth} status={getStatus('l2')} color={l2Model?.color} title={l2Model?.name} subtitle="Final Arbiter" icon={l2Model?.icon} onMouseDown={(e) => handleMouseDown('l2', e)} onClick={() => setSelectedNode({ modelName: l2Model?.name, icon: l2Model?.icon, tier: 'Consensus Outcome', content: (typeof responseL2 === 'string' ? responseL2 : responseL2?.response) })}>
           {getStatus('l2') === 'thinking' && <div className="animate-pulse text-blue-500 font-black uppercase tracking-widest" style={{ fontSize: Math.max(6, nodeWidth / 25) }}>Synthesizing...</div>}
           {responseL2 && <div className="text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 italic" style={{ fontSize: Math.max(6, nodeWidth / 25) }}>Consensus Reached <ArrowRight size={8} /></div>}
        </AutomationNode>
      )}
    </div>
  );
}

function FlowLine({ x1, y1, x2, y2, isActive, color }) {
  const midX = x1 + (x2 - x1) * 0.5;
  // Use quadratic Bezier for nice curves
  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  return (
    <g>
      <path d={path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      {isActive && (
         <>
            <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6 6" className="flow-dash-animation" style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
            <style>{`
               .flow-dash-animation {
                  animation: flowDashMove 1.5s linear infinite;
               }
               @keyframes flowDashMove {
                  from { stroke-dashoffset: 12; }
                  to { stroke-dashoffset: 0; }
               }
            `}</style>
         </>
      )}
    </g>
  );
}

function AutomationNode({ x, y, status, icon, title, subtitle, children, color, onMouseDown, onClick, nodeWidth = 220 }) {
  const isActive = status === 'thinking';
  const isDone = status === 'done';
  const scale = nodeWidth / 220;
  
  return (
    <div 
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`absolute z-10 transition-all select-none cursor-pointer hover:translate-y-[-2px] ${isDone ? 'opacity-100' : 'opacity-40 grayscale-[0.5]'}`} 
      style={{ left: x, top: y, width: nodeWidth, transform: `translate(-50%, -50%)` }}
    >
      <div className={`rounded-2xl bg-[#0f1115] border transition-all duration-500 overflow-hidden shadow-2xl ${isActive ? 'border-[#ea3a5b] shadow-[0_0_40px_rgba(234,58,91,0.2)]' : isDone ? 'border-white/10 hover:border-emerald-500/30' : 'border-white/5'}`}>
        <div className="flex items-center gap-3 p-3 bg-white/[0.03] border-b border-white/[0.05]" style={{ padding: 12 * scale }}>
          <div className="rounded-xl bg-white flex items-center justify-center border border-white/5 shadow-inner overflow-hidden flex-shrink-0" style={{ width: 40 * scale, height: 40 * scale, padding: 8 * scale }}>
             {icon ? <img src={icon} className="w-full h-full object-contain" alt="" /> : <Cpu size={20 * scale} className="text-black" />}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-white uppercase tracking-widest truncate" style={{ fontSize: Math.max(8, 11 * scale) }}>{title}</h3>
            <p className="opacity-20 font-black uppercase tracking-[0.3em] mt-0.5" style={{ fontSize: Math.max(6, 8 * scale) }}>{subtitle}</p>
          </div>
          {isDone && <CheckCircle2 size={12 * scale} className="text-emerald-500 flex-shrink-0" />}
        </div>
        <div className="flex flex-col justify-center bg-[#09090b]/40" style={{ padding: 16 * scale, minHeight: 50 * scale }}>
           {children}
        </div>
      </div>
    </div>
  );
}
