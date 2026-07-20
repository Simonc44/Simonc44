import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

type ShapeKind =
  | "torusKnot"
  | "icosahedron"
  | "octahedron"
  | "sphere"
  | "torus"
  | "dodecahedron";

interface ShapeProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
  geometry: ShapeKind;
}

// Lookup table for geometry JSX, matching the project's table-driven style.
const GEOMETRIES: Record<ShapeKind, React.ReactNode> = {
  torusKnot: <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />,
  icosahedron: <icosahedronGeometry args={[0.8, 0]} />,
  octahedron: <octahedronGeometry args={[0.7, 0]} />,
  sphere: <sphereGeometry args={[0.8, 32, 32]} />,
  torus: <torusGeometry args={[0.6, 0.2, 16, 32]} />,
  dodecahedron: <dodecahedronGeometry args={[0.7, 0]} />,
};

/**
 * One floating 3D shape.
 * - Rotates slowly over time
 * - Wraps in <Float> from drei for organic bobbing (skipped under reduced motion)
 * - Uses a cheap meshStandardMaterial colored by the scene's lights
 */
const Shape = ({ position, color, scale = 1, speed = 1, geometry }: ShapeProps) => {
  const ref = useRef<THREE.Mesh>(null!);
  const shouldReduceMotion = useReducedMotion();

  useFrame((state) => {
    if (shouldReduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.18 * speed;
    ref.current.rotation.z = t * 0.12 * speed;
  });

  const mesh = (
    <mesh ref={ref} position={position} scale={scale}>
      {GEOMETRIES[geometry]}
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.55}
        emissive={color}
        emissiveIntensity={0.25}
      />
    </mesh>
  );

  return shouldReduceMotion ? mesh : (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={2}>
      {mesh}
    </Float>
  );
};

/** Subtle parallax: the camera drifts slightly toward the mouse. Disabled under reduced motion. */
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
      camera={{ position: [0, 0, 7], fov: 45 }}
      style={{ background: "transparent", pointerEvents: "none" }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 6, 5]} intensity={3} color="#a78bfa" />
      <pointLight position={[-6, -6, 5]} intensity={2.5} color="#f472b6" />
      <pointLight position={[0, 0, 4]} intensity={1.4} color="#ffffff" />

      {/* 4 shapes — kept compact for performance. Positioned in the corners
          so they decorate without blocking the central text/terminal. */}
      <Shape
        position={[-5, 2.5, -2]}
        color="#a78bfa"
        scale={0.85}
        speed={1}
        geometry="torusKnot"
      />
      <Shape
        position={[5.5, -2, -3]}
        color="#f472b6"
        scale={0.7}
        speed={1.2}
        geometry="icosahedron"
      />
      <Shape
        position={[-4.5, -2.8, -1]}
        color="#a78bfa"
        scale={0.6}
        speed={0.9}
        geometry="octahedron"
      />
      <Shape
        position={[4, 2.8, -4]}
        color="#f472b6"
        scale={0.65}
        speed={1.1}
        geometry="dodecahedron"
      />

      <CameraRig />
    </Canvas>
  );
};

export default ThreeScene;
