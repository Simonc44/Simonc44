"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import type { WebGLRenderer, Scene, Camera } from "three";

// ── Suppression du warning THREE.Clock (bibliothèque tierce) ─────
const _origWarn = console.warn.bind(console);
console.warn = (msg: unknown, ...rest: unknown[]) => {
  if (typeof msg === "string" &&
    (msg.includes("THREE.Clock") || msg.includes("Context Lost"))) return;
  _origWarn(msg, ...rest);
};

/**
 * ShaderBg — fond 3D fluide animé (violet → or → noir profond).
 *
 * Stratégie anti-freeze 0ms + contexte WebGL indestructible :
 *
 * 1. frameloop="always"       → R3F ne met PAS la boucle en pause
 * 2. gl.render() synchrone    → au scroll, render DIRECT (0ms, pas de rAF)
 * 3. visibilitychange         → idem au retour sur l'onglet
 * 4. webglcontextlost         → preventDefault() pour restauration auto
 * 5. Watchdog périodique      → isContextLost() toutes les 3s
 * 6. Auto-remount             → si perdu, change la key du canvas
 */
export function ShaderBg() {
  const [mountKey, setMountKey] = useState(0);
  const renderNowRef = useRef<(() => void) | null>(null);
  const invalidateRef = useRef<(() => void) | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handlerRef = useRef<((e: Event) => void) | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── 1. Scroll listener : render synchrone DIRECT (0ms) ──────────
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 800) return;

      try {
        renderNowRef.current?.();
      } catch {
        // Render a échoué → contexte probablement perdu → force remount
        console.warn("[ShaderBg] Render failed on scroll — forcing remount");
        setMountKey((k) => k + 1);
        return;
      }

      invalidateRef.current?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── 2. Visibility change ────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      try {
        renderNowRef.current?.();
      } catch {
        console.warn("[ShaderBg] Render failed on visibility — forcing remount");
        setMountKey((k) => k + 1);
        return;
      }
      invalidateRef.current?.();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── 3. onCreated : capture + watchdog + context loss ────────────
  const handleCreated = useCallback(
    (state: {
      gl: WebGLRenderer;
      scene: Scene;
      camera: Camera;
      invalidate: () => void;
    }) => {
      const canvas = state.gl.domElement;
      canvasRef.current = canvas;
      invalidateRef.current = state.invalidate;

      // Render synchrone avec try/catch pour détecter perte de contexte
      renderNowRef.current = () => {
        const ctx = state.gl.getContext();
        if (ctx?.isContextLost()) {
          throw new Error("WebGL context lost");
        }
        state.gl.render(state.scene, state.camera);
      };

      // Context loss → preventDefault (laisse le navigateur tenter de restaurer)
      const handler = (e: Event) => e.preventDefault();
      handlerRef.current = handler;
      canvas.addEventListener("webglcontextlost", handler);

      // Watchdog : vérifie la santé du contexte toutes les 3s
      if (watchdogRef.current) clearInterval(watchdogRef.current);
      watchdogRef.current = setInterval(() => {
        const ctx = state.gl.getContext();
        if (ctx?.isContextLost()) {
          console.warn("[ShaderBg] Watchdog detected lost context — remounting");
          setMountKey((k) => k + 1);
        }
      }, 3000);
    },
    []
  );

  // ── 4. Cleanup tout ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (canvasRef.current && handlerRef.current) {
        canvasRef.current.removeEventListener("webglcontextlost", handlerRef.current);
      }
      if (watchdogRef.current) {
        clearInterval(watchdogRef.current);
        watchdogRef.current = null;
      }
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <ShaderGradientCanvas
        key={mountKey}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        pixelDensity={1.5}
        fov={45}
        onCreated={handleCreated}
      >
        <ShaderGradient
          type="plane"
          color1="#0a0a0c"
          color2="#7c3aed"
          color3="#f59e0b"
          lightType="3d"
          shader="defaults"
          cDistance={3.6}
          cPolarAngle={90}
          uFrequency={3.5}
          uSpeed={0.2}
          uStrength={2}
          grain={true}
          grainBlending={0.2}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
