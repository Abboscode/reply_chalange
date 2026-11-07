"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { chapters, courses, initialHistory } from "@/lib/demo-data";
import { examService } from "@/lib/exam-service";
import type {
  AssistantMessage, AssistantPhase, Course, ExamFeedback, ExamPhase, ExamProviderStatus, ExamQuestion,
  ExamSession, Preferences, SessionSummary,
} from "@/lib/types";

type QuickAction = "test" | "cross" | "explain" | "weak" | "end";

interface AppState {
  preferences: Preferences;
  history: SessionSummary[];
  courseList: Course[];
  pendingFiles: Record<string, string[]>;
  selectedChapters: Record<string, string[]>;
  assistantOpen: boolean;
  assistantPhase: AssistantPhase;
  assistantDraft: string;
  assistantMessages: AssistantMessage[];
  examPhase: ExamPhase;
  session: ExamSession | null;
  question: ExamQuestion | null;
  feedback: ExamFeedback | null;
  recap: SessionSummary | null;
  isWorking: boolean;
  error: string | null;
  examProviderStatus: ExamProviderStatus;
  setAssistantOpen: (open: boolean) => void;
  setAssistantDraft: (value: string) => void;
  setAssistantPhase: (phase: AssistantPhase) => void;
  addAssistantMessage: (message: Omit<AssistantMessage, "id">) => void;
  startExam: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<boolean>;
  continueToFollowUp: () => Promise<void>;
  endExam: () => Promise<void>;
  runQuickAction: (action: QuickAction) => Promise<void>;
  addCourse: (name: string, code: string) => string;
  queueFiles: (courseId: string, names: string[]) => void;
  toggleChapter: (courseId: string, chapterId: string) => void;
  removeHistory: (id: string) => void;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetDemoData: () => void;
}

const welcome: AssistantMessage = {
  id: "welcome", role: "assistant",
  content: "Ready when you are. I can run an AI-guided oral exam grounded in the verified Computer Architecture demo knowledge base.",
  label: "AI",
};

