"use client";

import { motion, useReducedMotion } from "motion/react";
import { Mic, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AssistantPhase } from "@/lib/types";

export function AssistantOrb({ phase, open, reducedMotion, onClick }: { phase: AssistantPhase; open: boolean; reducedMotion: boolean; onClick: () => void }) {
  const prefersReduced = useReducedMotion();
  const still = reducedMotion || prefersReduced;
  const listening = phase === "listening" || phase === "transcribing";
  const speaking = phase === "speaking";
  return (
    <motion.button
      type="button" aria-label={open ? "Minimize oral exam assistant" : "Open oral exam assistant"} aria-expanded={open}
      onClick={onClick} whileHover={still ? undefined : { scale: 1.05 }} whileTap={{ scale: 0.96 }}
      animate={still ? undefined : listening ? { scale: [1, 1.08, 1] } : speaking ? { scale: [1, 1.04, .98, 1] } : { y: [0, -5, 0], scale: [1, 1.025, 1] }}
      transition={{ duration: listening ? 1.1 : speaking ? .8 : 4.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn("assistant-orb group relative grid size-[68px] place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#090e1a]", open && "ring-1 ring-cyan-200/50")}
    >
      <span className="orb-glow absolute inset-[-14px] rounded-full" />
      <span className="orb-shell absolute inset-0 overflow-hidden rounded-full border border-white/25">
        <span className="orb-color orb-color-a" /><span className="orb-color orb-color-b" /><span className="orb-color orb-color-c" />
        <span className="absolute inset-[7px] rounded-full bg-[#07111e]/30 backdrop-blur-sm" />
      </span>
      {listening ? <Mic className="relative z-10 size-6 text-white" /> : speaking ? <Volume2 className="relative z-10 size-6 text-white" /> : <Sparkles className="relative z-10 size-6 text-white" />}
      <span className="sr-only">{listening ? "Listening" : speaking ? "Speaking" : "Assistant idle"}</span>
    </motion.button>
  );
}
