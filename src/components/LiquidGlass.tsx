import { useState } from "react";

export default function LiquidGlass({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-2xl shadow-[0_0_60px_-12px_rgba(124,58,237,0.35)] ${className}`}>
      {/* radial cosmic core glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-violet-600/30 blur-[60px] animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-600/20 blur-[50px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-fuchsia-500/20 blur-[60px]" />
      {/* orbital ring hint */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 300 300" preserveAspectRatio="none">
        <ellipse cx="150" cy="150" rx="130" ry="50" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6" transform="rotate(-12 150 150)" />
        <ellipse cx="150" cy="150" rx="110" ry="30" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" transform="rotate(-12 150 150)" />
      </svg>
      <div className="relative z-10 p-6 text-zinc-100">
        <h3 className="text-lg font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-200 to-fuchsia-300 bg-clip-text text-transparent">Liquid Glass</h3>
        <p className="text-xs text-indigo-200/70 font-medium mt-1">Transmission + glow reference (R3F / MeshTransmissionMaterial)</p>
      </div>
    </div>
  );
}
