import { useState } from "react";
import { Item } from "@/types";
import { Trash2, Heart, Star, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { shareItem } from "@/lib/share";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import ConfirmDialog from "./ConfirmDialog";

interface Props {
  item: Item;
  index?: number;
}

export default function ItemCard({ item, index = 0 }: Props) {
  const { user } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const confirmDelete = async () => {
    if(!user) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/items/${item.id}`));
    } catch(err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/items/${item.id}`);
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await shareItem(item);
  }

  return (
      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: (index % 10) * 0.05, duration: 0.2 }}
         className="flex flex-col md:flex-row p-5 md:p-6 bg-white dark:bg-slate-900 rounded-[28px] shadow-sm hover:shadow-md gap-6 transition-all group border border-slate-200 dark:border-slate-800/60"
      >
         <div className="flex-1 flex flex-col min-w-0">
           <div className="flex items-start gap-4 mb-4">
              <div className={cn(
                  "w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 text-xl overflow-hidden shadow-inner", 
                  item.type === 'link' ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600"
              )}>
                  {item.type === 'link' ? '🔗' : '🖼️'}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100 font-sans tracking-tight">{item.title}</h4>
                  {item.type === 'link' && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block mt-1.5" onClick={(e) => e.stopPropagation()}>
                          {item.url}
                      </a>
                  )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                   onClick={handleShare} 
                   className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-full transition-colors active:scale-95"
                   title="Share"
                >
                    <Share2 className="w-5 h-5" />
                </button>
                <button 
                   onClick={handleToggleFavorite} 
                   className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-full transition-colors active:scale-95"
                   title="Favorite"
                >
                    <Heart className={cn("w-5 h-5 transition-transform", item.isFavorite && "fill-rose-500 text-rose-500 scale-110")} />
                </button>
                <button 
                   onClick={handleDeleteClick} 
                   className="p-2.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full transition-colors active:scale-95"
                   title="Delete"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
              </div>
           </div>
           
           {item.aiNotes && (
               <div className="p-4 md:p-5 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-[24px] mb-5 text-[15px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                   ✨ {item.aiNotes}
               </div>
           )}

           <div className="flex items-center justify-between mt-auto">
               <div className="flex items-center gap-1.5">
                   <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                   <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200">{item.rating}/5</span>
               </div>
               {item.tags?.length > 0 && (
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                       {item.tags.map(tag => (
                           <span key={tag} className="text-[13px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full shrink-0">
                               {tag}
                           </span>
                       ))}
                   </div>
               )}
           </div>
         </div>

         {item.type !== 'link' && item.url.startsWith('data:image') && (
             <div className="w-full md:w-64 md:h-56 bg-slate-100 dark:bg-slate-800 rounded-[20px] overflow-hidden shrink-0 border border-slate-200 dark:border-slate-800">
                 <img src={item.url} alt="Saved content" className="w-full h-full object-cover" />
             </div>
         )}

         <ConfirmDialog
           isOpen={isDeleteDialogOpen}
           onClose={() => setIsDeleteDialogOpen(false)}
           onConfirm={confirmDelete}
           title="Delete Item"
           description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
           confirmText="Delete"
           danger
           icon="delete"
         />
      </motion.div>
  );
}
