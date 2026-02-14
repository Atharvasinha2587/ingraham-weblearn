import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function TrajectoryArc() {
  const ballRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const v = 12;
    const angle = (55 * Math.PI) / 180;
    const g = 9.8;
    const vx = v * Math.cos(angle);
    const vy = v * Math.sin(angle);
    const totalTime = (2 * vy) / g;
    for (let t = 0; t <= totalTime; t += 0.02) {
      points.push(new THREE.Vector3(vx * t - 4, vy * t - 0.5 * g * t * t - 1, 0));
    }
    return points;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(curve.length * 3);
    curve.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [curve]);

  useFrame((state) => {
    timeRef.current = (state.clock.elapsedTime * 0.3) % 1;
    const idx = Math.floor(timeRef.current * (curve.length - 1));
    if (ballRef.current && curve[idx]) {
      ballRef.current.position.copy(curve[idx]);
    }
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#4f8cff" transparent opacity={0.5} sizeAttenuation />
      </points>
      <mesh ref={ballRef}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color="#4f8cff" emissive="#4f8cff" emissiveIntensity={0.3} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function ProjectilePreview() {
  return (
    <Canvas camera={{ position: [2, 2, 6], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#fff" />
      <directionalLight position={[3, 5, 3]} intensity={0.5} />
      <TrajectoryArc />
      <gridHelper args={[16, 16, "#cbd5e1", "#e2e8f0"]} position={[0, -1, 0]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}