const defaultSelected = Object.fromEntries(courses.map((course) => [
  course.id,
  course.id === "computer-architecture" ? ["pipelining", "hazards", "performance"] : course.chapterIds.slice(0, 3),
]));
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      preferences: { theme: "dark", reducedMotion: false, speechInput: true, speechOutput: true, muted: false },
      history: initialHistory,
      courseList: courses,
      pendingFiles: {},
      selectedChapters: defaultSelected,
      assistantOpen: false,
      assistantPhase: "closed",
      assistantDraft: "",
      assistantMessages: [welcome],
      examPhase: "idle",
      session: null,
      question: null,
      feedback: null,
      recap: null,
      isWorking: false,
      error: null,
      examProviderStatus: "ready",

      setAssistantOpen: (open) => set({ assistantOpen: open, assistantPhase: open ? "idle" : "closed" }),
      setAssistantDraft: (assistantDraft) => set({ assistantDraft, error: null }),
      setAssistantPhase: (assistantPhase) => set({ assistantPhase }),
      addAssistantMessage: (message) => set((state) => ({
        assistantMessages: [...state.assistantMessages, { ...message, id: newId() }],
      })),

      startExam: async () => {
        if (get().isWorking) return;
        set({ isWorking: true, error: null, examPhase: "preparing", assistantPhase: "responding", recap: null, feedback: null });
        try {
          const selected = get().selectedChapters["computer-architecture"] ?? [];
          const result = await examService.startExam("computer-architecture", selected);
          set((state) => ({
            session: result.session, question: result.question, examPhase: "answering", isWorking: false,
            assistantPhase: "idle", assistantOpen: true, examProviderStatus: "connected",
            assistantMessages: [...state.assistantMessages, {
              id: newId(), role: "assistant", content: result.question.text, label: "AI",
            }],
          }));
        } catch (error) {
          set({ isWorking: false, examPhase: "error", assistantPhase: "error", examProviderStatus: "error", error: error instanceof Error ? error.message : "The examiner could not start. Try again." });
        }
      },

      submitAnswer: async (rawAnswer) => {
        if (get().isWorking) return false;
        const answer = rawAnswer.trim();
        const { session, question } = get();
        if (!answer) { set({ error: "Write or dictate an answer before submitting." }); return false; }
        if (!session || !question) { set({ error: "Start an exam before submitting an answer." }); return false; }
        const phaseBeforeRequest = get().examPhase;
        set({ isWorking: true, error: null, assistantPhase: "responding" });
        try {
          const result = await examService.submitAnswer(session, question.id, answer);
          let recap: SessionSummary | null = null;
          if (result.complete) recap = (await examService.endExam(result.session, result.feedback)).summary;
          set((state) => ({
            session: result.session, feedback: result.feedback, examPhase: result.complete ? "completed" : "feedback",
            isWorking: false, assistantPhase: "idle", recap, assistantDraft: "", examProviderStatus: "connected",
            history: recap ? [recap, ...state.history.filter((item) => item.id !== recap?.id)] : state.history,
            assistantMessages: [
              ...state.assistantMessages,
              { id: newId(), role: "student", content: answer },
              {
                id: newId(), role: "assistant",
                content: result.complete
                  ? `Practice recap: ${result.feedback.strengths[0]} ${result.feedback.suggestedImprovement}`
                  : `Feedback: ${result.feedback.strengths[0]} ${result.feedback.gaps[0]}`,
                label: "AI",
              },
            ],
          }));
          return true;
        } catch (error) {
          set({ isWorking: false, examPhase: phaseBeforeRequest, assistantPhase: "error", examProviderStatus: "error", assistantDraft: answer, error: error instanceof Error ? error.message : "The examiner could not continue. Retry your answer." });
          return false;
        }
      },

      continueToFollowUp: async () => {
        const { session, feedback } = get();
        if (!session || !feedback || get().isWorking) return;
        set({ isWorking: true, assistantPhase: "responding" });
        try {
          const next = await examService.nextQuestion(session, feedback);
          set((state) => ({
            session: next.session, question: next.question, feedback: null, examPhase: "followup", isWorking: false, assistantPhase: "idle",
            assistantMessages: [...state.assistantMessages, { id: newId(), role: "assistant", content: next.question.text, label: "AI" }],
          }));
        } catch (error) {
          set({ isWorking: false, assistantPhase: "error", error: error instanceof Error ? error.message : "The follow-up could not be opened." });
        }
      },

      endExam: async () => {
        const { session, feedback } = get();
        if (!session) {
          get().addAssistantMessage({ role: "assistant", content: "There is no active exam session to end. Choose “Test me” whenever you’re ready.", label: "Demo" });
          return;
        }
        if (get().isWorking) return;
        set({ isWorking: true, assistantPhase: "responding" });
        const result = await examService.endExam(session, feedback);
        set((state) => ({
          session: result.session, recap: result.summary, examPhase: "completed", isWorking: false, assistantPhase: "idle",
          history: [result.summary, ...state.history.filter((item) => item.id !== result.summary.id)],
          assistantMessages: [...state.assistantMessages, { id: newId(), role: "assistant", content: "Session ended. I saved a local practice recap in Practice History.", label: "AI" }],
        }));
      },

      runQuickAction: async (action) => {
        if (action === "test" || action === "cross") return get().startExam();
        if (action === "end") return get().endExam();
        get().addAssistantMessage({
          role: "assistant", label: "Demo",
          content: action === "explain"
            ? "Forwarding connects pipeline timing to dependency handling: it bypasses register write-back, but a load may still finish too late for the next instruction. That remaining stall then connects directly to effective CPI."
            : "From the local practice history: review the topics listed in your recaps. This shortcut uses local summaries; start an exam for live AI feedback.",
        });
      },

      addCourse: (name, code) => {
        const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "course"}-${Date.now()}`;
        const course: Course = { id, name, code: code || "NEW", description: "Local demo course — no materials analyzed.", chapterIds: [], status: "pending", accent: "#22d3ee", progress: 0 };
        set((state) => ({ courseList: [...state.courseList, course], selectedChapters: { ...state.selectedChapters, [id]: [] } }));
        return id;
      },
      queueFiles: (courseId, names) => set((state) => ({ pendingFiles: { ...state.pendingFiles, [courseId]: [...(state.pendingFiles[courseId] ?? []), ...names] } })),
      toggleChapter: (courseId, chapterId) => set((state) => {
        const current = state.selectedChapters[courseId] ?? [];
        return { selectedChapters: { ...state.selectedChapters, [courseId]: current.includes(chapterId) ? current.filter((id) => id !== chapterId) : [...current, chapterId] } };
      }),
      removeHistory: (id) => set((state) => ({ history: state.history.filter((item) => item.id !== id) })),
      setPreference: (key, value) => set((state) => ({ preferences: { ...state.preferences, [key]: value } })),
      resetDemoData: () => set({
        preferences: { theme: "dark", reducedMotion: false, speechInput: true, speechOutput: true, muted: false },
        history: initialHistory, courseList: courses, pendingFiles: {}, selectedChapters: defaultSelected,
        assistantOpen: false, assistantPhase: "closed", assistantDraft: "", assistantMessages: [welcome],
        examPhase: "idle", session: null, question: null, feedback: null, recap: null, isWorking: false, error: null, examProviderStatus: "ready",
      }),
    }),
    {
      name: "connected-exam-demo",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences, history: state.history }),
      skipHydration: true,
    },
  ),
);

export const computerArchitectureChapters = chapters.filter((chapter) => chapter.courseId === "computer-architecture");
