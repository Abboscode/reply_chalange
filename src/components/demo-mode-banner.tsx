"use client";

import { CircleDot } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";

export function DemoModeBanner() {
  const status = useAppStore((state) => state.examProviderStatus);
  const message = status === "connected"
    ? "OpenAI examiner connected — verified demo knowledge base · PDF analysis not connected"
    : status === "error"
      ? "Examiner unavailable — check server configuration · PDF analysis not connected"
      : "OpenAI examiner — verified demo knowledge base · PDF analysis not connected";
  return (
    <div className="flex min-h-8 items-center justify-center gap-2 border-b border-cyan-300/10 bg-cyan-300/[.035] px-4 text-center text-[11px] font-medium tracking-wide text-slate-400">
      <CircleDot className={`size-3 ${status === "error" ? "text-amber-300" : "text-cyan-300"}`} aria-hidden="true" />
      {message}
    </div>
  );
}
