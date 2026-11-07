import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { PersistHydrator } from "@/components/persist-hydrator";

export const metadata: Metadata = {
  title: { default: "Connected Oral Exam", template: "%s · Connected Oral Exam" },
  description: "Practice explaining the connections across your course—not just memorizing chapters.",
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#090e1a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body><PersistHydrator /><AppShell>{children}</AppShell></body></html>;
}
