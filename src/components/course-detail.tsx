"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ArrowLeft, Check, FileText, Info, Layers3, Play, UploadCloud, X } from "lucide-react";
import { chapters } from "@/lib/demo-data";
import { useAppStore } from "@/store/use-app-store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { courseList, pendingFiles, selectedChapters, queueFiles, toggleChapter, startExam, setAssistantOpen } = useAppStore();
  const course = courseList.find((item) => item.id === id);
  const courseChapters = chapters.filter((chapter) => chapter.courseId === id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const selected = selectedChapters[id] ?? [];

  if (!course) return <EmptyCourse />;

  const acceptFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    const invalid = list.find((file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"));
    const oversized = list.find((file) => file.size > 25 * 1024 * 1024);
    if (invalid) { setUploadError(`${invalid.name} is not a PDF.`); return; }
    if (oversized) { setUploadError(`${oversized.name} exceeds the 25 MB demo limit.`); return; }
    setUploadError(null); queueFiles(id, list.map((file) => file.name));
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => { if (event.target.files) acceptFiles(event.target.files); event.target.value = ""; };
  const onDrop = (event: DragEvent) => { event.preventDefault(); setDragging(false); acceptFiles(event.dataTransfer.files); };
  const launch = async () => { setAssistantOpen(true); await startExam(); };

  return (
    <div>
      <Link href="/courses" className="mb-6 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-slate-500 hover:text-cyan-200"><ArrowLeft className="size-4" />Back to courses</Link>
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="mb-3 flex items-center gap-2"><span className="eyebrow">{course.code}</span><Badge>{course.status === "pending" ? "Local demo" : "Sample course"}</Badge></div><h1 className="text-3xl font-semibold tracking-[-.035em] text-white sm:text-4xl">{course.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{course.description}</p></div>
        <Button onClick={() => void launch()}><Play className="size-4 fill-current" />Practice selected chapters</Button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_.88fr]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6"><div className="mb-5 flex items-start justify-between gap-3"><div><p className="eyebrow mb-2">Study scope</p><h2 className="text-lg font-semibold text-white">Choose chapters to connect</h2></div><span className="text-xs text-slate-500">{selected.length} selected</span></div>
            {courseChapters.length ? <div className="grid gap-2 sm:grid-cols-2">{courseChapters.map((chapter) => { const active = selected.includes(chapter.id); return <button key={chapter.id} type="button" aria-pressed={active} onClick={() => toggleChapter(id, chapter.id)} className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${active ? "border-cyan-300/25 bg-cyan-300/[.07] text-cyan-100" : "border-white/[.07] bg-white/[.02] text-slate-400 hover:bg-white/[.04]"}`}><span className={`grid size-7 shrink-0 place-items-center rounded-lg ${active ? "bg-cyan-300 text-slate-950" : "bg-white/[.05]"}`}>{active ? <Check className="size-4" /> : chapter.order}</span>{chapter.title}</button>; })}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center"><Layers3 className="mx-auto size-6 text-slate-600" /><p className="mt-3 text-sm text-slate-400">No chapters in this local course yet.</p><p className="mt-1 text-xs text-slate-600">Real chapter creation will arrive with the material backend.</p></div>}
          </Card>

          <Card className="p-5 sm:p-6"><div className="mb-4"><p className="eyebrow mb-2">Material library</p><h2 className="text-lg font-semibold text-white">Queue course PDFs</h2><p className="mt-1 text-xs leading-5 text-slate-500">Files stay in this browser session. The demo records names only and does not read or upload content.</p></div>
            <div role="button" tabIndex={0} aria-label="Choose PDF files" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={`grid min-h-40 cursor-pointer place-items-center rounded-2xl border border-dashed p-5 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 ${dragging ? "border-cyan-300/50 bg-cyan-300/[.07]" : "border-white/10 bg-white/[.02] hover:border-white/20 hover:bg-white/[.035]"}`}>
              <div><span className="mx-auto grid size-11 place-items-center rounded-xl bg-white/[.05]"><UploadCloud className="size-5 text-cyan-200" /></span><p className="mt-3 text-sm font-medium text-slate-200">Drop PDFs here or choose files</p><p className="mt-1 text-[11px] text-slate-600">PDF only · up to 25 MB each · no processing in demo</p></div><input ref={inputRef} onChange={onChange} type="file" accept="application/pdf,.pdf" multiple className="sr-only" />
            </div>
            {uploadError && <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-rose-300"><X className="size-3.5" />{uploadError}</p>}
            {(pendingFiles[id]?.length ?? 0) > 0 && <div className="mt-4 space-y-2">{pendingFiles[id].map((name, index) => <div key={`${name}-${index}`} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.025] px-3 py-2.5"><FileText className="size-4 text-slate-500" /><span className="min-w-0 flex-1 truncate text-xs text-slate-300">{name}</span><Badge className="border-amber-300/15 text-amber-200">Queued (demo)</Badge></div>)}</div>}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden"><div className="border-b border-white/[.07] p-5"><div className="flex items-center justify-between"><div><p className="eyebrow mb-2">Knowledge source</p><h2 className="text-lg font-semibold text-white">Verified demo reference</h2></div><Badge className="border-cyan-300/20 text-cyan-200">Public source</Badge></div></div><div className="p-5"><p className="font-mono text-[11px] uppercase tracking-[.12em] text-slate-600">UC Berkeley CS61C · Data Hazards — Forwarding</p><p className="mt-4 border-l-2 border-cyan-300/40 pl-4 text-sm leading-7 text-slate-300">Forwarding can supply an ALU result before register write-back, while an immediately dependent load may still require a stall because memory data arrives later.</p><a href="https://notes.cs61c.org/content/pipeline-hazards/data-hazards/" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold text-cyan-200 hover:text-cyan-100">Open verified course notes</a><div className="mt-3 rounded-xl bg-amber-300/[.045] p-3 text-xs leading-5 text-amber-100/70"><Info className="mr-2 inline size-3.5" />This public demo source is not derived from any file selected above.</div></div></Card>
          <Card className="p-5"><p className="eyebrow mb-2">Connected prompt</p><h3 className="font-semibold text-white">From timing to performance</h3><p className="mt-2 text-sm leading-6 text-slate-400">Explain why a data dependency can remain visible in CPI even when the processor implements forwarding.</p><div className="mt-4 flex flex-wrap gap-2"><Badge>Ch. 4 · Hazards</Badge><Badge>Ch. 2 · Performance</Badge><Badge className="text-amber-200">Sample</Badge></div></Card>
        </div>
      </div>
    </div>
  );
}

function EmptyCourse() { return <div className="grid min-h-[60vh] place-items-center text-center"><div><h1 className="text-2xl font-semibold text-white">Course not found</h1><p className="mt-2 text-sm text-slate-500">This local demo course may have been reset.</p><Button asChild className="mt-5"><Link href="/courses">Return to courses</Link></Button></div></div>; }
