import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "framer-motion";
import {
  Float,
  Environment,
  MeshTransmissionMaterial,
  MeshDistortMaterial,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import * as THREE from "three";

import { useDeviceProfile } from "@/hooks/useDevicePerformance";

/* ──────────────────────────────────────────────────────────────────────
 * TiltGroup
 *
 * Pointer-driven parallax. Writes the local lerped tilt delta into
 * `localRef.current.userData.{pointerX,pointerY}` so that
 * `ScrollOverlay` (which mutates the same group's rotation) can
 * compose both motions on the next frame. We can't forwardRef cleanly
 * across the Canvas boundary, so the parent's `forwardedRef` is kept
 * in sync from inside this useFrame.
 * ────────────────────────────────────────────────────────────────────── */
const TiltGroup = ({
  enabled,
  forwardedRef,
  children,
}: {
  enabled: boolean;
  forwardedRef: React.MutableRefObject<THREE.Group | null>;
  children: React.ReactNode;
}) => {
  const localRef = useRef<THREE.Group>(null);
  // Mirror localRef into the forwarded ref so the ScrollRig can drive it.
  // We can't just forwardRef from inside Canvas reliably, so we use a
  // manual mirror and update synchronously after mount via useFrame.
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!localRef.current) return;
    // Keep the externally forwarded ref in sync.
    forwardedRef.current = localRef.current;

    if (enabled) {
      target.current.x = state.pointer.y * 0.28;
      target.current.y = state.pointer.x * 0.28;

      current.current.x = THREE.MathUtils.lerp(
        current.current.x,
        target.current.x,
        0.06
      );
      current.current.y = THREE.MathUtils.lerp(
        current.current.y,
        target.current.y,
        0.06
      );
      // Compose with the ScrollOverlay's scroll-driven rotation by
      // stashing the pointer delta in userData. ScrollOverlay reads
      // it each frame to layer both motions.
      localRef.current.userData.pointerX = current.current.x;
      localRef.current.userData.pointerY = current.current.y;
    }
  });

  return <group ref={localRef}>{children}</group>;
};

/* ──────────────────────────────────────────────────────────────────────
 * ScrollOverlay
 *
 * The single headless R3F component that wires BOTH scroll-driven
 * movements: camera doll-out + group Y/X rotation. Lives inside
 * <Canvas>, so it can mutate `state.camera` AND `groupRef.current`
 * after both TiltGroup (which writes userData) has settled for the
 * frame.
 *
 * `.get()` on a framer-motion MotionValue is essentially a ref read —
 * no React state → no component rerender. Safe to call 60×/sec.
 * ────────────────────────────────────────────────────────────────────── */
const ScrollOverlay = ({
  groupRef,
  enabled,
  pageScroll,
}: {
  groupRef: React.MutableRefObject<THREE.Group | null>;
  enabled: boolean;
  pageScroll: MotionValue<number> | null;
}) => {
  useFrame((state) => {
    const g = groupRef.current;
    if (!enabled) return;

    const p = pageScroll?.get() ?? 0;
    const px = (g?.userData.pointerX as number | undefined) ?? 0;
    const py = (g?.userData.pointerY as number | undefined) ?? 0;

    // Camera dolly — push the camera back as the user scrolls past
    // the Hero so the 3D scene appears to "recede" into the page.
    const targetZ = 5 + p * 2.5;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.05
    );

    // Group tilt: scroll-driven base + pointer overlay
    if (!g) return;
    const baseY = p * Math.PI * 0.6;
    const baseX = -p * 0.4;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseY + py, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseX + px, 0.05);
  });
  return null;
};

/* ──────────────────────────────────────────────────────────────────────
 * Per-mesh subcomponents (unchanged) ----------------------------------- */

interface ObjectPerformanceGateProps {
  isLowEnd: boolean;
}

const HeroShard = ({ isLowEnd }: ObjectPerformanceGateProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.y = t * 0.05;
    ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04);
  });

  const material = isLowEnd ? (
    <meshStandardMaterial
      color="#c4b5fd"
      metalness={1}
      roughness={0.05}
      envMapIntensity={1.8}
    />
  ) : (
    <MeshTransmissionMaterial
      transmission={1}
      roughness={0.1}
      thickness={2}
      ior={1.2}
      chromaticAberration={0.06}
      resolution={isLowEnd ? 128 : 256}
      backside
      color="#c4b5fd"
    />
  );

  const mesh = (
    <mesh ref={ref} position={[0, -0.2, -2]}>
      <icosahedronGeometry args={[1.4, 0]} />
      {material}
    </mesh>
  );

  return shouldReduceMotion ? (
    mesh
  ) : (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={0}>
      {mesh}
    </Float>
  );
};

