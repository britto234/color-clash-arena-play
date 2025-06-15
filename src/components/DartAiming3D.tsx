import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import * as THREE from 'three';

interface DartAiming3DProps {
  onThrow: (horizontalPosition: number, verticalPosition: number) => void;
  disabled: boolean;
}

const DartArrow = ({
  position,
  rotation,
  isThrown,
  target,
  onArrive
}: {
  position: { x: number; y: number; z: number },
  rotation: number,
  isThrown: boolean,
  target: { x: number; y: number; z: number },
  onArrive: () => void
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hasArrived, setHasArrived] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current && isThrown && !hasArrived) {
      // Move position toward target
      const cur = groupRef.current.position;
      const tar = new THREE.Vector3(target.x, target.y, target.z);
      cur.lerp(tar, 0.2);
      // On arrival
      if (cur.distanceTo(tar) < 0.06 && !hasArrived) {
        setHasArrived(true);
        onArrive();
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[Math.PI / 2, 0, rotation]}
    >
      {/* Tip */}
      <Cylinder args={[0.02, 0.05, 0.3]} position={[0, 0, 0.15]}>
        <meshStandardMaterial color="#C0C0C0" />
      </Cylinder>
      {/* Shaft */}
      <Cylinder args={[0.05, 0.05, 0.8]} position={[0, 0, -0.4]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      {/* Flights */}
      <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color="#FF0000" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color="#FF0000" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

const DartboardMesh3D = () => (
  <group>
    {/* Main dartboard base */}
    <Cylinder args={[4, 4, 0.2, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#8B4513" />
    </Cylinder>

    {/* Dartboard face */}
    <Cylinder args={[3.8, 3.8, 0.05, 32]} position={[0, 0, 0.1]}>
      <meshStandardMaterial color="#2C1810" />
    </Cylinder>

    {/* Scoring rings and segments */}
    {Array.from({ length: 20 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 20;
      const isRed = i % 2 === 0;
      return (
        <group key={i}>
          {/* Outer segments */}
          <mesh position={[Math.cos(angle) * 3, Math.sin(angle) * 3, 0.12]} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.6, 1.5]} />
            <meshStandardMaterial color={isRed ? "#DC143C" : "#000000"} />
          </mesh>
          
          {/* Double ring */}
          <mesh position={[Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0.13]} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.3, 1.2]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>

          {/* Triple ring */}
          <mesh position={[Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0.13]} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.3, 1.2]} />
            <meshStandardMaterial color="#32CD32" />
          </mesh>

          {/* Numbers */}
          <Text
            position={[Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0.15]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5][i]}
          </Text>
        </group>
      );
    })}

    {/* Bull rings */}
    <Cylinder args={[0.8, 0.8, 0.05, 16]} position={[0, 0, 0.14]}>
      <meshStandardMaterial color="#32CD32" />
    </Cylinder>

    <Cylinder args={[0.4, 0.4, 0.06, 16]} position={[0, 0, 0.15]}>
      <meshStandardMaterial color="#DC143C" />
    </Cylinder>

    {/* Bull's eye labels */}
    <Text position={[0, -0.6, 0.16]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
      25
    </Text>
    <Text position={[0, 0, 0.16]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
      50
    </Text>
  </group>
);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const DartAiming3D: React.FC<DartAiming3DProps> = ({ onThrow, disabled }) => {
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  const [pull, setPull] = useState(0); // 0 to 1
  const [aim, setAim] = useState(0.5); // 0 left, 1 right, 0.5 center
  const [dartReleased, setDartReleased] = useState(false);

  // For dart animation (3d board coordinates)
  const [dartProps, setDartProps] = useState({
    position: { x: 0, y: -6, z: 0 },
    rotation: 0,
    isThrown: false,
    target: { x: 0, y: 0, z: 0.5 }
  });

  // Use for touch or mouse
  const overlayRef = useRef<HTMLDivElement>(null);

  // Mouse/touch handling
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || dartReleased) return;
    setDragging(true);
    setDragOrigin(getEventPosition(e));
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !dragging || !dragOrigin) return;
    const { x, y } = getEventPosition(e);
    // Horizontal movement [-150, +150]px → aim from 0(left) to 1(right)
    // Vertical movement [0, +200]px (pulling down) → power from 0 to 1
    const dx = x - dragOrigin.x;
    const dy = y - dragOrigin.y;
    setAim(clamp(0.5 + dx / 300, 0, 1));
    setPull(clamp(dy / 200, 0, 1));
  };

  const handlePointerUp = () => {
    if (disabled || !dragging) return;
    setDragging(false);
    setDartReleased(true);

    // BOARD COORDS (map to board percentage 0..100)
    const horizontal = clamp(aim, 0, 1) * 90 + 5; // 5..95
    const vertical = (1 - clamp(pull, 0, 1)) * 90 + 5; // 5..95
    // BOARD PHYSICAL (centered = 0)
    const tx = ((horizontal - 50) / 50) * 4;
    const ty = ((50 - vertical) / 50) * 4;

    setDartProps({
      position: { x: (aim - 0.5) * 4, y: -6, z: 0 },
      rotation: (aim - 0.5) * 0.6,
      isThrown: true,
      target: { x: tx, y: ty, z: 0.5 }
    });
  };

  // Call onThrow once the dart has arrived
  const handleDartArrive = () => {
    const horizontal = clamp(aim, 0, 1) * 90 + 5; // 5..95
    const vertical = (1 - clamp(pull, 0, 1)) * 90 + 5; // 5..95
    setTimeout(() => {
      onThrow(horizontal, vertical);
    }, 400);
  };

  // Reset allow new throw if needed (optionally could show a button)
  useEffect(() => {
    if (!dartReleased && !dragging) {
      setPull(0);
      setAim(0.5);
      setDartProps({
        position: { x: 0, y: -6, z: 0 },
        rotation: 0,
        isThrown: false,
        target: { x: 0, y: 0, z: 0.5 }
      });
    }
  }, [dartReleased, dragging]);

  // For mobile/touch and mouse
  function getEventPosition(e: any) {
    if (e.touches && e.touches[0])
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  // Overlay event binding
  useEffect(() => {
    const ref = overlayRef.current;
    if (!ref) return;

    const move = (e: any) => handlePointerMove(e);
    const up = () => handlePointerUp();

    if (dragging) {
      ref.addEventListener('mousemove', move);
      ref.addEventListener('touchmove', move, { passive: false });
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    }
    return () => {
      ref.removeEventListener('mousemove', move);
      ref.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [dragging, dragOrigin, aim, pull]);

  return (
    <div className="relative flex flex-col items-center space-y-4">
      <div className="w-96 h-96 rounded-lg overflow-hidden shadow-2xl bg-slate-900 relative select-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} />
          <DartboardMesh3D />
          {/* Dart */}
          <DartArrow
            position={dartProps.position}
            rotation={dartProps.rotation}
            isThrown={dartProps.isThrown}
            target={dartProps.target}
            onArrive={handleDartArrive}
          />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
        {/* AIM overlay (handle all events!) */}
        {!dartReleased && (
          <div
            ref={overlayRef}
            className="absolute inset-0 cursor-pointer"
            style={{
              zIndex: 10,
              background: 'rgba(0,0,0,0.02)'
            }}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          />
        )}
      </div>
      {/* Aim UI */}
      <div className="text-center space-y-2">
        {!dartReleased ? (
          <>
            <p className="text-white font-bold text-lg">
              Pull and Aim!
            </p>
            <p className="text-white text-sm">Drag down to pull back, drag left/right to aim. Release to throw.</p>
            <div className="flex flex-col items-center mt-2">
              <div className="w-64 bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${pull * 100}%` }}
                />
              </div>
              <span className="text-xs text-yellow-200">Power: {(pull * 100).toFixed(0)}%</span>
              <span className="text-xs text-blue-200">Aim: {((aim - 0.5) * 100).toFixed(0)} (L/R)</span>
            </div>
          </>
        ) : (
          <p className="text-green-400 font-bold">Dart thrown! 🎯</p>
        )}
      </div>
      {/* Optional: Reset for next throw (if needed) */}
      {/* ... */}
    </div>
  );
};

export default DartAiming3D;
