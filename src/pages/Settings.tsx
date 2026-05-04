import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, User as UserIcon, Moon, Sun, Monitor, Palette, Info, ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, useMaterialYou, setUseMaterialYou } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10 gap-4">
        <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">Settings</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
          
          {/* Account Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 font-sans">Account</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow-md border border-slate-200/60 dark:border-slate-800/60 rounded-[24px] p-6 flex flex-col sm:flex-row items-center sm:justify-between gap-6 transition-all">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40 border border-indigo-200/50 dark:border-indigo-800/50 shadow-inner rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                      <UserIcon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="pt-1">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight">{user?.displayName || 'User'}</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="px-6 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full font-semibold transition-all active:scale-95 flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
             </div>
          </motion.section>

          {/* Appearance Section */}
          <motion.section 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3, delay: 0.05 }}
             className="space-y-4"
          >
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 font-sans">Appearance</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow border border-slate-200/60 dark:border-slate-800/60 rounded-[24px] p-2 flex flex-col transition-all">
                
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                       <Palette className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Theme Mode</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Select your preferred color scheme</p>
                     </div>
                   </div>
                   <div className="flex bg-slate-100/80 dark:bg-slate-950 p-1.5 rounded-2xl w-full md:w-auto">
                      {(['light', 'dark', 'system'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            "flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-bold capitalize flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                            theme === t 
                              ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm" 
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                          )}
                        >
                          {t === 'light' && <Sun className="w-4 h-4" />}
                          {t === 'dark' && <Moon className="w-4 h-4" />}
                          {t === 'system' && <Monitor className="w-4 h-4" />}
                          <span className="hidden sm:inline">{t}</span>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-4" />

                <div className="p-4 flex items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <Palette className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Dynamic Colors</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Use Material You system colors</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => setUseMaterialYou(!useMaterialYou)}
                     className={cn(
                       "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden shrink-0",
                       useMaterialYou ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                     )}
                   >
                      <motion.span 
                        layout
                        className={cn(
                          "inline-block h-5 w-5 rounded-full bg-white shadow-sm",
                          useMaterialYou ? "ml-6" : "ml-1"
                        )} 
                      />
                   </button>
                </div>

             </div>
          </motion.section>

          {/* General Section */}
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4"
          >
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 font-sans">General</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm hover:shadow border border-slate-200/60 dark:border-slate-800/60 rounded-[24px] p-2 flex flex-col transition-all">
                
                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                       <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Sync Status</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">All data is synced in real-time</p>
                     </div>
                   </div>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                     Synced
                   </span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-4" />

                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800/50">
                       <Monitor className="w-5 h-5" strokeWidth={1.5} />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Clear Cache</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Free up local data</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => { localStorage.clear(); window.location.reload(); }}
                     className="px-5 py-2 text-sm font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-full transition-all active:scale-95"
                   >
                     Clear
                   </button>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800/60 mx-4" />

                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50">
                       <Info className="w-5 h-5" strokeWidth={1.5} />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">About SmartSave</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">Version 3.0.0 &bull; Privacy Policy</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:hidden">v3.0.0 • Privacy</p>
                     </div>
                   </div>
                </div>

             </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
