"use client";

import { useState } from 'react';
import { Scene } from '@/components/Scene';

export default function Home() {
  const [showRoof, setShowRoof] = useState(false);
  const [viewMode, setViewMode] = useState('overview');

  const roomsList = [
    { id: 'overview', name: '🏡 Overview', desc: 'Full Dollhouse perspective' },
    { id: 'sitting_room', name: '🛋️ Sitting Room', desc: 'Spacious central lounge' },
    { id: 'master_bedroom', name: '🛏️ Master Bed', desc: 'En-suite master bedroom' },
    { id: 'kitchen', name: '🍳 Kitchen', desc: 'Modern kitchen space' },
    { id: 'room1', name: '🛌 Room 1', desc: 'Top-left bedroom' },
    { id: 'room2', name: '🛌 Room 2', desc: 'Bottom-left bedroom' },
    { id: 'toilets', name: '🚽 Toilets', desc: 'Shared bathroom area' },
  ];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-neutral-950 font-sans">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Scene showRoof={showRoof} viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* TOP ROW */}
        <div className="flex justify-between items-start w-full">
          {/* Top-left: Title card */}
          <div className="bg-neutral-900/75 border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto max-w-xs transition-all hover:border-white/20">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>🏠</span> Kadiri&apos;s House
            </h1>
            <p className="text-xs text-neutral-400 mt-1">Professional architectural walkthrough. Click on any room or use the navigator to inspect inside.</p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md text-[10px] font-medium border border-amber-500/20">
              Active: {roomsList.find(r => r.id === viewMode)?.name || 'Overview'}
            </div>
          </div>

          {/* Top-right: Roof Control */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            {viewMode === 'overview' ? (
              <button
                onClick={() => setShowRoof(!showRoof)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-lg border transition-all cursor-pointer backdrop-blur-md ${
                  showRoof 
                    ? 'bg-amber-500 text-neutral-950 border-amber-400 hover:bg-amber-400' 
                    : 'bg-neutral-900/90 text-white border-white/10 hover:bg-neutral-800'
                }`}
              >
                {showRoof ? '👀 Hide Roof & Solar Panels' : '🏠 Show Roof & Solar Panels'}
              </button>
            ) : (
              <div className="bg-neutral-900/80 border border-white/10 text-neutral-400 text-xs px-4 py-2.5 rounded-full backdrop-blur-md">
                Roof auto-hidden for interior view
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-5 w-full pointer-events-auto">
          
          {/* BOTTOM NAVIGATION: Room selector bar */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 bg-neutral-950/80 border border-white/10 p-2.5 rounded-3xl shadow-2xl backdrop-blur-xl max-w-4xl">
              {roomsList.map((room) => {
                const isActive = viewMode === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setViewMode(room.id)}
                    className={`flex flex-col items-center px-4 py-2 rounded-2xl transition-all cursor-pointer text-center min-w-[100px] ${
                      isActive 
                        ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md scale-105' 
                        : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{room.name.split(' ')[0]}</span>
                    <span className="text-xs font-medium mt-0.5">{room.name.split(' ').slice(1).join(' ')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ROW: Controls hint & reset */}
          <div className="flex justify-between items-center w-full">
            {/* Bottom-left: Controls instruction card */}
            <div className="bg-neutral-900/75 border border-white/10 px-4 py-3 rounded-xl shadow-xl text-neutral-300 backdrop-blur-md max-w-xs text-xs">
              <span className="font-semibold text-white block mb-1">Interaction Tips:</span>
              <ul className="space-y-0.5 text-neutral-400">
                <li>• Left click + drag to rotate camera</li>
                <li>• Scroll / pinch to zoom in/out</li>
                <li>• Click any door to toggle it open/closed</li>
              </ul>
            </div>

            {/* Bottom-right: Back to overview button */}
            {viewMode !== 'overview' && (
              <button
                onClick={() => setViewMode('overview')}
                className="bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/10 px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                🔄 Reset to Bird-Eye Overview
              </button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
