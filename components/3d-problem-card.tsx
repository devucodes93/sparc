'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface Problem3DCardProps {
  color: string
  difficulty: string
}

function AnimatedPyramid({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004
    }
  })

  return (
    <Float floatIntensity={1} speed={2}>
      <mesh ref={meshRef}>
        <tetrahedronGeometry args={[1.5]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          wireframe={false}
        />
      </mesh>
    </Float>
  )
}

export function Problem3DCard({ color, difficulty }: Problem3DCardProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.4} color={color} />
        <Environment preset="studio" />
        <AnimatedPyramid color={color} />
      </Canvas>
      <div className="absolute top-2 right-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
        {difficulty}
      </div>
    </div>
  )
}
