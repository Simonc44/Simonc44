import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A tiny orientation-only capabilities profile for R3F and glassmorphism
 * surfaces. Designed to read *static* values (low-end / touch / reduce-motion)
 * so we can decide *before* mounting expensive WebGL pipelines.
 *
 * Why a custom hook over drei's `useDevicePerformance`:
 *  - drei returns a numeric score (-2..2) — fine, but we also want a boolean
 *    "is touch" signal and the actual reduced-motion flag in one place.
 *  - We avoid a Zustand store for a value that's only used at mount-time.
 *
 * All three signals are read lazily inside `useEffect` so SSR (Vite preview
 * generating static markup is fine, but Parcel / Astro setups would crash
 * without `typeof window` guards — we keep them for safety).
 */
export interface DeviceProfile {
  /** Mobile-style breakpoints OR weak hardware. Used to drop shaders. */
  isLowEnd: boolean;
  /** `(hover: none)` || `(pointer: coarse)`. CSS uses this via the gate. */
  isTouch: boolean;
  /** `prefers-reduced-motion: reduce`. */
  prefersReducedMotion: boolean | null;
  /** Suggested dpr cap. 1 on low-end / mobile, 1.5 elsewhere. */
  dprCap: [number, number];
  /** True once all signals are settled — render effects can gate on it. */
  ready: boolean;
}

const QUERY_MOBILE = "(max-width: 768px)";
const QUERY_TOUCH_PRIMARY = "(hover: none) and (pointer: coarse)";
const QUERY_REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

export function useDeviceProfile(): DeviceProfile {
  const reduceMotion = useReducedMotion();

  const [profile, setProfile] = useState<DeviceProfile>({
    isLowEnd: false,
    isTouch: false,
    prefersReducedMotion: null,
    dprCap: [1, 1.5],
    ready: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqlMobile = window.matchMedia(QUERY_MOBILE);
    const mqlTouch = window.matchMedia(QUERY_TOUCH_PRIMARY);

    const compute = () => {
      const isMobile = mqlMobile.matches;
      const isTouch = mqlTouch.matches;

      // deviceMemory / hardwareConcurrency are non-standard but supported
      // by Chromium, Edge, Safari TP. Treat missing as "high-end" (good).
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        hardwareConcurrency?: number;
      };
      const lowMem =
        typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;
      const lowCores =
        typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency <= 4;

      const isLowEnd = isMobile || isTouch || lowMem || lowCores;

      setProfile({
        isLowEnd,
        isTouch,
        prefersReducedMotion: reduceMotion ?? null,
        dprCap: isLowEnd ? [1, 1] : [1, 1.5],
        ready: true,
      });
    };

    compute();
    // Cheap listeners — these rarely fire after first page load.
    mqlMobile.addEventListener?.("change", compute);
    mqlTouch.addEventListener?.("change", compute);
    return () => {
      mqlMobile.removeEventListener?.("change", compute);
      mqlTouch.removeEventListener?.("change", compute);
    };
  }, [reduceMotion]);

  return profile;
}
