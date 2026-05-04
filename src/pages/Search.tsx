import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Item } from "@/types";
import { Search as SearchIcon } from "lucide-react";
import ItemCard from "@/components/ItemCard";

export default function Search() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/items`), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
      setItems(newItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/items`);
    });

    return unsubscribe;
  }, [user]);

  const filteredItems = items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.aiNotes && item.aiNotes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 transition-colors sticky top-0 z-10">
        <div className="relative w-full max-w-2xl">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
            <SearchIcon className="w-5 h-5" />
          </span>
          <input 
             autoFocus
             type="text" 
             placeholder="Search your knowledge..."
             value={searchTerm || ''}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 md:py-3.5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-full text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {searchTerm && <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Search Results</h2>}
          
          {searchTerm && filteredItems.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
          ))}

          {searchTerm && filteredItems.length === 0 && (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm">
                  No results found for "{searchTerm}"
              </div>
          )}
          {!searchTerm && (
              <div className="text-center py-20 text-slate-400 dark:text-slate-500 text-sm">
                  Type something above to search.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