const OrganicBlob = ({ isLowEnd }: ObjectPerformanceGateProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.1;
  });

  const segments = isLowEnd ? 32 : 64;
  const mesh = (
    <mesh ref={ref} position={[1.6, -0.8, -1.2]}>
      <sphereGeometry args={[0.7, segments, segments]} />
      <MeshDistortMaterial
        color="#f472b6"
        metalness={0.85}
        roughness={0.2}
        speed={2}
        distort={0.4}
      />
    </mesh>
  );

  return shouldReduceMotion ? (
    mesh
  ) : (
    <Float speed={2} floatIntensity={2} rotationIntensity={1}>
      {mesh}
    </Float>
  );
};

const TorusAccent = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.z = t * 0.15;
  });

  const mesh = (
    <mesh ref={ref} position={[2.1, 1.1, -1.5]}>
      <torusGeometry args={[0.5, 0.15, 16, 32]} />
      <meshStandardMaterial color="#a78bfa" metalness={0.9} roughness={0.1} />
    </mesh>
  );

  return shouldReduceMotion ? (
    mesh
  ) : (
    <Float speed={1} floatIntensity={1.5} rotationIntensity={1.5}>
      {mesh}
    </Float>
  );
};

const ShadowAccent = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.1;
  });

  const mesh = (
    <mesh ref={ref} position={[-2, 1.4, -2.5]}>
      <octahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#2e1065" metalness={0.5} roughness={0.5} />
    </mesh>
  );

  return shouldReduceMotion ? (
    mesh
  ) : (
    <Float speed={1} floatIntensity={2} rotationIntensity={0.5}>
      {mesh}
    </Float>
  );
};

const CameraRig = ({ enabled }: { enabled: boolean }) => {
  useFrame((state) => {
    if (!enabled) return;
    const targetX = state.mouse.x * 0.5;
    const targetY = state.mouse.y * 0.4;
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      targetX,
      0.04
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY,
      0.04
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const PostFX = ({ isLowEnd }: { isLowEnd: boolean }) => {
  if (isLowEnd) return <Noise opacity={0.025} />;
  return (
    <EffectComposer disableNormalPass>
      <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.8} />
      <Noise opacity={0.025} />
      <Vignette eskil={false} offset={0.15} darkness={0.7} />
    </EffectComposer>
  );
};

/* ──────────────────────────────────────────────────────────────────────
 * Public component
 *
 * Accepts an optional `pageScroll` MotionValue so the canvas can be
 * driven by the page-level scroll progress (Hero passes it in).
 * If omitted, scene is purely hover-driven (existing behavior).
 * ────────────────────────────────────────────────────────────────────── */
const ThreeScene = ({
  pageScroll,
}: {
  pageScroll?: MotionValue<number>;
} = {}) => {
  const profile = useDeviceProfile();
  const groupRef = useRef<THREE.Group | null>(null);

  // Self-subscribe to the page scroll when the parent doesn't supply a
  // MotionValue explicitly. framer-motion's `useScroll` is a singleton
  // listener, so multiple components subscribing is cheap. This avoids
  // the need to prop-drill scroll state into every ThreeScene call site.
  const fallbackScroll = useScroll().scrollYProgress;
  const effectiveScroll = pageScroll ?? fallbackScroll;

  if (!profile.ready) return null;

  const tiltEnabled = !profile.isTouch && !profile.prefersReducedMotion;
  const scrollEnabled = tiltEnabled && !profile.isLowEnd;
  const cameraEnabled =
    !profile.isTouch && !profile.prefersReducedMotion && !profile.isLowEnd;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 38 }}
      dpr={profile.dprCap}
      style={{ background: "transparent", pointerEvents: "none" }}
      gl={{
        alpha: true,
        antialias: !profile.isLowEnd,
        powerPreference: profile.isLowEnd ? "low-power" : "high-performance",
        stencil: false,
      }}
      frameloop="always"
      flat
    >
      {!profile.isLowEnd && <Environment preset="city" />}
      <ambientLight intensity={0.25} />
      <pointLight
        position={[5, -5, 2]}
        intensity={5}
        color="#f472b6"
        distance={15}
      />
      <pointLight
        position={[-5, 5, 2]}
        intensity={4}
        color="#a78bfa"
        distance={15}
      />

      <TiltGroup
        enabled={tiltEnabled}
        forwardedRef={groupRef}
      >
        <HeroShard isLowEnd={profile.isLowEnd} />
        <OrganicBlob isLowEnd={profile.isLowEnd} />
        <TorusAccent />
        <ShadowAccent />
      </TiltGroup>

      {/* Combines scroll-driven + pointer-driven rotation on the same group */}
      <ScrollOverlay
        groupRef={groupRef}
        enabled={scrollEnabled}
        pageScroll={effectiveScroll}
      />

      <CameraRig enabled={cameraEnabled} />
      <PostFX isLowEnd={profile.isLowEnd} />
    </Canvas>
  );
};

export default ThreeScene;
export { ThreeScene as FloatingObject };
