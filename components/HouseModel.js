"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// 3D Window Component with frames and semi-transparent glass
function Window3D({ width, height, thickness = 0.5 }) {
  const frameWidth = 0.15; // Frame border width
  const frameThickness = thickness + 0.1; // Slightly thicker than the wall for detail

  return (
    <group>
      {/* Outer frame (4 border blocks) */}
      {/* Top */}
      <mesh position={[0, height / 2 - frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, frameWidth, frameThickness]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -height / 2 + frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, frameWidth, frameThickness]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Left */}
      <mesh position={[-width / 2 + frameWidth / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height - frameWidth * 2, frameThickness]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Right */}
      <mesh position={[width / 2 - frameWidth / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height - frameWidth * 2, frameThickness]} />
        <meshStandardMaterial color="#222222" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Glass Pane */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width - frameWidth * 2, height - frameWidth * 2, 0.05]} />
        <meshStandardMaterial
          color="#a3d8f8"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// Luxurious 3D Door Component with custom paneling, vertical handles, glass panel options, and interactive open/close
function Door3D({ width, height, thickness = 0.5, isEntrance = false, flipSwing = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const doorRef = useRef();

  const frameWidth = 0.15;
  const frameThickness = thickness + 0.05;

  // Custom premium color palettes
  const frameColor = "#1a1a1a"; // Elegant Ebony frame
  const doorColor = isEntrance ? "#1c140e" : "#3d2314"; // Ebony-Oak for entry doors, Walnut for interior doors
  const handleColor = "#d4af37"; // Rich Brass/Gold handles

  const panelWidth = width - frameWidth * 2;
  const panelHeight = height - frameWidth;

  // Toggle cursor on hover
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Target angle: open by 100 degrees (1.75 rad) or closed (0 rad)
  const targetRotation = isOpen ? (flipSwing ? -Math.PI / 1.8 : Math.PI / 1.8) : 0;

  // Smooth rotation — only animate when not yet settled
  useFrame(() => {
    if (doorRef.current) {
      const diff = targetRotation - doorRef.current.rotation.y;
      if (Math.abs(diff) > 0.001) {
        doorRef.current.rotation.y = THREE.MathUtils.lerp(
          doorRef.current.rotation.y,
          targetRotation,
          0.15
        );
      } else if (doorRef.current.rotation.y !== targetRotation) {
        doorRef.current.rotation.y = targetRotation; // snap and stop updating
      }
    }
  });

  return (
    <group>
      {/* Outer Door Frame */}
      {/* Top Frame */}
      <mesh position={[0, height / 2 - frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, frameWidth, frameThickness]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Left Frame */}
      <mesh position={[-width / 2 + frameWidth / 2, -frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height - frameWidth, frameThickness]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Right Frame */}
      <mesh position={[width / 2 - frameWidth / 2, -frameWidth / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, height - frameWidth, frameThickness]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Door Leaf (hinged on the left, interactive) */}
      <group
        ref={doorRef}
        position={[-width / 2 + frameWidth, -frameWidth / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => setHovered(false)}
      >
        {/* Main Solid Slab */}
        <mesh position={[panelWidth / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidth, panelHeight, 0.12]} />
          <meshStandardMaterial color={doorColor} roughness={0.85} />
        </mesh>

        {/* Premium Inset Panels (Horizontal moldings on front/back) */}
        {!isEntrance && [0.2, 0.5, 0.8].map((yFactor, idx) => {
          const pW = panelWidth - 0.2;
          const pH = (panelHeight - 0.6) / 3;
          const pY = -panelHeight / 2 + 0.3 + yFactor * (panelHeight - 0.6);
          return (
            <group key={idx}>
              {/* Front panels */}
              <mesh position={[panelWidth / 2, pY, 0.065]} castShadow>
                <boxGeometry args={[pW, pH, 0.01]} />
                <meshStandardMaterial color={doorColor} roughness={0.9} />
              </mesh>
              {/* Back panels */}
              <mesh position={[panelWidth / 2, pY, -0.065]} castShadow>
                <boxGeometry args={[pW, pH, 0.01]} />
                <meshStandardMaterial color={doorColor} roughness={0.9} />
              </mesh>
            </group>
          );
        })}

        {/* Entrance Door Frosted Glass Insert */}
        {isEntrance && (
          <mesh position={[panelWidth / 2, 0, 0.01]} castShadow>
            <boxGeometry args={[panelWidth - 0.3, panelHeight - 0.6, 0.05]} />
            <meshStandardMaterial
              color="#d0e8f8"
              transparent
              opacity={0.3}
              roughness={0.1}
            />
          </mesh>
        )}

        {/* Luxurious Vertical Brass Handle Bar (Front) */}
        <group position={[panelWidth - 0.25, 0, 0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.2]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.5, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.5, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
        </group>

        {/* Luxurious Vertical Brass Handle Bar (Back) */}
        <group position={[panelWidth - 0.25, 0, -0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.2]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.5, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.5, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.08]} />
            <meshStandardMaterial color={handleColor} metalness={0.95} roughness={0.1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 3D Master Bathroom Toilet bowl, Flush tank, Seat
function ToiletFixture({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Flush Tank */}
      <mesh position={[0, 1.8, -0.45]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Flush Button */}
      <mesh position={[0, 2.41, -0.45]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bowl Base */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.35, 1.4, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Bowl Rim */}
      <mesh position={[0, 1.4, 0.1]} castShadow>
        <boxGeometry args={[0.9, 0.1, 1.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Seat Cover */}
      <mesh position={[0, 1.46, 0.1]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.85, 0.05, 1.05]} />
        <meshStandardMaterial color="#5a3d28" roughness={0.6} />
      </mesh>
    </group>
  );
}

// 3D Vanity (Cabinet, Sink, Faucet, Mirror)
function VanityFixture({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Cabinet Base */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 3.0, 2.0]} />
        <meshStandardMaterial color="#2c1a11" roughness={0.7} />
      </mesh>
      {/* Elegant Marble Countertop */}
      <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.1, 2.05]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.2} />
      </mesh>
      {/* Sink Basin */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[1.0, 0.02, 1.3]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Silver Chrome Faucet */}
      <group position={[-0.5, 3.3, 0]}>
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.2, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      {/* Luxurious Wall Mirror */}
      <mesh position={[-0.75, 5.0, 0]} castShadow>
        <boxGeometry args={[0.02, 2.2, 1.4]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.05} metalness={0.95} />
      </mesh>
    </group>
  );
}

