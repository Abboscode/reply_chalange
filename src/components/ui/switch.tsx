"use client";

import { cn } from "@/lib/utils";

export function Switch({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (checked: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onCheckedChange(!checked)}
      className={cn("relative h-7 w-12 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300", checked ? "border-cyan-300/40 bg-cyan-300/30" : "border-white/10 bg-white/[.06]")}
    >
      <span className={cn("absolute top-1 size-[18px] rounded-full shadow transition-transform", checked ? "translate-x-[24px] bg-cyan-200" : "translate-x-1 bg-slate-400")} />
    </button>
  );
}
