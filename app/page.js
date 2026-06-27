"use client";

import { useState } from 'react';
import { Scene } from '@/components/Scene';

export default function Home() {
  const [showRoof, setShowRoof] = useState(false);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-neutral-950">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Scene showRoof={showRoof} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* Top-left: Title card */}
        <div className="absolute top-6 left-6 pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl shadow-xl">
            <h1 className="text-xl font-bold text-white tracking-tight">🏠 Kadiri&apos;s House</h1>
            <p className="text-xs text-neutral-400 mt-1">Professional Floor Plan Visualization</p>
          </div>
        </div>

        {/* Top-right: Action buttons */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={() => setShowRoof(!showRoof)}
            style={{
              background: showRoof ? 'rgba(212,175,55,0.2)' : 'rgba(20,20,20,0.85)',
              color: 'white',
              border: '2px solid #d4af37',
              padding: '10px 22px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s',
              fontFamily: 'sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            {showRoof ? '👀 Hide Roof & Panels' : '🏠 Show Roof & Panels'}
          </button>
        </div>

        {/* Bottom-left: Controls hint */}
        <div className="absolute bottom-6 left-6 pointer-events-auto">
          <div className="bg-black/50 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl shadow-xl text-white">
            <h3 className="font-semibold text-sm mb-2">Controls</h3>
            <ul className="text-xs text-neutral-400 space-y-1">
              <li>• Left Click + Drag — Rotate</li>
              <li>• Right Click + Drag — Pan</li>
              <li>• Click any door — Open / Close</li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}
