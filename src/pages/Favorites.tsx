import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Item } from "@/types";
import { Heart, ArrowLeft } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
        collection(db, `users/${user.uid}/items`), 
        where('isFavorite', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      // Sort client side
      newItems.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setItems(newItems as Item[]);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/items`);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10 gap-4">
        <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3 font-sans">
           <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-500 flex items-center justify-center">
             <Heart className="w-5 h-5 fill-rose-500" />
           </div>
           Favorites
        </h1>
        <div className="ml-auto flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full tracking-wide">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-10">
          {items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
          ))}
          {items.length === 0 && !loading && (
              <div className="text-center py-24 text-slate-500 dark:text-slate-400 text-base font-medium bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-dashed rounded-[32px] transition-colors shadow-sm">
                  You haven't favored any items yet.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
