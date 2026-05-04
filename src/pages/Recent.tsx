import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { Item } from "@/types";
import { Clock } from "lucide-react";
import ItemCard from "@/components/ItemCard";

export default function Recent() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
        collection(db, `users/${user.uid}/items`), 
        orderBy('createdAt', 'desc'),
        limit(30)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(newItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/items`);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
           <Clock className="w-5 h-5 text-emerald-500" /> Recent Items
        </h1>
        <div className="ml-auto flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
          ))}
          {items.length === 0 && !loading && (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-[15px] font-medium bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-dashed rounded-[32px] transition-colors shadow-sm">
                  You haven't saved any items recently.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
