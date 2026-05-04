import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, onSnapshot, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Item } from "@/types";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ItemCard from "@/components/ItemCard";

export default function CategoryView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !id) return;
    const q = query(
        collection(db, `users/${user.uid}/items`), 
        where('category', '==', id)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      // Sort client side
      newItems.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setItems(newItems as Item[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/items`);
    });

    return unsubscribe;
  }, [user, id]);

  const handleDelete = async (itemId: string) => {
    if(!user) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/items/${itemId}`));
    } catch(err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/items/${itemId}`);
    }
  }

  const handleToggleFavorite = async (item: Item) => {
    if(!user) return;
    try {
        await updateDoc(doc(db, `users/${user.uid}/items/${item.id}`), {
            isFavorite: !item.isFavorite,
            updatedAt: serverTimestamp()
        });
    } catch(err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/items/${item.id}`);
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition mr-2 md:mr-4">
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{id}</h1>
        <div className="ml-auto flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {items.map((item, i) => (
              <ItemCard key={item.id} item={item} index={i} />
          ))}
          {items.length === 0 && (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-[15px] font-medium bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 border-dashed rounded-[32px] transition-colors shadow-sm">
                  No items in this category.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
