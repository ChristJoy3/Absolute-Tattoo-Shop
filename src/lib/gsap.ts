"use client";

/**
 * Single place where GSAP plugins are registered.
 * Import { gsap, ScrollTrigger, SplitText, useGSAP } from here, never from "gsap" directly,
 * so registration is guaranteed before any animation code runs.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile URL bars resizing the viewport must not re-trigger layout recalcs mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
