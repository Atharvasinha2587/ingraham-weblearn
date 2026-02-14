import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Nucleus({ protons = 3, neutrons = 3 }: { protons?: number; neutrons?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });

  const protonPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < Math.min(protons, 6); i++) {
      const angle = (i / Math.min(protons, 6)) * Math.PI * 2;
      pos.push([0.15 * Math.cos(angle), 0.15 * Math.sin(angle), (Math.random() - 0.5) * 0.15]);
    }
    return pos;
  }, [protons]);

  const neutronPositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < Math.min(neutrons, 6); i++) {
      const angle = ((i + 0.5) / Math.min(neutrons, 6)) * Math.PI * 2;
      pos.push([0.12 * Math.cos(angle), (Math.random() - 0.5) * 0.15, 0.12 * Math.sin(angle)]);
    }
    return pos;
  }, [neutrons]);

  return (
    <group ref={ref}>
      {protonPositions.map((pos, i) => (
        <mesh key={`p${i}`} position={pos}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.2} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
      {neutronPositions.map((pos, i) => (
        <mesh key={`n${i}`} position={pos}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.1} metalness={0.2} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function ElectronOrbit({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) {
  const electronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (electronRef.current) {
      const t = state.clock.elapsedTime * speed;
      electronRef.current.position.x = radius * Math.cos(t);
      electronRef.current.position.z = radius * Math.sin(t);
    }
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 8, 100]} />
        <meshStandardMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function AtomModel({ shells, protons, neutrons }: { shells: number; protons?: number; neutrons?: number }) {
  const orbits = useMemo(() => {
    const configs = [
      { radius: 1.2, speed: 2.5, tilt: 0, color: "#3b82f6" },
      { radius: 1.2, speed: 2.5, tilt: Math.PI / 3, color: "#3b82f6" },
      { radius: 2.0, speed: 1.8, tilt: 0.2, color: "#8b5cf6" },
      { radius: 2.0, speed: 1.8, tilt: Math.PI / 2.5, color: "#8b5cf6" },
      { radius: 2.0, speed: 1.8, tilt: -Math.PI / 3, color: "#8b5cf6" },
      { radius: 2.8, speed: 1.2, tilt: 0.4, color: "#ec4899" },
      { radius: 2.8, speed: 1.2, tilt: Math.PI / 2, color: "#ec4899" },
    ];
    const count = shells === 1 ? 2 : shells === 2 ? 5 : 7;
    return configs.slice(0, count);
  }, [shells]);

  return (
    <group>
      <Nucleus protons={protons} neutrons={neutrons} />
      {orbits.map((o, i) => (
        <ElectronOrbit key={i} {...o} />
      ))}
    </group>
  );
}

export default function AtomCanvas({ shells, protons, neutrons }: { shells: number; protons?: number; neutrons?: number }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#fff" />
        <pointLight position={[-5, -3, 5]} intensity={0.3} color="#818cf8" />
        <directionalLight position={[3, 5, 3]} intensity={0.4} />
        <AtomModel shells={shells} protons={protons} neutrons={neutrons} />
        <OrbitControls enableDamping dampingFactor={0.1} minDistance={3} maxDistance={15} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
