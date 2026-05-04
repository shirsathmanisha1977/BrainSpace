import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Item } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIconMap: Record<string, string> = {
  Food: "🍔",
  Technology: "💻",
  Travel: "✈️",
  Design: "🎨",
  Education: "📚",
  Shopping: "🛍️",
  Others: "📦"
};

const categoryColorMap: Record<string, string> = {
  Food: "bg-orange-100 text-orange-600",
  Technology: "bg-blue-100 text-blue-600",
  Travel: "bg-emerald-100 text-emerald-600",
  Design: "bg-purple-100 text-purple-600",
  Education: "bg-yellow-100 text-yellow-600",
  Shopping: "bg-pink-100 text-pink-600",
  Others: "bg-slate-100 text-slate-600"
};

const categoryBadgeMap: Record<string, string> = {
  Food: "bg-orange-50 text-orange-600",
  Technology: "bg-blue-50 text-blue-600",
  Travel: "bg-emerald-50 text-emerald-600",
  Design: "bg-purple-50 text-purple-600",
  Education: "bg-yellow-50 text-yellow-600",
  Shopping: "bg-pink-50 text-pink-600",
  Others: "bg-slate-50 text-slate-600"
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/items`), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(newItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/items`);
    });

    return unsubscribe;
  }, [user]);

  const categoriesMap = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const categories = Object.keys(categoriesMap).sort();

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="px-4 h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md md:px-8 flex items-center justify-between shrink-0 gap-4 transition-colors sticky top-0 z-10">
        <div 
          className="relative flex-1 md:w-96 md:flex-none cursor-text" 
          onClick={() => navigate('/search')}
        >
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <div className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-full text-sm font-medium text-slate-400 flex items-center cursor-text hover:shadow-md transition-all">
            Search your knowledge...
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link to="/add">
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition">
              + Save Content
            </button>
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        <section>
          <div className="mb-8 mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              Hello, {user?.displayName ? user.displayName.split(' ')[0] : 'User'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Ready to explore your saved knowledge?</p>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-2">Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <Link to="/all">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all cursor-pointer flex items-center gap-5 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-500" />
                <div className="w-14 h-14 rounded-[20px] bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  📂
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">All Items</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/favorites">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all cursor-pointer flex items-center gap-5 relative overflow-hidden group"
              >
                 <div className="absolute top-0 left-0 bottom-0 w-2 bg-rose-500" />
                <div className="w-14 h-14 rounded-[20px] bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  ❤️
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">Favorites</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      {items.filter(item => item.isFavorite).length} {items.filter(item => item.isFavorite).length === 1 ? 'Item' : 'Items'}
                    </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/recent">
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all cursor-pointer flex items-center gap-5 relative overflow-hidden group"
              >
                 <div className="absolute top-0 left-0 bottom-0 w-2 bg-emerald-500" />
                <div className="w-14 h-14 rounded-[20px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  🕒
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">Recent</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">
                      Last 7 days
                    </p>
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-2">Smart Categories</h2>
            <Link to="/search" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-4 py-2 rounded-full transition-colors">View All</Link>
          </div>
          
          {categories.length === 0 && !loading && (
             <div className="text-[15px] font-medium text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-dashed border-slate-300 dark:border-slate-700 shadow-sm">
                No categories yet. Save a link or image to get started.
             </div>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat, i) => (
              <Link key={cat} to={`/category/${cat}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-[28px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md cursor-pointer flex flex-col h-full group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 pointer-events-none" />
                  <div className={cn(
                    "w-14 h-14 rounded-[20px] flex items-center justify-center mb-5 text-2xl shadow-inner group-hover:scale-110 transition-transform",
                    categoryColorMap[cat] || categoryColorMap['Others']
                  )}>
                    {categoryIconMap[cat] || categoryIconMap['Others']}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-auto leading-tight">{cat}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1.5">
                    {categoriesMap[cat].length} {categoriesMap[cat].length === 1 ? 'Item' : 'Items'}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0 pb-10">
          <div className="flex items-center justify-between mb-5 mt-4">
            <h2 className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-2">Recently Saved</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.slice(0, 8).map((item, i) => (
                <Link key={item.id} to={`/category/${item.category}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 md:p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-[24px] shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/50 cursor-pointer transition-all group"
                  >
                    <div className={cn(
                        "w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl shrink-0 border border-slate-100 dark:border-slate-800 shadow-inner group-hover:scale-105 transition-transform",
                        item.type === 'link' ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30" : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30"
                    )}>
                      {item.type === 'link' ? '🔗' : '🖼️'}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">{item.title}</h4>
                      <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.type === 'link' ? item.url : 'Saved image'}
                      </p>
                    </div>
                    {item.isFavorite && (
                        <div className="shrink-0 mr-1 text-rose-500">
                             <span className="text-sm">❤️</span>
                        </div>
                    )}
                    <span className={cn(
                      "hidden sm:inline-flex px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-full whitespace-nowrap",
                      categoryBadgeMap[item.category] || categoryBadgeMap['Others']
                    )}>
                      {item.category}
                    </span>
                  </motion.div>
                </Link>
              ))}
          </div>

          {items.length === 0 && !loading && (
             <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm mt-4">
                <div className="text-6xl mb-6">🪄</div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">Your library awaits</h3>
                <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-3">Start saving links and images. Our AI will automatically organize them for you.</p>
                <Link to="/add">
                   <button className="mt-8 bg-indigo-600 text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-indigo-700 shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.4)] transition-all active:scale-95">
                     Save First Item
                   </button>
                </Link>
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
