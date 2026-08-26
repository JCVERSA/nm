import { Home, FolderOpen, ClipboardList, Settings } from "lucide-react";

export default function MobileDock({ active = "overview", onTabChange }: { active?: string; onTabChange?: (tab: string) => void }) {
  const tabs = [
    { id: "overview", label: "Home", icon: Home },
    { id: "simulator", label: "Files", icon: FolderOpen },
    { id: "commands", label: "Plans", icon: ClipboardList },
    { id: "analytics", label: "Analytics", icon: Settings },
  ];
  return (
    <nav className="fixed bottom-3 left-3 right-3 md:hidden z-50 flex items-center justify-center gap-1 rounded-[999px] px-3 py-2 backdrop-blur-xl bg-indigo-900/40 border border-indigo-400/20 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" aria-label="Mobile dock">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange?.(t.id)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            active === t.id
              ? "bg-white/10 text-indigo-300 shadow-[inset_2px_2px_5px_-2px_rgba(255,255,255,0.3),inset_-2px_-2px_5px_2px_rgba(255,255,255,0.2)]"
              : "text-indigo-100/70 hover:bg-white/10 hover:text-indigo-200"
          }`}
          aria-label={t.label}
        >
          <t.icon className="w-5 h-5" />
          <span className="leading-none">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
