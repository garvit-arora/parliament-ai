import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getModelById } from '../data/models';
import ReactMarkdown from 'react-markdown';

/**
 * 4-Layer Node-based Flow Canvas with Draggable Nodes
 */
export default function FlowCanvas({
  prompt,
  responsesL1,
  responseL2,
  isThinking,
  phase, 
  config
}) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 1200, h: 400 });
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Custom positions for nodes
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize positions once or when config changes
  useEffect(() => {
    const w = Math.max(containerSize.w, 1300);
    const h = 400;
    const col0 = w * 0.15;
    const col1 = w * 0.45;
    const col2 = w * 0.75;

    const initial = {};
    initial['input'] = { x: col0, y: h / 2 };
    
    const l1Models = config?.layer1 || ['gpt', 'grok', 'deepseek'];
    const l1StartY = (h / 2) - ((l1Models.length - 1) * 140) / 2;
    l1Models.forEach((id, i) => {
      initial[`l1-${id}`] = { x: col1, y: l1StartY + i * 140 };
    });

    initial['l2'] = { x: col2, y: h / 2 };

    setNodePositions(initial);
  }, [config, containerSize.w]);

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
    const x = (e.clientX - rect.left) - dragOffset.current.x;
    const y = (e.clientY - rect.top) - dragOffset.current.y;
    
    setNodePositions(prev => ({
      ...prev,
      [draggingNode]: { x, y }
    }));
  }, [draggingNode]);

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const getL1Response = (modelId) => responsesL1?.find((r) => r.model_id === modelId);

  const getStatus = (nodeTier) => {
    if (!isThinking && phase !== 'done') return 'idle';
    if (nodeTier === 'input') return 'done';
    if (nodeTier === 'l1') return phase === 'querying_l1' ? 'thinking' : (responsesL1 ? 'done' : 'waiting');
    if (nodeTier === 'l2') return phase === 'querying_l2' ? 'thinking' : (phase === 'done' ? 'done' : 'waiting');
    return 'idle';
  };

  const l1Nodes = (config?.layer1 || ['gpt', 'grok', 'deepseek']).map(id => ({
    id: `l1-${id}`,
    modelId: id,
    model: getModelById(id)
  }));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[500px] overflow-hidden bg-[#1a1b26]/30 rounded-[40px] border border-white/5 cursor-crosshair"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {selectedNode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedNode(null)}>
           <div className="bg-[#1c1c1e] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl scale-in" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-white/5 p-2 flex items-center justify-center border border-white/10">
                        <img src={selectedNode.icon} className="w-full h-full object-contain" alt="" />
                     </div>
                    <div>
                       <h2 className="text-xl font-black">{selectedNode.modelName}</h2>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{selectedNode.tier}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/5 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
              </div>
              <div className="p-10 overflow-y-auto prose prose-invert prose-sm max-w-none">
                 <ReactMarkdown>{selectedNode.content || "Generating logic stream..."}</ReactMarkdown>
              </div>
           </div>
        </div>
      )}

      <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
        {nodePositions['input'] && l1Nodes.map((n, i) => (
          nodePositions[n.id] && <FlowLine key={n.id} x1={nodePositions['input'].x} y1={nodePositions['input'].y} x2={nodePositions[n.id].x} y2={nodePositions[n.id].y} isActive={['querying_l1', 'querying_l2', 'done'].includes(phase)} color="#10b981" />
        ))}
        {l1Nodes.map((n, i) => (
          nodePositions[n.id] && nodePositions['l2'] && <FlowLine key={`${n.id}-l2`} x1={nodePositions[n.id].x} y1={nodePositions[n.id].y} x2={nodePositions['l2'].x} y2={nodePositions['l2'].y} isActive={['querying_l2', 'done'].includes(phase)} color={n.model?.color || '#3b82f6'} />
        ))}
      </svg>

      {nodePositions['input'] && (
        <AutomationNode x={nodePositions['input'].x} y={nodePositions['input'].y} status={getStatus('input')} title="Input" subtitle="Source" onMouseDown={(e) => handleMouseDown('input', e)}>
           <p className="text-[9px] text-white/50 truncate max-w-[120px]">{prompt}</p>
        </AutomationNode>
      )}

      {l1Nodes.map(n => nodePositions[n.id] && (
        <AutomationNode key={n.id} x={nodePositions[n.id].x} y={nodePositions[n.id].y} status={getStatus('l1')} color={n.model?.color} title={n.model?.name} subtitle="Deliberator" icon={n.model?.icon} onMouseDown={(e) => handleMouseDown(n.id, e)} onClick={() => setSelectedNode({ modelName: n.model?.name, icon: n.model?.icon, tier: 'Level 1', content: getL1Response(n.modelId)?.response })}>
           {getStatus('l1') === 'thinking' && <div className="text-[9px] animate-pulse">Deliberating...</div>}
           {getL1Response(n.modelId)?.status === 'success' && <div className="text-[9px] text-white/40 italic">Review Output →</div>}
        </AutomationNode>
      ))}

      {nodePositions['l2'] && (
        <AutomationNode x={nodePositions['l2'].x} y={nodePositions['l2'].y} status={getStatus('l2')} color={getModelById(config?.layer2 || 'gpt')?.color} title={getModelById(config?.layer2 || 'gpt')?.name} subtitle="Final Verdict" icon={getModelById(config?.layer2 || 'gpt')?.icon} onMouseDown={(e) => handleMouseDown('l2', e)} onClick={() => setSelectedNode({ modelName: getModelById(config?.layer2 || 'gpt')?.name, icon: getModelById(config?.layer2 || 'gpt')?.icon, tier: 'Level 2', content: responseL2?.response })}>
           {getStatus('l2') === 'thinking' && <div className="text-[9px] animate-pulse">Synthesizing...</div>}
           {responseL2 && <div className="text-[9px] text-emerald-400 font-bold">Consensus Reached →</div>}
        </AutomationNode>
      )}
    </div>
  );
}

function FlowLine({ x1, y1, x2, y2, isActive, color }) {
  const midX = x1 + (x2 - x1) * 0.5;
  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  return (
    <g>
      <path d={path} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
      {isActive && <path d={path} fill="none" stroke={color} strokeWidth="2" strokeDasharray="5 5" style={{ animation: 'flow-dash 2s linear infinite' }} />}
    </g>
  );
}

function AutomationNode({ x, y, status, icon, title, subtitle, children, color, onMouseDown, onClick }) {
  const isActive = status === 'thinking';
  const isDone = status === 'done';
  return (
    <div 
      onMouseDown={onMouseDown}
      onClick={isDone ? onClick : undefined}
      className={`absolute z-10 transition-shadow select-none ${isDone ? 'cursor-grab active:cursor-grabbing' : 'opacity-40 pointer-events-none'}`} 
      style={{ left: x, top: y, width: 180, transform: `translate(-50%, -50%)` }}
    >
      <div className={`rounded-2xl bg-[#0f1115] border ${isActive ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : isDone ? 'border-white/10 hover:border-white/30' : 'border-white/5'} transition-all`}>
        <div className="flex items-center gap-2 p-3 bg-white/[0.02] border-b border-white/[0.05]">
          <div className="w-6 h-6 rounded bg-white/5 p-1 flex items-center justify-center border border-white/5">
             <img src={icon} className="w-full h-full object-contain" alt="" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black text-white/90 uppercase tracking-widest truncate">{title}</h3>
            <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">{subtitle}</p>
          </div>
        </div>
        <div className="p-3 min-h-[44px] flex flex-col justify-center">{children}</div>
      </div>
    </div>
  );
}
