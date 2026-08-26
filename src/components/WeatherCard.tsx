import { CloudSun, Droplets, Wind, Activity, Thermometer, Gauge, HeartPulse } from "lucide-react";
import { useState } from "react";

export default function WeatherCard() {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative w-full max-w-[260px] rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-800 shadow-xl shadow-indigo-950/20 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-indigo-900/30 hover:-translate-y-0.5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top card */}
      <div className="relative z-10 px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-300">
            <CloudSun className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white leading-none tracking-tight">23 °C</p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Dunmore, Ireland</p>
          </div>
        </div>
      </div>

      {/* Expandable lower section */}
      <div className={`relative z-0 overflow-hidden transition-all duration-300 ease-in-out ${hover ? "max-h-[260px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-4 flex flex-wrap gap-3 text-[11px] font-medium text-slate-300">
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <Droplets className="w-3 h-3 text-indigo-300" /> Humidity <span className="text-white">30%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <Wind className="w-3 h-3 text-emerald-300" /> Wind <span className="text-white">8 Km/h</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <Activity className="w-3 h-3 text-amber-300" /> AQI <span className="text-white">30</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <Thermometer className="w-3 h-3 text-rose-300" /> Real Feel <span className="text-white">21 °C</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            <Gauge className="w-3 h-3 text-sky-300" /> Pressure <span className="text-white">1012 mbar</span>
          </div>
        </div>
      </div>

      {/* Bottom healthy bar */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-500/90 to-emerald-400 text-emerald-950 font-bold text-sm rounded-b-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
        <HeartPulse className="w-4 h-4" /> Healthy
      </div>
    </div>
  );
}
