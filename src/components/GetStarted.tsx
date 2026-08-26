import { Zap, Wifi, Terminal } from "lucide-react";

export default function GetStarted() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-800/30 p-8 shadow-2xl shadow-indigo-950/20">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-lg">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Nebula Bot</h2>
        <p className="text-sm text-indigo-200/70 font-medium mb-6">Advanced WhatsApp multi-device bot with AI, dynamic commands, pairing, dark mode, and mobile dock.</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Zap, label: "AI Commands", desc: "Gemini 3.7" },
            { icon: Wifi, label: "Pairing", desc: "QR + Code" },
            { icon: Terminal, label: "Custom Registry", desc: "Edit / Create" },
          ].map((item) => (
            <a key={item.label} href="#" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-400/40 transition text-center" aria-label={item.label}>
              <item.icon className="w-6 h-6 text-indigo-300" />
              <span className="text-[10px] font-bold text-white">{item.label}</span>
              <span className="text-[9px] text-indigo-300/70">{item.desc}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
