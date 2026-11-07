import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1020] disabled:pointer-events-none disabled:opacity-45",
  { variants: {
    variant: {
      default: "bg-cyan-300 text-slate-950 hover:bg-cyan-200 shadow-[0_8px_30px_-12px_rgba(34,211,238,.7)]",
      secondary: "border border-white/10 bg-white/[.06] text-slate-100 hover:bg-white/[.1]",
      ghost: "text-slate-300 hover:bg-white/[.07] hover:text-white",
      outline: "border border-cyan-300/30 bg-cyan-300/[.06] text-cyan-100 hover:bg-cyan-300/[.12]",
      danger: "border border-rose-400/20 bg-rose-400/[.08] text-rose-200 hover:bg-rose-400/[.14]",
    },
    size: { default: "h-11", sm: "h-9 min-h-9 rounded-lg px-3 text-xs", icon: "size-11 p-0" },
  }, defaultVariants: { variant: "default", size: "default" } },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
