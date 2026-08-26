"use client";
import { useEffect } from "react";
import { animate, waapi, cubicBezier, spring } from "animejs";

export default function SquareAnimation() {
  useEffect(() => {
    animate(".row-anim:nth-child(1) .square-anim", {
      x: "17rem",
      rotate: 360,
      ease: "out(3)",
      duration: 2000,
    });
    animate(".row-anim:nth-child(2) .square-anim", {
      x: "17rem",
      rotate: 360,
      ease: cubicBezier(0.7, 0.1, 0.5, 0.9),
      duration: 2000,
    });
    waapi.animate(".row-anim:nth-child(3) .square-anim", {
      x: "17rem",
      rotate: 360,
      ease: spring({ bounce: 0.35 }),
      duration: 2000,
    });
  }, []);

  return (
    <div className="w-full py-8 flex flex-col gap-4">
      {[
        { label: "Built-in ease (out(3))", bg: "bg-gradient-to-r from-indigo-600 to-violet-600" },
        { label: "Custom cubic Bezier", bg: "bg-gradient-to-r from-fuchsia-600 to-rose-500" },
        { label: "Spring physics", bg: "bg-gradient-to-r from-amber-400 to-orange-500" },
      ].map((r, i) => (
        <div key={i} className="row-anim flex items-center gap-6">
          <div className={`w-20 h-6 rounded-full ${r.bg} shadow-lg opacity-60`} />
          <div className="square-anim w-16 h-16 rounded-2xl bg-gradient-to-br from-white/90 to-indigo-200 shadow-2xl shadow-indigo-900/30 flex items-center justify-center text-xs font-extrabold text-indigo-950">{i + 1}</div>
          <span className="text-xs font-bold text-indigo-200/70">{r.label}</span>
        </div>
      ))}
    </div>
  );
}
