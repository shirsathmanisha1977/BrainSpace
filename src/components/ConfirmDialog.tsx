import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  icon?: "delete" | "logout" | "alert";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  icon = "alert",
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 transition-colors"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] shadow-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden pointer-events-auto flex flex-col items-center text-center p-8 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className={cn(
                  "w-16 h-16 rounded-[20px] flex items-center justify-center mb-5 shrink-0 shadow-inner",
                  danger 
                    ? "bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800/50" 
                    : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 border border-indigo-100 dark:border-indigo-800/50"
                )}
              >
                {icon === "delete" && <Trash2 className="w-8 h-8" />}
                {icon === "logout" && <LogOut className="w-8 h-8 ml-1" />}
                {icon === "alert" && <AlertTriangle className="w-8 h-8" />}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight mb-2">
                {title}
              </h3>
              
              <p className="text-[15px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                {description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-[15px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 flex-1"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn(
                    "w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-[15px] text-white transition-all active:scale-95 flex-1 shadow-sm hover:shadow-md",
                    danger 
                      ? "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none" 
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none"
                  )}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
