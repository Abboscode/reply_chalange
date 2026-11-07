"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Lightbulb, Mic, RotateCcw, Send, Sparkles, Square, Target, Volume2 } from "lucide-react";
import { chapters } from "@/lib/demo-data";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function ExamWorkspace() {
  const {
    examPhase, question, feedback, recap, session, isWorking, error, preferences, selectedChapters,
    toggleChapter, startExam, submitAnswer, continueToFollowUp, endExam,
  } = useAppStore();
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("Professor style");
  const [duration, setDuration] = useState("10 min");
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognition = useSpeechRecognition();
  const speech = useSpeechSynthesis();
  const architectureChapters = chapters.filter((chapter) => chapter.courseId === "computer-architecture");
  const selected = selectedChapters["computer-architecture"] ?? [];
  const active = examPhase !== "idle" && examPhase !== "preparing" && examPhase !== "error";

  const send = async () => {
    if (!answer.trim()) return;
    const current = answer;
    const submitted = await submitAnswer(current);
    if (submitted) setAnswer("");
  };
  const startVoice = () => {
    setVoiceError(null);
    if (recognition.listening) return recognition.stop();
    recognition.start((text) => setAnswer(text), (message) => setVoiceError(message));
  };

  if (examPhase === "completed" && recap) return <CompletedRecap recap={recap} onRestart={() => void startExam()} />;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {!active ? (
          <Card className="overflow-hidden">
            <div className="page-grid relative border-b border-white/[.07] px-5 py-7 sm:px-8"><div className="absolute right-4 top-4 grid size-24 place-items-center rounded-full border border-cyan-300/10 bg-cyan-300/[.04]"><BrainOrb /></div><p className="eyebrow mb-3">Session setup</p><h2 className="max-w-xl text-2xl font-semibold tracking-tight text-white">Choose your scope. Then explain out loud, like the real thing.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Questions and feedback come from OpenAI, bounded to the verified CS61C demo knowledge base. Uploaded PDFs are not used.</p></div>
            <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-2">
              <Field label="Course"><select aria-label="Course" className="field"><option>Computer Architecture</option><option disabled>Operating Systems (sample flow coming later)</option></select></Field>
              <Field label="Difficulty"><select aria-label="Difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="field"><option>Guided</option><option>Professor style</option><option>Challenge</option></select></Field>
              <Field label="Duration preference"><div className="flex gap-2">{["5 min", "10 min", "20 min"].map((item) => <button key={item} type="button" onClick={() => setDuration(item)} className={cn("min-h-11 flex-1 rounded-xl border px-2 text-xs font-semibold transition", duration === item ? "border-cyan-300/30 bg-cyan-300/[.09] text-cyan-100" : "border-white/[.08] bg-white/[.025] text-slate-500")}>{item}</button>)}</div></Field>
              <Field label="Answer mode"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setMode("text")} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-xl border text-xs font-semibold", mode === "text" ? "border-cyan-300/30 bg-cyan-300/[.09] text-cyan-100" : "border-white/[.08] text-slate-500")}><Send className="size-3.5" />Text</button><button type="button" onClick={() => setMode("voice")} disabled={!preferences.speechInput || !recognition.supported} className={cn("flex min-h-11 items-center justify-center gap-2 rounded-xl border text-xs font-semibold disabled:opacity-40", mode === "voice" ? "border-cyan-300/30 bg-cyan-300/[.09] text-cyan-100" : "border-white/[.08] text-slate-500")}><Mic className="size-3.5" />Voice</button></div></Field>
              <div className="lg:col-span-2"><p className="mb-3 text-xs font-semibold text-slate-300">Chapters to connect</p><div className="flex flex-wrap gap-2">{architectureChapters.map((chapter) => { const chosen = selected.includes(chapter.id); return <button key={chapter.id} type="button" aria-pressed={chosen} onClick={() => toggleChapter("computer-architecture", chapter.id)} className={cn("min-h-11 rounded-xl border px-3 text-xs font-medium", chosen ? "border-cyan-300/25 bg-cyan-300/[.08] text-cyan-100" : "border-white/[.08] text-slate-500")}>{chosen && <CheckCircle2 className="mr-1.5 inline size-3.5" />}{chapter.title}</button>; })}</div></div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/[.07] bg-white/[.015] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><p className="text-xs text-slate-600">{selected.length} chapters · {difficulty} · {duration}</p>{error && <p role="alert" className="mt-1 text-xs text-rose-300">{error}</p>}{selected.length < 2 && <p className="mt-1 text-[10px] text-amber-200/70">Select at least two chapters for connected reasoning.</p>}</div><Button disabled={selected.length < 2 || isWorking} onClick={() => void startExam()}>{isWorking ? "Contacting examiner…" : "Begin AI examination"}<ArrowRight className="size-4" /></Button></div>
          </Card>
        ) : (
          <>
            {question && <Card className="overflow-hidden"><div className="border-b border-white/[.07] bg-gradient-to-r from-cyan-300/[.05] to-violet-500/[.04] p-5 sm:p-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Badge className="border-cyan-300/20 text-cyan-200">AI question</Badge><Badge className="border-amber-300/15 text-amber-200">Demo KB</Badge><span className="text-[10px] uppercase tracking-[.15em] text-slate-600">{question.kind === "follow_up" ? "Follow-up" : "Cross-chapter reasoning"}</span></div><Button variant="ghost" size="sm" onClick={() => { if (speech.speaking) speech.stop(); else speech.speak(question.text, setVoiceError); }}>{speech.speaking ? <Square className="size-3.5" /> : <Volume2 className="size-3.5" />}{speech.speaking ? "Stop" : "Read aloud"}</Button></div><h2 className="max-w-3xl text-xl font-medium leading-8 text-white sm:text-2xl sm:leading-9">{question.text}</h2><div className="mt-5 flex flex-wrap gap-2">{question.chapterIds.map((id) => <Badge key={id}>{chapters.find((chapter) => chapter.id === id)?.title ?? id}</Badge>)}</div>{question.sourceRefs.length > 0 && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">{question.sourceRefs.map((source) => <a key={source.sourceId} href={source.url} target="_blank" rel="noreferrer" className="hover:text-cyan-200">Verified: {source.section}</a>)}</div>}</div>
              {(examPhase === "answering" || examPhase === "followup") && <div className="p-5 sm:p-7"><label htmlFor="exam-answer" className="text-xs font-semibold text-slate-300">Your reasoning</label><textarea id="exam-answer" value={answer} disabled={isWorking} maxLength={4000} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void send(); }} rows={7} placeholder="Explain the mechanism, then connect it to the performance consequence…" className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[#0b1220] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/10 disabled:opacity-70" /><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div>{(error || voiceError) && <p role="alert" className="text-xs text-rose-300">{error || voiceError}</p>}<p className="text-[10px] text-slate-600">Ctrl/⌘ + Enter to submit · sent securely through the server</p></div><div className="flex gap-2">{mode === "voice" && <Button variant={recognition.listening ? "default" : "secondary"} disabled={isWorking} onClick={startVoice}><Mic className="size-4" />{recognition.listening ? "Stop listening" : "Start microphone"}</Button>}<Button disabled={!answer.trim() || isWorking} onClick={() => void send()}>{isWorking ? "Examiner is evaluating…" : "Submit answer"}<Send className="size-4" /></Button></div></div></div>}
            </Card>}
            {feedback && examPhase === "feedback" && <Feedback feedback={feedback} onContinue={() => void continueToFollowUp()} />}
          </>
        )}
      </div>
      <aside className="space-y-4">
        <Card className="p-5"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-violet-400/[.08]"><Target className="size-5 text-violet-300" /></span><div><p className="text-sm font-semibold text-white">Practice objective</p><p className="text-xs text-slate-500">Connect mechanism to consequence</p></div></div><div className="mt-5 space-y-3 text-xs text-slate-400"><ProgressStep done={active} active={!active} label="Set the scope" /><ProgressStep done={examPhase === "feedback" || examPhase === "followup"} active={examPhase === "answering"} label="Explain your reasoning" /><ProgressStep done={examPhase === "followup"} active={examPhase === "feedback"} label="Review sample feedback" /><ProgressStep done={false} active={examPhase === "followup"} label="Handle the follow-up" /></div></Card>
        <Card className="p-5"><div className="flex items-center gap-2 text-xs font-semibold text-amber-200"><Lightbulb className="size-4" />What professors listen for</div><ul className="mt-3 space-y-2 text-xs leading-5 text-slate-500"><li>• A causal chain, not just definitions</li><li>• Explicit assumptions</li><li>• Connection across chapter boundaries</li><li>• A concrete performance consequence</li></ul></Card>
        {session && <Button variant="danger" className="w-full" onClick={() => void endExam()}><Square className="size-3.5" />End and save demo recap</Button>}
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs font-semibold text-slate-300">{label}<div className="mt-2">{children}</div></label>; }
function ProgressStep({ done, active, label }: { done: boolean; active: boolean; label: string }) { return <div className="flex items-center gap-2.5"><span className={cn("grid size-5 place-items-center rounded-full border text-[9px]", done ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : active ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 text-slate-700")}>{done ? <CheckCircle2 className="size-3" /> : "·"}</span><span className={active ? "text-slate-200" : ""}>{label}</span></div>; }
function BrainOrb() { return <div className="relative size-12 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500 shadow-[0_0_35px_-8px_rgba(34,211,238,.7)]"><span className="absolute inset-2 rounded-full bg-[#10192a]/60 backdrop-blur-sm" /></div>; }
function Feedback({ feedback, onContinue }: { feedback: NonNullable<ReturnType<typeof useAppStore.getState>["feedback"]>; onContinue: () => void }) {
  return <Card className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow mb-2">OpenAI examiner</p><h3 className="text-lg font-semibold text-white">AI practice feedback</h3></div><Badge className="border-cyan-300/20 text-cyan-200"><Sparkles className="size-3" />Practice, not a grade</Badge></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[.045] p-4"><p className="text-xs font-bold text-emerald-300">Strength shown</p><p className="mt-2 text-sm leading-6 text-slate-300">{feedback.strengths.join(" ")}</p></div><div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.04] p-4"><p className="text-xs font-bold text-amber-200">Missing connection</p><p className="mt-2 text-sm leading-6 text-slate-300">{feedback.gaps.join(" ")}</p></div></div><div className="mt-4 rounded-2xl border border-white/[.07] p-4"><p className="text-xs font-bold text-slate-300">Stronger framing</p><p className="mt-2 text-sm leading-6 text-slate-400">{feedback.suggestedImprovement}</p></div>{feedback.sourceRefs.length > 0 && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-500">{feedback.sourceRefs.map((source) => <a key={source.sourceId} href={source.url} target="_blank" rel="noreferrer" className="hover:text-cyan-200">Verified source: {source.section}</a>)}</div>}<div className="mt-5 flex justify-end"><Button onClick={onContinue}>Continue to adaptive follow-up <ArrowRight className="size-4" /></Button></div></Card>;
}
function CompletedRecap({ recap, onRestart }: { recap: NonNullable<ReturnType<typeof useAppStore.getState>["recap"]>; onRestart: () => void }) { return <Card className="mx-auto max-w-3xl overflow-hidden"><div className="page-grid border-b border-white/[.07] px-6 py-9 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[.07]"><CheckCircle2 className="size-7 text-emerald-300" /></span><Badge className="mt-5 border-cyan-300/20 text-cyan-200">AI practice recap</Badge><h2 className="mt-3 text-3xl font-semibold text-white">Practice complete</h2><p className="mt-2 text-sm text-slate-500">The summary is saved locally. Raw answers and the response ID are not persisted in your browser.</p></div><div className="grid gap-4 p-6 sm:grid-cols-2"><div className="rounded-2xl bg-white/[.035] p-4"><p className="text-xs font-semibold text-emerald-300">Keep doing</p><p className="mt-2 text-sm leading-6 text-slate-300">{recap.strength}</p></div><div className="rounded-2xl bg-white/[.035] p-4"><p className="text-xs font-semibold text-amber-200">Review next</p><p className="mt-2 text-sm leading-6 text-slate-300">{recap.review}</p></div></div><div className="flex flex-col gap-3 border-t border-white/[.07] px-6 py-5 sm:flex-row sm:justify-between"><Button variant="secondary" asChild><a href="/history"><Clock3 className="size-4" />View history</a></Button><Button onClick={onRestart}><RotateCcw className="size-4" />Start another exam</Button></div></Card>; }
