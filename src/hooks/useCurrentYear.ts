"use client";

import { useSyncExternalStore } from "react";
import { BUILD_YEAR } from "@/lib/years";

const noop = () => () => {};

/**
 * The visitor's current year. Static HTML carries the build year; the browser value
 * replaces it after hydration, so the site never goes stale like "twenty one years later".
 */
export function useCurrentYear(): number {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => BUILD_YEAR);
}
