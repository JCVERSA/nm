"use client";
import { useEffect } from "react";
import { createDraggable } from "animejs";

export default function DraggableSquare() {
  useEffect(() => {
    createDraggable(".draggable-square");
  }, []);

  return (
    <div className="py-6 flex flex-col items-center gap-3">
      <div className="text-xs font-bold text-indigo-200/60">Drag me</div>
      <div className="draggable-square w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-900/30 cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-extrabold">D</div>
    </div>
  );
}
