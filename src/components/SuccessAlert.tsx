import { X } from "lucide-react";

export interface SuccessAlertProps {
  visible: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
}

export default function SuccessAlert({ visible, title = "Done successfully", description = "Operation completed.", onClose }: SuccessAlertProps) {
  if (!visible) return null;
  return (
    <div className="fixed top-16 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs">
        <div className="success-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-xl bg-slate-950 dark:bg-[#232531] border border-slate-800 dark:border-slate-800 px-3 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex gap-2.5 items-center">
            <div className="text-emerald-400 bg-white/5 backdrop-blur-xl p-1.5 rounded-lg shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xs truncate">{title}</p>
              <p className="text-slate-400 text-[10px] truncate">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-500 hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors shrink-0 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
