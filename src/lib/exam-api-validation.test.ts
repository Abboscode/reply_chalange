import { describe, expect, it } from "vitest";
import { validateExamRequest } from "./exam-api-validation";

describe("exam API request validation", () => {
  it("accepts a bounded start request", () => {
    const result = validateExamRequest({ action: "start", chapterIds: ["pipelining", "hazards"], requestId: "request_12345678" });
    expect(result.ok).toBe(true);
  });

  it("rejects one-chapter and oversized answer requests", () => {
    expect(validateExamRequest({ action: "start", chapterIds: ["hazards"], requestId: "request_12345678" }).ok).toBe(false);
    expect(validateExamRequest({ action: "answer", answer: "x".repeat(4001), previousResponseId: "resp_12345678", turn: 1, requestId: "request_12345678" }).ok).toBe(false);
  });
});
