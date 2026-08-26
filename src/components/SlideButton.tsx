import { useState } from "react";

export interface SlideButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SlideButton({ label = "Action", icon, onClick, className = "" }: SlideButtonProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 to-indigo-950 text-slate-50 font-sans font-semibold text-sm px-6 py-3 flex items-center justify-center shadow-lg shadow-indigo-950/20 transition-all duration-500 ease-in-out hover:shadow-indigo-900/40 hover:scale-[1.03] active:scale-95 focus:outline-none cursor-pointer select-none ${className}`}
      aria-label={label}
    >
      <span
        className={`absolute left-0 top-0 bottom-0 flex items-center justify-center w-[70px] transition-all duration-500 ease-in-out ${hover ? "w-[175px]" : "w-[70px]"}`}
      >
        <span className={`transition-transform duration-500 ease-in-out ${hover ? "scale-110" : "scale-100"}`}>
          {icon || (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          )}
        </span>
      </span>
      <span className={`relative z-10 transition-all duration-500 ease-in-out ${hover ? "opacity-0 translate-x-[-55px]" : "opacity-100 translate-x-[55px]"}`}>
        {label}
      </span>
    </button>
  );
}
