import { useState, useEffect, useMemo, useRef } from 'react';
import { getModelById } from '../data/models';

/**
 * The main Parliament Floor — semicircle of model nodes with
 * neural connection lines, energy waves, and response bubbles
 */
export default function ParliamentFloor({
  selectedModels,
  responses,
  speakerResponse,
  isThinking,
  isIdle,
}) {
  const svgRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ w: 800, h: 500 });
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ w: width, h: height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calculate node positions in a semicircle
  const nodePositions = useMemo(() => {
    const cx = containerSize.w / 2;
    const cy = containerSize.h * 0.65;
    const radiusX = Math.min(containerSize.w * 0.38, 350);
    const radiusY = Math.min(containerSize.h * 0.38, 220);
    const count = selectedModels.length;

    if (count === 0) return [];

    return selectedModels.map((id, i) => {
      const angle = Math.PI + (Math.PI * (i + 1)) / (count + 1);
      return {
        id,
        x: cx + radiusX * Math.cos(angle),
        y: cy + radiusY * Math.sin(angle),
        model: getModelById(id),
      };
    });
  }, [selectedModels, containerSize]);

  // Speaker position (center top)
  const speakerPos = {
    x: containerSize.w / 2,
    y: containerSize.h * 0.12,
  };

  const getResponseForModel = (modelId) => {
    return responses?.find((r) => r.model_id === modelId);
  };

  return (
    <div
      ref={containerRef}
      id="parliament-floor"
      className="relative flex-1 w-full overflow-hidden"
    >
      {/* Background gradient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '40%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* SVG overlay for connection lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none z-10"
        width={containerSize.w}
        height={containerSize.h}
      >
        <defs>
          <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0.3)" />
          </linearGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Model-to-model connections (when thinking) */}
        {isThinking && nodePositions.map((node, i) => (
          nodePositions.slice(i + 1).map((node2, j) => (
            <line
              key={`conn-${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={node2.x}
              y2={node2.y}
              stroke="url(#line-gradient)"
              strokeWidth="1"
              className="neural-line"
              opacity="0.4"
              filter="url(#glow-filter)"
            />
          ))
        ))}

        {/* Model-to-speaker connections (when aggregating or has response) */}
        {(speakerResponse || isThinking) && nodePositions.map((node, i) => (
          <line
            key={`speaker-line-${i}`}
            x1={node.x}
            y1={node.y}
            x2={speakerPos.x}
            y2={speakerPos.y}
            stroke={node.model?.color || '#8b5cf6'}
            strokeWidth="1"
            className="neural-line"
            opacity={speakerResponse ? '0.3' : '0.15'}
            filter="url(#glow-filter)"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>

      {/* Speaker Node (center top) */}
      {selectedModels.length > 0 && (
        <SpeakerNode
          x={speakerPos.x}
          y={speakerPos.y}
          response={speakerResponse}
          isThinking={isThinking}
        />
      )}

      {/* Model Nodes */}
      {nodePositions.map((node, i) => (
        <ModelNode
          key={node.id}
          {...node}
          response={getResponseForModel(node.id)}
          isThinking={isThinking}
          isLeftHalf={node.x < containerSize.w / 2}
          nodeIndex={i}
        />
      ))}

      {/* Empty state */}
      {selectedModels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-up">
            <div className="text-5xl mb-4 opacity-30">🏛️</div>
            <p className="text-parliament-text-secondary text-sm">
              Select models above to convene the Parliament
            </p>
            <p className="text-parliament-text-muted text-xs mt-1">
              Choose 2 or more for a meaningful debate
            </p>
          </div>
        </div>
      )}

      {/* Idle state with models selected */}
      {selectedModels.length > 0 && isIdle && !responses?.length && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <p className="text-parliament-text-muted text-xs glass px-4 py-2 rounded-full">
            Parliament is assembled — present your query below
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Individual model node on the parliament floor
 */
function ModelNode({ id, x, y, model, response, isThinking, isLeftHalf, nodeIndex }) {
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (response?.status === 'success') {
      const timer = setTimeout(() => setShowResponse(true), 400 + nodeIndex * 200);
      return () => clearTimeout(timer);
    } else {
      setShowResponse(false);
    }
  }, [response, nodeIndex]);

  if (!model) return null;

  const nodeSize = 56;

  // Position bubble to the side to avoid overlap
  const bubbleStyle = isLeftHalf
    ? { right: '100%', marginRight: '16px', top: '50%', transform: 'translateY(-50%)' }
    : { left: '100%', marginLeft: '16px', top: '50%', transform: 'translateY(-50%)' };

  return (
    <div
      className="absolute z-20 flex flex-col items-center"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Energy waves when thinking */}
      {isThinking && (
        <>
          <div
            className="energy-wave"
            style={{
              width: nodeSize + 20,
              height: nodeSize + 20,
              left: -(nodeSize + 20 - nodeSize) / 2,
              top: -(nodeSize + 20 - nodeSize) / 2,
              borderColor: `${model.color}40`,
            }}
          />
          <div
            className="energy-wave"
            style={{
              width: nodeSize + 20,
              height: nodeSize + 20,
              left: -(nodeSize + 20 - nodeSize) / 2,
              top: -(nodeSize + 20 - nodeSize) / 2,
              borderColor: `${model.color}30`,
              animationDelay: '0.7s',
            }}
          />
        </>
      )}

      {/* Main node */}
      <div
        className={`
          relative rounded-full flex items-center justify-center
          transition-all duration-700 cursor-pointer
          ${isThinking ? 'animate-breathe' : ''}
        `}
        style={{
          width: nodeSize,
          height: nodeSize,
          background: `radial-gradient(circle at 30% 30%, ${model.color}25, ${model.color}08)`,
          border: `1.5px solid ${model.color}40`,
          boxShadow: isThinking
            ? `0 0 30px ${model.glowColor.replace('0.4', '0.3')}, 0 0 60px ${model.glowColor.replace('0.4', '0.1')}`
            : `0 0 15px ${model.glowColor.replace('0.4', '0.1')}`,
        }}
      >
        <span className="text-xl select-none">{model.icon}</span>

        {/* Status indicator dot */}
        {response?.status === 'success' && !isThinking && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-parliament-bg"
            style={{ background: model.color }}
          />
        )}
      </div>

      {/* Model name */}
      <p
        className="text-[11px] font-medium mt-2 whitespace-nowrap"
        style={{ color: model.color }}
      >
        {model.name}
      </p>

      {/* Response bubble — positioned to the side based on half */}
      {showResponse && response?.status === 'success' && (
        <div
          className="absolute w-48 animate-materialize z-30"
          style={bubbleStyle}
        >
          <div
            className="glass-strong rounded-xl p-2.5 text-[10px] leading-relaxed text-parliament-text-primary/90"
            style={{
              borderColor: `${model.color}20`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${model.glowColor.replace('0.4', '0.05')}`,
            }}
          >
            <p className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: model.color }}>
              {model.name}
            </p>
            <p className="line-clamp-3">
              {response.response.slice(0, 120)}
              {response.response.length > 120 && '...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Speaker node — the aggregation AI at the center top
 */
function SpeakerNode({ x, y, response, isThinking }) {
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => setShowResponse(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowResponse(false);
    }
  }, [response]);

  return (
    <div
      id="speaker-node"
      className="absolute z-30 flex flex-col items-center"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Focus beam from below */}
      {(isThinking || response) && (
        <div
          className="absolute w-32 focus-beam"
          style={{
            height: '200px',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          }}
        />
      )}

      {/* Speaker icon */}
      <div
        className={`
          relative rounded-full flex items-center justify-center
          transition-all duration-700
          ${isThinking ? 'animate-breathe' : ''}
        `}
        style={{
          width: 68,
          height: 68,
          background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.2), rgba(59,130,246,0.1))',
          border: '1.5px solid rgba(139,92,246,0.4)',
          boxShadow: isThinking
            ? '0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1)'
            : '0 0 20px rgba(139,92,246,0.15)',
        }}
      >
        <span className="text-2xl select-none">⚖️</span>
      </div>

      <p className="text-[11px] font-semibold mt-2 gradient-text tracking-wide">
        Speaker
      </p>

      {/* Compact verdict indicator */}
      {showResponse && response && (
        <div
          className="absolute top-full mt-3 animate-materialize z-30"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className="glass-strong rounded-full px-4 py-2 border border-violet-500/20 flex items-center gap-2"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(139,92,246,0.1)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            <p className="text-[10px] font-medium text-parliament-text-primary/80 whitespace-nowrap">
              Verdict synthesized — view Transcript
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
