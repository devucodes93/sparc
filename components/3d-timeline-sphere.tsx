'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function PulsingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.Material>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
    }
    if (materialRef.current && 'emissiveIntensity' in materialRef.current) {
      materialRef.current.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime) * 0.2
    }
  })

  return (
    <Float floatIntensity={1.5} speed={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.3}
          wireframe={false}
        />
      </mesh>
      
      {/* Outer Ring */}
      <mesh scale={1.3}>
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial 
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.1}
          wireframe={true}
        />
      </mesh>
    </Float>
  )
}

export function Timeline3D() {
  return (
    <div className="w-full h-80 rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#06b6d4" />
        <Environment preset="city" />
        <PulsingSphere />
        <OrbitControls 
          autoRotate
          autoRotateSpeed={1.5}
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
        />
      </Canvas>
    </div>
  )
}
