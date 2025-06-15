import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder, Plane } from '@react-three/drei';
import * as THREE from 'three';
import DartboardCore from './DartboardCore';

interface DartAiming3DProps {
  onThrow: (horizontalPosition: number, verticalPosition: number) => void;
  disabled: boolean;
}

// -------- DartArrow COMPONENT --------
const DartArrow = ({
  position,
  rotation,
  isThrown,
  target,
  onArrive,
}: {
  position: { x: number; y: number; z: number };
  rotation: number;
  isThrown: boolean;
  target: { x: number; y: number; z: number };
  onArrive: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hasArrived, setHasArrived] = useState(false);

  useFrame(() => {
    if (groupRef.current && isThrown && !hasArrived) {
      const cur = groupRef.current.position;
      const tar = new THREE.Vector3(target.x, target.y, target.z);
      cur.lerp(tar, 0.17);
      if (cur.distanceTo(tar) < 0.05 && !hasArrived) {
        setHasArrived(true);
        if (onArrive) onArrive();
      }
    }
  });

  // Only standard props passed to primitives!
  return (
    <group
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[Math.PI / 2, 0, rotation]}
    >
      {/* Tip */}
      <Cylinder args={[0.02, 0.05, 0.3, 12]} position={[0, 0, 0.15]}>
        <meshStandardMaterial color="#C0C0C0" />
      </Cylinder>
      {/* Shaft */}
      <Cylinder args={[0.05, 0.05, 0.8, 12]} position={[0, 0, -0.4]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      {/* Flights */}
      <Plane args={[0.3, 0.4]} position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#FF0000" side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[0.3, 0.4]} position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#FF0000" side={THREE.DoubleSide} />
      </Plane>
    </group>
  );
};

// -------- DartboardMesh3D --------
const DartboardMesh3D = () => {
  return (
    <group>
      <DartboardCore />
    </group>
  );
};

// -------- Clamp --------
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// -------- MAIN COMPONENT --------
const DartAiming3D: React.FC<DartAiming3DProps> = ({ onThrow, disabled }) => {
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  const [pull, setPull] = useState(0); // 0 to 1
  const [aim, setAim] = useState(0.5); // 0 (left), 1 (right), 0.5 (center)
  const [dartReleased, setDartReleased] = useState(false);

  const [dartProps, setDartProps] = useState({
    position: { x: 0, y: -6, z: 0 },
    rotation: 0,
    isThrown: false,
    target: { x: 0, y: 0, z: 0.5 }
  });

  const overlayRef = useRef<HTMLDivElement>(null);

  // Mouse/touch events
  function getEventPosition(e: any) {
    if (e.touches && e.touches[0])
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || dartReleased) return;
    setDragging(true);
    setDragOrigin(getEventPosition(e));
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || !dragging || !dragOrigin) return;
    const { x, y } = getEventPosition(e);
    const dx = x - dragOrigin.x;
    const dy = y - dragOrigin.y;
    setAim(clamp(0.5 + dx / 300, 0, 1));
    setPull(clamp(dy / 200, 0, 1));
  };

  const handlePointerUp = () => {
    if (disabled || !dragging) return;
    setDragging(false);
    setDartReleased(true);
    // Board coords (percentages)
    const horizontal = clamp(aim, 0, 1) * 90 + 5; // range 5..95
    const vertical = (1 - clamp(pull, 0, 1)) * 90 + 5; // range 5..95
    const tx = ((horizontal - 50) / 50) * 4;
    const ty = ((50 - vertical) / 50) * 4;
    setDartProps({
      position: { x: (aim - 0.5) * 4, y: -6, z: 0 },
      rotation: (aim - 0.5) * 0.6,
      isThrown: true,
      target: { x: tx, y: ty, z: 0.5 }
    });
  };

  // Call onThrow ONCE when dart arrives
  const handleDartArrive = () => {
    const horizontal = clamp(aim, 0, 1) * 90 + 5;
    const vertical = (1 - clamp(pull, 0, 1)) * 90 + 5;
    setTimeout(() => {
      onThrow(horizontal, vertical);
    }, 400);
  };

  // Reset dart for new throws
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
        <Canvas>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} />
          <DartboardMesh3D />
          <DartArrow
            position={dartProps.position}
            rotation={dartProps.rotation}
            isThrown={dartProps.isThrown}
            target={dartProps.target}
            onArrive={handleDartArrive}
          />
        </Canvas>
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
    </div>
  );
};

export default DartAiming3D;
