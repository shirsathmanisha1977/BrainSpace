import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function Layout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden transition-colors">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
        <BottomNav />
      </main>
    </div>
  );
}
