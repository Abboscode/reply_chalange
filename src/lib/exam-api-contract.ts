import type { ExamFeedback, ExamQuestion } from "./types";

export type ExamApiRequest =
  | { action: "start"; chapterIds: string[]; requestId: string }
  | { action: "answer"; answer: string; previousResponseId: string; turn: number; requestId: string };

export interface ExamApiStartResponse {
  action: "start";
  responseId: string;
  question: ExamQuestion;
  model: string;
}

export interface ExamApiAnswerResponse {
  action: "answer";
  responseId: string;
  feedback: ExamFeedback;
  complete: boolean;
  model: string;
}

export interface ExamApiErrorResponse { error: string; code: string }
export type ExamApiResponse = ExamApiStartResponse | ExamApiAnswerResponse;
