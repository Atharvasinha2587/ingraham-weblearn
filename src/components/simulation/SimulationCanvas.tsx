import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { SimData } from "@/hooks/useProjectileSimulation";

function Ball({ x, y }: { x: number; y: number }) {
  return (
    <mesh position={[x * 0.1, y * 0.1, 0]}>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.15} metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

function TrajectoryLine({ trajectory }: { trajectory: { x: number; y: number }[] }) {
  const line = useMemo(() => {
    if (trajectory.length < 2) return null;
    const pts = trajectory.map((p) => new THREE.Vector3(p.x * 0.1, p.y * 0.1, 0));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [trajectory]);

  if (!line) return null;

  return (
    <line>
      <primitive object={line} attach="geometry" />
      <lineBasicMaterial color="#818cf8" transparent opacity={0.6} />
    </line>
  );
}

function GroundGrid() {
  return (
    <>
      <gridHelper args={[40, 40, "#cbd5e1", "#e2e8f0"]} rotation={[0, 0, 0]} />
      <mesh position={[10, 0.01, 0]}>
        <boxGeometry args={[20, 0.02, 0.02]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
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
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.7} color="#fff" />
        <directionalLight position={[5, 8, 3]} intensity={0.5} />
        <GroundGrid />
        <Ball x={data.x} y={data.y} />
        <TrajectoryLine trajectory={data.trajectory} />
        <OrbitControls enableDamping dampingFactor={0.1} minDistance={3} maxDistance={30} />
      </Canvas>
    </div>
  );
}
