import { supportedChapterIds } from "./computer-architecture-kb";
import type { ExamApiRequest } from "./exam-api-contract";

type ValidationResult = { ok: true; data: ExamApiRequest } | { ok: false; error: string; code: string };
const requestIdPattern = /^[a-zA-Z0-9_-]{8,100}$/;
const responseIdPattern = /^resp_[a-zA-Z0-9_-]{8,200}$/;

export function validateExamRequest(value: unknown): ValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid("Request body must be a JSON object.");
  const body = value as Record<string, unknown>;
  if (!requestIdPattern.test(String(body.requestId ?? ""))) return invalid("A valid request ID is required.");

  if (body.action === "start") {
    if (!Array.isArray(body.chapterIds)) return invalid("chapterIds must be an array.");
    const chapterIds = [...new Set(body.chapterIds.filter((id): id is string => typeof id === "string"))];
    if (chapterIds.length < 2) return invalid("Select at least two supported chapters for connected reasoning.");
    if (chapterIds.length > 4 || chapterIds.some((id) => !supportedChapterIds.some((supported) => supported === id))) return invalid("One or more chapters are not supported by the demo knowledge base.");
    return { ok: true, data: { action: "start", chapterIds, requestId: String(body.requestId) } };
  }

  if (body.action === "answer") {
    const answer = typeof body.answer === "string" ? body.answer.trim() : "";
    const previousResponseId = typeof body.previousResponseId === "string" ? body.previousResponseId : "";
    const turn = body.turn;
    if (!answer || answer.length > 4_000) return invalid("Answer must contain between 1 and 4,000 characters.");
    if (!responseIdPattern.test(previousResponseId)) return invalid("A valid conversation response ID is required.");
    if (!Number.isInteger(turn) || Number(turn) < 1 || Number(turn) > 3) return invalid("Turn must be an integer from 1 to 3.");
    return { ok: true, data: { action: "answer", answer, previousResponseId, turn: Number(turn), requestId: String(body.requestId) } };
  }

  return invalid("Action must be either start or answer.");
}

function invalid(error: string): ValidationResult { return { ok: false, error, code: "invalid_request" }; }
