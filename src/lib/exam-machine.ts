import type { ExamPhase } from "./types";

export type ExamEvent = "START" | "ASKED" | "ANSWER" | "CONTINUE" | "COMPLETE" | "FAIL" | "RESET";

export function transitionExam(phase: ExamPhase, event: ExamEvent): ExamPhase {
  const transitions: Partial<Record<ExamPhase, Partial<Record<ExamEvent, ExamPhase>>>> = {
    idle: { START: "preparing" }, preparing: { ASKED: "answering", FAIL: "error" },
    asking: { ASKED: "answering", FAIL: "error" }, answering: { ANSWER: "feedback", FAIL: "error" },
    feedback: { CONTINUE: "followup", COMPLETE: "completed" }, followup: { ANSWER: "completed", FAIL: "error" },
    completed: { RESET: "idle", START: "preparing" }, error: { RESET: "idle", START: "preparing" },
  };
  return transitions[phase]?.[event] ?? phase;
}
