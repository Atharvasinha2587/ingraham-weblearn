import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { PendulumData, PendulumParams } from "@/hooks/usePendulumSimulation";

function TrailLine({ history }: { history: { x: number; y: number }[] }) {
  const geometry = useMemo(() => {
    if (history.length < 2) return null;
    const pts = history.slice(-60).map((p) => new THREE.Vector3(p.x, p.y, 0));
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [history]);

  if (!geometry) return null;
  return (
    <line>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial color="#818cf8" transparent opacity={0.3} />
    </line>
  );
}

function PendulumBob({ x, y, history }: { x: number; y: number; history: { x: number; y: number }[] }) {
  return (
    <group>
      {/* Pivot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* String */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, x, y, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#94a3b8" />
      </line>
      {/* Trail */}
      <TrailLine history={history} />
      {/* Bob */}
      <mesh position={[x, y, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.15} metalness={0.5} roughness={0.25} />
      </mesh>
      {/* Bob glow ring */}
      <mesh position={[x, y, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#818cf8" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function PendulumCanvas({ data, params }: { data: PendulumData; params: PendulumParams }) {
  const bobHistory = useMemo(() => {
    return data.history.map((h) => {
      const theta = (h.angle * Math.PI) / 180;
      return { x: params.length * Math.sin(theta), y: -params.length * Math.cos(theta) };
    });
  }, [data.history, params.length]);

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, -1, 6], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.7} color="#fff" />
        <directionalLight position={[3, 5, 3]} intensity={0.5} />
        {/* Support bar */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.5, 0.06, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
        </mesh>
        <PendulumBob x={data.x} y={data.y} history={bobHistory} />
        <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} position={[0, -params.length - 1, 0]} />
        <OrbitControls enableDamping dampingFactor={0.1} minDistance={3} maxDistance={20} />
      </Canvas>
    </div>
  );
}
