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
    <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-1 py-2 bg-white dark:bg-slate-950 shrink-0 pb-4 transition-colors">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[60px] transition-colors rounded-lg",
              isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <div className={cn("p-1.5 rounded-xl transition-colors", isActive && "bg-indigo-50 dark:bg-indigo-900/30")}>
              <Icon size={22} className={cn(isActive && "text-indigo-600 dark:text-indigo-400")} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
