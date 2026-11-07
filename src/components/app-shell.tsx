"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BrainCircuit, Clock3, Home, Network, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoModeBanner } from "./demo-mode-banner";
import { Assistant } from "./assistant/assistant";

const nav = [
  { href: "/", label: "Overview", short: "Home", icon: Home },
  { href: "/courses", label: "My courses", short: "Courses", icon: BookOpen },
  { href: "/connections", label: "Connections", short: "Connect", icon: Network },
  { href: "/exam", label: "Oral practice", short: "Practice", icon: BrainCircuit },
  { href: "/history", label: "History", short: "History", icon: Clock3 },
  { href: "/settings", label: "Settings", short: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-dvh bg-[#090e1a] text-slate-100">
      <DemoModeBanner />
      <aside className="fixed inset-y-8 left-0 z-30 hidden w-[244px] flex-col border-r border-white/[.07] bg-[#0b1120]/90 px-4 py-6 backdrop-blur-xl md:flex">
        <Link href="/" className="mb-9 flex items-center gap-3 rounded-xl px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
          <span className="grid size-10 place-items-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 to-violet-500/20 shadow-[0_0_28px_-8px_rgba(34,211,238,.6)]">
            <Sparkles className="size-5 text-cyan-200" />
          </span>
          <span><span className="block text-sm font-bold tracking-tight text-white">Connected</span><span className="block text-xs text-slate-500">Oral Exam</span></span>
        </Link>
        <nav aria-label="Main navigation" className="space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300",
              active(href) ? "bg-cyan-300/[.09] text-cyan-100" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-100",
            )}>
              <Icon className={cn("size-[18px]", active(href) ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300")} />
              {label}
              {active(href) && <span className="ml-auto size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-200"><BrainCircuit className="size-4 text-amber-300" /> Think across chapters</div>
          <p className="text-[11px] leading-5 text-slate-500">Practice explaining relationships, tradeoffs, and consequences—not isolated facts.</p>
        </div>
      </aside>

      <main className="min-h-[calc(100dvh-32px)] pb-28 md:ml-[244px] md:pb-12">
        <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-7 md:px-9 md:py-9 lg:px-12">{children}</div>
      </main>

      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-6 border-t border-white/10 bg-[#0a0f1c]/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:hidden">
        {nav.map(({ href, short, icon: Icon }) => (
          <Link key={href} href={href} className={cn("flex min-h-11 flex-col items-center justify-center gap-1 text-[9px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300", active(href) ? "text-cyan-200" : "text-slate-500")}>
            <Icon className="size-[18px]" /><span>{short}</span>
          </Link>
        ))}
      </nav>
      <Assistant />
    </div>
  );
}
