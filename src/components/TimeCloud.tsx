import { useState, useEffect } from "react";

export default function TimeCloud() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  const hourStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="relative w-[18em] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-indigo-800/30 bg-gradient-to-br from-slate-950 to-[#1b2735] transition-all duration-500 hover:scale-[1.03] hover:shadow-indigo-800/30 p-4 group">
      <style>{`
        @keyframes rotate-cloud { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
      <div className="relative z-10 h-36 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-orange-300 font-extrabold text-2xl tracking-tight">{day}</p>
            <p className="text-indigo-200/80 font-medium text-sm">{dateStr}</p>
          </div>
          <p className="text-orange-400 font-extrabold text-3xl">{hourStr}</p>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full animate-[spin_25s_linear_infinite]" viewBox="0 0 200 200" fill="none">
            <path fill="#ed782a" d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="flex items-center gap-2 text-indigo-200 text-xs font-medium opacity-70">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span>Sunrise / Sunset</span>
        </div>
      </div>
    </div>
  );
}
