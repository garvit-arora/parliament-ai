import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import FlowCanvas from './components/FlowCanvas';
import ChatHistory from './components/ChatHistory';
import ResponsePanel from './components/ResponsePanel';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import FlowConfigModal from './components/FlowConfigModal';
import PremiumModal from './components/PremiumModal';
import SharedChat from './components/SharedChat';
import NotFound from './components/NotFound';
import AccountPage from './components/AccountPage';
import Onboarding from './components/Onboarding';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import DataScanner from './components/audit/DataScanner';
import BiasTuner from './components/audit/BiasTuner';
import FairnessTracker from './components/audit/FairnessTracker';
import TrustReport from './components/audit/TrustReport';
import NewsProtocol from './components/audit/NewsProtocol';
import Whitepaper from './components/audit/Whitepaper';
import { queryStreamGraph, getChats, saveChat, deleteChat, generateChatTitle, ingestFile, authProfile, saveFeedback } from './api/council';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast, { Toaster } from 'react-hot-toast';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { Database, Scale, Sliders, CheckCircle2, Download, Search, Settings, Share2, LogOut, User, Plus, Trash2, Cpu, FileText, Zap, Sparkles, ChevronDown, Menu, X, ArrowRight, Globe, Lock, Mic, Volume2, Paperclip, Send, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const TAGLINES = [
  "Search something controversial",
  "Deliberate on global bias",
  "Audit the digital consensus",
  "Uncover hidden agendas",
  "Cross-examine neural logic",
  "Investigate systemic neutrality",
  "Challenge the standard narrative",
  "Probe for ideological drift",
  "Analyze the forensic data stream",
  "Execute objective deliberation",
  "Scan for partisan influence",
  "Map the fairness of a claim",
  "Sync with the Council's wisdom",
  "Audit the consensus node",
  "Initiate a deep search query",
  "Delve into the data scanner",
  "Tune the bias of the council",
  "Explore the unbiased news protocol",
  "Review the forensic trust reports",
  "Deliberate with the AI Parliament"
];

function DashboardShell({ currentUser, children, sidebarOpen, setSidebarOpen, handleNewChat, history, handleSelectSession, handleDeleteSession, activeSessionId, setIsSearchOpen, navigate, handleLogout, activeSession, currentView, setCurrentView, handleShare }) {
  const location = useLocation();
  
  const getPageTitle = () => {
     const path = location.pathname;
     if (path === '/audit/scanner') return 'Data Scanner';
     if (path === '/audit/tuner') return 'Bias Tuner';
     if (path === '/audit/tracker') return 'Fairness Map';
     if (path === '/audit/report') return 'Bias Reports';
     if (path === '/audit/news') return 'Unbiased News';
     return null;
  };

  const pageTitle = getPageTitle();

  return (
    <div className="h-screen w-full flex bg-[#09090b] text-white overflow-hidden relative font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div className={`
        transition-all duration-300 border-r border-white/5 bg-[#0d0d12] flex flex-col flex-shrink-0 z-[120]
        ${sidebarOpen ? 'w-[280px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}
        ${sidebarOpen ? 'fixed inset-y-0 left-0 lg:relative' : ''}
      `}>
          <div className="w-[280px] h-full flex flex-col p-4">
             <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                   <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
                   <span className="font-black text-sm uppercase tracking-[0.2em] text-white">Council<span className="text-[#ea3a5b]">X</span></span>
                </div>
                <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-white/5 rounded-lg text-white hover:text-white transition-colors"><Search size={16} /></button>
             </div>
             
             <button onClick={handleNewChat} className="w-full h-12 bg-[#1a1b26] border border-white/5 rounded-2xl text-sm font-bold mb-8 flex items-center justify-center gap-3 hover:bg-white/5 transition-all group">
                <Plus size={16} className="text-[#ea3a5b] group-hover:rotate-90 transition-transform" />
                New Chat
             </button>
             
             <div className="mb-8 px-2">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white mb-6 px-1">Audit Tools</div>
                <div className="space-y-1">
                   {[
                     { n: 'Data Scanner', i: <Database size={16} />, path: '/audit/scanner' },
                     { n: 'Bias Tuner', i: <Sliders size={16} />, path: '/audit/tuner' },
                     { n: 'Unbiased News', i: <Globe size={16} />, path: '/audit/news' },
                     { n: 'Bias Reports', i: <FileText size={16} />, path: '/audit/report' },
                     { n: 'Fairness Map', i: <Scale size={16} />, path: '/audit/tracker' }
                   ].map((t) => (
                     <button 
                        key={t.n} 
                        onClick={() => navigate(t.path)} 
                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-[13px] font-bold transition-all group ${location.pathname === t.path ? 'bg-[#ea3a5b]/10 text-[#ea3a5b]' : 'text-white hover:bg-white/5 hover:text-white'}`}
                      >
                        <span className={`transition-opacity ${location.pathname === t.path ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{t.i}</span>
                        {t.n}
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ChatHistory history={history} onSelectSession={handleSelectSession} onDeleteSession={(e, id) => handleDeleteSession(e, history.find(s => (s.id === id || s.session_id === id || s._id === id)))} activeIndex={history.findIndex(s => (s.id === activeSessionId || s.session_id === activeSessionId || s._id === activeSessionId))} />
             </div>
          </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#09090b] min-w-0 relative">
        <header className="flex items-center justify-between px-4 md:px-8 py-2 md:py-6 bg-[#09090b]/50 backdrop-blur-md border-b border-white/[0.04] z-[100] sticky top-0 h-14 md:h-[80px]">
           <div className="flex items-center gap-4 md:gap-6 overflow-hidden max-w-[60%] md:max-w-[50%]">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg lg:hidden flex-shrink-0"><Menu size={20} /></button>
              
              {pageTitle ? (
                 <div className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-300">{pageTitle}</div>
              ) : activeSession && location.pathname === '/' ? (
                <>
                  <div className="hidden md:flex items-center bg-white/5 rounded-2xl p-1 border border-white/5 overflow-hidden flex-shrink-0">
                     <button onClick={() => setCurrentView('flow')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'flow' ? 'bg-white text-black shadow-lg' : 'text-white hover:text-white'}`}>Process Map</button>
                     <button onClick={() => setCurrentView('transcript')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'transcript' ? 'bg-white text-black shadow-lg' : 'text-white hover:text-white'}`}>Transcript</button>
                  </div>
                  <div className="hidden md:block h-4 w-[1px] bg-white/10 flex-shrink-0 mx-2" />
                  <div className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-white truncate italic flex-grow">{activeSession.title}</div>
                </>
              ) : (
                <div className="w-8" />
              )}
           </div>
           
           <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => navigate('/whitepaper')} className="hidden md:flex text-[10px] font-black uppercase tracking-widest text-white hover:text-white items-center gap-2 group px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                <FileText size={14} className="group-hover:text-[#ea3a5b] transition-colors" />
                Whitepaper
              </button>
              
              <button onClick={handleShare} className="hidden md:flex text-[10px] font-black uppercase tracking-widest text-white hover:text-white items-center gap-2 group px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                <Share2 size={14} className="group-hover:text-[#ea3a5b] transition-colors" />
                Share
              </button>
              
              <div className="hidden md:block h-4 w-[1px] bg-white/10 mx-2" />
              
              <button onClick={() => navigate('/account')} className="flex items-center gap-3 group px-2 py-1 rounded-full hover:bg-white/5 transition-all">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-white/10 shadow-lg shadow-indigo-500/20 group-hover:border-indigo-400/50 transition-colors">
                    {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" /> : (currentUser.displayName?.[0] || 'U')}
                 </div>
              </button>

              <button onClick={handleLogout} className="hidden md:block p-2 text-white hover:text-rose-500 transition-colors"><LogOut size={16} /></button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto">
           {children}
        </main>
      </div>
    </div>
  );
}

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('parliament_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => {
      // Auto-close sidebar on mobile/tablet when resizing
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const [currentView, setCurrentView] = useState('flow'); 
  const [inputValue, setInputValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  
  const [modelsL1, setModelsL1] = useState(['gpt', 'grok', 'deepseek']);
  const [modelL2, setModelL2] = useState('grok');
  const [isListening, setIsListening] = useState(false);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [phase, setPhase] = useState(null); 
  const [statusText, setStatusText] = useState('');
  const [history, setHistory] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const scrollRef = useRef(null);

  // RANDOM TAGLINE
  const randomTagline = useMemo(() => {
     return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  }, [activeSessionId]);

  useEffect(() => {
    if (currentUser) { getChats(currentUser.uid).then(data => { if (data.status === 'success') setHistory(data.chats); }).catch(console.error); }
  }, [currentUser]);

  const activeSession = history.find(s => (s.id === activeSessionId || s.session_id === activeSessionId || s._id === activeSessionId));
  const filteredHistory = history.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // AUTH HANDLERS
  const handleLogin = async (user) => {
    try {
      const profile = await authProfile(user.uid, user.email, user.displayName);
      const fullUser = { ...user, ...profile.user };
      setCurrentUser(fullUser);
      localStorage.setItem('parliament_user', JSON.stringify(fullUser));
      navigate('/');
    } catch (err) {
      toast.error("Auth sync failed.");
    }
  };

  const handleLogout = () => { setCurrentUser(null); setHistory([]); setActiveSessionId(null); localStorage.removeItem('parliament_user'); navigate('/login'); };

  // AZURE STT
  const startSTT = () => {
    const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;
    if (!speechKey) return toast.error("Azure Keys Missing.");

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechRecognitionLanguage = "en-US";
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    setIsListening(true);
    recognizer.recognizeOnceAsync(result => {
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        setInputValue(prev => prev + result.text);
      }
      setIsListening(false);
      recognizer.close();
    });
  };

  // AZURE TTS
  const playTTS = (text) => {
    const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;
    if (!speechKey) return toast.error("Azure Keys Missing.");

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = "en-US-AndrewNeural";
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(text, result => {
      synthesizer.close();
    }, error => {
      console.error(error);
      synthesizer.close();
    });
  };

  const handleSend = useCallback(async (prompt = inputValue) => {
    if (!prompt.trim() || isThinking) return;
    setIsThinking(true);
    
    const currentSessionId = activeSessionId || `session_${Date.now()}`;
    if (!activeSessionId) {
      setActiveSessionId(currentSessionId);
      setHistory(prev => [{ id: currentSessionId, title: "Audit Started", timestamp: Date.now(), messages: [] }, ...prev]);
    }

    let hasFile = false;
    if (attachedFile) {
       hasFile = true;
       setPhase('reading_file');
       try { await ingestFile(currentSessionId, attachedFile); toast.success("Node Indexed."); } catch (err) { toast.error("Ingestion failed."); }
    }

    setInputValue('');
    setAttachedFile(null);
    setPhase('querying_l1');

    const controller = new AbortController();
    setAbortController(controller);

    const updateMessage = (updates) => {
       setHistory(prev => prev.map(s => {
          if (s.id === currentSessionId || s.session_id === currentSessionId || s._id === currentSessionId) {
             const lastMsg = s.messages[s.messages.length - 1];
              if (lastMsg && lastMsg.isProcessing) {
                 const newMessages = [...s.messages];
                 newMessages[newMessages.length - 1] = { ...lastMsg, ...updates, isFileAttached: hasFile };
                 return { ...s, messages: newMessages };
              } else {
                 return { ...s, messages: [...s.messages, { prompt, responsesL1: [], responseL2: '', isProcessing: true, isFileAttached: hasFile, ...updates }] };
              }
          }
          return s;
       }));
    };

    const existingSession = history.find(s => (s.id === currentSessionId || s.session_id === currentSessionId || s._id === currentSessionId));
    if (!existingSession || existingSession.title === "Audit Started") {
       generateChatTitle(prompt, 'gpt').then(data => {
          if (data.status === 'success') {
             setHistory(prev => prev.map(s => (s.id === currentSessionId || s.session_id === currentSessionId || s._id === currentSessionId) ? { ...s, title: data.title } : s));
          }
       }).catch(console.error);
    }

    const mappedL1 = modelsL1; // Use clinical IDs for backend lookup
    const mappedL2 = modelL2;

    try {
      await queryStreamGraph(currentUser.uid, prompt, existingSession?.messages || [], mappedL1, mappedL2, (event) => {
        if (event.state?.status) {
           setStatusText(event.state.status);
        }

        if (event.node === 'retrieval_node') { 
          updateMessage({}); // Initialize message structure immediately
          setPhase('web_searching'); 
        }
        else if (event.node === 'web_research_node') {
          setPhase('querying_l1');
        }
        else if (event.node === 'layer1_node') { 
          updateMessage({ responsesL1: event.state.l1_responses }); 
          setPhase('querying_l2'); 
        }
        else if (event.node === 'layer2_node') { 
          const isDone = !event.state.needs_reconsideration;
          updateMessage({ responseL2: event.state.l2_response, isProcessing: !isDone }); 
          if (isDone) {
            setPhase('done');
            setCurrentView('transcript');
            // Save after a short delay
            setTimeout(async () => {
              setHistory(prev => {
                const current = prev.find(s => (s.id === currentSessionId || s.session_id === currentSessionId || s._id === currentSessionId));
                if (current) saveChat(currentUser.uid, currentSessionId, current.title, current.messages).catch(console.error);
                return prev;
              });
            }, 500);
          } else { 
            setPhase('querying_l1'); 
          }
        }
        else if (event.node === 'error_node') {
          toast.error(`Council Error: ${event.state.error}`);
          updateMessage({ isProcessing: false });
          setPhase('error');
        }
      }, controller.signal, currentSessionId);
    } catch (error) {
      toast.error(error.message);
      updateMessage({ isProcessing: false });
    } finally { setIsThinking(false); setAbortController(null); }
  }, [inputValue, activeSessionId, currentUser, isThinking, history, modelsL1, modelL2, attachedFile]);

  const [deleteModal, setDeleteModal] = useState({ open: false, sessionId: null, title: '' });
  const handleDeleteSession = (e, session) => { e.stopPropagation(); setDeleteModal({ open: true, sessionId: session.id || session.session_id || session._id, title: session.title }); };
  const confirmDelete = async () => {
    try {
      await deleteChat(currentUser.uid, deleteModal.sessionId);
      setHistory(prev => prev.filter(s => (s.id !== deleteModal.sessionId && s.session_id !== deleteModal.sessionId && s._id !== deleteModal.sessionId)));
      if (activeSessionId === deleteModal.sessionId) { setActiveSessionId(null); setPhase(null); }
      toast.success("Erased.");
    } catch (err) { toast.error("Delete failed"); }
  };
  const handleSelectSession = (index) => { setActiveSessionId(history[index]._id || history[index].session_id || history[index].id); setCurrentView('flow'); setIsSearchOpen(false); navigate('/'); };
  const handleNewChat = () => { setActiveSessionId(null); setPhase(null); setCurrentView('flow'); navigate('/'); };
  const handleShare = () => {
    if (!activeSessionId) return toast.error("No session");
    navigator.clipboard.writeText(`${window.location.origin}/share/${activeSessionId}`);
    toast.success("Link copied!");
  };

  const [abortController, setAbortController] = useState(null);
  const handleStop = () => { if (abortController) { abortController.abort(); setAbortController(null); setIsThinking(false); } };

  const handleFeedback = async (mIdx, type) => {
    if (!activeSessionId) return;
    try {
      await saveFeedback(currentUser.uid, activeSessionId, mIdx, type);
      setHistory(prev => prev.map(s => {
        if (s.id === activeSessionId || s.session_id === activeSessionId || s._id === activeSessionId) {
          const newMessages = [...s.messages];
          newMessages[mIdx] = { ...newMessages[mIdx], feedback: type };
          return { ...s, messages: newMessages };
        }
        return s;
      }));
      toast.success(type === 'like' ? 'Upvoted.' : 'Downvoted.');
    } catch (err) {
      toast.error("Feedback failed.");
    }
  };

  const fileInputRef = useRef(null);
  const handleFileUpload = async (e) => { const file = e.target.files[0]; if (!file) return; setAttachedFile(file); toast.success(`${file.name} attached.`); };

  const availableModels = ['GPT', 'Grok', 'DeepSeek'];

  const inputComponent = (
    <div className="w-full relative">
      {/* BOX UI */}
      <div className={`md:rounded-[32px] overflow-hidden transition-all md:border md:border-white/[0.08] backdrop-blur-3xl md:bg-white/[0.03] ${!activeSession ? 'md:shadow-2xl md:shadow-black/80' : 'md:shadow-xl'} flex items-center gap-2 rounded-2xl bg-[#202123]/90 border border-white/10 shadow-lg px-2 py-1.5 md:block md:px-0 md:py-0`}>
        <div className="hidden md:block w-full">
           <textarea
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
             placeholder="Ask anything..."
             className="w-full px-10 pt-10 pb-4 bg-transparent text-white text-base outline-none resize-none min-h-[120px] max-h-[200px] font-medium leading-relaxed placeholder:text-white"
           />
        </div>
        
        {/* Mobile Input */}
        <button onClick={() => fileInputRef.current?.click()} className="md:hidden p-2 rounded-full text-white/70 hover:text-white flex-shrink-0"><Plus size={20} /></button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Message..."
          className="md:hidden flex-1 bg-transparent text-white text-base outline-none resize-none max-h-[100px] font-medium py-2 placeholder:text-white/40"
          rows={1}
        />
        
        <div className="hidden md:flex items-center justify-between px-10 pb-8">
          <div className="flex gap-4 items-center">
             <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:text-white hover:bg-[#ea3a5b]/20 hover:border-[#ea3a5b]/40 transition-all"><Plus size={20} /></button>
             <button onClick={startSTT} className={`p-4 rounded-full transition-all border ${isListening ? 'bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse' : 'bg-white/5 border-white/10 text-white hover:text-white'}`}><Mic size={20} /></button>
             <button onClick={() => setIsConfigOpen(!isConfigOpen)} className={`px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 group ${isConfigOpen ? 'bg-[#ea3a5b]/20 border-[#ea3a5b] text-[#ea3a5b]' : 'bg-white/5 border-white/10 text-white hover:text-white'}`}>
                <Cpu size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Choose Models</span>
             </button>
          </div>
          <div className="flex items-center gap-4">
            {isThinking ? (
              <button onClick={handleStop} className="h-14 px-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10">Stop Analysis</button>
            ) : (
              <button onClick={() => handleSend()} disabled={!inputValue.trim() && !attachedFile} className="h-14 px-12 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#ea3a5b] hover:text-white transition-all disabled:opacity-20 shadow-2xl shadow-black/40 flex items-center gap-3 group">
                 Send <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-1">
           <button onClick={startSTT} className={`p-2 rounded-full transition-all flex-shrink-0 ${isListening ? 'text-rose-500 animate-pulse' : 'text-white/60 hover:text-white'}`}><Mic size={20} /></button>
           {isThinking ? (
              <button onClick={handleStop} className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div></button>
           ) : (
              <button onClick={() => handleSend()} disabled={!inputValue.trim() && !attachedFile} className="w-9 h-9 rounded-full bg-white text-black disabled:opacity-20 flex items-center justify-center flex-shrink-0 disabled:bg-white/20 disabled:text-white/50 transition-colors">
                 <Send size={16} className="mr-0.5 mt-0.5" />
              </button>
           )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Toaster position="bottom-right" />
      <DeleteConfirmModal isOpen={deleteModal.open} onClose={() => setDeleteModal({ ...deleteModal, open: false })} onConfirm={confirmDelete} title={deleteModal.title} />
      
      {isSearchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSearchOpen(false)} />
           <div className="w-full max-w-2xl bg-[#0d0d12]/90 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-2 animate-in fade-in slide-in-from-top-4">
              <div className="p-8"><input autoFocus placeholder="Search history..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none outline-none text-3xl text-white placeholder-white/10 font-medium" /></div>
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                 {filteredHistory.map((s) => (
                    <button key={s.id || s.session_id || s._id} onClick={() => { handleSelectSession(history.indexOf(s)); setIsSearchOpen(false); }} className="w-full px-8 py-6 hover:bg-white/5 text-left border-b border-white/5 flex items-center justify-between group">
                       <div><div className="font-bold text-white group-hover:text-[#ea3a5b] transition-colors">{s.title}</div><div className="text-[10px] opacity-20 uppercase tracking-[0.3em] mt-2 font-black italic">{new Date(s.updated_at || s.timestamp).toLocaleDateString()}</div></div>
                       <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/share/:sessionId" element={<SharedChat />} />
        <Route path="/whitepaper" element={<Whitepaper />} />
        <Route path="/*" element={
          !currentUser ? <LandingPage onLoginClick={() => navigate('/login')} /> : (
            <DashboardShell 
              currentUser={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} 
              handleNewChat={handleNewChat} history={history} handleSelectSession={handleSelectSession} 
              handleDeleteSession={handleDeleteSession} activeSessionId={activeSessionId} setIsSearchOpen={setIsSearchOpen} 
              navigate={navigate} handleLogout={handleLogout} activeSession={activeSession} currentView={currentView} 
              setCurrentView={setCurrentView} handleShare={handleShare}
            >
               <Routes>
                  <Route path="/" element={
                     <div className="h-full w-full flex flex-col relative animate-in fade-in duration-700">
                        <div className={`flex-1 ${activeSession ? 'overflow-y-auto' : 'overflow-y-auto'} p-4 md:p-12 mb-4`} ref={scrollRef}>
                           <div className="w-full max-w-[420px] mx-auto md:max-w-none space-y-16 pt-10 pb-32 md:py-10">
                              {!activeSession && (
                                <div className="h-[50vh] md:h-[60vh] flex flex-col items-center justify-center text-center space-y-3 md:space-y-0">
                                   <div className="relative z-10 w-full px-4 md:px-12">
                                      <h2 className="text-3xl font-semibold md:text-7xl md:font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white">
                                         {new Date().getHours() < 12 ? 'Good Morning,' : new Date().getHours() < 18 ? 'Good Afternoon,' : 'Good Evening,'} <span className="text-[#ea3a5b]">{(currentUser?.displayName || currentUser?.display_name || currentUser?.email?.split('@')?.[0] || 'there')?.split(' ')?.[0]}</span>.
                                      </h2>
                                      <p className="text-xs text-gray-400 md:text-white md:text-sm font-black uppercase tracking-widest md:tracking-[0.4em] mt-3 md:mt-6">
                                         {randomTagline}
                                      </p>
                                   </div>
                                 </div>
                              )}
                             {activeSession && currentView === 'flow' && (
                                <div className="flex-1 flex flex-col items-center">
                               {/* HUD OVERLAY - Elevated 'Out of Box' */}
                               {(() => {
                                   const msgs = activeSession?.messages || [];
                                   const lastMsg = msgs[msgs.length - 1];
                                   const processedPrompt = lastMsg?.prompt || inputValue;
                                   if (!processedPrompt) return null;
                                  return (
                                     <div 
                                        className="w-full max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-top-4 duration-700 cursor-pointer"
                                        onClick={() => setIsInputExpanded(!isInputExpanded)}
                                     >
                                        <div className="bg-[#12121a]/60 backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 flex items-start gap-6 shadow-2xl transition-all hover:border-[#ea3a5b]/20">
                                           <div className="w-12 h-12 rounded-2xl bg-[#ea3a5b]/10 flex items-center justify-center text-[#ea3a5b] flex-shrink-0 border border-[#ea3a5b]/20 shadow-lg shadow-[#ea3a5b]/5 mt-1">
                                              <MessageSquare size={20} />
                                           </div>
                                           <div className="min-w-0 flex-1">
                                              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ea3a5b] mb-1.5 opacity-80 italic">Input</div>
                                              <div className={`text-sm font-semibold text-white leading-relaxed ${isInputExpanded ? 'whitespace-pre-wrap' : 'truncate'}`}>"{processedPrompt}"</div>
                                           </div>
                                        </div>
                                     </div>
                                  );
                               })()}

                                  <div className="w-full max-w-7xl h-[60vh] rounded-[40px] overflow-hidden bg-[#0a0a0b] border border-white/5 relative shadow-inner group">
                                     <div className="absolute -inset-4 bg-gradient-to-r from-[#ea3a5b]/5 to-blue-500/5 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                     {(() => {
                                        const msgs = activeSession?.messages || [];
                                        const lastMsg = msgs[msgs.length - 1] || {};
                                        return (
                                           <FlowCanvas 
                                              activeSessionId={activeSessionId}
                                              responsesL1={lastMsg.responsesL1 || []}
                                              responseL2={lastMsg.responseL2 || ''}
                                              isThinking={isThinking}
                                              phase={phase}
                                              isFileAttached={lastMsg.isFileAttached || attachedFile !== null}
                                              currentPrompt={lastMsg.prompt || inputValue}
                                              config={{
                                                 layer1: modelsL1,
                                                 layer2: modelL2
                                              }} 
                                           />
                                        );
                                     })()}
                                  </div>
                                </div>
                             )}
                             {activeSession && currentView === 'transcript' && (
                                <div className="w-full px-8 space-y-16">
                                   {activeSession.messages.map((msg, mIdx) => (
                                     <div key={mIdx} className="space-y-10 animate-in fade-in duration-700">
                                        <div className="flex justify-end w-full"><div className="bg-white/5 px-10 py-6 rounded-3xl rounded-tr-none text-sm font-medium leading-relaxed italic text-white max-w-[70%] border border-white/[0.05] shadow-2xl">{msg.prompt}</div></div>
                                        {(msg.responseL2 || msg.isProcessing) && (
                                           <div className="flex gap-10 group w-full">
                                              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center relative p-2 overflow-hidden">
                                                 <img src="/logo.png" className="w-full h-full object-contain" alt="CouncilX" />
                                              </div>
                                              <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-10 rounded-[32px] rounded-tl-none prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 max-w-[85%] shadow-sm overflow-x-auto min-h-[100px]">
                                                 {msg.isProcessing && !msg.responseL2 ? (
                                                   <div className="flex items-center gap-3 text-white italic">
                                                       <div className="w-2 h-2 bg-[#ea3a5b] rounded-full animate-ping" />
                                                       <span className="text-[#ea3a5b] font-black uppercase tracking-widest text-[10px]">{statusText || "The Council is deliberating..."}</span>
                                                    </div>
                                                 ) : (
                                                   <>
                                                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                         {typeof msg.responseL2 === 'string' ? msg.responseL2 : msg.responseL2?.response || ''}
                                                      </ReactMarkdown>
                                                      
                                                      {msg.responseL2 && !msg.isProcessing && (
                                                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                           <button 
                                                              onClick={() => handleFeedback(mIdx, 'like')}
                                                              className={`p-2 rounded-lg transition-all ${msg.feedback === 'like' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'bg-white/10 text-white hover:text-white hover:bg-white/20'}`}
                                                           >
                                                              <ThumbsUp size={14} />
                                                           </button>
                                                           <button 
                                                              onClick={() => handleFeedback(mIdx, 'dislike')}
                                                              className={`p-2 rounded-lg transition-all ${msg.feedback === 'dislike' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-110' : 'bg-white/10 text-white hover:text-white hover:bg-white/20'}`}
                                                           >
                                                              <ThumbsDown size={14} />
                                                           </button>
                                                        </div>
                                                      )}
                                                   </>
                                                 )}
                                              </div>
                                           </div>
                                        )}
                                     </div>
                                   ))}
                                </div>
                             )}
                          </div>
                       </div>
                       
                        <div className="p-4 pt-0 w-full fixed bottom-4 left-0 right-0 md:static md:max-w-none md:p-12 md:pt-0 z-50">
                          <div className="w-full max-w-[420px] mx-auto md:max-w-none md:px-4">
                             {/* ATTACHED FILE PREVIEW ABOVE THE BOX */}
                             {attachedFile && (
                                <div className="mb-4 animate-in slide-in-from-bottom-2 duration-300">
                                   <div className="bg-[#161720]/80 backdrop-blur-3xl border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl inline-flex">
                                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg"><FileText size={18} /></div>
                                      <div className="min-w-0 pr-4">
                                         <div className="text-sm font-bold truncate text-white">{attachedFile.name}</div>
                                         <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Read & Index</div>
                                      </div>
                                      <button onClick={() => setAttachedFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={14} /></button>
                                   </div>
                                </div>
                             )}
                             {inputComponent}
                          </div>
                       </div>
                    </div>
                  } />
                  <Route path="/audit/scanner" element={<DataScanner />} />
                  <Route path="/audit/tuner" element={<BiasTuner />} />
                  <Route path="/audit/tracker" element={<FairnessTracker history={history} activeSessionId={activeSessionId} />} />
                  <Route path="/audit/report" element={<TrustReport />} />
                  <Route path="/audit/news" element={<NewsProtocol />} />
                  <Route path="/account" element={<AccountPage user={currentUser} onLogout={handleLogout} onUpdate={(u) => {setCurrentUser(u); localStorage.setItem('parliament_user', JSON.stringify(u));}} />} />
               </Routes>
            </DashboardShell>
          )
        } />
      </Routes>
      <FlowConfigModal 
         isOpen={isConfigOpen} 
         onClose={() => setIsConfigOpen(false)} 
         config={{ layer1: modelsL1, layer2: modelL2 }} 
         onSave={(newConfig) => {
            setModelsL1(newConfig.layer1);
            setModelL2(newConfig.layer2);
         }} 
      />
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.json,.pdf,.txt" />
    </>
  );
}

export default function App() { return (<BrowserRouter><MainApp /></BrowserRouter>); }
