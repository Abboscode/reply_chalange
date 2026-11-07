import { describe, expect, it } from "vitest";
import { transitionExam } from "./exam-machine";

describe("demo exam progression", () => {
  it("moves through preparation, answer, feedback, follow-up, and completion", () => {
    expect(transitionExam("idle", "START")).toBe("preparing");
    expect(transitionExam("preparing", "ASKED")).toBe("answering");
    expect(transitionExam("answering", "ANSWER")).toBe("feedback");
    expect(transitionExam("feedback", "CONTINUE")).toBe("followup");
    expect(transitionExam("followup", "ANSWER")).toBe("completed");
  });

  it("blocks invalid phase jumps", () => expect(transitionExam("idle", "ANSWER")).toBe("idle"));
});
