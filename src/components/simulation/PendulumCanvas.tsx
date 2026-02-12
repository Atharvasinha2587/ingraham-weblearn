import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import type { PendulumData, PendulumParams } from "@/hooks/usePendulumSimulation";

function PendulumBob({ x, y, length }: { x: number; y: number; length: number }) {
  return (
    <group>
      {/* Pivot */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      {/* String */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, x, y, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" />
      </line>
      {/* Bob */}
      <mesh position={[x, y, 0]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function PendulumCanvas({ data, params }: { data: PendulumData; params: PendulumParams }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, -1, 6], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#38bdf8" />
        <directionalLight position={[3, 5, 3]} intensity={0.4} />
        {/* Support bar */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2, 0.05, 0.05]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <PendulumBob x={data.x} y={data.y} length={params.length} />
        <gridHelper args={[20, 20, "#1e3a5f", "#0d1b2a"]} position={[0, -params.length - 1, 0]} />
        <OrbitControls enableDamping dampingFactor={0.1} minDistance={3} maxDistance={20} />
      </Canvas>
    </div>
  );
}
