import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { SimData } from "@/hooks/useProjectileSimulation";

function Ball({ x, y }: { x: number; y: number }) {
  return (
    <mesh position={[x * 0.1, y * 0.1, 0]}>
      <sphereGeometry args={[0.15, 24, 24]} />
      <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
    </mesh>
  );
}

function TrajectoryLine({ trajectory }: { trajectory: { x: number; y: number }[] }) {
  const line = useMemo(() => {
    if (trajectory.length < 2) return null;
    const pts = trajectory.map((p) => new THREE.Vector3(p.x * 0.1, p.y * 0.1, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    return geometry;
  }, [trajectory]);

  if (!line) return null;

  return (
    <line>
      <primitive object={line} attach="geometry" />
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.5} />
    </line>
  );
}

function GroundGrid() {
  return (
    <>
      <gridHelper args={[40, 40, "#1e3a5f", "#0d1b2a"]} rotation={[0, 0, 0]} />
      {/* X axis */}
      <mesh position={[10, 0.01, 0]}>
        <boxGeometry args={[20, 0.02, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Y axis */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[0.02, 10, 0.02]} />
        <meshBasicMaterial color="#22c55e" />
      </mesh>
      <Text position={[11, 0.3, 0]} fontSize={0.3} color="#ef4444">X</Text>
      <Text position={[0.3, 5.5, 0]} fontSize={0.3} color="#22c55e">Y</Text>
    </>
  );
}

export default function SimulationCanvas({ data }: { data: SimData }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [5, 4, 8], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#38bdf8" />
        <directionalLight position={[5, 8, 3]} intensity={0.4} />
        <GroundGrid />
        <Ball x={data.x} y={data.y} />
        <TrajectoryLine trajectory={data.trajectory} />
        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          minDistance={3}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
}
