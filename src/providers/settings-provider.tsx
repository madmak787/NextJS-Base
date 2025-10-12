"use client";
import React from "react";
import { useEffect } from "react";
import { useSettings } from "@/stores/useSettings";

/**
 * This provider runs on the client side and initializes global settings once.
 * Keeps layout.tsx a Server Component, avoiding the metadata conflict.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const fetchSettings = useSettings((s) => s.fetchSettings);
  const loaded = useSettings((s) => s.loaded);

  useEffect(() => {
    if (!loaded) fetchSettings(); // Fetch global settings once
  }, [loaded, fetchSettings]);

  return <>{children}</>;
}
