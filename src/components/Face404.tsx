import { useState } from "react";

export default function Face404({ message = "Page Not Found" }: { message?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 py-12" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <style>{`
        @keyframes eyes { from { transform: translateY(112.5px); } to { transform: translateY(15px); } }
        @keyframes eye-lid { 0%,40%,45%,100%{transform:translateY(0)} 42.5%{transform:translateY(17.5px)} }
        @keyframes pupil { 0%,37.5%,40%,45%,87.5%,100%{stroke-dashoffset:0;transform:translate(0,0)} 12.5%,25%,62.5%,75%{transform:translate(-35px,0)} 42.5%{stroke-dashoffset:35;transform:translate(0,17.5px)} }
        @keyframes mouth-left { from,50%{stroke-dashoffset:-102} to{stroke-dashoffset:0} }
        @keyframes mouth-right { from,50%{stroke-dashoffset:102} to{stroke-dashoffset:0} }
        @keyframes nose { from{transform:translate(0,0)} to{transform:translate(0,22.5px)} }
      `}</style>
      <main className="my-custom-face-container text-slate-100" aria-label="404 illustration">
        <svg className="face w-[200px] h-[250px]" viewBox="0 0 320 380" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={25}>
            <g className="face__eyes" transform="translate(0,112.5)">
              <g transform="translate(15,0)">
                <polyline className="face__eye-lid" points="37,0 0,120 75,120" style={{ animation: "eye-lid 4s 1.3s forwards infinite" }} />
                <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" style={{ animation: "pupil 4s 1.3s forwards infinite" }} />
              </g>
              <g transform="translate(230,0)">
                <polyline className="face__eye-lid" points="37,0 0,120 75,120" style={{ animation: "eye-lid 4s 1.3s forwards infinite" }} />
                <polyline className="face__pupil" points="55,120 55,155" strokeDasharray="35 35" style={{ animation: "pupil 4s 1.3s forwards infinite" }} />
              </g>
            </g>
            <rect className="face__nose" x="132.5" y="112.5" width={55} height={155} rx={4} ry={4} style={{ animation: "nose 4s 1.3s forwards infinite" }} />
            <g transform="translate(65,334)" strokeDasharray="102 102">
              <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0" style={{ animation: "mouth-left 4s 1.3s forwards infinite" }} />
              <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30" style={{ animation: "mouth-right 4s 1.3s forwards infinite" }} />
            </g>
          </g>
        </svg>
      </main>
      <div className="text-center space-y-2 mt-6">
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">404</h2>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{message}</p>
        <p className="text-sm text-slate-400 dark:text-slate-500">The requested page or command was not found.</p>
      </div>
    </div>
  );
}
