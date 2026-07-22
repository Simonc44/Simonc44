"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────
   GPU Particle Field — 1200 points, shader-driven repulsion
   No per-frame JS allocations. All mutation via uniforms.
   ───────────────────────────────────────────────────────── */

const PARTICLE_COUNT = 1200;

const ParticleField = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const scrollData = useScroll();

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -Math.random() * 10 - 2;
      randoms[i] = Math.random();
    }
    return { positions, randoms };
  }, []);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
    // Scroll disperses particles outward — no setState, direct uniform mutation.
    const scroll = scrollData.offset; // 0..1
    m.uniforms.uScroll.value = scroll;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
          uColorA: { value: new THREE.Color("#a78bfa") },
          uColorB: { value: new THREE.Color("#f472b6") },
        }}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uScroll;
          attribute float aRandom;
          varying float vAlpha;
          varying float vMix;

          void main() {
            vec3 pos = position;

            // Ambient drift
            pos.y += sin(uTime * 0.15 + aRandom * 10.0) * 0.6;
            pos.x += cos(uTime * 0.10 + aRandom * 5.0) * 0.3;

            // Scroll-driven: particles expand radially as user scrolls
            float scrollForce = uScroll * 3.0;
            vec2 radialDir = normalize(pos.xy + vec2(0.001));
            pos.xy += radialDir * scrollForce * (0.5 + aRandom * 0.8);

            // Mouse repulsion in world-space
            vec2 mouseWorld = uMouse * 10.0;
            float dist = distance(pos.xy, mouseWorld);
            float radius = 4.0;
            vMix = dist < radius ? 1.0 : 0.0;
            if (vMix > 0.0) {
              vec2 dir = normalize(pos.xy - mouseWorld + 1e-5);
              float force = (radius - dist) / radius;
              pos.xy += dir * force * 1.8;
            }

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (1.6 + aRandom * 2.8) * (38.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;

            float proximity = 1.0 - smoothstep(0.0, radius, dist);
            // Fade out as scroll increases (particles escape the frame)
            float scrollFade = 1.0 - smoothstep(0.4, 0.9, uScroll);
            vAlpha = (0.2 + aRandom * 0.4) * (0.5 + proximity * 0.5) * scrollFade;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          varying float vMix;
          uniform vec3 uColorA;
          uniform vec3 uColorB;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float d = length(uv);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.0, d);
            vec3 col = mix(uColorA, uColorB, vMix * 0.8);
            gl_FragColor = vec4(col, vAlpha * soft);
          }
        `}
      />
    </points>
  );
};

/* ─────────────────────────────────────────────────────────
   Scroll-Driven Hero Object — Icosahedron with
   MeshTransmissionMaterial. Rotation, scale, and Y offset
   are all driven by scroll progress. No time-based animation.
   ───────────────────────────────────────────────────────── */

const VERTEX_SHADER_WARP = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HeroObject = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const scrollData = useScroll();

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;

    const scroll = scrollData.offset; // 0..1

    // Rotation driven by scroll (no time-based spin → user controls it)
    g.rotation.y = scroll * Math.PI * 3;
    g.rotation.x = scroll * Math.PI * 0.5;

    // Scale: starts at 1, shrinks to 0.3 as user scrolls away
    const scale = THREE.MathUtils.lerp(1, 0.3, scroll);
    g.scale.setScalar(scale);

    // Y position: drifts upward as user scrolls down
    g.position.y = scroll * 4;

    // Mouse-tracking parallax on top of scroll (micro-interaction)
    const targetRotX = g.rotation.x + state.pointer.y * 0.08 * (1 - scroll);
    const targetRotY = g.rotation.y + state.pointer.x * 0.1 * (1 - scroll);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, 0.05);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, 0.05);
  });

  return (
    <Float speed={1.4} floatIntensity={0.6} rotationIntensity={0}>
      <group ref={groupRef}>
        <mesh ref={meshRef} castShadow>
          <icosahedronGeometry args={[1.6, 4]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.4}
            samples={8}
            transmission={1}
            roughness={0.05}
            thickness={2.8}
            ior={1.25}
            chromaticAberration={0.06}
            color="#a78bfa"
            attenuationColor="#f472b6"
            attenuationDistance={3}
          />
        </mesh>

        {/* Inner core glow */}
        <mesh>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.08}
            wireframe
          />
        </mesh>
      </group>
    </Float>
  );
};

/* ─────────────────────────────────────────────────────────
   Ring Accent — thin torus ring that rotates counter to scroll
   ───────────────────────────────────────────────────────── */

const RingAccent = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const scrollData = useScroll();

  useFrame(() => {
    const r = ref.current;
    if (!r) return;
    r.rotation.x = Math.PI / 2 + scrollData.offset * Math.PI;
    r.rotation.z = scrollData.offset * Math.PI * 2;
    r.scale.setScalar(1 + scrollData.offset * 0.5);
    r.material.opacity = (1 - scrollData.offset * 1.5).valueOf();
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.4, 0.012, 16, 120]} />
      <meshBasicMaterial
        color="#a78bfa"
        transparent
        opacity={0.35}
      />
    </mesh>
  );
};

/* ─────────────────────────────────────────────────────────
   SceneContent — assembled inside ScrollControls
   ───────────────────────────────────────────────────────── */

function SceneContent() {
  return (
    <ScrollControls pages={2} damping={0.15}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#a78bfa" />
      <pointLight position={[-10, -5, -5]} intensity={0.8} color="#f472b6" />

      <Suspense fallback={null}>
        <Environment preset="city" />

        {/* Particles — drawn behind the object */}
        <group position={[0, 0, -6]}>
          <ParticleField />
        </group>

        {/* Central hero object */}
        <HeroObject />

        {/* Orbiting ring accent */}
        <RingAccent />
      </Suspense>
    </ScrollControls>
  );
}

/* ─────────────────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────────────────── */

export default function Hero3D() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        /**
         * eventSource must point to the scrollable container, not the canvas,
         * so ScrollControls can intercept wheel events.
         * We pass `document.documentElement` so Lenis + ScrollControls co-exist.
         */
        eventSource={
          typeof document !== "undefined" ? document.documentElement : undefined
        }
        eventPrefix="client"
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
