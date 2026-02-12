import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Nucleus() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={ref}>
      {/* Protons */}
      {[[-0.15, 0.1, 0], [0.15, -0.05, 0.1], [0, 0.1, -0.15]].map((pos, i) => (
        <mesh key={`p${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Neutrons */}
      {[[0.1, -0.1, -0.1], [-0.1, -0.15, 0.1], [0.05, 0.15, 0.1]].map((pos, i) => (
        <mesh key={`n${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.17, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" emissive="#94a3b8" emissiveIntensity={0.2} />
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
        <meshStandardMaterial color={color} transparent opacity={0.3} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh ref={electronRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function AtomModel({ shells }: { shells: number }) {
  const orbits = useMemo(() => {
    const configs = [
      { radius: 1.2, speed: 2.5, tilt: 0, color: "#38bdf8" },
      { radius: 1.2, speed: 2.5, tilt: Math.PI / 3, color: "#38bdf8" },
      { radius: 2.0, speed: 1.8, tilt: 0.2, color: "#818cf8" },
      { radius: 2.0, speed: 1.8, tilt: Math.PI / 2.5, color: "#818cf8" },
      { radius: 2.0, speed: 1.8, tilt: -Math.PI / 3, color: "#818cf8" },
      { radius: 2.8, speed: 1.2, tilt: 0.4, color: "#f472b6" },
      { radius: 2.8, speed: 1.2, tilt: Math.PI / 2, color: "#f472b6" },
    ];
    const count = shells === 1 ? 2 : shells === 2 ? 5 : 7;
    return configs.slice(0, count);
  }, [shells]);

  return (
    <group>
      <Nucleus />
      {orbits.map((o, i) => (
        <ElectronOrbit key={i} {...o} />
      ))}
    </group>
  );
}

export default function AtomCanvas({ shells }: { shells: number }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#38bdf8" />
        <pointLight position={[-5, -3, 5]} intensity={0.3} color="#818cf8" />
        <AtomModel shells={shells} />
        <OrbitControls enableDamping dampingFactor={0.1} minDistance={3} maxDistance={15} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
