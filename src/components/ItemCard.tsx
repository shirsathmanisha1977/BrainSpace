import { Item } from "@/types";
import { Trash2, Heart, Star, Tag, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { shareItem } from "@/lib/share";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";

interface Props {
  item: Item;
  index?: number;
}

export default function ItemCard({ item, index = 0 }: Props) {
  const { user } = useAuth();
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(!user) return;
    try {
        await deleteDoc(doc(db, `users/${user.uid}/items/${item.id}`));
    } catch(err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/items/${item.id}`);
    }
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
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: (index % 10) * 0.05 }}
         className="flex flex-col md:flex-row p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-[24px] shadow-sm gap-6 transition-all group hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
      >
         <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="flex-1 flex flex-col min-w-0">
           <div className="flex items-start gap-5 mb-4 relative z-10">
              <div className={cn(
                  "w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 text-2xl shadow-inner border", 
                  item.type === 'link' 
                     ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-500 border-blue-100 dark:border-blue-800/50" 
                     : "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 text-emerald-500 border-emerald-100 dark:border-emerald-800/50"
              )}>
                  {item.type === 'link' ? '🔗' : '🖼️'}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100 font-sans tracking-tight">{item.title}</h4>
                  {item.type === 'link' && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline truncate block mt-1.5" onClick={(e) => e.stopPropagation()}>
                          {item.url}
                      </a>
                  )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 md:relative bg-white/80 dark:bg-slate-900/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-1 md:p-0 rounded-2xl md:rounded-none">
                <button 
                   onClick={handleShare} 
                   className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all active:scale-95"
                   title="Share"
                >
                    <Share2 className="w-5 h-5" />
                </button>
                <button 
                   onClick={handleToggleFavorite} 
                   className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all active:scale-95"
                   title="Favorite"
                >
                    <Heart className={cn("w-5 h-5 transition-transform", item.isFavorite && "fill-rose-500 text-rose-500 scale-110")} />
                </button>
                <button 
                   onClick={handleDelete} 
                   className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all active:scale-95"
                   title="Delete"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
              </div>
           </div>
           
           {item.aiNotes && (
               <div className="p-4 md:p-5 bg-indigo-50/40 dark:bg-indigo-900/20 rounded-[20px] mb-5 text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed border border-indigo-100/50 dark:border-indigo-800/30 relative overflow-hidden shadow-inner">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 z-10 rounded-l-[20px]"></div>
                   ✨ {item.aiNotes}
               </div>
           )}

           <div className="flex items-center justify-between mt-auto">
               <div className="flex items-center gap-1.5">
                   <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.rating}/5</span>
               </div>
               {item.tags?.length > 0 && (
                   <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                       <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                       {item.tags.map(tag => (
                           <span key={tag} className="text-[11px] uppercase font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 px-2.5 py-1 rounded-lg shrink-0 flex">
                               {tag}
                           </span>
                       ))}
                   </div>
               )}
           </div>
         </div>

         {item.type !== 'link' && item.url.startsWith('data:image') && (
             <div className="w-full md:w-64 md:h-48 bg-slate-100 dark:bg-slate-800 rounded-[20px] overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-inner group-hover:shadow-md transition-shadow">
                 <img src={item.url} alt="Saved content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             </div>
         )}
      </motion.div>
  );
}
