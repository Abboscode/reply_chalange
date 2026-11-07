import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl"><p className="eyebrow mb-3">{eyebrow}</p><h1 className="text-3xl font-semibold tracking-[-.035em] text-white sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p></div>
      {action}
    </header>
  );
}
