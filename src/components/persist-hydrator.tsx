"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function PersistHydrator() {
  const theme = useAppStore((state) => state.preferences.theme);
  useEffect(() => { void useAppStore.persist.rehydrate(); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  return null;
}
