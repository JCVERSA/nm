import { useState } from "react";

export interface ToggleSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  className?: string;
}

export default function ToggleSwitch({ label, checked = false, onChange, className = "" }: ToggleSwitchProps) {
  const [internal, setInternal] = useState(checked);
  const isChecked = onChange ? checked : internal;
  const set = (v: boolean) => {
    if (onChange) onChange(v);
    if (!onChange) setInternal(v);
  };
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`} aria-label={label || "Toggle"}>
      <div className="switch relative inline-block w-14 h-8 z-50">
        <input
          type="checkbox"
          className="opacity-0 w-0 h-0"
          checked={isChecked}
          onChange={(e) => set(e.target.checked)}
          aria-checked={isChecked}
        />
        <span className="slider absolute inset-0 rounded-full border-2 border-[#414141] dark:border-slate-600 bg-slate-800 dark:bg-slate-950 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] dark:shadow-[0_0_20px_rgba(9,117,241,0.8)] dark:border-blue-500" />
        <span className="absolute left-0.5 bottom-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.320,1)] dark:bg-indigo-200" style={{ transform: isChecked ? "translateX(1.5em)" : "translateX(0.2em)" }} />
      </div>
      {label && <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>}
    </label>
  );
}
