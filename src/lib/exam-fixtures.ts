import type { ExamFeedback, ExamQuestion } from "./types";

export const primaryQuestion: ExamQuestion = {
  id: "sample-forwarding-question",
  text: "Why can forwarding remove some pipeline stalls, while a load–use hazard can still increase effective CPI?",
  chapterIds: ["hazards", "performance"],
  sourceRefs: [
    { document: "Sample architecture notes", page: 18, chapterId: "hazards", sourceId: "sample-hazards", isDemo: true },
    { document: "Sample architecture notes", page: 7, chapterId: "performance", sourceId: "sample-cpi", isDemo: true },
  ],
  kind: "cross_chapter_reasoning",
  isDemo: true,
};

export const followUpQuestion: ExamQuestion = {
  id: "sample-cpi-followup",
  text: "Suppose a loop has five instructions and one load–use stall every iteration. Starting from an ideal CPI of 1, how would you estimate the new CPI?",
  chapterIds: ["hazards", "performance"], sourceRefs: primaryQuestion.sourceRefs,
  kind: "follow_up", isDemo: true,
};

export const sampleFeedback: ExamFeedback = {
  strengths: ["You identified that forwarding reuses results before register write-back."],
  gaps: ["A complete answer should state that load data becomes available after the dependent instruction needs it."],
  suggestedImprovement: "Link the timing constraint to performance: the remaining bubble adds stall cycles, which increases effective CPI.",
  followUpQuestion,
  sourceRefs: primaryQuestion.sourceRefs,
  isDemo: true,
};

export const followUpFeedback: ExamFeedback = {
  strengths: ["You connected a per-iteration stall to the instruction count."],
  gaps: ["In a real session, the examiner would probe your assumptions about loop setup and cache misses."],
  suggestedImprovement: "The scripted estimate is (5 base cycles + 1 stall) / 5 instructions = 1.2 CPI.",
  sourceRefs: primaryQuestion.sourceRefs,
  isDemo: true,
};
