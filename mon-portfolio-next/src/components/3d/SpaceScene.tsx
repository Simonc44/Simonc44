"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * ParticleField — Multi-layer interactive 3D particle constellation.
 * Reacts to pointer position with physical inertia (lerp) and dynamic wave motion.
 */
function ParticleField() {
  const fgRef = useRef<THREE.Points>(null);
  const bgRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Foreground interactive nodes
  const { fgPositions, fgColors } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#e2e8f0"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#c084fc"),
    ];

    for (let i = 0; i < count; i++) {
      const r = 9 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    return { fgPositions: positions, fgColors: colors };
  }, []);

  // Background deep ambient dust
  const bgPositions = useMemo(() => {
    const count = 2500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = -4 - Math.random() * 12;
    }
    return positions;
  }, []);

  const pointer = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Foreground wave rotation + mouse lerp
    if (fgRef.current) {
      fgRef.current.rotation.y = t * 0.03;
      fgRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;

      pointer.current.lerp(state.pointer, 0.04);
      const targetX = (pointer.current.x * viewport.width) / 12;
      const targetY = (pointer.current.y * viewport.height) / 12;

      fgRef.current.position.x = THREE.MathUtils.lerp(fgRef.current.position.x, targetX, 0.05);
      fgRef.current.position.y = THREE.MathUtils.lerp(fgRef.current.position.y, targetY, 0.05);
    }

    // Background slow drift
    if (bgRef.current) {
      bgRef.current.rotation.z = t * 0.008;
    }
  });

  return (
    <group>
      {/* Deep Background Dust */}
      <Points ref={bgRef} positions={bgPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a1a1aa"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Dynamic Foreground Constellation */}
      <Points ref={fgRef} positions={fgPositions} colors={fgColors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.055}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function SpaceScene() {
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}

