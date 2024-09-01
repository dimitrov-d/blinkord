"use client";

import { useRef, useState, useEffect, useContext, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ThemeContext } from "@/lib/contexts/ThemeProvider";

function DiscordLogo() {
  const mesh = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Replace with the path to your 3D model
  const { scene } = useGLTF("/models/scene.gltf");

  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const { isDark } = useContext(ThemeContext);

  const bind = useDrag(({ offset: [x, y] }) => {
    const z = position[2];
    setPosition([x / aspect, -y / aspect, z]);
  });

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5;
      // Add a floating effect
      mesh.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isDark ? 0xff00ff : 0xffffff,
      metalness: 0.1,
      roughness: 0.5,
    });
  }, [isDark]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  return (
    <group ref={mesh} {...(bind() as any)} position={position}>
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
}

export default function DiscordLogo3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-auto">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DiscordLogo />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/scene.gltf");