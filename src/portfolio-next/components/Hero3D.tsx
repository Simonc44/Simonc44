"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

/* ─────────────── Layer 1: GPU particle field ─────────────── */

const PARTICLE_COUNT = 1500;

const ParticleField = () => {
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, randomness } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const randomness = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread particles in a wide 3D cloud, biased slightly behind the camera.
      positions[i * 3 + 0] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = -Math.random() * 14 - 2;
      randomness[i] = Math.random();
    }
    return { positions, randomness };
  }, []);

  useFrame((state) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);
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
          array={randomness}
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
          uColorA: { value: new THREE.Color("#a78bfa") }, // violet
          uColorB: { value: new THREE.Color("#f472b6") }, // coral
        }}
        vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          attribute float aRandom;
          varying float vAlpha;
          varying float vMix;

          void main() {
            vec3 pos = position;

            // Slow vertical drift per particle
            pos.y += sin(uTime * 0.18 + aRandom * 12.0) * 0.45;
            pos.x += cos(uTime * 0.12 + aRandom * 6.0) * 0.25;

            // Mouse attraction-repulsion at the screen center plane
            vec2 mouseWorld = uMouse * 12.0;
            float dist = distance(pos.xy, mouseWorld);
            float radius = 4.5;
            if (dist < radius) {
              vec2 dir = normalize(pos.xy - mouseWorld + 1e-5);
              float force = (radius - dist) / radius;
              pos.xy += dir * force * 1.6;
              vMix = 1.0;
            } else {
              vMix = 0.0;
            }

            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            // Bigger particles when closer + a per-particle size variance
            gl_PointSize = (1.8 + aRandom * 3.0) * (40.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;

            // Closer to mouse → brighter
            float proximity = 1.0 - smoothstep(0.0, radius, dist);
            vAlpha = (0.25 + aRandom * 0.35) * (0.5 + proximity * 0.5);
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
            vec3 col = mix(uColorA, uColorB, vMix * 0.7);
            gl_FragColor = vec4(col, vAlpha * soft);
          }
        `}
      />
    </points>
  );
};

/* ─────────────── Layer 2: The 3D model ─────────────── */

const FallbackModel = () => {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const tx = state.pointer.x * 0.5;
    const ty = -state.pointer.y * 0.3;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, tx, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, ty, 0.05);
  });

  return (
    <Float speed={1.8} floatIntensity={1} rotationIntensity={0.4}>
      <group ref={ref}>
        <mesh castShadow>
          <torusKnotGeometry args={[1, 0.32, 128, 32]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.6}
            samples={6}
            transmission={1}
            roughness={0.12}
            thickness={2.6}
            ior={1.2}
            chromaticAberration={0.08}
            color="#a78bfa"
          />
        </mesh>
        {/* Faint duplicate behind for soft shadow plane feel */}
        <mesh position={[0, -1.4, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 2, 64]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};

const GLTFModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      state.pointer.x * 0.5,
      0.05
    );
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      -state.pointer.y * 0.3,
      0.05
    );
  });
  return <primitive ref={ref} object={scene} />;
};

interface Hero3DProps {
  /** Optional path to a .glb / .gltf model to swap in for the procedural shape. */
  modelUrl?: string;
}

/**
 * The Hero's 3D composition.
 *  - One `<Canvas>` (avoid stacking canvases — double WebGL contexts tank mobile fps).
 *  - Layered z-depth: particles ~ z = -8, model at z = 0.
 *  - Uses drei's `Environment` for IBL (required by MeshTransmissionMaterial)
 *    and `<Suspense>` to keep mount-time smooth.
 */
export default function Hero3D({ modelUrl }: Hero3DProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // r3f handles dpr clamping at attach time; this preserves transparency
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {/* Single ambient + HDRI keeps the canvas inexpensive */}
        <ambientLight intensity={0.35} />
        <Suspense fallback={null}>
          <Environment preset="city" />

          {/* Layer 1: Particles (back) */}
          <group position={[0, 0, -8]}>
            <ParticleField />
          </group>

          {/* Layer 2: Model (mid) */}
          {modelUrl ? (
            <GLTFModel url={modelUrl} />
          ) : (
            <FallbackModel />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
