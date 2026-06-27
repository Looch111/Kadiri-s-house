"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { HouseModel } from './HouseModel';

export function Scene({ showRoof }) {
  return (
    <Canvas shadows camera={{ position: [0, 30, 40], fov: 50 }}>
      {/* Lighting for professional look */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        castShadow 
        position={[10, 30, 10]} 
        intensity={1.5} 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      <Suspense fallback={null}>
        {/* Environment map for realistic reflections and lighting */}
        <Environment preset="city" />
        
        {/* House Model */}
        <HouseModel showRoof={showRoof} />
        
        {/* Soft shadows on the ground */}
        <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={20} color="#000000" />
      </Suspense>

      {/* Orbit Controls — zoom disabled */}
      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2.1} 
        maxDistance={100}
        enableZoom={false}
      />
    </Canvas>
  );
}
