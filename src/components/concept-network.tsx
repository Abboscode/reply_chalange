"use client";

import { useState } from "react";
import { ArrowRight, Info, Network, Sparkles } from "lucide-react";
import { graphEdges, graphNodes } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useAppStore } from "@/store/use-app-store";

export function ConceptNetwork() {
  const [selected, setSelected] = useState(graphNodes[2]);
  const { setAssistantOpen, runQuickAction } = useAppStore();
  const openExplanation = async () => { setAssistantOpen(true); await runQuickAction("explain"); };
  const nodeById = Object.fromEntries(graphNodes.map((node) => [node.id, node]));
  const connected = graphEdges.filter((edge) => edge.from === selected.id || edge.to === selected.id);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <Card className="relative min-h-[560px] overflow-hidden p-4 sm:p-6">
        <div className="absolute inset-0 page-grid opacity-40" />
        <div className="relative flex items-center justify-between"><div><p className="eyebrow mb-2">Sample map</p><h2 className="text-lg font-semibold text-white">Pipeline performance</h2></div><Badge className="text-amber-200">Not PDF-derived</Badge></div>
        <div className="relative mt-6 h-[440px] overflow-hidden rounded-2xl border border-white/[.06] bg-[#0b1323]/60">
          <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="edge-gradient"><stop stopColor="#22d3ee" stopOpacity=".38" /><stop offset="1" stopColor="#8b5cf6" stopOpacity=".35" /></linearGradient></defs>
            {graphEdges.map((edge) => { const from = nodeById[edge.from]; const to = nodeById[edge.to]; return <line key={`${edge.from}-${edge.to}`} x1={from.x + 6} y1={from.y + 4} x2={to.x + 6} y2={to.y + 4} stroke="url(#edge-gradient)" strokeWidth=".45" strokeDasharray="1.5 1.1" vectorEffect="non-scaling-stroke" />; })}
          </svg>
          {graphNodes.map((node) => (
            <button key={node.id} type="button" aria-pressed={selected.id === node.id} onClick={() => setSelected(node)} style={{ left: `${node.x}%`, top: `${node.y}%` }} className={cn("absolute z-10 min-h-14 min-w-[106px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-[#121d30]/95 px-3 py-2 text-left shadow-xl backdrop-blur transition hover:-translate-y-[55%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:min-w-[124px]", selected.id === node.id ? "border-cyan-300/45 shadow-[0_0_35px_-15px_rgba(34,211,238,.8)]" : "border-white/10")}>
              <span className="block text-[9px] font-bold uppercase tracking-[.15em] text-slate-600">{node.chapter}</span><span className="mt-1 block text-xs font-semibold text-slate-200">{node.label}</span>
            </button>
          ))}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/25 px-2 py-1.5 text-[10px] text-slate-500"><Info className="size-3" />Select a concept to inspect its links</div>
        </div>
      </Card>
      <aside className="space-y-4">
        <Card className="p-5"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300/[.08]"><Network className="size-5 text-cyan-200" /></span><Badge className="text-amber-200">Sample</Badge></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-slate-600">{selected.chapter}</p><h2 className="mt-1 text-xl font-semibold text-white">{selected.label}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{selected.detail}</p><Button className="mt-5 w-full" variant="outline" onClick={() => void openExplanation()}><Sparkles className="size-4" />Explain this connection</Button></Card>
        <Card className="p-5"><h3 className="text-sm font-semibold text-white">Direct relationships</h3><div className="mt-3 space-y-2">{connected.length ? connected.map((edge) => { const other = nodeById[edge.from === selected.id ? edge.to : edge.from]; return <button key={`${edge.from}-${edge.to}`} onClick={() => setSelected(other)} className="flex min-h-12 w-full items-center gap-2 rounded-xl border border-white/[.06] bg-white/[.025] px-3 text-left text-xs text-slate-400 hover:border-white/15 hover:text-slate-200"><span className="min-w-0 flex-1"><span className="block truncate font-medium text-slate-300">{other.label}</span><span className="text-[10px] text-slate-600">{edge.label}</span></span><ArrowRight className="size-3.5" /></button>; }) : <p className="text-xs text-slate-600">No direct sample links.</p>}</div></Card>
      </aside>
    </div>
  );
}
