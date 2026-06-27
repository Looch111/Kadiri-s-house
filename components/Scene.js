"use client";

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HouseModel } from './HouseModel';

// Smooth camera and controls target interpolation helper
function CameraController({ targetPos, targetLookAt, controlsRef }) {
  const { camera } = useThree();

  useFrame(() => {
    // Smoothly move the camera to the target position
    camera.position.lerp(new THREE.Vector3(...targetPos), 0.08);

    // Smoothly point OrbitControls target to target room center
    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(...targetLookAt), 0.08);
      controlsRef.current.update();
    }
  });

  return null;
}

export function Scene({ showRoof, viewMode, onViewModeChange }) {
  const controlsRef = useRef();

  const cameraViews = {
    overview: {
      position: [0, 35, 45],
      target: [0, 0, 0]
    },
    sitting_room: {
      position: [3, 5.5, 12],
      target: [1, 3, 6.5]
    },
    master_bedroom: {
      position: [14.5, 5.5, -4],
      target: [12.5, 3, -6.5]
    },
    kitchen: {
      position: [-2.5, 5.5, -4],
      target: [-4, 3, -6.5]
    },
    room1: {
      position: [-12.5, 5.5, -6],
      target: [-14, 3, -8]
    },
    room2: {
      position: [-12.5, 5.5, 6],
      target: [-14, 3, 8]
    },
    toilets: {
      position: [-11, 5.5, 0],
      target: [-14, 3, 0]
    }
  };

  const activeView = cameraViews[viewMode] || cameraViews.overview;

  // Auto-hide roof when viewing individual rooms
  const finalShowRoof = viewMode === 'overview' ? showRoof : false;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 35, 45], fov: 50 }}
      dpr={[1, 1.5]}         // Cap pixel ratio for high DPI displays
      performance={{ min: 0.5 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      {/* Ambient lighting */}
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
        <HouseModel showRoof={finalShowRoof} />

        {/* 3D Room labels visible in overview mode */}
        {viewMode === 'overview' && (
          <group>
            {/* Sitting Room */}
            <Html position={[1, 7, 6.5]} center>
              <button 
                onClick={() => onViewModeChange('sitting_room')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🛋️ Sitting Room
              </button>
            </Html>

            {/* Master Bedroom */}
            <Html position={[12.5, 7, -6.5]} center>
              <button 
                onClick={() => onViewModeChange('master_bedroom')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🛏️ Master Bed
              </button>
            </Html>

            {/* Kitchen */}
            <Html position={[-4, 7, -6.5]} center>
              <button 
                onClick={() => onViewModeChange('kitchen')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🍳 Kitchen
              </button>
            </Html>

            {/* Room 1 */}
            <Html position={[-14, 7, -8]} center>
              <button 
                onClick={() => onViewModeChange('room1')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🛌 Room 1
              </button>
            </Html>

            {/* Room 2 */}
            <Html position={[-14, 7, 8]} center>
              <button 
                onClick={() => onViewModeChange('room2')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🛌 Room 2
              </button>
            </Html>

            {/* Toilets */}
            <Html position={[-14, 7, 0]} center>
              <button 
                onClick={() => onViewModeChange('toilets')}
                className="bg-black/85 hover:bg-amber-500 hover:scale-110 active:scale-95 transition-all text-white border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md cursor-pointer select-none whitespace-nowrap pointer-events-auto"
              >
                🚽 Toilets
              </button>
            </Html>
          </group>
        )}
      </Suspense>

      {/* Controller to animate camera between views */}
      <CameraController targetPos={activeView.position} targetLookAt={activeView.target} controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={80}
        enableZoom={true}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
