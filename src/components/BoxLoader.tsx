import { useState } from "react";

export default function BoxLoader({ active = true }: { active?: boolean }) {
  const [hover, setHover] = useState(false);
  if (!active) return null;
  return (
    <div className="flex items-center justify-center py-8" aria-label="Loading box animation" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <style>{`
        .box-loader { width: 112px; height: 112px; position: relative; }
        .box-loader .b { border: 16px solid #334155; box-sizing: border-box; position: absolute; display: block; border-radius: 4px; }
        .box-loader .b1 { width: 112px; height: 48px; margin-top: 64px; margin-left: 0; animation: abox1 4s 1s forwards ease-in-out infinite; }
        .box-loader .b2 { width: 48px; height: 48px; margin-top: 0; margin-left: 0; animation: abox2 4s 1s forwards ease-in-out infinite; }
        .box-loader .b3 { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; animation: abox3 4s 1s forwards ease-in-out infinite; }
        @keyframes abox1 {
          0% { width: 112px; height: 48px; margin-top: 64px; margin-left: 0; }
          12.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0; }
          25% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0; }
          37.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0; }
          50% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0; }
          62.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 0; }
          75% { width: 48px; height: 112px; margin-top: 0; margin-left: 0; }
          87.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
          100% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
        }
        @keyframes abox2 {
          0% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
          12.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
          25% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
          37.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 0; }
          50% { width: 112px; height: 48px; margin-top: 0; margin-left: 0; }
          62.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
          75% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
          87.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
          100% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
        }
        @keyframes abox3 {
          0% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
          12.5% { width: 48px; height: 48px; margin-top: 0; margin-left: 64px; }
          25% { width: 48px; height: 112px; margin-top: 0; margin-left: 64px; }
          37.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
          50% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
          62.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
          75% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
          87.5% { width: 48px; height: 48px; margin-top: 64px; margin-left: 64px; }
          100% { width: 112px; height: 48px; margin-top: 64px; margin-left: 0; }
        }
      `}</style>
      <div className="box-loader">
        <div className="b b1" />
        <div className="b b2" />
        <div className="b b3" />
      </div>
    </div>
  );
}
