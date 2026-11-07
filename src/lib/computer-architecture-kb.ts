import type { SourceRef } from "./types";

export const supportedChapterIds = ["pipelining", "hazards", "memory", "performance"] as const;
export type SupportedChapterId = (typeof supportedChapterIds)[number];

interface KnowledgeEntry {
  id: string;
  chapterId: SupportedChapterId;
  topic: string;
  fact: string;
  source: Omit<SourceRef, "sourceId" | "chapterId" | "isDemo">;
}

export const computerArchitectureKnowledge: KnowledgeEntry[] = [
  {
    id: "cs61c-five-stage-pipeline",
    chapterId: "pipelining",
    topic: "Five-stage pipeline",
    fact: "The classic five-stage RISC-V pipeline uses IF, ID, EX, MEM, and WB. Different instructions can occupy different stages in the same cycle, increasing throughput; pipelining does not imply lower latency for one instruction.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Pipelining — Summary",
      url: "https://notes.cs61c.org/content/pipeline/summary/",
    },
  },
  {
    id: "cs61c-pipeline-throughput",
    chapterId: "performance",
    topic: "Latency and throughput",
    fact: "Latency is end-to-end completion time, while throughput is completed work per unit time. The five-stage pipeline is motivated by increasing instruction throughput compared with a single-cycle datapath.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Performance Metrics",
      url: "https://notes.cs61c.org/content/pipeline/",
    },
  },
  {
    id: "cs61c-forwarding",
    chapterId: "hazards",
    topic: "Forwarding",
    fact: "Forwarding (bypassing) sends a result from a pipeline register directly to an ALU input before register-file write-back. MEM-to-EX and WB-to-EX paths resolve many read-after-write data hazards without stalls.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Data Hazards — Forwarding",
      url: "https://notes.cs61c.org/content/pipeline-hazards/data-hazards/",
    },
  },
  {
    id: "cs61c-load-use",
    chapterId: "hazards",
    topic: "Load-use hazard",
    fact: "For an immediately dependent instruction, load data is not available until the end of the load's MEM stage, too late for the dependent instruction's EX stage in that cycle. The illustrated five-stage design therefore inserts one stall and then uses WB-to-EX forwarding.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Data Hazards — Load Data Hazards",
      url: "https://notes.cs61c.org/content/pipeline-hazards/data-hazards/",
    },
  },
  {
    id: "cs61c-amat",
    chapterId: "memory",
    topic: "Average Memory Access Time",
    fact: "AMAT equals hit time plus miss rate multiplied by miss penalty. A cache miss can add many cycles and therefore connect memory-hierarchy behavior to processor performance.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Average Memory Access Time",
      url: "https://notes.cs61c.org/content/caches-intro/amat/",
    },
  },
  {
    id: "cs61c-iron-law",
    chapterId: "performance",
    topic: "Iron law and CPI",
    fact: "Program time is instruction count multiplied by cycles per instruction multiplied by time per cycle. Pipeline stalls add cycles and can increase effective CPI; one extra stall for every five instructions adds 1/5, so an ideal CPI of 1 becomes 1.2 under that simplified assumption.",
    source: {
      document: "UC Berkeley CS61C Course Notes",
      section: "Iron Law of Processor Performance",
      url: "https://notes.cs61c.org/content/parallel-tlp/",
    },
  },
];

export const verifiedSourceIds = computerArchitectureKnowledge.map((entry) => entry.id);

export function sourceRefsFor(ids: string[]): SourceRef[] {
  const unique = [...new Set(ids)];
  return unique.flatMap((id) => {
    const entry = computerArchitectureKnowledge.find((candidate) => candidate.id === id);
    return entry ? [{ ...entry.source, sourceId: entry.id, chapterId: entry.chapterId, isDemo: true }] : [];
  });
}

export function knowledgeBasePrompt() {
  return computerArchitectureKnowledge
    .map((entry) => `[${entry.id}] Chapter: ${entry.chapterId}. Topic: ${entry.topic}. Verified fact: ${entry.fact}`)
    .join("\n");
}
