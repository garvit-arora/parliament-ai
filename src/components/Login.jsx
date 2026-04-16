import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';
import { authProfile } from '../api/council';

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      const profile = await authProfile(user.uid, user.email, user.displayName || 'User');
      
      onLogin({ ...user, isNewUser: profile.isNewUser });
    } catch (err) {
      console.error(err);
      setError("Failed to authenticate with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ea3a5b]/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5">
        <div className="w-full px-6 md:px-12 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
            <img src="/logo.png" alt="CouncilX" className="w-10 h-10 object-contain" />
            <span className="font-black text-xl md:text-2xl tracking-tighter uppercase text-white">
               Council<span className="text-[#ea3a5b]">X</span>
            </span>
          </div>
          
          <div className="flex items-center gap-10">
            <button onClick={() => window.location.href = '/'} className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all whitespace-nowrap">Home</button>
          </div>
        </div>
      </nav>
      <div className="max-w-md w-full glass p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase text-white">Council<span className="text-[#ea3a5b]">X</span></h2>
          <p className="text-white/50 text-sm mb-10 font-medium">Protocol Authenticated Session</p>
        </div>

        <div className="space-y-4">
          {error && <div className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg">{error}</div>}

          <label className="flex items-start gap-3 mb-6 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="data-consent" 
                className="peer appearance-none w-5 h-5 border border-white/10 rounded-md bg-white/5 checked:bg-[#ea3a5b] checked:border-[#ea3a5b] transition-all cursor-pointer"
                onChange={(e) => {
                  if (e.target.checked) setError(null);
                }}
              />
              <svg className="absolute w-5 h-5 text-white p-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">
              I certify that I am human and agree to the <span className="text-white">Protocol Consensus Agreement</span> for data orchestration and vector storage.
            </span>
          </label>

          <button
            onClick={() => {
              if (!document.getElementById('data-consent').checked) {
                setError("You must accept the data collection agreement before logging in.");
                return;
              }
              handleGoogleLogin();
            }}
            disabled={loading}
            className="w-full relative flex items-center justify-center gap-3 py-3 px-4 border border-white/10 rounded-xl hover:bg-white/5 disabled:opacity-50 transition-colors bg-[#111115]"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

      </div>
      
      <p className="mt-8 max-w-sm text-center text-[10px] text-white/20 leading-relaxed px-4">
        <strong>Privacy Notice:</strong> We explicitly store your chat transcripts and historical session data to verify bias correction matrices and train our orchestration models organically.
      </p>
    </div>
  );
}
