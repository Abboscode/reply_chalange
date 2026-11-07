import type { Chapter, Course, SessionSummary } from "./types";

export const courses: Course[] = [
  {
    id: "computer-architecture", name: "Computer Architecture", code: "CE-201",
    description: "Pipelines, memory hierarchy, and performance tradeoffs.",
    chapterIds: ["pipelining", "hazards", "memory", "performance"], status: "demo",
    accent: "#22d3ee", progress: 68,
  },
  {
    id: "operating-systems", name: "Operating Systems", code: "CS-304",
    description: "Processes, scheduling, concurrency, and virtual memory.",
    chapterIds: ["processes", "scheduling", "concurrency", "virtual-memory"], status: "demo",
    accent: "#8b5cf6", progress: 41,
  },
  {
    id: "digital-control", name: "Digital Control", code: "EE-312",
    description: "Discrete systems, stability, and controller design.",
    chapterIds: ["sampling", "z-transform", "stability", "controllers"], status: "demo",
    accent: "#fbbf24", progress: 23,
  },
];

export const chapters: Chapter[] = [
  { id: "pipelining", courseId: "computer-architecture", title: "Pipelining fundamentals", order: 1 },
  { id: "hazards", courseId: "computer-architecture", title: "Data hazards & forwarding", order: 2 },
  { id: "memory", courseId: "computer-architecture", title: "Memory hierarchy", order: 3 },
  { id: "performance", courseId: "computer-architecture", title: "CPI & performance", order: 4 },
  { id: "processes", courseId: "operating-systems", title: "Processes & threads", order: 1 },
  { id: "scheduling", courseId: "operating-systems", title: "CPU scheduling", order: 2 },
  { id: "concurrency", courseId: "operating-systems", title: "Concurrency", order: 3 },
  { id: "virtual-memory", courseId: "operating-systems", title: "Virtual memory", order: 4 },
  { id: "sampling", courseId: "digital-control", title: "Sampling", order: 1 },
  { id: "z-transform", courseId: "digital-control", title: "Z-transform", order: 2 },
  { id: "stability", courseId: "digital-control", title: "Discrete stability", order: 3 },
  { id: "controllers", courseId: "digital-control", title: "Controller design", order: 4 },
];

export const initialHistory: SessionSummary[] = [
  {
    id: "demo-history-1", courseName: "Computer Architecture", date: "2026-11-05T17:30:00.000Z",
    questions: 4, focus: ["Pipelining", "Performance"], strength: "Clear explanation of forwarding paths",
    review: "Connect load latency to CPI more explicitly", completed: true,
  },
  {
    id: "demo-history-2", courseName: "Operating Systems", date: "2026-11-02T13:10:00.000Z",
    questions: 3, focus: ["Scheduling", "Concurrency"], strength: "Good tradeoff reasoning",
    review: "Review starvation versus deadlock", completed: true,
  },
];

export const graphNodes = [
  { id: "pipeline", label: "Pipeline", chapter: "Ch. 3", x: 12, y: 46, color: "cyan", detail: "Overlaps instruction stages to increase throughput—not necessarily single-instruction latency." },
  { id: "hazards", label: "Data hazards", chapter: "Ch. 4", x: 35, y: 18, color: "violet", detail: "Dependencies can prevent the next instruction from using a value when it is needed." },
  { id: "forwarding", label: "Forwarding", chapter: "Ch. 4", x: 60, y: 38, color: "cyan", detail: "Routes a computed value directly to a dependent stage before register write-back." },
  { id: "load-use", label: "Load–use", chapter: "Ch. 5", x: 38, y: 73, color: "amber", detail: "Loaded data often arrives too late for the immediately following instruction, so a stall can remain." },
  { id: "cpi", label: "Effective CPI", chapter: "Ch. 2", x: 78, y: 70, color: "violet", detail: "Base CPI plus stall cycles per instruction connects microarchitectural events to performance." },
];

export const graphEdges = [
  { from: "pipeline", to: "hazards", label: "creates exposure" },
  { from: "hazards", to: "forwarding", label: "partly resolved by" },
  { from: "forwarding", to: "load-use", label: "cannot always avoid" },
  { from: "load-use", to: "cpi", label: "raises" },
  { from: "pipeline", to: "cpi", label: "targets" },
];
