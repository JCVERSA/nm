import { useState } from "react";

export default function AboutCard({ onClick }: { onClick?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative w-28 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-950 to-indigo-950 border border-indigo-800/50 shadow-xl shadow-indigo-950/20 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label="About"
      title="About — By Jcversa"
    >
      <style>{`
        .ab-dot { position:absolute; width:5px; height:5px; border-radius:2px; background:#e2e8f0; border:1px solid rgba(255,255,255,0.3); transition: all 0.2s ease; }
        .ab-card:hover .ab-dot { background:#6366f1; border-color:#818cf8; }
      `}</style>
      <div className="absolute inset-0 flex flex-wrap content-start gap-[3px] p-2 opacity-60">
        {Array.from({ length: 45 }).map((_, i) => {
          const s = [5, 10, 15, 20][i % 4];
          const left = (i % 9) * 12 + 4;
          const top = Math.floor(i / 9) * 14 + 4;
          return <span key={i} className="ab-dot" style={{ left: `${left}px`, top: `${top}px`, width: s, height: s }} />;
        })}
      </div>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hover ? "opacity-100" : "opacity-0"}`}>
        <div className="text-center">
          <span className="block text-[10px] font-extrabold text-indigo-300 tracking-[0.15em]">UIVERS.IO</span>
          <span className="block text-[8px] font-bold text-slate-400 mt-0.5">By Jcversa</span>
        </div>
      </div>
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)] animate-pulse" />
    </button>
  );
}
