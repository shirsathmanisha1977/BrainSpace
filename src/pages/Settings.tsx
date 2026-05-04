import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut, User as UserIcon, Moon, Sun, Monitor, Info, ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition mr-3">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
          
          {/* Account Section */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Account</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] p-6 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <UserIcon className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{user?.displayName || 'User'}</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
             </div>
          </section>

          {/* Appearance Section */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Appearance</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] p-4 flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 transition-colors">
                
                <div className="p-4 flex items-center justify-between">
                   <div>
                     <h3 className="font-semibold text-slate-900 dark:text-slate-100">Theme Mode</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Select your preferred color scheme</p>
                   </div>
                   <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                      {(['light', 'dark', 'system'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold capitalize flex items-center justify-center gap-2 transition-all",
                            theme === t 
                              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          )}
                        >
                          {t === 'light' && <Sun className="w-4 h-4" />}
                          {t === 'dark' && <Moon className="w-4 h-4" />}
                          {t === 'system' && <Monitor className="w-4 h-4" />}
                          {t}
                        </button>
                      ))}
                   </div>
                </div>

             </div>
          </section>

          {/* General Section */}
          <section className="space-y-4">
             <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">General</h2>
             <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] p-4 flex flex-col divide-y divide-slate-100 dark:divide-slate-800/60 transition-colors">
                
                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                       <Monitor className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Sync Status</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">All data is synced in real-time</p>
                     </div>
                   </div>
                   <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 rounded-full uppercase tracking-wider">
                     Synced
                   </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                       <Monitor className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">Clear Cache</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Free up local data</p>
                     </div>
                   </div>
                   <button 
                     onClick={() => { localStorage.clear(); window.location.reload(); }}
                     className="px-4 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg transition"
                   >
                     Clear
                   </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center">
                       <Info className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-slate-100">About BrainSpace</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Version 3.0.0 &bull; Privacy Policy</p>
                     </div>
                   </div>
                </div>

             </div>
          </section>

        </div>
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to sign out of BrainSpace? You will need to sign in again to access your saved items."
        confirmText="Sign Out"
        danger
        icon="logout"
      />
    </div>
  );
}
