"use client";
import { useEffect, useRef } from "react";
import { animate, svg, stagger } from "animejs";

export default function NebulaTextAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const drawables = svg.createDrawable(svgRef.current.querySelectorAll(".line"));
    const anim = animate(drawables, {
      draw: ["0 0", "0 1", "1 1"],
      ease: "inOutQuad",
      duration: 2000,
      delay: stagger(100),
      loop: true,
    });
    return () => anim.pause();
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <svg ref={svgRef} viewBox="0 0 520 110" className="w-full max-w-2xl h-auto" aria-label="Nebula text animation" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nebGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c084fc" />
            <stop offset="0.5" stopColor="#a855f7" />
            <stop offset="1" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        <g fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="76" letterSpacing="12" fill="none" stroke="url(#nebGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path className="line" d="M 30 75 Q 45 20 70 60 T 110 55" />
          <path className="line" d="M 130 75 L 160 20 L 190 75 Z" />
          <path className="line" d="M 210 75 Q 230 25 250 60 T 280 55 L 270 75" />
          <path className="line" d="M 310 20 L 310 75 L 340 75 L 330 40" />
          <path className="line" d="M 360 75 Q 380 30 400 60 T 430 55" />
          <path className="line" d="M 450 75 L 480 20 L 500 75 Z" />
        </g>
      </svg>
    </div>
  );
}
