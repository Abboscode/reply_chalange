import Link from "next/link";
import { ArrowUpRight, BookOpen, Layers3 } from "lucide-react";
import type { Course } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
      <Card className="relative h-full overflow-hidden p-5 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/[.15]">
        <div className="absolute -right-16 -top-16 size-36 rounded-full opacity-[.07] blur-3xl" style={{ background: course.accent }} />
        <div className="mb-8 flex items-start justify-between"><div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[.04]"><BookOpen className="size-5" style={{ color: course.accent }} /></div><ArrowUpRight className="size-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-300" /></div>
        <div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[.17em] text-slate-500">{course.code}</span><Badge className={course.status === "pending" ? "text-amber-200" : "text-slate-400"}>{course.status === "pending" ? "Local" : "Sample"}</Badge></div>
        <h2 className="mt-2 text-lg font-semibold text-white">{course.name}</h2><p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{course.description}</p>
        <div className="mt-6 flex items-center justify-between text-xs text-slate-500"><span className="flex items-center gap-1.5"><Layers3 className="size-3.5" />{course.chapterIds.length} chapters</span><span>{course.progress}% demo path</span></div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.accent }} /></div>
      </Card>
    </Link>
  );
}
