import { useState } from "react";

export default function CrystalLoader({ active = true }: { active?: boolean }) {
  if (!active) return null;
  return (
    <div className="flex items-center justify-center py-8" aria-label="Loading crystal">
      <style>{`
        .crystal-wrap { display:flex; align-items:center; justify-content:center; width:200px; height:200px; perspective:800px; position:relative; }
        @keyframes crystalSpin { from { transform: translate(-50%, -50%) rotateX(45deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(45deg) rotateZ(360deg); } }
        @keyframes crystalEmerge { 0%, 100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
        @keyframes crystalFadeIn { to { visibility: visible; opacity: 0.8; } }
        .crystal-box { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; opacity: 0; transform-origin: bottom center; transform: translate(-50%, -50%) rotateX(45deg) rotateZ(0deg); animation: crystalSpin 4s linear infinite, crystalEmerge 2s ease-in-out infinite alternate, crystalFadeIn 0.3s ease-out forwards; border-radius: 10px; visibility: hidden; }
        .crystal-box:nth-child(1) { background: linear-gradient(45deg, #0f172a, #312e81); animation-delay: 0s; }
        .crystal-box:nth-child(2) { background: linear-gradient(45deg, #1e1b4b, #4338ca); animation-delay: 0.3s; }
        .crystal-box:nth-child(3) { background: linear-gradient(45deg, #312e81, #6366f1); animation-delay: 0.6s; }
        .crystal-box:nth-child(4) { background: linear-gradient(45deg, #3730a3, #818cf8); animation-delay: 0.9s; }
        .crystal-box:nth-child(5) { background: linear-gradient(45deg, #4338ca, #a5b4fc); animation-delay: 1.2s; }
        .crystal-box:nth-child(6) { background: linear-gradient(45deg, #6366f1, #c7d2fe); animation-delay: 1.5s; }
      `}</style>
      <div className="crystal-wrap">
        <div className="crystal-box" />
        <div className="crystal-box" />
        <div className="crystal-box" />
        <div className="crystal-box" />
        <div className="crystal-box" />
        <div className="crystal-box" />
      </div>
    </div>
  );
}