// 3D Glass-Enclosed Walk-in Shower
function ShowerFixture({ position }) {
  return (
    <group position={position}>
      {/* Shower Tray Base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.1, 3.5]} />
        <meshStandardMaterial color="#dddddd" roughness={0.2} />
      </mesh>
      {/* Left Wall Tile overlay */}
      <mesh position={[-1.725, 5.0, 0]}>
        <boxGeometry args={[0.05, 10, 3.45]} />
        <meshStandardMaterial color="#b0c4de" roughness={0.4} />
      </mesh>
      {/* Top Wall Tile overlay */}
      <mesh position={[0, 5.0, -1.725]}>
        <boxGeometry args={[3.45, 10, 0.05]} />
        <meshStandardMaterial color="#b0c4de" roughness={0.4} />
      </mesh>

      {/* Glass Enclosures */}
      {/* Right Glass Panel */}
      <mesh position={[1.725, 4.5, 0]}>
        <boxGeometry args={[0.02, 9, 3.5]} />
        <meshPhysicalMaterial
          color="#d0e8f8"
          transparent
          opacity={0.2}
          roughness={0.05}
          transmission={0.9}
          ior={1.5}
        />
      </mesh>
      {/* Bottom Glass Panel */}
      <mesh position={[0.75, 4.5, 1.725]}>
        <boxGeometry args={[2.0, 9, 0.02]} />
        <meshPhysicalMaterial
          color="#d0e8f8"
          transparent
          opacity={0.2}
          roughness={0.05}
          transmission={0.9}
          ior={1.5}
        />
      </mesh>

      {/* Shower Chrome Pipe & Head */}
      <group position={[0, 8.0, -1.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.15, 0.15]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Single solar panel — optimized to 2 meshes
function SolarPanel({ position }) {
  return (
    <group position={position} rotation={[-0.25, 0, 0]}>
      {/* Panel frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.06, 1.6]} />
        <meshStandardMaterial color="#888888" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Dark PV cell surface */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[3.1, 0.01, 1.5]} />
        <meshStandardMaterial color="#0a1628" roughness={0.1} metalness={0.4} />
      </mesh>
    </group>
  );
}

// Solar panel array — rows and columns of panels
function SolarPanels() {
  // Main roof block (X=0→30, Z=0→26) — 4 rows x 7 columns
  const mainPanels = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      mainPanels.push([2 + col * 3.8, 10.2, 3 + row * 2.2]);
    }
  }
  // Master wing roof (X=30→38, Z=0→13) — 2 rows x 2 columns
  const wingPanels = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 2; col++) {
      wingPanels.push([31.5 + col * 3.8, 10.2, 2 + row * 2.2]);
    }
  }

  return (
    <group>
      {mainPanels.map(([x, y, z], i) => (
        <SolarPanel key={`m${i}`} position={[x, y, z]} />
      ))}
      {wingPanels.map(([x, y, z], i) => (
        <SolarPanel key={`w${i}`} position={[x, y, z]} />
      ))}
    </group>
  );
}

