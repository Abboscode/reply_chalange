import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-white/[.08] bg-[#121a2b]/80 shadow-[0_24px_80px_-50px_rgba(0,0,0,.9)] backdrop-blur-xl", className)} {...props} />;
}
