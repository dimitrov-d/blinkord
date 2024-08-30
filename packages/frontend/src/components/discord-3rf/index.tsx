"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function DiscordLogo() {
  const mesh = useRef<THREE.Group>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Replace with the path to your 3D model
  const { scene } = useGLTF("/models/scene.gltf");

  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

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

  const updateLogoColor = () => {
    if (mesh.current) {
      // Detect if dark mode is active
      const isDarkMode = document.documentElement.classList.contains("dark");

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.set(isDarkMode ? "magenta" : "white");
        }
      });
    }
  };

  useEffect(() => {
    if (mesh.current) {
      mesh.current.position.set(...position);

      // Update color initially
      updateLogoColor();

      // Listen for changes in the theme
      const observer = new MutationObserver(updateLogoColor);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, [position]);

  return (
    <group ref={mesh} {...(bind() as any)} position={position}>
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </group>
  );
}

export default function DiscordLogo3D() {
  return (
    <div className="absolute inset-0 z-100 pointer-events-auto">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DiscordLogo />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/scene.gltf");
