import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, Settings as SettingsIcon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: PlusCircle, label: "Add", path: "/add" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="md:hidden border-t border-slate-200/60 dark:border-slate-800/60 flex justify-around items-center px-2 py-3 bg-white dark:bg-slate-900 shrink-0 pb-6 transition-colors shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1.5 min-w-[64px] transition-all rounded-full px-2",
              isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <div className={cn("px-5 py-1.5 rounded-full transition-all", isActive && "bg-indigo-100 dark:bg-indigo-900/50")}>
              <Icon size={24} className={cn(isActive && "text-indigo-700 dark:text-indigo-300 fill-indigo-100 dark:fill-indigo-900/20")} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn("text-[11px] font-bold", isActive && "text-indigo-900 dark:text-indigo-100")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
