import { useState } from "react";

export default function PairSuccess({ active = true }: { active?: boolean }) {
  const [hover, setHover] = useState(false);
  if (!active) return null;
  return (
    <div
      className="relative w-[270px] h-[120px] rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/20 bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-800/30 mx-auto"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <style>{`
        .ps-card { position:absolute; width:70px; height:46px; background:linear-gradient(135deg, #312e81, #4f46e5); border-radius:6px; top:28px; left:30px; z-index:10; display:flex; flex-direction:column; align-items:center; box-shadow:9px 9px 9px -2px rgba(79,70,229,0.7); transition:transform 1.2s cubic-bezier(0.645,0.045,0.355,1); }
        .ps-card:hover { transform:translateY(-70px) rotate(90deg); }
        .ps-card .line { width:65px; height:13px; background:#818cf8; border-radius:2px; margin-top:7px; }
        .ps-card .dots { width:8px; height:8px; background:#7ee787; border-radius:50%; box-shadow:0 -10px 0 0 #4ade80, 0 10px 0 0 #16a34a; margin-top:5px; transform:rotate(90deg); margin:-8px 0 0 -30px; }
        .ps-post { position:absolute; width:63px; height:75px; background:#dddde0; border-radius:6px; bottom:10px; left:65px; z-index:11; overflow:hidden; opacity:0; animation:psSlidePost 1s cubic-bezier(0.165,0.84,0.44,1) forwards; }
        @keyframes psSlidePost { 0%{transform:translateY(0);opacity:0} 100%{transform:translateY(-70px);opacity:1} }
        .ps-screen { width:47px; height:23px; background:#f8fafc; border-radius:3px; position:absolute; top:22px; left:8px; }
        .ps-dollar { position:absolute; font-family:system-ui,sans-serif; font-size:16px; font-weight:800; color:#4ade80; text-align:center; left:0; top:0; width:100%; animation:psFade 0.3s 1s backwards; }
        @keyframes psFade { 0%{opacity:0;transform:translateY(-5px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>
      <div className="relative w-full h-full" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {/* Card */}
        <div className="ps-card">
          <div className="line" />
          <div className="dots" />
        </div>
        {/* Post / Receipt */}
        <div className="ps-post">
          <div className="ps-screen" />
          <div className="ps-dollar">✓ CONNECTED</div>
          <div className="absolute bottom-1 left-1 text-[7px] font-bold text-slate-700">Pair Code Success</div>
        </div>
      </div>
    </div>
  );
}
