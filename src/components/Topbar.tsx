import { Bot, Menu, Sparkles } from "lucide-react";

export default function Topbar({ title, subtitle, onMenu }: { title: string; subtitle: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-2xl border-b border-white/10 px-4 md:px-6 py-3.5 flex items-center gap-3 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
      <button onClick={onMenu} className="lg:hidden p-2 rounded-xl text-indigo-200 hover:bg-white/10 cursor-pointer" aria-label="Menu"><Menu className="w-5 h-5" /></button>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-extrabold text-white truncate tracking-tight">{title}</h1>
          <p className="text-[11px] text-indigo-200/60 truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/30">
          <Sparkles className="w-3 h-3" /> NEBULA
        </span>
      </div>
    </header>
  );
}
