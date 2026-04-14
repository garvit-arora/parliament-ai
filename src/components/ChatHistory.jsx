export default function ChatHistory({ history, onSelectSession, activeIndex, onDeleteSession }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 opacity-20">
        <p className="text-xs font-black uppercase tracking-[0.2em]">No Sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 px-2">Recent Chats</div>
      {history.map((session, i) => (
        <div key={session.id} className="group relative">
          <button
            onClick={() => onSelectSession(i)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border ${
              activeIndex === i 
                ? 'bg-blue-600/10 border-blue-500/30 text-white' 
                : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/60'
            }`}
          >
            <div className="text-xs font-bold truncate mb-0.5 pr-6">{session.title}</div>
            <div className="text-[9px] opacity-50 font-mono">
              {new Date(session.timestamp).toLocaleDateString()} • {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </button>
          <button 
            onClick={(e) => onDeleteSession(e, session.id)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-rose-500 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      ))}
    </div>
  );
}
