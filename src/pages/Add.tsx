import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { categorizeContent } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";
import { Link2, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
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
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-4 md:px-8 flex items-center shrink-0 transition-colors sticky top-0 z-10 gap-4">
        <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">Save Content</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md overflow-hidden flex flex-col min-h-[500px] transition-all relative">
          
          {/* Subtle gradient accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
          
          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30">
            <button 
               onClick={() => setTab('link')}
               className={cn("flex-1 py-4 md:py-5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all relative overflow-hidden", 
               tab === 'link' ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300")}
            >
              <Link2 className="w-4 h-4"/> 
              Link
            </button>
            <button 
               onClick={() => setTab('image')}
               className={cn("flex-1 py-4 md:py-5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all border-l border-l-slate-200/60 dark:border-l-slate-800/60 relative overflow-hidden", 
               tab === 'image' ? "border-b-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900" : "border-b-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300")}
            >
              <ImageIcon className="w-4 h-4"/> 
              Image
            </button>
          </div>

          <div className="p-6 md:p-10 flex-1 flex flex-col gap-8">
            <div>
               <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight font-sans">Let AI extract and organize it.</h2>
               <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">SmartSave automatically sorts what you save into clean categories and writes brief notes for you.</p>
            </div>

            {tab === 'link' ? (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest pl-1">Content URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/article" 
                  value={link || ''}
                  onChange={e => setLink(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[20px] outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-full h-[280px] border-2 border-dashed border-indigo-200 dark:border-indigo-900/50 rounded-[24px] flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all overflow-hidden group bg-indigo-50/30 dark:bg-indigo-900/10 hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20"
                >
                   {fileUrl ? (
                       <img src={fileUrl} alt="Preview" className="w-full h-full object-contain" />
                   ) : (
                     <div className="flex flex-col items-center p-6 text-center">
                       <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:rotate-3 transition-transform text-indigo-500">
                          <ImageIcon className="w-8 h-8" />
                       </div>
                       <p className="text-base text-slate-700 dark:text-slate-300 font-bold font-sans">Click to select image</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">JPEG, PNG, WEBP (Max 800KB)</p>
                     </div>
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
               className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-base md:text-lg transition-all flex items-center justify-center gap-2 shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_20px_-4px_rgba(79,70,229,0.4)] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Analyzing & Saving..." : "Save with AI ✨"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
