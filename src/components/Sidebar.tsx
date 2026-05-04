import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, Settings as SettingsIcon, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: PlusCircle, label: "Add Content", path: "/add" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-50 dark:bg-slate-950 justice-between py-6 shrink-0 transition-colors">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="none" stroke="currentColor" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">BrainSpace</h1>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-5 py-3.5 rounded-full text-sm font-bold cursor-pointer transition-all",
                  isActive 
                    ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-100" 
                    : "text-slate-700 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <Icon size={22} className={cn(isActive ? "text-indigo-900 dark:text-indigo-100" : "text-slate-500", isActive && "fill-indigo-100 dark:fill-indigo-900/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="px-6 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-[24px] hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer transition-all">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{user?.displayName || 'User'}</p>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
