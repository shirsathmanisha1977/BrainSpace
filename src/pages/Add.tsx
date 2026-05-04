import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { categorizeContent } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";
import { Link2, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Add() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'link'|'image'>('link');
  const [link, setLink] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 800000) { // Keep under 800KB for firestore limits safely
          alert("File is too large, please select an image under 800KB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (tab === 'link' && (!link || !link.startsWith('http'))) {
      alert("Please enter a valid URL.");
      return;
    }
    if (tab === 'image' && !fileUrl) {
      alert("Please select an image.");
      return;
    }

    setIsLoading(true);
    try {
      const type = tab === 'image' ? 'image' : 'link';
      let content = type === 'link' ? link : fileUrl;

      // 1. Ask Gemini to categorize
      const aiData = await categorizeContent({ type, content });
      
      // 2. Save Document
      const itemRef = doc(collection(db, `users/${user.uid}/items`));
      const newItem = {
        type: type,
        url: content,
        title: String(aiData.title || (type === 'link' ? link : 'Image snippet')).substring(0, 1000),
        aiNotes: String(aiData.summary || '').substring(0, 3000),
        category: String(aiData.category || 'Others').substring(0, 100),
        rating: 0,
        tags: [],
        isFavorite: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(itemRef, newItem);
      navigate(`/category/${newItem.category}`);

    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/items`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="h-16 md:h-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Save Content</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col min-h-[500px] transition-colors relative">
          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 relative z-10">
            <button 
               onClick={() => setTab('link')}
               className={cn("flex-1 py-3 md:py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition", 
               tab === 'link' ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900")}
            >
              <Link2 className="w-4 h-4"/> Link
            </button>
            <button 
               onClick={() => setTab('image')}
               className={cn("flex-1 py-3 md:py-4 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition border-l border-l-slate-200 dark:border-l-slate-800", 
               tab === 'image' ? "border-b-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10" : "border-b-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900")}
            >
              <ImageIcon className="w-4 h-4"/> Image
            </button>
          </div>

          <div className="p-4 md:p-8 flex-1 flex flex-col gap-6">
            <div className="mb-2">
               <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Let AI extract and organize it.</h2>
               <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">BrainSpace automatically sorts what you save into clean categories.</p>
            </div>

            {tab === 'link' ? (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Content URL</label>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={link || ''}
                  onChange={e => setLink(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition overflow-hidden group bg-slate-50/50 dark:bg-slate-900/50"
                >
                   {fileUrl ? (
                       <img src={fileUrl} alt="Preview" className="w-full h-full object-contain" />
                   ) : (
                     <>
                       <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                       </div>
                       <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">Click to select image</p>
                       <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Max 800KB</p>
                     </>
                   )}
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            )}

            <button 
               disabled={isLoading}
               onClick={handleSave}
               className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition flex items-center justify-center gap-2 shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Analyzing & Saving..." : "Save with AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
