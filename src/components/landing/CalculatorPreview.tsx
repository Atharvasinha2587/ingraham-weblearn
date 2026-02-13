import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Calculator() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.3;
      ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  const buttons = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "×"],
    ["0", ".", "=", "÷"],
  ];

  return (
    <group ref={ref}>
      {/* Body */}
      <RoundedBox args={[2, 2.8, 0.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="#1e1b4b" metalness={0.3} roughness={0.6} />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[1.6, 0.5, 0.05]} radius={0.05} position={[0, 0.95, 0.12]}>
        <meshStandardMaterial color="#0f0a2e" emissive="#f59e0b" emissiveIntensity={0.08} />
      </RoundedBox>
      <Text position={[0.4, 0.95, 0.16]} fontSize={0.2} color="#f59e0b" anchorX="right">
        3.14
      </Text>

      {/* Buttons */}
      {buttons.map((row, ri) =>
        row.map((label, ci) => (
          <group key={`${ri}-${ci}`} position={[-0.55 + ci * 0.38, 0.35 - ri * 0.38, 0.12]}>
            <RoundedBox args={[0.3, 0.3, 0.06]} radius={0.04} smoothness={2}>
              <meshStandardMaterial
                color={ci === 3 ? "#7c3aed" : "#2e1065"}
                metalness={0.2}
                roughness={0.7}
              />
            </RoundedBox>
            <Text position={[0, 0, 0.04]} fontSize={0.12} color={ci === 3 ? "#e9d5ff" : "#a78bfa"}>
              {label}
            </Text>
          </group>
        ))
      )}
    </group>
  );
}

function FloatingSymbols() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.1;
  });
  const symbols = ["π", "∑", "∫", "√", "∞", "Δ"];
  return (
    <group ref={ref}>
      {symbols.map((sym, i) => {
        const angle = (i / symbols.length) * Math.PI * 2;
        const r = 2.5;
        return (
          <Text
            key={i}
            position={[r * Math.cos(angle), Math.sin(angle * 2) * 0.5, r * Math.sin(angle)]}
            fontSize={0.25}
            color="#f59e0b"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.3}
          >
            {sym}
          </Text>
        );
      })}
    </group>
  );
}

export default function CalculatorPreview() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.5], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#f59e0b" />
      <pointLight position={[-3, 2, 3]} intensity={0.3} color="#7c3aed" />
      <Calculator />
      <FloatingSymbols />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
