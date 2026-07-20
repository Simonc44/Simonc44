import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * Hero focal point — iridescent crystal icosahedron using drei's
 * MeshTransmissionMaterial for a premium glass refraction effect.
 * Slow rotation + subtle breathing scale.
 */
const HeroShard = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.1;
    ref.current.rotation.y = t * 0.05;
    // Subtle "breathing" scale for an organic feel
    ref.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04);
  });

  const mesh = (
    <mesh ref={ref} position={[0, -3, -7]}>
      <icosahedronGeometry args={[1.4, 0]} />
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.1}
        thickness={2}
        ior={1.2}
        chromaticAberration={0.06}
        resolution={256}
        backside
        color="#c4b5fd"
      />
    </mesh>
  );

  return shouldReduceMotion ? mesh : (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={0}>
      {mesh}
    </Float>
  );
};

/**
 * Organic accent — wobbly coral liquid sphere. Catches the eye on the
 * lower-right with a continuously morphing surface.
 */
const OrganicBlob = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.1;
  });

  const mesh = (
    <mesh ref={ref} position={[4.5, -2.5, -3]}>
      <sphereGeometry args={[0.7, 64, 64]} />
      <MeshDistortMaterial
        color="#f472b6"
        metalness={0.85}
        roughness={0.2}
        speed={2}
        distort={0.4}
      />
    </mesh>
  );

  return shouldReduceMotion ? mesh : (
    <Float speed={2} floatIntensity={2} rotationIntensity={1}>
      {mesh}
    </Float>
  );
};

/**
 * Polished violet torus — top-right accent, sharp metallic look.
 */
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
    <mesh ref={ref} position={[5.5, 3, -4]}>
      <torusGeometry args={[0.5, 0.15, 16, 32]} />
      <meshStandardMaterial color="#a78bfa" metalness={0.9} roughness={0.1} />
    </mesh>
  );

  return shouldReduceMotion ? mesh : (
    <Float speed={1} floatIntensity={1.5} rotationIntensity={1.5}>
      {mesh}
    </Float>
  );
};

/**
 * Deep violet octahedron — top-left, far-away in depth. Adds moody
 * shadow accent + parallax-amplified depth feel.
 */
const ShadowAccent = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.1;
  });

  const mesh = (
    <mesh ref={ref} position={[-5, 3.5, -6]}>
      <octahedronGeometry args={[0.55, 0]} />
      <meshStandardMaterial color="#2e1065" metalness={0.5} roughness={0.5} />
    </mesh>
  );

  return shouldReduceMotion ? mesh : (
    <Float speed={1} floatIntensity={2} rotationIntensity={0.5}>
      {mesh}
    </Float>
  );
};

/** Subtle parallax: camera drifts slightly toward the mouse. */
const CameraRig = () => {
  const shouldReduceMotion = useReducedMotion();
  useFrame((state) => {
    if (shouldReduceMotion) return;
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

const ThreeScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ background: "transparent", pointerEvents: "none" }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* HDRI lighting + reflections — drei's "city" preset fetched from CDN. */}
      <Environment preset="city" />

      <ambientLight intensity={0.25} />
      {/* Coral rim light from bottom-right */}
      <pointLight
        position={[5, -5, 2]}
        intensity={5}
        color="#f472b6"
        distance={15}
      />
      {/* Violet highlight from top-left */}
      <pointLight
        position={[-5, 5, 2]}
        intensity={4}
        color="#a78bfa"
        distance={15}
      />

      <HeroShard />
      <OrganicBlob />
      <TorusAccent />
      <ShadowAccent />

      <CameraRig />

      {/* Premium post-processing stack. mipmapBlur is the cheap Beautiful
          glow path; Noise + Vignette add cinematic filmic feel. */}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.8} />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.15} darkness={0.7} />
      </EffectComposer>
    </Canvas>
  );
};

export default ThreeScene;
