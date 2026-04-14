import { useState, useRef, useEffect } from 'react';

/**
 * Glassmorphic floating chat input bar
 */
export default function ChatInput({ onSend, isDisabled, selectedModelsCount }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isDisabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim() || isDisabled || selectedModelsCount === 0) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div id="chat-input" className="w-full px-6 py-4">
      <form
        onSubmit={handleSubmit}
        className="relative max-w-3xl mx-auto"
      >
        <div
          className="glass-strong rounded-2xl flex items-center gap-3 px-5 py-3 transition-all duration-300 focus-within:border-violet-500/30"
          style={{
            boxShadow: '0 -4px 30px rgba(0,0,0,0.3), 0 0 20px rgba(139,92,246,0.05)',
          }}
        >
          {/* Council icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 bg-white/5">
            <img src="/logo.png" className="w-5 h-5 object-contain opacity-70" alt="" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            id="query-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={
              selectedModelsCount === 0
                ? 'Select models to begin...'
                : isDisabled
                ? 'Parliament is deliberating...'
                : 'Present your query to the Parliament...'
            }
            className="flex-1 bg-transparent text-sm text-council-text-primary placeholder:text-council-text-muted/50 outline-none disabled:opacity-40"
          />

          {/* Send button */}
          <button
            type="submit"
            id="send-button"
            disabled={isDisabled || !value.trim() || selectedModelsCount === 0}
            className="
              flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
              transition-all duration-300
              disabled:opacity-20 disabled:cursor-not-allowed
              enabled:hover:scale-105 enabled:active:scale-95
            "
            style={{
              background: value.trim() && !isDisabled
                ? 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.4))'
                : 'rgba(255,255,255,0.04)',
              border: '1px solid',
              borderColor: value.trim() && !isDisabled
                ? 'rgba(139,92,246,0.3)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: value.trim() && !isDisabled
                ? '0 0 15px rgba(139,92,246,0.2)'
                : 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Subtle hint */}
        <p className="text-center text-[10px] text-council-text-muted/40 mt-2">
          Press Enter to submit • Multiple AI models will deliberate
        </p>
      </form>
    </div>
  );
}
