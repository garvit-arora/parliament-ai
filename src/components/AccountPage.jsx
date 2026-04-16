import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, CheckCircle2, Save, Zap, Info, ArrowLeft, Crown, Monitor, LayoutTemplate, Bell, SlidersHorizontal } from 'lucide-react';
import { updateProfile } from '../api/council';
import toast from 'react-hot-toast';

export default function AccountPage({ user, onLogout, onUpdate }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [instructions, setInstructions] = useState(user?.custom_instructions || '');
  
  // Customization Toggles state (Mocked UI preferences as requested)
  const [tolerance, setTolerance] = useState(user?.base_tolerance || 65);
  const [deepSeekEnabled, setDeepSeekEnabled] = useState(true);
  
  const promptLimit = user?.has_premium ? 1000 : 50;
  const promptsLeft = Math.max(0, promptLimit - (user?.prompts_used || 0));

  const handleUpdate = async () => {
    try {
      const resp = await updateProfile(user.uid, { 
        display_name: name,
        custom_instructions: instructions,
        base_tolerance: tolerance
      });
      if (resp.status === 'success') {
        onUpdate(resp.user);
        setIsEditing(false);
        toast.success("Profile saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col font-sans h-full overflow-y-auto px-8 md:px-16 py-10 w-full animate-in fade-in duration-500">
       <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">Profile</h1>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Available Audits</div>
                <div className="text-xl font-bold text-emerald-500">{promptsLeft} <span className="text-xs text-white/30 font-medium">/ {promptLimit}</span></div>
             </div>
             {!user?.has_premium && (
               <button className="px-5 py-2.5 bg-[#ea3a5b]/10 text-[#ea3a5b] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ea3a5b] hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-[#ea3a5b]/5">
                  <Crown size={14} /> Upgrade Plan
               </button>
             )}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
             
             {/* Personal Info Box */}
             <section>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-lg font-bold text-white flex items-center gap-3"><User size={18} className="text-white/40"/> Personal Information</h2>
                   {isEditing ? (
                      <div className="flex gap-3">
                         <button onClick={() => setIsEditing(false)} className="px-5 py-2 text-xs font-bold text-white/40 hover:text-white transition-colors">Cancel</button>
                         <button onClick={handleUpdate} className="px-6 py-2.5 bg-emerald-500 text-black text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"><Save size={14}/> Save Changes</button>
                      </div>
                   ) : (
                      <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white hover:text-black transition-all">Edit Profile</button>
                   )}
                </div>
                
                <div className="p-8 md:p-10 rounded-[32px] bg-[#0a0a0f] border border-white/5 space-y-8 shadow-2xl">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl border border-white/10 bg-indigo-600 flex items-center justify-center text-4xl font-black shrink-0 overflow-hidden shadow-2xl relative group">
                         <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.email || 'user'}`} alt="" className="w-full h-full object-cover scale-110" />
                         {isEditing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-black uppercase tracking-widest">
                               Upload
                            </div>
                         )}
                      </div>
                      <div>
                         <div className="text-sm font-bold text-white/90 mb-2">{user?.email}</div>
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            <CheckCircle2 size={12} /> Verified Account
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Display Name</label>
                         <input 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           disabled={!isEditing}
                           className="w-full bg-[#161720] border border-white/5 focus:border-[#ea3a5b]/50 rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                         />
                      </div>
                   </div>
                </div>
             </section>

             {/* Forensic Instructions Setting */}
             <section>
                <div className="flex items-center justify-between mb-6">
                   <h2 className="text-lg font-bold text-white flex items-center gap-3"><Shield size={18} className="text-[#ea3a5b]"/> System Directives</h2>
                </div>
                <div className="p-8 md:p-10 rounded-[32px] bg-[#0a0a0f] border border-white/5 shadow-2xl">
                   <p className="text-xs font-medium text-white/40 leading-relaxed mb-6">These instructions are automatically prepended to every audit query you run on CouncilX to enforce your custom constraints globally.</p>
                   <textarea 
                     value={instructions}
                     onChange={(e) => setInstructions(e.target.value)}
                     disabled={!isEditing}
                     placeholder="e.g., Always cross-reference facts from three diverse geographical sources."
                     className="w-full h-40 bg-[#161720] border border-white/5 focus:border-[#ea3a5b]/50 rounded-2xl px-6 py-5 text-sm leading-relaxed outline-none resize-none transition-all disabled:opacity-30 disabled:cursor-not-allowed custom-scrollbar"
                   />
                </div>
             </section>
          </div>

          {/* Preferences Sidebar Area */}
          <div className="lg:col-span-4 space-y-10 lg:pl-4">
             


             {/* Audit Configuration Placebo settings */}
             <section>
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Default Audit Rules</h3>
                <div className="bg-[#0a0a0f] border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
                   
                   <div className="p-6 border-b border-white/5 flex flex-col gap-5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[#ea3a5b]/10 flex items-center justify-center text-[#ea3a5b] border border-[#ea3a5b]/20"><SlidersHorizontal size={16} /></div>
                         <div className="text-sm font-bold text-white/90">Base Tolerance</div>
                      </div>
                      <input type="range" min="0" max="100" value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value))} disabled={!isEditing} className={`w-full accent-[#ea3a5b] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer outline-none transition-all ${!isEditing ? 'opacity-30 cursor-not-allowed' : ''}`} />
                      <div className="flex justify-between text-[9px] text-[#ea3a5b] uppercase tracking-widest font-black">
                         <span>Strict</span>
                         <span>Lenient</span>
                      </div>
                   </div>

                   <div className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setDeepSeekEnabled(!deepSeekEnabled)}>
                      <div className="text-sm font-bold text-white/90">DeepSeek Fallbacks</div>
                      <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${deepSeekEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
                         <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-sm ${deepSeekEnabled ? 'left-7' : 'left-1'}`} />
                      </div>
                   </div>

                </div>
             </section>

             <div className="pt-6">
                <button onClick={onLogout} className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all w-full shadow-lg shadow-rose-500/5 group text-center">
                   Sign Out Application
                </button>
             </div>

          </div>
       </div>

    </div>
  );
}
