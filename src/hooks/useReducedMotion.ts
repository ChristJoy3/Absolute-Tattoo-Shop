"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True when the visitor asked the OS for reduced motion. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
