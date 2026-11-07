"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Clock3, Lightbulb, Sparkles, Trash2 } from "lucide-react";
import { shortDate } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function HistoryView() {
  const { history, removeHistory } = useAppStore();
  const [expanded, setExpanded] = useState<string | null>(history[0]?.id ?? null);
  if (!history.length) return <EmptyHistory />;
  return (
    <div className="space-y-4">
      {history.map((session) => {
        const open = expanded === session.id;
        return <Card key={session.id} className="overflow-hidden"><div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-violet-400/15 bg-violet-400/[.07]"><BookOpen className="size-5 text-violet-300" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-white">{session.courseName}</h2><Badge className={session.isAiGenerated ? "border-cyan-300/20 text-cyan-200" : "text-amber-200"}>{session.isAiGenerated ? "AI practice recap" : "Sample recap"}</Badge></div><div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span className="flex items-center gap-1"><Clock3 className="size-3" />{shortDate(session.date)}</span><span>{session.questions} answered</span><span>{session.focus.join(" · ")}</span></div></div><div className="flex items-center gap-1"><Button variant="ghost" size="icon" aria-label={`Remove ${session.courseName} session`} onClick={() => removeHistory(session.id)}><Trash2 className="size-4" /></Button><Button variant="secondary" onClick={() => setExpanded(open ? null : session.id)}>{open ? "Hide" : "Details"}{open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}</Button></div></div>{open && <div className="grid gap-3 border-t border-white/[.07] bg-white/[.015] p-4 sm:grid-cols-2 sm:p-5"><div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[.035] p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-300"><Sparkles className="size-3.5" />{session.isAiGenerated ? "Observed strength" : "Sample strength"}</div><p className="mt-2 text-sm leading-6 text-slate-400">{session.strength}</p></div><div className="rounded-2xl border border-amber-300/10 bg-amber-300/[.03] p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-200"><Lightbulb className="size-3.5" />Suggested review</div><p className="mt-2 text-sm leading-6 text-slate-400">{session.review}</p></div><p className="sm:col-span-2 text-[10px] leading-4 text-slate-600">This is practice feedback, not an official grade. The local summary does not retain the raw answer transcript.</p></div>}</Card>;
      })}
    </div>
  );
}

function EmptyHistory() { return <Card className="grid min-h-72 place-items-center border-dashed text-center"><div><Clock3 className="mx-auto size-7 text-slate-600" /><h2 className="mt-4 font-semibold text-white">No demo sessions yet</h2><p className="mt-2 text-sm text-slate-500">Complete a sample oral exam to create a local recap.</p><Button asChild className="mt-5"><a href="/exam">Start practice</a></Button></div></Card>; }
