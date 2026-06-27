"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { HouseModel } from './HouseModel';

export function Scene({ showRoof }) {
  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}   // Fix: PCFSoftShadowMap is deprecated
      camera={{ position: [0, 30, 40], fov: 50 }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      frameloop="demand"                        // Only render when state changes — biggest perf win
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 30, 10]}
        intensity={1.5}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      <Suspense fallback={null}>
        <Environment preset="city" backgroundBlurriness={1} />
        <HouseModel showRoof={showRoof} />
      </Suspense>

      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        maxDistance={100}
        enableZoom={true}
        enableDamping
        dampingFactor={0.05}          // Slightly snappier feel (was 0.08)
      />
    </Canvas>
  );
}
