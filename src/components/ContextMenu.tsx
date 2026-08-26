import { useState } from "react";
import { Star, Pencil, Trash2, CloudDownload, Copy, BarChart3, ArrowUpDown, Settings, Check } from "lucide-react";

export default function ContextMenu({ onSelect }: { onSelect?: (action: string) => void }) {
  const [fav, setFav] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState("Nebula Bot");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  return (
    <div className="w-[260px] rounded-xl border border-slate-700 bg-[#222222] shadow-2xl shadow-black/40 p-1 text-zinc-100 font-sans select-none overflow-hidden">
      <ul className="flex flex-col gap-0.5">
        <li className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#333333] transition text-xs font-medium">
          <span>{fav ? "Remove favorite" : "Add favorite"}</span>
          <button onClick={() => setFav(!fav)} className={`p-1 rounded-full transition ${fav ? "bg-amber-400 text-amber-950" : "text-slate-300 hover:text-white"}`} aria-label="Favorite">
            <Star className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
          </button>
        </li>
        <li className={`flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#333333] transition text-xs font-medium ${renaming ? "bg-[#333333] overflow-hidden" : ""}`}>
          {!renaming ? (
            <>
              <span>Edit Name</span>
              <button onClick={() => setRenaming(true)} className="p-1 rounded hover:bg-white/10" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
            </>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <input autoFocus value={name} onChange={e => setName(e.target.value)} className="flex-1 bg-transparent border-none outline-none text-white text-xs font-medium" onKeyDown={e => { if (e.key === "Enter") setRenaming(false); }} />
              <button onClick={() => setRenaming(false)} className="text-emerald-400 hover:text-emerald-300"><Check className="w-4 h-4" /></button>
            </div>
          )}
        </li>
      </ul>
      <div className="h-px bg-slate-700 my-1 mx-2" />
      <ul className="flex flex-col gap-0.5">
        {[
          { label: "New Deployment", icon: CloudDownload, action: "deploy" },
          { label: "Duplicate", icon: Copy, action: "duplicate" },
          { label: "Analytics", icon: BarChart3, action: "analytics" },
          { label: "Transfer Project", icon: ArrowUpDown, action: "transfer" },
          { label: "Project Settings", icon: Settings, action: "settings" },
        ].map((item) => (
          <li key={item.action}>
            <button onClick={() => onSelect?.(item.action)} className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#333333] transition text-zinc-200 text-xs font-medium cursor-pointer">
              <item.icon className="w-4 h-4 text-indigo-300" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => { if (deleteConfirm) { onSelect?.("delete"); setDeleteConfirm(false); } else setDeleteConfirm(true); }}
            onMouseLeave={() => setDeleteConfirm(false)}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition text-xs font-medium cursor-pointer ${deleteConfirm ? "bg-red-950/50 text-red-300" : "text-rose-300 hover:bg-rose-950/30"}`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleteConfirm ? "Confirm Delete" : "Delete Project"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
