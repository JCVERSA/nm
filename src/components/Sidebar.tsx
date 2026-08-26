import { LayoutDashboard, MessageSquare, Terminal, BarChart3, Zap, Menu, X } from "lucide-react";
import SidebarToggleIcon from "./SidebarToggleIcon";

export default function Sidebar({ active, onChange, open, onToggle }: { active: string; onChange: (t: string) => void; open: boolean; onToggle: () => void }) {
  const items = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "simulator", label: "Simulator", icon: MessageSquare },
    { id: "commands", label: "Commands", icon: Terminal },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onToggle} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-16 lg:w-20 bg-gradient-to-b from-slate-950 to-indigo-950/90 border-r border-indigo-800/30 flex flex-col items-center py-6 gap-1 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <button onClick={onToggle} className="lg:hidden p-2 mb-2 text-indigo-200 hover:text-white" aria-label="Toggle sidebar"><SidebarToggleIcon isOpen={open} className="text-indigo-200 w-6 h-6" /></button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-6">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <nav className="flex flex-col gap-2 w-full px-2" aria-label="Main">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onChange(item.id); onToggle(); }}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl text-[10px] font-bold transition-all duration-200 ${active === item.id ? "bg-indigo-600/20 text-indigo-300 shadow-[inset_2px_2px_5px_-2px_rgba(99,102,241,0.3)]" : "text-indigo-200/60 hover:text-indigo-100 hover:bg-white/5"}`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
