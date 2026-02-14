import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Nucleus() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.4;
  });
  return (
    <group ref={ref}>
      {[[-0.12, 0.08, 0], [0.12, -0.04, 0.08], [0, 0.08, -0.12]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.14, 14, 14]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
      {[[0.08, -0.08, -0.08], [-0.08, -0.12, 0.08]].map((p, i) => (
        <mesh key={`n${i}`} position={p as [number, number, number]}>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color="#6ee7b7" emissive="#6ee7b7" emissiveIntensity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Orbit({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) {
  const elRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (elRef.current) {
      const t = s.clock.elapsedTime * speed;
      elRef.current.position.x = radius * Math.cos(t);
      elRef.current.position.z = radius * Math.sin(t);
    }
  });
  return (
    <group rotation={[tilt, 0, tilt * 0.5]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 80]} />
        <meshStandardMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={elRef}>
        <sphereGeometry args={[0.06, 14, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function AtomPreview() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#fff" />
      <directionalLight position={[-3, 3, 3]} intensity={0.3} />
      <Nucleus />
      <Orbit radius={1} speed={2.5} tilt={0} color="#10b981" />
      <Orbit radius={1} speed={2.5} tilt={Math.PI / 3} color="#10b981" />
      <Orbit radius={1.6} speed={1.8} tilt={0.3} color="#34d399" />
      <Orbit radius={1.6} speed={1.8} tilt={Math.PI / 2.5} color="#34d399" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}