// Modern Flat Parapet Roof — clean, invisible from street level
function Roof() {
  const roofColor = "#2a2a2a";       // Dark concrete/membrane surface
  const parapetColor = "#f0ede8";    // Matches wall color — seamless parapet

  return (
    <group>
      {/* ── FLAT ROOF SLABS ── */}

      {/* Main block flat roof slab (X=0→30, Z=0→26) */}
      <mesh position={[15, 10.04, 13]} castShadow receiveShadow>
        <boxGeometry args={[30.5, 0.08, 26.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.95} />
      </mesh>

      {/* Master bedroom wing flat roof slab (X=30→38, Z=0→13) */}
      <mesh position={[34, 10.04, 6.5]} castShadow receiveShadow>
        <boxGeometry args={[8.5, 0.08, 13.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.95} />
      </mesh>

      {/* ── PARAPET WALLS (raised border that hides the roof) ── */}
      {/* These sit on top of the flat slab, ~1 unit tall, matching wall color */}

      {/* Main block — Front parapet (Z=26) */}
      <mesh position={[15, 10.3, 26.25]} castShadow>
        <boxGeometry args={[30.5, 0.5, 0.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Main block — Back parapet (Z=0) */}
      <mesh position={[15, 10.3, -0.25]} castShadow>
        <boxGeometry args={[30.5, 0.5, 0.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Main block — Left parapet (X=0) */}
      <mesh position={[-0.25, 10.3, 13]} castShadow>
        <boxGeometry args={[0.5, 0.5, 26.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Main block — Right parapet up to X=30, Z=0→26 but stopping at master wing */}
      <mesh position={[30.25, 10.3, 19.5]} castShadow>
        <boxGeometry args={[0.5, 0.5, 13]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>

      {/* Master wing — Right parapet (X=38) */}
      <mesh position={[38.25, 10.3, 6.5]} castShadow>
        <boxGeometry args={[0.5, 0.5, 13.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Master wing — Back parapet (Z=0, X=30→38) */}
      <mesh position={[34, 10.3, -0.25]} castShadow>
        <boxGeometry args={[8.5, 0.5, 0.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Master wing — Front parapet (Z=13, X=30→38) */}
      <mesh position={[34, 10.3, 13.25]} castShadow>
        <boxGeometry args={[8.5, 0.5, 0.5]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
      {/* Inner corner parapet fill (X=30, Z=13→26) */}
      <mesh position={[30.25, 10.3, 19.5]} castShadow>
        <boxGeometry args={[0.5, 0.5, 13]} />
        <meshStandardMaterial color={parapetColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Luxury Exterior Wall Lantern Sconce — optimized
function LuxuryWallLamp({ position, rotationY = 0 }) {
  const gold = "#b8960c";
  const darkGold = "#7a5c00";

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Mounting plate */}
      <mesh castShadow>
        <boxGeometry args={[0.28, 0.38, 0.05]} />
        <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Arm (single L-shape approximated by 2 cylinders) */}
      <mesh position={[0, -0.18, 0.12]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.36, 6]} />
        <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.36, 0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.32, 6]} />
        <meshStandardMaterial color={gold} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Lantern head — single box as body instead of 4 pillars + 4 panes */}
      <group position={[0, -0.6, 0.44]}>
        {/* Lantern cage body (semi-transparent single mesh) */}
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.65, 0.28]} />
          <meshStandardMaterial
            color="#fff8dc"
            transparent opacity={0.18}
            emissive="#ffcc44" emissiveIntensity={1.2}
            roughness={0.1}
          />
        </mesh>
        {/* Gold top pyramid cap */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <coneGeometry args={[0.16, 0.18, 4]} />
          <meshStandardMaterial color={darkGold} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Finial */}
        <mesh position={[0, 0.50, 0]}>
          <coneGeometry args={[0.02, 0.09, 5]} />
          <meshStandardMaterial color={gold} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Bottom cap */}
        <mesh position={[0, -0.36, 0]}>
          <cylinderGeometry args={[0.1, 0.04, 0.07, 7]} />
          <meshStandardMaterial color={darkGold} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Glowing bulb — no shadow */}
        <mesh>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#fff8dc" emissive="#ffcc44" emissiveIntensity={6} roughness={0.1} />
        </mesh>
        {/* Emissive glow only — individual point lights exceed GPU shader limits */}
      </group>
    </group>
  );
}

// Helper component to draw a single wall with cutouts (windows/doors)
function Wall({ start, end, height = 14, y = 0, thickness = 0.5, cutouts = [], color = "#f5f5f5", transparent = false, opacity = 1, isGlass = false }) {
  const shapeInfo = useMemo(() => {
    const dx = end[0] - start[0];
    const dz = end[1] - start[1];
    const length = Math.sqrt(dx * dx + dz * dz);

    const angle = Math.atan2(-dz, dx);

    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(length, 0);
    s.lineTo(length, height);
    s.lineTo(0, height);
    s.lineTo(0, 0);

    cutouts.forEach(cutout => {
      const h = new THREE.Path();
      h.moveTo(cutout.x, cutout.bottom);
      h.lineTo(cutout.x + cutout.width, cutout.bottom);
      h.lineTo(cutout.x + cutout.width, cutout.bottom + cutout.height);
      h.lineTo(cutout.x, cutout.bottom + cutout.height);
      h.lineTo(cutout.x, cutout.bottom);
      s.holes.push(h);
    });

    return { shape: s, angle };
  }, [start, end, height, cutouts]);

  const extrudeSettings = { depth: thickness, bevelEnabled: false };

  return (
    <group position={[start[0], y, start[1]]} rotation={[0, shapeInfo.angle, 0]}>
      {/* Wall Mesh */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shapeInfo.shape, extrudeSettings]} />
        {isGlass ? (
          <meshPhysicalMaterial
            color="#a3d8f8"
            transparent
            opacity={0.3}
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            thickness={0.1}
            ior={1.5}
          />
        ) : (
          <meshStandardMaterial color={color} roughness={0.9} transparent={transparent} opacity={opacity} />
        )}
      </mesh>

      {/* Render 3D objects in the cutout holes */}
      {cutouts.map((cutout, idx) => {
        const cx = cutout.x + cutout.width / 2;
        const cy = cutout.bottom + cutout.height / 2;
        const cz = thickness / 2;

        if (cutout.type === 'window') {
          return (
            <group key={idx} position={[cx, cy, cz]}>
              <Window3D width={cutout.width} height={cutout.height} thickness={thickness} />
            </group>
          );
        } else if (cutout.type === 'door') {
          return (
            <group key={idx} position={[cx, cy, cz]}>
              <Door3D width={cutout.width} height={cutout.height} thickness={thickness} isEntrance={cutout.isEntrance} flipSwing={cutout.flipSwing} />
            </group>
          );
        }
        return null;
      })}
    </group>
  );
}

