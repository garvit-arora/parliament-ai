import { MODELS } from '../data/models';

/**
 * Horizontal scrollable model selection panel
 * Each card shows the model info with animated border when selected
 */
export default function ModelSelector({ selectedModels, onToggleModel }) {
  return (
    <div id="model-selector" className="w-full px-6 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse-slow" />
        <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-parliament-text-secondary">
          Parliament Members
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-violet-500/20 to-transparent" />
        <span className="text-[10px] text-parliament-text-muted font-mono">
          {selectedModels.length} selected
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {MODELS.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          return (
            <button
              key={model.id}
              id={`model-card-${model.id}`}
              onClick={() => onToggleModel(model.id)}
              className={`
                relative flex-shrink-0 w-44 rounded-xl p-3.5 transition-all duration-500 cursor-pointer
                ${isSelected
                  ? `glass-strong selected-glow border border-transparent`
                  : 'glass border border-transparent hover:border-white/10'
                }
              `}
              style={isSelected ? {
                borderColor: `${model.color}50`,
                boxShadow: `0 0 20px ${model.glowColor.replace('0.4', '0.15')}, inset 0 0 20px ${model.glowColor.replace('0.4', '0.05')}`,
              } : {}}
            >
              {/* Animated gradient border when selected */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${model.color}20, transparent, ${model.color}10)`,
                  }}
                />
              )}

              <div className="relative z-10">
                {/* Icon and name */}
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{model.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-parliament-text-primary leading-tight">
                      {model.name}
                    </p>
                    <p className="text-[10px] text-parliament-text-muted mt-0.5">
                      {model.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 mt-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: isSelected ? `${model.color}15` : 'rgba(255,255,255,0.04)',
                        color: isSelected ? model.color : '#8888a0',
                        border: `1px solid ${isSelected ? `${model.color}30` : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${model.color}30`, border: `1px solid ${model.color}60` }}
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke={model.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
