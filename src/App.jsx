import { useState, useCallback, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FlowCanvas from './components/FlowCanvas';
import ChatHistory from './components/ChatHistory';
import ResponsePanel from './components/ResponsePanel';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import FlowConfigModal from './components/FlowConfigModal';
import PremiumModal from './components/PremiumModal';
import SharedChat from './components/SharedChat';
import AccountPage from './components/AccountPage';
import Onboarding from './components/Onboarding';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { queryStreamGraph, getChats, saveChat, deleteChat, generateChatTitle } from './api/council';
import ReactMarkdown from 'react-markdown';
import toast, { Toaster } from 'react-hot-toast';

function MainApp() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('parliament_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI state
  const [sidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('flow'); // 'flow' | 'transcript'
  const [inputValue, setInputValue] = useState('');
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Execution state (for the canvas)
  const [isThinking, setIsThinking] = useState(false);
  const [phase, setPhase] = useState(null); 

  // History & Sessions state
  const [history, setHistory] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeSessionId, history, currentView]);

  const activeSession = history.find(s => s.id === activeSessionId) || null;
  const filteredHistory = history.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.messages.some(m => m.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pipeline configuration
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [pipelineConfig, setPipelineConfig] = useState({
    layer1: ['gpt', 'grok', 'deepseek'], 
    layer2: 'gpt', 
    layer3: 'gpt', 
    layer4: 'gpt' 
  });

  const isPipelineConfigured = pipelineConfig.layer1.length > 0 && pipelineConfig.layer2 && pipelineConfig.layer3 && pipelineConfig.layer4;

  const loadUserChats = async (user) => {
    try {
      const resp = await getChats(user.uid);
      if (resp.chats) {
        setHistory(resp.chats.map(dbChat => ({
           id: dbChat.session_id,
           title: dbChat.title,
           timestamp: dbChat._id ? parseInt(dbChat._id.substring(0,8), 16) * 1000 : Date.now(),
           messages: dbChat.messages
        })));
      }
    } catch(err) { console.error(err); }
  };

  useEffect(() => { if (currentUser) loadUserChats(currentUser); }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('parliament_user', JSON.stringify(user));
    if (user.isNewUser) navigate('/onboarding');
    else navigate('/dashboard');
  };

  const handleSend = useCallback(async (overridingPrompt = null) => {
    const prompt = (overridingPrompt || inputValue).trim();
    if (!prompt || !isPipelineConfigured || !currentUser || isThinking) return;

    setInputValue('');
    setIsThinking(true);
    setPhase('querying_l1');
    setCurrentView('flow');

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      setActiveSessionId(currentSessionId);
      setHistory(prev => [{
        id: currentSessionId,
        title: prompt.slice(0, 30),
        timestamp: Date.now(),
        messages: [{ prompt, responsesL1: null, responseL2: null, responseL3: null, responseL4: null, isProcessing: true }]
      }, ...prev]);
    } else {
      setHistory(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, { prompt, responsesL1: null, responseL2: null, responseL3: null, responseL4: null, isProcessing: true }] } : s));
    }

    const updateMessage = (payload) => {
      setHistory(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          const newMessages = [...s.messages];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], ...payload };
          return { ...s, messages: newMessages };
        }
        return s;
      }));
    };

    setPhase('querying_l1');

    const controller = new AbortController();
    setAbortController(controller);

    // Context Serialization for Conversational Memory
    const msgHistory = [];
    if (activeSession) {
      activeSession.messages.forEach(m => {
        if (m.prompt) msgHistory.push({ role: "user", content: m.prompt });
        if (m.responseL4?.response) msgHistory.push({ role: "assistant", content: m.responseL4.response });
      });
    }

    // Parallel Title Generation for New Sessions
    const existingSession = history.find(s => s.id === currentSessionId);
    if (!existingSession || existingSession.title === "New Session" || existingSession.title === "New Chat") {
       generateChatTitle(prompt, pipelineConfig.layer4).then(data => {
          if (data.status === 'success') {
             setHistory(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: data.title } : s));
          }
       }).catch(e => console.error("Parallel title gen failed", e));
    }

    try {
      await queryStreamGraph(currentUser.uid, prompt, msgHistory, pipelineConfig.layer1, pipelineConfig.layer2, pipelineConfig.layer3, pipelineConfig.layer4, (event) => {
        if (event.node === 'error_node') {
          toast.error(`Deliberation Error: ${event.state.error}`);
          return;
        }

        if (event.node === 'layer1_node') { 
          updateMessage({ responsesL1: event.state.l1_responses }); 
          setPhase('querying_l2'); 
        }
        else if (event.node === 'layer2_node') { 
          updateMessage({ responseL2: event.state.l2_response }); 
          setPhase('querying_l3'); 
        }
        else if (event.node === 'layer3_node') { 
          updateMessage({ responseL3: event.state.l3_response }); 
          setPhase(event.state.needs_reconsideration ? 'querying_l1' : 'querying_l4'); 
        }
        else if (event.node === 'layer4_node') {
           updateMessage({ responseL4: event.state.l4_response, isProcessing: false });
           setPhase('done');
           
           setHistory(h => {
             const current = h.find(s => s.id === currentSessionId);
             if (current) saveChat(currentUser.uid, currentSessionId, current.title, current.messages);
             return h;
           });
        }
      }, controller.signal);
    } catch (error) {
      if (error.name === 'AbortError') {
         console.log('Deliberation terminated by user');
      } else if (error.message.includes("Free limit reached")) {
         setIsPremiumModalOpen(true);
      } else {
         toast.error(error.message);
      }
      updateMessage({ isProcessing: false });
    } finally { 
      setIsThinking(false);
      setAbortController(null);
    }
  }, [inputValue, activeSessionId, currentUser, pipelineConfig, isThinking, isPipelineConfigured]);

  const [deleteModal, setDeleteModal] = useState({ open: false, sessionId: null, title: '' });

  const handleDeleteSession = (e, session) => {
    e.stopPropagation();
    setDeleteModal({ open: true, sessionId: session.id, title: session.title });
  };

  const confirmDelete = async () => {
    try {
      await deleteChat(currentUser.uid, deleteModal.sessionId);
      setHistory(prev => prev.filter(s => s.id !== deleteModal.sessionId));
      if (activeSessionId === deleteModal.sessionId) {
        setActiveSessionId(null);
        setActiveSession(null);
        setPhase(null);
      }
      toast.success("Session erased from registry");
    } catch (err) {
      toast.error("Failed to delete session");
    }
  };

  const handleSelectSession = (index) => {
    setActiveSessionId(history[index].id);
    setCurrentView('flow');
    setIsSearchOpen(false);
  };

  const handleNewChat = () => { setActiveSessionId(null); setPhase(null); setCurrentView('flow'); };

  const handleShare = () => {
    if (!activeSessionId) return toast.error("No active session");
    navigator.clipboard.writeText(`${window.location.origin}/share/${activeSessionId}`);
    toast.success("Link copied!");
  };

  const [abortController, setAbortController] = useState(null);

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsThinking(false);
      // Clean up local processing state
      if (activeSession) {
         const newMessages = [...activeSession.messages];
         const lastMsg = newMessages[newMessages.length - 1];
         if (lastMsg && lastMsg.isProcessing) {
            lastMsg.isProcessing = false;
            setActiveSession({...activeSession, messages: newMessages});
         }
      }
    }
  };

  const inputComponent = (
    <div className="w-full">
      <div className={`rounded-3xl overflow-hidden glass transition-all ${activeSession ? 'bg-[#0d0e15] border border-white/5' : 'bg-[#0d0e15] border-white/10 shadow-2xl'}`}>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); !isThinking ? handleSend() : null; } }}
          placeholder="Enter controversial topic..."
          className="w-full px-6 pt-5 pb-2 bg-transparent text-white text-sm outline-none resize-none"
        />
        <div className="flex items-center justify-between px-4 pb-4">
          <button onClick={() => setIsConfigOpen(true)} className="px-4 py-2 rounded-xl text-[11px] font-bold text-white/40 border border-white/5 bg-[#1a1b26] hover:text-white transition-colors">Select Source</button>
          
          {isThinking ? (
            <button onClick={handleStop} className="h-10 px-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2">
              <div className="w-2 h-2 bg-current rounded-sm" />
              Stop
            </button>
          ) : (
            <button onClick={() => handleSend()} disabled={!inputValue.trim()} className="h-10 px-6 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-30">Send</button>
          )}
        </div>
      </div>
    </div>
  );

  const handleLogout = () => {
    setCurrentUser(null);
    setHistory([]);
    setActiveSessionId(null);
    setActiveSession(null);
    localStorage.removeItem('parliament_user');
    navigate('/login');
  };

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#0d0d12', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' } }} />
      {isPremiumModalOpen && <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />}
      <DeleteConfirmModal 
        isOpen={deleteModal.open} 
        onClose={() => setDeleteModal({ ...deleteModal, open: false })} 
        onConfirm={confirmDelete}
        title={deleteModal.title}
      />
      
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSearchOpen(false)} />
           <div className="w-full max-w-2xl bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/20 rounded-[28px] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                 <input autoFocus placeholder="Search chats..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none outline-none text-xl text-white placeholder-white/20" />
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                 {filteredHistory.map((s, idx) => (
                    <button key={s.id} onClick={() => { handleSelectSession(history.indexOf(s)); setIsSearchOpen(false); }} className="w-full px-6 py-4 hover:bg-white/5 text-left border-b border-white/5">
                       <div className="font-bold">{s.title}</div>
                       <div className="text-[10px] opacity-30 uppercase tracking-widest">{new Date(s.timestamp).toLocaleDateString()}</div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage onLoginClick={() => navigate('/login')} />} />
        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/share/:sessionId" element={<SharedChat />} />
        <Route path="/onboarding" element={<Onboarding onComplete={() => navigate('/dashboard')} user={currentUser} />} />
        <Route path="/account" element={currentUser ? <AccountPage user={currentUser} onLogout={handleLogout} onUpdate={(u) => {setCurrentUser(u); localStorage.setItem('parliament_user', JSON.stringify(u));}} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={
          !currentUser ? <Navigate to="/login" /> : (
            <div className="h-screen w-full flex bg-[#09090b] text-white">
               <div className={`transition-all duration-300 border-r border-white/5 bg-[#0d0d12] flex flex-col flex-shrink-0 ${sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
                  <div className="w-[280px] h-full flex flex-col p-4">
                     <div className="flex items-center justify-between mb-6 px-2">
                        <div className="flex items-center gap-2">
                           <img src="/logo.png" alt="" className="w-6 h-6 object-contain" />
                           <span className="font-black text-sm uppercase tracking-widest opacity-50 text-white">Council <span className="text-[#ea3a5b]">X</span></span>
                        </div>
                        <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-white/5 rounded-lg"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></button>
                     </div>
                     <button onClick={handleNewChat} className="w-full h-11 bg-[#1a1b26] border border-white/5 rounded-full text-sm font-bold mb-8">New Chat</button>
                     <div className="flex-1 overflow-y-auto"><ChatHistory history={history} onSelectSession={handleSelectSession} onDeleteSession={(e, id) => handleDeleteSession(e, history.find(s => s.id === id))} activeIndex={history.findIndex(s => s.id === activeSessionId)} /></div>
                     <div className="mt-auto pt-4 flex flex-col gap-3">
                        <button onClick={() => setIsPremiumModalOpen(true)} className="w-full py-4 bg-white/[0.03] border border-white/10 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/5 hover:text-white transition-all">Upgrade to Pro</button>
                        <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl cursor-pointer" onClick={() => navigate('/account')}>
                           <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold overflow-hidden">{currentUser.photoURL ? <img src={currentUser.photoURL} alt="" /> : 'U'}</div>
                           <div className="min-w-0"><div className="text-xs font-bold truncate">{currentUser.displayName}</div><div className="text-[9px] opacity-40 truncate">{currentUser.email}</div></div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col bg-[#09090b] min-w-0">
         <header className="flex items-center justify-between px-8 py-4 bg-[#09090b]/50 backdrop-blur-md border-b border-white/[0.02] z-[100] sticky top-0">
            <div className="flex items-center gap-6">
               {activeSession && (
                 <>
                   <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                      <button onClick={() => setCurrentView('flow')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'flow' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Logic Flow</button>
                      <button onClick={() => setCurrentView('transcript')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'transcript' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Transcript</button>
                   </div>
                   <div className="h-4 w-[1px] bg-white/10" />
                   <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 truncate max-w-[300px]">{activeSession.title}</div>
                 </>
               )}
            </div>
            
            <div className="flex items-center gap-4">
               <button onClick={handleShare} className="text-[11px] font-bold text-white/60 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5">Share <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg></button>
               <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden ml-2 shadow-lg cursor-pointer" onClick={() => navigate('/account')}>
                  {currentUser.photoURL ? <img src={currentUser.photoURL} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">U</div>}
               </div>
            </div>
         </header>
         <div className="flex-1 flex flex-col min-h-0 relative">
            {!activeSession ? (
               <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-20 text-center max-w-6xl mx-auto custom-scrollbar">
                  <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                     {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return "Good morning";
                        if (hour < 18) return "Good afternoon";
                        return "Good evening";
                     })()}, {currentUser.displayName?.split(' ')[0]}
                  </h1>
                  <p className="text-white/40 mb-16 text-xl font-medium max-w-2xl leading-relaxed">
                     The Assembly is ready. Challenge the consensus, dissect the controversial, and find the truth.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                     {[
                       { t: "Economics", p: "Universal Basic Income: Economic miracle or structural collapse?" },
                       { t: "Energy", p: "Nuclear Energy: The only path to net-zero?" },
                       { t: "Ethics", p: "Social Media Algorithms: Free speech vs. systemic harm." }
                     ].map(card => <button key={card.p} onClick={() => setInputValue(card.p)} className="bg-[#0b0c14] p-10 rounded-[40px] border border-white/5 text-left transition-all hover:bg-[#12131f] hover:scale-[1.02] shadow-2xl group">
                        <p className="text-[10px] font-black opacity-20 group-hover:opacity-40 uppercase tracking-[0.4em] mb-8 transition-all">{card.t}</p>
                        <p className="text-base font-bold leading-relaxed">{card.p.split(':')[0]}</p>
                     </button>)}
                  </div>
               </div>
            ) : (
               <div ref={scrollRef} className="flex-1 overflow-y-auto pt-10 px-6 pb-64 custom-scrollbar overscroll-none">
                  <div className="w-full space-y-24">
                     {activeSession.messages.map((msg, idx) => (
                        <div key={idx} className="w-full space-y-12">
                           {currentView === 'flow' && (
                             <div className="flex items-center gap-5 opacity-40">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 bg-white/5 rounded-full border border-white/5 shadow-xl">Assembly Logic Task 0{idx+1}</div>
                                <div className="h-[1px] flex-1 bg-white/5" />
                             </div>
                           )}
                           
                           {currentView === 'flow' ? (
                              <div className="space-y-20">
                                 <div className="space-y-8 bg-black/20 rounded-[48px] p-4 border border-white/[0.02]">
                                    <FlowCanvas 
                                       prompt={msg.prompt} 
                                       responsesL1={msg.responsesL1} 
                                       responseL2={msg.responseL2} 
                                       responseL3={msg.responseL3} 
                                       responseL4={msg.responseL4} 
                                       isThinking={msg.isProcessing} 
                                       phase={idx === activeSession.messages.length - 1 ? phase : 'done'} 
                                       config={pipelineConfig} 
                                    />
                                 </div>
                              </div>
                           ) : (
                              <div className="space-y-10 py-6 w-full">
                                 {/* User Message */}
                                 <div className="flex justify-end items-start gap-4">
                                    <div className="flex flex-col items-end gap-2 max-w-[85%]">
                                       <div className="bg-[#0f172a] border border-white/10 rounded-[32px] rounded-tr-sm px-8 py-5 text-base font-bold text-white shadow-xl leading-relaxed">{msg.prompt}</div>
                                       <span className="text-[9px] font-black uppercase tracking-widest text-white/10 mr-4">Investigator</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/10 bg-indigo-600 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-2xl">
                                       {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-bold">U</span>}
                                    </div>
                                 </div>

                                 {/* AI Arbiter Response */}
                                 {msg.responseL4 && (
                                   <div className="flex justify-start items-start gap-4 w-full">
                                      <div className="w-10 h-10 rounded-full border border-white/10 bg-[#121214] flex-shrink-0 flex items-center justify-center shadow-2xl relative">
                                         <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full" />
                                         <span className="text-lg relative z-10">⚖️</span>
                                      </div>
                                      <div className="flex flex-col items-start gap-3 flex-1 max-w-[90%]">
                                         <div className="bg-[#121214] border border-white/10 rounded-[40px] rounded-tl-sm px-10 py-8 prose prose-invert prose-p:leading-relaxed max-w-none w-full prose-lg shadow-2xl relative overflow-hidden">
                                            <ReactMarkdown>{msg.responseL4.response}</ReactMarkdown>
                                         </div>
                                         <div className="flex items-center gap-6 pl-4 h-10">
                                            {!msg.feedback ? (
                                              <div className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
                                                 <button 
                                                   onClick={() => {
                                                     const newMessages = [...activeSession.messages];
                                                     newMessages[idx].feedback = 'like';
                                                     setActiveSession({...activeSession, messages: newMessages});
                                                     import('./api/council').then(m => m.saveFeedback(currentUser.uid, activeSessionId, idx, 'like'));
                                                   }} 
                                                   className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                 >
                                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                                 </button>
                                                 <button 
                                                   onClick={() => {
                                                     const newMessages = [...activeSession.messages];
                                                     newMessages[idx].feedback = 'dislike';
                                                     setActiveSession({...activeSession, messages: newMessages});
                                                     import('./api/council').then(m => m.saveFeedback(currentUser.uid, activeSessionId, idx, 'dislike'));
                                                   }}
                                                   className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                 >
                                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2H20a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                                                 </button>
                                              </div>
                                            ) : (
                                              <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] rounded-full border border-white/5 animate-in fade-in zoom-in-95 duration-500">
                                                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Feedback Recorded</span>
                                                 {msg.feedback === 'like' ? 
                                                   <svg className="text-emerald-500/60" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> : 
                                                   <svg className="text-rose-500/60" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2H20a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                                                 }
                                              </div>
                                            )}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/10">Final Arbiter</span>
                                         </div>
                                      </div>
                                   </div>
                                 )}

                                 {msg.isProcessing && (
                                   <div className="flex justify-start items-center gap-4 pl-14">
                                      <div className="bg-white/5 rounded-full px-6 py-3 flex gap-2 items-center shadow-xl border border-white/5 backdrop-blur-md">
                                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                         <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                                         <div className="w-1.5 h-1.5 bg-blue-500/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                         <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-white/20">Deliberating...</span>
                                      </div>
                                   </div>
                                 )}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}
            <div className="absolute bottom-10 left-0 w-full px-10 pointer-events-none z-50">
               <div className="w-full max-w-5xl mx-auto pointer-events-auto shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-full">
                  {inputComponent}
               </div>
            </div>
         </div>
         <FlowConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} config={pipelineConfig} onSave={setPipelineConfig} />
      </div>
   </div>
)
        } />
      </Routes>
    </>
  );
}

export default function App() { return (<BrowserRouter><MainApp /></BrowserRouter>); }
