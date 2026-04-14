import { useState, useMemo } from 'react';
import { MODELS, MODEL_CATEGORIES } from '../data/models';

/**
 * Yupp-inspired model selection modal
 * Shows models in a searchable, categorized grid
 * Allows assigning models as "Deliberators" (Layer 1) or "Speaker"
 */
export default function ModelSelectionModal({
  isOpen,
  onClose,
  selectedModels,
  speakerModel,
  onToggleModel,
  onSetSpeaker,
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredModels = useMemo(() => {
    return MODELS.filter((m) => {
      const matchesSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.provider.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || m.tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden animate-materialize"
          style={{
            background: 'rgba(20, 20, 26, 0.95)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.05)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-lg font-semibold text-white">Select models</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pb-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-council-text-muted"
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Explore models"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-council-text-muted/60 outline-none focus:border-violet-500/30 transition-colors"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
            {MODEL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all duration-200
                  ${activeCategory === cat.id
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-council-text-muted hover:text-council-text-secondary hover:bg-white/[0.03] border border-transparent'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Selected summary */}
          <div className="px-6 pb-2">
            <p className="text-[10px] uppercase tracking-[0.15em] text-council-text-muted font-medium">
              {selectedModels.length} deliberator{selectedModels.length !== 1 ? 's' : ''} selected
              {speakerModel && ` · Speaker: ${MODELS.find(m => m.id === speakerModel)?.name || speakerModel}`}
            </p>
          </div>

          {/* Model grid */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredModels.map((model) => {
                const isSelected = selectedModels.includes(model.id);
                const isSpeaker = speakerModel === model.id;

                return (
                  <div
                    key={model.id}
                    className={`
                      group relative rounded-xl p-3.5 cursor-pointer transition-all duration-300
                      ${isSelected
                        ? 'border-2'
                        : 'border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.02]'
                      }
                    `}
                    style={isSelected ? {
                      borderColor: `${model.color}40`,
                      background: `linear-gradient(135deg, ${model.color}08, transparent)`,
                    } : {}}
                    onClick={() => onToggleModel(model.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `${model.color}15`,
                          border: `1px solid ${model.color}25`,
                        }}
                      >
                        <span className="text-lg">{model.icon}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{model.name}</p>
                          {model.tier === 'pro' && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase font-bold tracking-wider">
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-council-text-muted mt-0.5">
                          by {model.provider}
                        </p>
                        <p className="text-[10px] text-council-text-muted/70 mt-1">
                          {model.description}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      <div className="flex flex-col gap-1.5">
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: `${model.color}30`, border: `1.5px solid ${model.color}60` }}
                          >
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke={model.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Role assignment (only if selected) */}
                    {isSelected && (
                      <div className="flex gap-2 mt-3 pl-13" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSpeaker) onSetSpeaker(null);
                          }}
                          className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-all ${
                            !isSpeaker
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'text-council-text-muted border border-white/[0.06] hover:border-white/10'
                          }`}
                        >
                          Deliberator
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetSpeaker(model.id);
                          }}
                          className={`text-[9px] px-2.5 py-1 rounded-full font-medium transition-all ${
                            isSpeaker
                              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                              : 'text-council-text-muted border border-white/[0.06] hover:border-white/10'
                          }`}
                        >
                          ⚖️ Speaker
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer action */}
          <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
            <p className="text-[10px] text-council-text-muted">
              Deliberators think in parallel · Speaker synthesizes
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 transition-all duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
