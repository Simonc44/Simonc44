"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ──────────── Internal particle field ──────────── */

function ParticleEnv() {
  const ref = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) * 0.5 - 2;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const count = 1200;
    const cols = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#e2e8f0"),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, []);

  const pointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.025;
    ref.current.rotation.x = Math.sin(t * 0.015) * 0.08;
    pointer.current.lerp(state.pointer, 0.04);
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      (pointer.current.x * viewport.width) / 16,
      0.05
    );
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      (pointer.current.y * viewport.height) / 16,
      0.05
    );
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.045}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/* ──────────── Lens mesh ──────────── */

function LensMesh({
  distortion,
  chromaticAberration,
  ior,
}: {
  distortion: number;
  chromaticAberration: number;
  ior: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Scale the pill to be slightly larger than the button viewport
  // so it overflows and gets clipped by the CSS overflow-hidden wrapper
  const scale = useMemo(() => {
    const width = viewport.width * 1.1;
    const height = width / 4.2;
    return { width, height };
  }, [viewport.width]);

  // Rounded pill shape
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const w = scale.width / 2;
    const h = scale.height / 2;
    const r = h; // fully rounded ends = pill shape

    s.moveTo(-w + r, -h);
    s.quadraticCurveTo(-w, -h, -w, -h + r);
    s.lineTo(-w, h - r);
    s.quadraticCurveTo(-w, h, -w + r, h);
    s.lineTo(w - r, h);
    s.quadraticCurveTo(w, h, w, h - r);
    s.lineTo(w, -h + r);
    s.quadraticCurveTo(w, -h, w - r, -h);
    s.closePath();

    return s;
  }, [scale]);

  return (
    <mesh ref={meshRef}>
      <shapeGeometry args={[shape]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.1}
        thickness={0.4}
        ior={ior}
        chromaticAberration={chromaticAberration}
        distortion={distortion}
        distortionScale={0.05}
        temporalDistortion={0.02}
        clearcoat={0.05}
        clearcoatRoughness={0.4}
        envMapIntensity={0.3}
        bg={new THREE.Color(0x050505)}
        transparent
        opacity={0.85}
        samples={4}
      />
    </mesh>
  );
}

/* ──────────── Scene ──────────── */

function LensScene({
  distortion,
  chromaticAberration,
  ior,
}: {
  distortion: number;
  chromaticAberration: number;
  ior: number;
}) {
  return (
    <>
      {/* Background particles — these get refracted by the lens */}
      <ParticleEnv />

      {/* Refractive lens — sits in front of particles */}
      <LensMesh
        distortion={distortion}
        chromaticAberration={chromaticAberration}
        ior={ior}
      />
    </>
  );
}

/* ──────────── Exposed component ──────────── */

interface RefractiveLensProps {
  /** Barrel distortion strength. Default: 0.4 */
  distortion?: number;
  /** Chromatic aberration intensity. Default: 0.03 */
  chromaticAberration?: number;
  /** Index of Refraction. Default: 1.15 */
  ior?: number;
}

/**
 * RefractiveLens — WebGL-based refractive glass overlay.
 *
 * Renders a pill-shaped mesh with MeshTransmissionMaterial inside
 * its own R3F canvas, with a built-in particle field to refract.
 *
 * Position this component absolutely over a pill-shaped button for
 * the full "liquid glass lens" effect with real-time barrel
 * distortion, chromatic aberration, and temporal distortion.
 */
export function RefractiveLens({
  distortion = 0.05,
  chromaticAberration = 0.03,
  ior = 1.15,
}: RefractiveLensProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 35, near: 0.1, far: 10 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <LensScene
          distortion={distortion}
          chromaticAberration={chromaticAberration}
          ior={ior}
        />
      </Canvas>
    </div>
  );
}
