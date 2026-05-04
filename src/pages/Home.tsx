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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 transition-colors relative">
      <header className="px-4 h-16 md:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 md:px-8 flex items-center justify-between shrink-0 gap-4 transition-colors sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans hidden sm:block">SmartSave</h1>
        <div 
          className="relative flex-1 max-w-xl cursor-text" 
          onClick={() => navigate('/search')}
        >
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <div className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-slate-100/80 dark:bg-slate-900 border-none rounded-full text-sm font-medium text-slate-500 shadow-inner flex items-center cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 transition truncate">
            Search your knowledge...
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/add">
            <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wide hover:bg-indigo-700 shadow-md hover:shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all active:scale-95">
              <span className="hidden sm:inline">+ Save Content</span>
              <span className="sm:hidden">+ New</span>
            </button>
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto">
        <section className="max-w-7xl mx-auto">
          <div className="mb-10 mt-4 px-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
              Hello, {user?.displayName ? user.displayName.split(' ')[0] : 'User'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Ready to explore your saved knowledge?</p>
          </div>

          <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-sans">Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            <Link to="/all">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition hover:shadow-lg cursor-pointer flex items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500" />
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-100 dark:border-blue-800/50 text-blue-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  📂
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 tracking-tight">All Items</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">
                      {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/favorites">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition hover:shadow-lg cursor-pointer flex items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500" />
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/40 dark:to-pink-900/40 border border-rose-100 dark:border-rose-800/50 text-rose-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  ❤️
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 tracking-tight">Favorites</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">
                      {items.filter(item => item.isFavorite).length} {items.filter(item => item.isFavorite).length === 1 ? 'Item' : 'Items'}
                    </p>
                </div>
              </motion.div>
            </Link>

            <Link to="/recent">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition hover:shadow-lg cursor-pointer flex items-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border border-emerald-100 dark:border-emerald-800/50 text-emerald-500 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🕒
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 tracking-tight">Recent</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">
                      Last 7 days
                    </p>
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-5 px-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-sans">Smart Categories</h2>
            <Link to="/search" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">View All</Link>
          </div>
          
          {categories.length === 0 && !loading && (
             <div className="text-sm text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                No categories yet. Save a link or image to get started.
             </div>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat} to={`/category/${cat}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-slate-950 p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition hover:shadow-md hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm",
                    categoryColorMap[cat] || categoryColorMap['Others']
                  )}>
                    {categoryIconMap[cat] || categoryIconMap['Others']}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mt-auto">{cat}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {categoriesMap[cat].length} {categoriesMap[cat].length === 1 ? 'Item' : 'Items'}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0 pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Recently Saved</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.slice(0, 8).map((item, i) => (
                <Link key={item.id} to={`/category/${item.category}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 cursor-pointer transition-all"
                  >
                    <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border border-slate-100 dark:border-slate-800",
                        item.type === 'link' ? "bg-blue-50 dark:bg-blue-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
                    )}>
                      {item.type === 'link' ? '🔗' : '🖼️'}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {item.type === 'link' ? item.url : 'Saved snippet'}
                      </p>
                    </div>
                    {item.isFavorite && (
                        <div className="shrink-0 mr-1 text-rose-500">
                             <span className="text-sm">❤️</span>
                        </div>
                    )}
                    <span className={cn(
                      "hidden sm:inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-md whitespace-nowrap",
                      categoryBadgeMap[item.category] || categoryBadgeMap['Others']
                    )}>
                      {item.category}
                    </span>
                  </motion.div>
                </Link>
              ))}
          </div>

          {items.length === 0 && !loading && (
             <div className="p-10 text-center bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-4">
                <div className="text-6xl mb-4">🪄</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Your library awaits</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">Start saving links and images. Our AI will automatically organize them for you.</p>
                <Link to="/add">
                   <button className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition">
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
