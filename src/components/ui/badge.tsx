import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-slate-300", className)} {...props} />;
}
