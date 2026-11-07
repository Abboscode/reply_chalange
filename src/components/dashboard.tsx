"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, Clock3, Network, Play, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/use-app-store";

export function Dashboard() {
  const { startExam, setAssistantOpen, history } = useAppStore();
  const launch = async () => { setAssistantOpen(true); await startExam(); };
  return (
    <div>
      <section className="page-grid relative mb-7 overflow-hidden rounded-[28px] border border-white/[.08] bg-[#10192a]/70 px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="pointer-events-none absolute -right-20 -top-32 size-96 rounded-full bg-cyan-300/[.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-violet-500/[.07] blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <div className="mb-5 flex items-center gap-2"><Badge className="border-cyan-300/20 bg-cyan-300/[.07] text-cyan-200"><Sparkles className="size-3" /> Connected reasoning</Badge><span className="text-xs text-slate-500">Saturday, 7 November</span></div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl lg:text-[60px]">Don’t just recall it.<br /><span className="text-gradient">Reason through it.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">Practice the kind of cross-chapter questions a professor actually asks—and make your reasoning visible as you answer.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={() => void launch()}><Play className="size-4 fill-current" />Start oral practice</Button><Button variant="secondary" asChild><Link href="/connections"><Network className="size-4" />Explore connections</Link></Button></div>
          </div>
          <KnowledgeVisual />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section>
          <div className="mb-4 flex items-center justify-between"><div><p className="eyebrow mb-1.5">Continue learning</p><h2 className="text-lg font-semibold text-white">Your active course</h2></div><Link href="/courses" className="flex min-h-11 items-center gap-1 text-xs font-semibold text-slate-400 hover:text-cyan-200">All courses <ArrowRight className="size-3.5" /></Link></div>
          <Card className="group overflow-hidden p-5 transition hover:border-cyan-300/20 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[.07]"><BookOpen className="size-6 text-cyan-200" /></div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">Computer Architecture</h3><Badge>Sample course</Badge></div><p className="mt-1.5 text-sm text-slate-500">4 chapters selected · last practiced 2 days ago</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full w-[68%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" /></div></div>
              <Button variant="secondary" asChild><Link href="/courses/computer-architecture">Open course <ArrowRight className="size-4" /></Link></Button>
            </div>
          </Card>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[{ icon: BrainCircuit, value: "12", label: "Sample questions", color: "text-cyan-300" }, { icon: Network, value: "8", label: "Connections explored", color: "text-violet-300" }, { icon: TrendingUp, value: "3", label: "Review themes", color: "text-amber-300" }].map(({ icon: Icon, value, label, color }) => <Card key={label} className="p-4"><div className="flex items-center gap-3"><Icon className={`size-5 ${color}`} /><div><p className="text-xl font-semibold text-white">{value}</p><p className="text-[11px] text-slate-500">{label} · Demo</p></div></div></Card>)}
          </div>
        </section>
        <section>
          <div className="mb-4"><p className="eyebrow mb-1.5">Practice history</p><h2 className="text-lg font-semibold text-white">Recent sessions</h2></div>
          <Card className="divide-y divide-white/[.06] overflow-hidden">
            {history.slice(0, 3).map((item) => <Link href="/history" key={item.id} className="group flex min-h-20 items-center gap-3 px-4 py-3 hover:bg-white/[.025]"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[.05]"><Clock3 className="size-4 text-slate-400" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-200">{item.courseName}</span><span className="block truncate text-xs text-slate-500">{item.focus.join(" · ")}</span></span><ArrowRight className="size-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" /></Link>)}
            <Link href="/history" className="flex min-h-12 items-center justify-center text-xs font-semibold text-slate-400 hover:text-cyan-200">View practice history</Link>
          </Card>
        </section>
      </div>
    </div>
  );
}

function KnowledgeVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <div className="absolute inset-[12%] rounded-full border border-white/[.05]" /><div className="absolute inset-[27%] rounded-full border border-dashed border-cyan-300/15" />
      <svg className="absolute inset-0 size-full opacity-60" viewBox="0 0 100 100" aria-hidden="true"><path d="M19 29 L50 49 L79 23 M50 49 L81 73 M50 49 L22 76 M19 29 L22 76" fill="none" stroke="url(#line)" strokeWidth=".6" strokeDasharray="2 2"/><defs><linearGradient id="line"><stop stopColor="#22d3ee"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs></svg>
      {[{ x: "8%", y: "21%", label: "Pipeline" }, { x: "68%", y: "14%", label: "Hazards" }, { x: "71%", y: "66%", label: "CPI" }, { x: "8%", y: "68%", label: "Memory" }].map((node) => <div key={node.label} className="absolute rounded-xl border border-white/10 bg-[#121d30]/90 px-3 py-2 text-[10px] font-semibold text-slate-300 shadow-xl" style={{ left: node.x, top: node.y }}>{node.label}</div>)}
      <div className="absolute left-1/2 top-1/2 grid size-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/20 bg-gradient-to-br from-cyan-300/15 to-violet-500/20 shadow-[0_0_60px_-10px_rgba(34,211,238,.32)]"><div className="text-center"><BrainCircuit className="mx-auto size-6 text-cyan-200" /><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.14em] text-slate-400">Reasoning</span></div></div>
    </div>
  );
}
