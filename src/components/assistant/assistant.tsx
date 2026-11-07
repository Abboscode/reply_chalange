"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, BrainCircuit, Link2, Mic, MicOff, Minimize2, Sparkles, Square, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";
import { useAppStore } from "@/store/use-app-store";
import { AssistantOrb } from "./assistant-orb";

const quickActions = [
  { id: "test" as const, label: "Test me", icon: BrainCircuit },
  { id: "cross" as const, label: "Cross-chapter question", icon: Link2 },
  { id: "explain" as const, label: "Explain connection", icon: Sparkles },
  { id: "weak" as const, label: "Weak topics", icon: BrainCircuit },
  { id: "end" as const, label: "End session", icon: Square },
];

export function Assistant() {
  const {
    assistantOpen, assistantPhase, assistantDraft, assistantMessages, preferences, examPhase, feedback,
    isWorking, error, setAssistantOpen, setAssistantDraft, setAssistantPhase, addAssistantMessage,
    submitAnswer, runQuickAction, continueToFollowUp,
  } = useAppStore();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognition = useSpeechRecognition();
  const speech = useSpeechSynthesis();

  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: preferences.reducedMotion ? "auto" : "smooth" }); }, [assistantMessages, feedback, preferences.reducedMotion]);
  useEffect(() => {
    if (assistantOpen) window.setTimeout(() => inputRef.current?.focus(), 260);
    else { recognition.stop(); speech.stop(); }
  }, [assistantOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVoiceError = (message: string) => { setVoiceError(message); setAssistantPhase("error"); };
  const toggleMic = () => {
    setVoiceError(null);
    if (recognition.listening) { recognition.stop(); setAssistantPhase("idle"); return; }
    recognition.start(
      (text) => { setAssistantDraft(text); setAssistantPhase("transcribing"); },
      handleVoiceError,
    );
    setAssistantPhase("listening");
  };
  const send = async () => {
    const text = assistantDraft.trim();
    if (!text) return;
    if (examPhase === "answering" || examPhase === "followup") await submitAnswer(text);
    else {
      addAssistantMessage({ role: "student", content: text });
      setAssistantDraft("");
      window.setTimeout(() => addAssistantMessage({ role: "assistant", label: "Demo", content: "Free-form chat is not enabled in this milestone. Choose “Test me” to start the OpenAI-powered examiner grounded in the verified demo knowledge base." }), 180);
    }
  };
  const lastAssistant = [...assistantMessages].reverse().find((message) => message.role === "assistant");

  return (
    <Dialog.Root open={assistantOpen} onOpenChange={setAssistantOpen}>
      <div className="fixed bottom-[88px] right-4 z-[60] md:bottom-6 md:right-6">
        {!assistantOpen && <span className="pointer-events-none absolute right-[76px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#111a2b]/90 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-xl backdrop-blur-lg lg:block">Ask me</span>}
        <AssistantOrb phase={assistantPhase} open={assistantOpen} reducedMotion={preferences.reducedMotion} onClick={() => setAssistantOpen(!assistantOpen)} />
      </div>
      <AnimatePresence>
        {assistantOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#050914]/65 backdrop-blur-[2px] md:pointer-events-none md:bg-transparent md:backdrop-blur-none" /></Dialog.Overlay>
            <Dialog.Content asChild onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus(); }}>
              <motion.section
                initial={preferences.reducedMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={preferences.reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: .98 }} transition={{ duration: .22 }}
                className="fixed inset-x-3 bottom-[82px] z-50 flex max-h-[78dvh] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0e1627]/95 shadow-[0_28px_110px_-25px_rgba(0,0,0,.95),0_0_50px_-28px_rgba(34,211,238,.55)] outline-none backdrop-blur-2xl md:inset-x-auto md:bottom-[108px] md:right-6 md:h-[min(690px,70vh)] md:w-[440px]"
              >
                <header className="flex items-center gap-3 border-b border-white/[.07] px-4 py-3.5">
                  <div className="relative grid size-9 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[.08]"><Sparkles className="size-4 text-cyan-200" /><span className="absolute right-0 top-0 size-2 rounded-full border-2 border-[#111a2b] bg-emerald-400" /></div>
                  <div className="min-w-0 flex-1"><Dialog.Title className="truncate text-sm font-bold text-white">Oral Exam Assistant</Dialog.Title><Dialog.Description className="text-[11px] text-slate-500">Computer Architecture · verified demo knowledge</Dialog.Description></div>
                  <Badge className="border-cyan-300/20 bg-cyan-300/[.08] text-cyan-200">OpenAI</Badge>
                  <Dialog.Close asChild><Button variant="ghost" size="icon" className="size-10 min-h-10" aria-label="Minimize assistant"><Minimize2 className="size-4" /></Button></Dialog.Close>
                </header>

                <div ref={threadRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map(({ id, label, icon: Icon }) => <Button key={id} size="sm" variant="secondary" disabled={isWorking} onClick={() => void runQuickAction(id)}><Icon className="size-3.5" />{label}</Button>)}
                  </div>
                  {assistantMessages.map((message) => (
                    <div key={message.id} className={cn("flex", message.role === "student" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6", message.role === "student" ? "rounded-br-md bg-cyan-300 text-slate-950" : "rounded-bl-md border border-white/[.07] bg-white/[.05] text-slate-200")}>
                        {message.label && <span className={cn("mb-1.5 block text-[9px] font-black uppercase tracking-[.16em]", message.label === "AI" ? "text-cyan-300" : "text-amber-300")}>{message.label}</span>}
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isWorking && <div className="flex items-center gap-2 text-xs text-slate-500"><span className="thinking-dots"><i /><i /><i /></span>Examiner is reasoning from the verified demo knowledge…</div>}
                  {feedback && examPhase === "feedback" && (
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[.045] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-cyan-200"><Sparkles className="size-4" />AI practice feedback</div>
                      <p className="text-xs leading-5 text-slate-400">{feedback.suggestedImprovement}</p>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => void continueToFollowUp()}>Continue to follow-up <ArrowUp className="size-3.5 rotate-90" /></Button>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/[.07] bg-[#0b1221]/75 p-3">
                  {(error || voiceError) && <div role="alert" className="mb-2 flex items-start gap-2 rounded-xl border border-rose-400/15 bg-rose-400/[.06] px-3 py-2 text-[11px] leading-4 text-rose-200"><X className="mt-0.5 size-3 shrink-0" />{error || voiceError}</div>}
                  <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[.04] p-2 focus-within:border-cyan-300/30 focus-within:ring-2 focus-within:ring-cyan-300/10">
                    <textarea ref={inputRef} value={assistantDraft} onChange={(event) => setAssistantDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} rows={1} placeholder={examPhase === "answering" || examPhase === "followup" ? "Explain your reasoning…" : "Ask or choose an action…"} className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-600" />
                    {preferences.speechInput && <Button type="button" variant={recognition.listening ? "default" : "ghost"} size="icon" onClick={toggleMic} aria-label={recognition.listening ? "Stop listening" : "Start speech input"}>{recognition.listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}</Button>}
                    <Button type="button" size="icon" onClick={() => void send()} disabled={!assistantDraft.trim() || isWorking} aria-label="Send message"><ArrowUp className="size-4" /></Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-slate-600">
                    <span>{recognition.listening ? "Listening — review text before sending" : recognition.supported ? "Mic starts only when tapped" : "Typing works in every browser"}</span>
                    {preferences.speechOutput && lastAssistant && !preferences.muted && <button type="button" onClick={() => { if (speech.speaking) { speech.stop(); setAssistantPhase("idle"); } else { speech.speak(lastAssistant.content, handleVoiceError); setAssistantPhase("speaking"); } }} className="flex min-h-8 items-center gap-1 rounded-lg px-2 text-slate-400 hover:bg-white/[.05] hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">{speech.speaking ? <Square className="size-3" /> : <Volume2 className="size-3" />}{speech.speaking ? "Stop" : "Read aloud"}</button>}
                  </div>
                </div>
              </motion.section>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
