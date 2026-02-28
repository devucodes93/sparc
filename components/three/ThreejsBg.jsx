"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import { useRef } from "react";
import * as THREE from "three";

function Globe() {
  const earthRef = useRef();
  const atmosphereRef = useRef();

  // Real community Earth textures (public CDN)
  const [colorMap, bumpMap, specMap] = useLoader(TextureLoader, [
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
    "https://unpkg.com/three-globe/example/img/earth-topology.png",
    "https://unpkg.com/three-globe/example/img/earth-water.png",
  ]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <>
      {/* Real Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={new THREE.Color("grey")}
          shininess={15}
        />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh ref={atmosphereRef} scale={1.2}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

export default function ThreejsBg() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={1} />

        {/* Stars */}
        <Stars
          radius={100}
          depth={60}
          count={6000}
          factor={4}
          saturation={0}
          fade
        />

        <Globe />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