export function HouseModel({ showRoof = false }) {

  // Coordinates Grid: X: 0, 6, 10, 20, 24, 25, 38 | Z: 0, 7, 10, 13, 16, 26

  const wallsData = [
    // --- TOP OUTER BOUNDARY (Z = 0) ---
    { start: [0, 0], end: [10, 0], cutouts: [{ x: 3.5, width: 3, bottom: 4, height: 5, type: 'window' }] }, // Top-Left Room Window
    { start: [10, 0], end: [20, 0], cutouts: [] }, // Kitchen (Solid Wall)
    { start: [20, 0], end: [25, 0], cutouts: [{ x: 1.5, width: 2, bottom: 5, height: 4, type: 'window' }] }, // Toilet (Top) Window
    { start: [25, 0], end: [38, 0], cutouts: [{ x: 5, width: 3, bottom: 4, height: 5, type: 'window' }] }, // Master Bedroom Window

    // --- LEFT OUTER BOUNDARY (X = 0) ---
    { start: [0, 10], end: [0, 0], cutouts: [{ x: 3.5, width: 3, bottom: 4, height: 5, type: 'window' }] }, // Top-Left Room Left Window
    { start: [0, 13], end: [0, 10], cutouts: [{ x: 0.5, width: 2, bottom: 5, height: 4, type: 'window' }] }, // Toilet 1 Left Window
    { start: [0, 16], end: [0, 13], cutouts: [{ x: 0.5, width: 2, bottom: 5, height: 4, type: 'window' }] }, // Toilet 2 Left Window
    { start: [0, 26], end: [0, 16], cutouts: [{ x: 3.5, width: 3, bottom: 4, height: 5, type: 'window' }] }, // Bottom-Left Room Left Window

    // --- BOTTOM OUTER BOUNDARY (Z = 26) ---
    { start: [10, 26], end: [0, 26], cutouts: [{ x: 2, width: 2, bottom: 4, height: 5, type: 'window' }, { x: 6, width: 2, bottom: 4, height: 5, type: 'window' }] }, // Bottom-Left Room Windows (2)
    {
      start: [24, 26],
      end: [10, 26],
      cutouts: [
        { x: 1.5, width: 2, bottom: 4, height: 5, type: 'window' },
        { x: 4.5, width: 2, bottom: 4, height: 5, type: 'window' },
        { x: 7.5, width: 2, bottom: 4, height: 5, type: 'window' },
        { x: 10.5, width: 2, bottom: 4, height: 5, type: 'window' }
      ]
    }, // Sitting Room Windows (4)
    { start: [30, 26], end: [24, 26], height: 3.5, color: "#cccccc" }, // Veranda low wall
    { start: [30, 26], end: [24, 26], height: 10.5, y: 3.5, isGlass: true }, // Veranda glass wall above low wall

    // --- RIGHT OUTER BOUNDARY ---
    { start: [38, 0], end: [38, 13], cutouts: [{ x: 2, width: 3, bottom: 4, height: 5, type: 'window' }, { x: 8, width: 3, bottom: 4, height: 5, type: 'window' }] }, // Master Bed Right Windows (2)
    { start: [30, 13], end: [38, 13], cutouts: [{ x: 5.5, width: 2, bottom: 4, height: 5, type: 'window' }] }, // Master Bed Bottom Outer Wall Window (1 window at corner, aligned)
    { start: [30, 13], end: [30, 26], cutouts: [{ x: 1.5, width: 3, bottom: 0, height: 9, type: 'door', isEntrance: true }] }, // Veranda right wall (Door to outside)

    // --- INNER VERTICAL WALLS ---
    { start: [10, 0], end: [10, 10], cutouts: [] }, // Top-Left Room / Kitchen (Solid Wall)
    { start: [10, 10], end: [10, 16], cutouts: [{ x: 3.5, width: 2.5, bottom: 0, height: 9, type: 'door' }] }, // Corridor → Sitting Room (Room 1 access)
    { start: [10, 16], end: [10, 26], cutouts: [] }, // Room 2 / Sitting Room (Solid Wall)
    { start: [6, 10], end: [6, 13], cutouts: [] }, // Toilet 1 / Lobby 1 (Solid Wall - no entrance)
    { start: [6, 13], end: [6, 16], cutouts: [] }, // Toilet 2 / Lobby 2 (Solid Wall - no entrance)
    { start: [0, 13], end: [6, 13], cutouts: [] }, // Toilet divider — splits Toilet 1 (Room 1) from Toilet 2 (Room 2)

    { start: [20, 0], end: [20, 7], cutouts: [] }, // Kitchen / Toilet (Top)
    { start: [20, 7], end: [20, 13], cutouts: [{ x: 2, width: 3, bottom: 0, height: 9, type: 'door' }] }, // Kitchen / Lobby (Door)
    { start: [24, 13], end: [24, 26], cutouts: [{ x: 1.5, width: 2, bottom: 4, height: 5, type: 'window' }, { x: 5, width: 2, bottom: 4, height: 5, type: 'window' }, { x: 9.5, width: 3, bottom: 0, height: 9, type: 'door', isEntrance: true }] }, // Sitting Room / Veranda Windows (2) + Door
    { start: [25, 0], end: [25, 7], cutouts: [{ x: 2, width: 3, bottom: 0, height: 9, type: 'door' }] }, // Toilet / Master Bed (En-suite Door)
    { start: [25, 7], end: [25, 13], cutouts: [{ x: 1.5, width: 3, bottom: 0, height: 9, type: 'door' }] }, // Lobby / Master Bed (Door)

    // --- INNER HORIZONTAL WALLS ---
    {
      start: [0, 10], end: [10, 10], cutouts: [
        { x: 1.5, width: 2.5, bottom: 0, height: 9, type: 'door', flipSwing: false }, // Room 1 → Toilet
        { x: 6.5, width: 2.5, bottom: 0, height: 9, type: 'door', flipSwing: false }  // Room 1 → Corridor
      ]
    },
    {
      start: [0, 16], end: [10, 16], cutouts: [
        { x: 1.5, width: 2.5, bottom: 0, height: 9, type: 'door', flipSwing: true }, // Room 2 → Toilet
        { x: 6.5, width: 2.5, bottom: 0, height: 9, type: 'door', flipSwing: true }  // Room 2 → Corridor
      ]
    },

    { start: [10, 13], end: [20, 13], cutouts: [] }, // Kitchen / Sitting Room (Solid Wall)
    { start: [20, 7], end: [25, 7], cutouts: [] }, // Toilet / Lobby (Solid Wall)
    { start: [20, 13], end: [25, 13], cutouts: [{ x: 1, width: 3, bottom: 0, height: 9, type: 'door', isEntrance: true }] }, // Lobby / Veranda (Door to outside)
    { start: [25, 13], end: [30, 13], cutouts: [] }, // Master Bed bottom wall facing Veranda (Solid Wall)
  ];

  return (
    <group position={[-19, 0, -13]}> {/* Center the 38x26 house footprint */}

      {/* Floor */}
      <mesh position={[19, 0, 13]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 32]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} /> {/* Wooden floor color */}
      </mesh>

      {/* Render all walls */}
      {wallsData.map((data, index) => (
        <Wall key={index} {...data} />
      ))}

      {/* Kitchen Counter (3ft deep, 5ft wide, 3ft high) */}
      <mesh position={[12.5, 1.5, 2.0]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 3]} />
        <meshStandardMaterial color="#dddddd" roughness={0.5} />
      </mesh>

      {/* Master Bathroom (En-Suite) Fixtures */}
      <ShowerFixture position={[21.75, 0, 2.25]} />
      <ToiletFixture position={[23.8, 0, 1.25]} rotation={[0, 0, 0]} />
      <VanityFixture position={[20.78, 0, 5.0]} rotation={[0, 0, 0]} />

      {/* Render Roof + Solar Panels when toggled on */}
      {showRoof && <>
        <Roof />
        <SolarPanels />
      </>}

      {/* ── LUXURY EXTERIOR WALL LANTERNS ── */}
      {/* Bottom-left room — outside front wall (Z=26, X=0→10) — 1 lamp */}
      <LuxuryWallLamp position={[5, 12, 26.6]} rotationY={Math.PI} />
      {/* Sitting room — outside front wall (Z=26, X=10→24) — 2 lamps between windows */}
      {[14, 21].map((x, i) => (
        <LuxuryWallLamp key={`fs${i}`} position={[x, 12, 26.6]} rotationY={Math.PI} />
      ))}
      {/* Back wall (Z=0, X=0→38) — 4 lamps */}
      {[5, 15, 25, 35].map((x, i) => (
        <LuxuryWallLamp key={`b${i}`} position={[x, 12, -0.3]} rotationY={0} />
      ))}
      {/* Left wall (X=0, Z=0→26) — 3 lamps */}
      {[5, 13, 21].map((z, i) => (
        <LuxuryWallLamp key={`l${i}`} position={[-0.3, 12, z]} rotationY={-Math.PI / 2} />
      ))}
      {/* Right wall (X=38, Z=0→13) — 2 lamps */}
      {[4, 10].map((z, i) => (
        <LuxuryWallLamp key={`r${i}`} position={[38.3, 12, z]} rotationY={Math.PI / 2} />
      ))}
      {/* Master bedroom bottom wall (Z=13, X=30→38) — 2 lamps */}
      {[32, 36].map((x, i) => (
        <LuxuryWallLamp key={`mb${i}`} position={[x, 12, 13.3]} rotationY={Math.PI} />
      ))}
      {/* Veranda right wall (X=30, Z=13→26) — 2 lamps */}
      {[17, 23].map((z, i) => (
        <LuxuryWallLamp key={`v${i}`} position={[30.3, 12, z]} rotationY={Math.PI / 2} />
      ))}

      {/* ── 6 STRATEGIC PERIMETER POINT LIGHTS (within GPU limit) ── */}
      {/* These illuminate the exterior walls — lamps glow visually via emissive */}
      <pointLight position={[5, 11, 28]} intensity={30} distance={22} decay={2} color="#ffcc44" /> {/* Front-left */}
      <pointLight position={[20, 11, 28]} intensity={30} distance={22} decay={2} color="#ffcc44" /> {/* Front-right */}
      <pointLight position={[-3, 10, 10]} intensity={25} distance={20} decay={2} color="#ffcc44" /> {/* Left wall */}
      <pointLight position={[-3, 10, 22]} intensity={25} distance={20} decay={2} color="#ffcc44" /> {/* Left wall bottom */}
      <pointLight position={[40, 10, 6]} intensity={25} distance={20} decay={2} color="#ffcc44" /> {/* Right wall */}
      <pointLight position={[20, 10, -3]} intensity={25} distance={20} decay={2} color="#ffcc44" /> {/* Back wall */}
    </group>
  );
}
