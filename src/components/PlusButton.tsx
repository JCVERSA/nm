import { Plus } from "lucide-react";
import { useState } from "react";

export default function PlusButton({ onClick, label = "New" }: { onClick?: () => void; label?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950 border-2 border-slate-600 text-indigo-200 w-12 h-12 shadow-lg shadow-indigo-950/30 hover:border-indigo-400 hover:shadow-indigo-900/40 transition-all duration-200 ease-in-out cursor-pointer select-none group flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      {/* Expanding corner accent */}
      <span
        className="absolute top-0 right-0 w-3 h-3 bg-indigo-400 rounded-bl-full transition-all duration-200 ease-in-out group-hover:w-6 group-hover:h-6"
        style={{ transform: hover ? "scale(1.6)" : "scale(1)", transformOrigin: "top right" }}
      />
      <Plus className={`w-6 h-6 text-indigo-200 transition-transform duration-200 ease-in-out group-hover:rotate-180 group-hover:text-indigo-900 ${hover ? "text-indigo-900" : ""}`} />
    </button>
  );
}
