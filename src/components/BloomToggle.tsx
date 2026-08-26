import { useState } from "react";

export default function BloomToggle({ checked = false, onChange }: { checked?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="bloom-switch cursor-pointer" aria-label="Toggle night mode" onClick={() => onChange?.(!checked)}>
      <input type="checkbox" checked={checked} readOnly className="opacity-0 w-0 h-0 absolute" />
      <span className="bloom-switch__track relative inline-block w-[4.5rem] h-[2.2rem] rounded-full overflow-hidden border border-[#a57bff]/40 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-[#1f0a4a] to-[#0e0322]">
        <span className="bloom-switch__star bloom-switch__star--1 absolute w-1 h-1 rounded-full bg-[#fbf5ff] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ top: "22%", left: "58%", transform: "scale(0.4)" }} />
        <span className="bloom-switch__star bloom-switch__star--2 absolute w-[3px] h-[3px] rounded-full bg-[#fbf5ff] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ top: "55%", left: "70%", transform: "scale(0.4)" }} />
        <span className="bloom-switch__star bloom-switch__star--3 absolute w-[2px] h-[2px] rounded-full bg-[#fbf5ff] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ top: "38%", left: "82%", transform: "scale(0.4)" }} />
        <span className={`bloom-switch__thumb absolute top-[50%] left-1 w-7 h-7 rounded-full bg-[#ffd23f] shadow-[0_0_16px_rgba(255,210,63,0.55)] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${checked ? "translate-x-[1.5em] bg-[#fbf5ff] text-[#1f0a4a] shadow-[0_0_16px_rgba(165,123,255,0.6)]" : "-translate-y-1/2"}`} style={{ transform: checked ? "translateX(1.5em) translateY(-50%)" : "translateY(-50%)" }}>
          <svg className={`bloom-switch__sun absolute w-4 h-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${checked ? "opacity-0 rotate-60 scale-75" : "opacity-100 rotate-0 scale-100"} text-[#0e0322]`} viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" /></svg>
          <svg className={`bloom-switch__moon absolute w-4 h-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${checked ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-60 scale-75"} text-[#fbf5ff]`} viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z" /></svg>
        </span>
      </span>
      <style>{`
        .bloom-switch { display:inline-block; cursor:pointer; font-family:"Outfit",system-ui,sans-serif; }
        .bloom-switch input { position:absolute; opacity:0; pointer-events:none; width:0; height:0; }
        .bloom-switch__track { display:inline-block; position:relative; width:4.5rem; height:2.2rem; border-radius:999px; background:linear-gradient(120deg,#1f0a4a,#0e0322); border:1px solid rgba(165,123,255,0.4); box-shadow:inset 0 2px 6px rgba(0,0,0,0.45); transition:background 320ms cubic-bezier(0.22,1,0.36,1), border-color 320ms cubic-bezier(0.22,1,0.36,1); overflow:hidden; }
        .bloom-switch__thumb { position:absolute; top:50%; left:0.2rem; width:1.75rem; height:1.75rem; border-radius:50%; background:#ffd23f; display:grid; place-items:center; transform:translateY(-50%); transition:left 360ms cubic-bezier(0.34,1.56,0.64,1), background 320ms cubic-bezier(0.22,1,0.36,1), color 320ms cubic-bezier(0.22,1,0.36,1), box-shadow 320ms cubic-bezier(0.22,1,0.36,1); color:#0e0322; box-shadow:0 0 16px rgba(255,210,63,0.55); }
        .bloom-switch input:checked ~ .bloom-switch__track { background:linear-gradient(120deg,#150633,#0e0322); border-color:rgba(165,123,255,0.55); }
        .bloom-switch input:checked ~ .bloom-switch__track .bloom-switch__thumb { left:calc(100% - 1.95rem); background:#fbf5ff; color:#1f0a4a; box-shadow:0 0 16px rgba(165,123,255,0.6); }
        .bloom-switch input:checked ~ .bloom-switch__track .bloom-switch__sun { opacity:0; transform:rotate(60deg) scale(0.6); }
        .bloom-switch input:checked ~ .bloom-switch__track .bloom-switch__moon { opacity:1; transform:rotate(0) scale(1); }
        .bloom-switch input:checked ~ .bloom-switch__track .bloom-switch__star { opacity:1; transform:scale(1); }
        .bloom-switch input:focus-visible ~ .bloom-switch__track { outline:2px solid #ffd23f; outline-offset:3px; }
      `}</style>
    </label>
  );
}
