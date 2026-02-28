'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Environment } from '@react-three/drei'
import * as THREE from 'three'

function RotatingCubes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.003
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Central Cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#6366f1" 
          emissive="#4f46e5"
          wireframe={false}
        />
      </mesh>

      {/* Orbiting Cubes */}
      {[0, 1, 2, 3].map((i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[
            Math.cos((i / 4) * Math.PI * 2) * 5,
            Math.sin((i / 4) * Math.PI * 2) * 5,
            Math.sin((i / 4) * Math.PI * 2) * 3,
          ]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial 
              color={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i]}
              emissive={['#7c3aed', '#0891b2', '#059669', '#d97706'][i]}
              wireframe={false}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8}
            array={new Float32Array([
              0, 0, 0,
              Math.cos(0) * 5, Math.sin(0) * 5, Math.sin(0) * 3,
              0, 0, 0,
              Math.cos(Math.PI / 2) * 5, Math.sin(Math.PI / 2) * 5, Math.sin(Math.PI / 2) * 3,
              0, 0, 0,
              Math.cos(Math.PI) * 5, Math.sin(Math.PI) * 5, Math.sin(Math.PI) * 3,
              0, 0, 0,
              Math.cos((3 * Math.PI) / 2) * 5, Math.sin((3 * Math.PI) / 2) * 5, Math.sin((3 * Math.PI) / 2) * 3,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4f46e5" linewidth={2} />
      </lineSegments>
    </group>
  )
}

export function HeroScene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#8b5cf6" />
      <Environment preset="night" />
      <RotatingCubes />
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={2}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
      />
    </Canvas>
  )
}
