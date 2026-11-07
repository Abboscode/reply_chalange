"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { BookPlus, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeading } from "./page-heading";
import { Button } from "./ui/button";
import { CourseCard } from "./course-card";
import { useAppStore } from "@/store/use-app-store";

export function CoursesLibrary() {
  const courseList = useAppStore((state) => state.courseList);
  const addCourse = useAppStore((state) => state.addCourse);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();
  const create = () => {
    if (!name.trim()) return;
    const id = addCourse(name.trim(), code.trim());
    setOpen(false); setName(""); setCode(""); router.push(`/courses/${id}`);
  };
  return (
    <div>
      <PageHeading eyebrow="Course library" title="Build your study space" description="Organize chapters, queue materials, and choose the ideas you want to connect in practice." action={<Button onClick={() => setOpen(true)}><Plus className="size-4" />Add course</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{courseList.map((course) => <CourseCard key={course.id} course={course} />)}</div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[80] bg-black/65 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[81] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#111a2b] p-6 shadow-2xl outline-none">
          <div className="flex items-start gap-3"><div className="grid size-11 place-items-center rounded-xl bg-cyan-300/10"><BookPlus className="size-5 text-cyan-200" /></div><div className="flex-1"><Dialog.Title className="text-lg font-semibold text-white">Add a local course</Dialog.Title><Dialog.Description className="mt-1 text-sm leading-5 text-slate-500">Creates UI-only organization. No backend or material analysis is connected.</Dialog.Description></div><Dialog.Close asChild><Button size="icon" variant="ghost" aria-label="Close"><X className="size-4" /></Button></Dialog.Close></div>
          <div className="mt-6 space-y-4"><label className="block text-xs font-semibold text-slate-300">Course name<input autoFocus value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") create(); }} placeholder="e.g. Signals and Systems" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" /></label><label className="block text-xs font-semibold text-slate-300">Course code <span className="font-normal text-slate-600">optional</span><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="EE-204" className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/10" /></label></div>
          <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={!name.trim()} onClick={create}>Create course</Button></div>
        </Dialog.Content></Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
