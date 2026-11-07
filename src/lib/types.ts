export type ExamPhase = "idle" | "preparing" | "asking" | "answering" | "feedback" | "followup" | "completed" | "error";
export type AssistantPhase = "closed" | "idle" | "listening" | "transcribing" | "responding" | "speaking" | "error";

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  chapterIds: string[];
  status: "demo" | "pending" | "ready";
  accent: string;
  progress: number;
}

export interface Chapter { id: string; courseId: string; title: string; order: number; selected?: boolean }
export interface SourceRef {
  document: string;
  page?: number;
  chapterId: string;
  sourceId?: string;
  section?: string;
  url?: string;
  isDemo?: boolean;
}
export interface ExamQuestion {
  id: string;
  text: string;
  chapterIds: string[];
  sourceRefs: SourceRef[];
  kind: "cross_chapter_reasoning" | "follow_up";
  isDemo: boolean;
  isAiGenerated?: boolean;
}
export interface ExamFeedback {
  strengths: string[];
  gaps: string[];
  suggestedImprovement: string;
  followUpQuestion?: ExamQuestion;
  sourceRefs: SourceRef[];
  isDemo: boolean;
  isAiGenerated?: boolean;
}
export interface ExamSession {
  id: string;
  courseId: string;
  phase: ExamPhase;
  questionIds: string[];
  answers: Record<string, string>;
  startedAt: string;
  endedAt?: string;
  isDemo: boolean;
  provider?: "openai" | "demo";
  previousResponseId?: string;
  turnCount?: number;
}
export interface SessionSummary {
  id: string;
  courseName: string;
  date: string;
  questions: number;
  focus: string[];
  strength: string;
  review: string;
  completed: boolean;
  isAiGenerated?: boolean;
}
export interface AssistantMessage {
  id: string;
  role: "assistant" | "student" | "system";
  content: string;
  label?: "Sample" | "Demo" | "AI";
}
export type ExamProviderStatus = "ready" | "connected" | "error";
export interface Preferences {
  theme: "dark" | "midnight";
  reducedMotion: boolean;
  speechInput: boolean;
  speechOutput: boolean;
  muted: boolean;
}
export interface StartExamResult { session: ExamSession; question: ExamQuestion }
export interface SubmitAnswerResult { session: ExamSession; feedback: ExamFeedback; complete: boolean }
export interface EndExamResult { session: ExamSession; summary: SessionSummary }
