import type { ExamApiErrorResponse, ExamApiResponse } from "./exam-api-contract";
import type { EndExamResult, ExamFeedback, ExamSession, StartExamResult, SubmitAnswerResult } from "./types";

export interface ExamService {
  startExam(courseId: string, chapterIds: string[]): Promise<StartExamResult>;
  submitAnswer(session: ExamSession, questionId: string, answer: string): Promise<SubmitAnswerResult>;
  nextQuestion(session: ExamSession, feedback: ExamFeedback): Promise<StartExamResult>;
  endExam(session: ExamSession, feedback: ExamFeedback | null): Promise<EndExamResult>;
  getSession(sessionId: string): Promise<ExamSession | null>;
}

export class ExamServiceError extends Error {
  constructor(message: string, public readonly code: string, public readonly status?: number) { super(message); }
}

export class OpenAIExamService implements ExamService {
  private sessions = new Map<string, ExamSession>();
  private pending = new Set<string>();

  async startExam(courseId: string, chapterIds: string[]): Promise<StartExamResult> {
    return this.once("start", async () => {
      const response = await callExamApi({ action: "start", chapterIds, requestId: requestId() });
      if (response.action !== "start") throw new ExamServiceError("The examiner returned an unexpected response.", "invalid_response");
      const session: ExamSession = {
        id: `exam-${Date.now()}`,
        courseId,
        phase: "answering",
        questionIds: [response.question.id],
        answers: {},
        startedAt: new Date().toISOString(),
        isDemo: true,
        provider: "openai",
        previousResponseId: response.responseId,
        turnCount: 1,
      };
      this.sessions.set(session.id, session);
      return { session, question: response.question };
    });
  }

  async submitAnswer(session: ExamSession, questionId: string, answer: string): Promise<SubmitAnswerResult> {
    const cleanAnswer = answer.trim();
    if (!cleanAnswer) throw new ExamServiceError("Write or dictate an answer before submitting.", "empty_answer", 400);
    if (!session.previousResponseId) throw new ExamServiceError("The examiner context is missing. Start a new session.", "missing_context", 400);
    return this.once(`${session.id}:${questionId}`, async () => {
      const response = await callExamApi({
        action: "answer",
        answer: cleanAnswer,
        previousResponseId: session.previousResponseId as string,
        turn: session.turnCount ?? 1,
        requestId: requestId(),
      });
      if (response.action !== "answer") throw new ExamServiceError("The examiner returned an unexpected response.", "invalid_response");
      const next: ExamSession = {
        ...session,
        phase: response.complete ? "completed" : "feedback",
        questionIds: session.questionIds.includes(questionId) ? session.questionIds : [...session.questionIds, questionId],
        answers: { ...session.answers, [questionId]: cleanAnswer },
        previousResponseId: response.responseId,
        ...(response.complete ? { endedAt: new Date().toISOString() } : {}),
      };
      this.sessions.set(next.id, next);
      return { session: next, feedback: response.feedback, complete: response.complete };
    });
  }

  async nextQuestion(session: ExamSession, feedback: ExamFeedback): Promise<StartExamResult> {
    const question = feedback.followUpQuestion;
    if (!question) throw new ExamServiceError("The examiner did not provide another question.", "missing_follow_up");
    const next: ExamSession = {
      ...session,
      phase: "followup",
      questionIds: session.questionIds.includes(question.id) ? session.questionIds : [...session.questionIds, question.id],
      turnCount: Math.min((session.turnCount ?? 1) + 1, 3),
    };
    this.sessions.set(next.id, next);
    return { session: next, question };
  }

  async endExam(session: ExamSession, feedback: ExamFeedback | null): Promise<EndExamResult> {
    const ended = { ...session, phase: "completed" as const, endedAt: session.endedAt ?? new Date().toISOString() };
    this.sessions.set(ended.id, ended);
    return {
      session: ended,
      summary: {
        id: ended.id,
        courseName: "Computer Architecture",
        date: ended.endedAt,
        questions: Object.keys(ended.answers).length,
        focus: feedback?.sourceRefs.map((source) => source.chapterId).filter((value, index, all) => all.indexOf(value) === index).slice(0, 3) ?? ["Connected reasoning"],
        strength: feedback?.strengths[0] ?? "You completed an AI-guided oral practice turn.",
        review: feedback?.gaps[0] ?? "Continue connecting mechanisms to measurable performance effects.",
        completed: true,
        isAiGenerated: Boolean(feedback?.isAiGenerated),
      },
    };
  }

  async getSession(sessionId: string) { return this.sessions.get(sessionId) ?? null; }

  private async once<T>(key: string, work: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) throw new ExamServiceError("This turn is already being processed.", "duplicate_submission", 409);
    this.pending.add(key);
    try { return await work(); }
    finally { this.pending.delete(key); }
  }
}

async function callExamApi(body: Record<string, unknown>): Promise<ExamApiResponse> {
  let response: Response;
  try {
    response = await fetch("/api/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ExamServiceError("Could not reach the examiner. Check your connection and try again.", "network_error");
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = isApiError(payload) ? payload.error : "The examiner is temporarily unavailable. Try again.";
    const code = isApiError(payload) ? payload.code : "request_failed";
    throw new ExamServiceError(error, code, response.status);
  }
  if (!payload || typeof payload !== "object" || !("action" in payload)) throw new ExamServiceError("The examiner returned an invalid response.", "invalid_response");
  return payload as ExamApiResponse;
}

function isApiError(value: unknown): value is ExamApiErrorResponse {
  return Boolean(value && typeof value === "object" && "error" in value && typeof value.error === "string" && "code" in value && typeof value.code === "string");
}

function requestId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `request_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const examService = new OpenAIExamService();
