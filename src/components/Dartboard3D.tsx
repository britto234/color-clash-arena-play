
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import DartAiming3D from './DartAiming3D';
import DartboardCore from './DartboardCore';

interface Dartboard3DProps {
  onScore: (points: number) => void;
  disabled: boolean;
}

const DartboardMesh = () => {
  const dartboardRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (dartboardRef.current) {
      dartboardRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={dartboardRef}>
      <DartboardCore />
    </group>
  );
};

const Dartboard3D: React.FC<Dartboard3DProps> = ({ onScore, disabled }) => {
  const [showAiming, setShowAiming] = useState(false);

  const calculateScore = (horizontalPos: number, verticalPos: number) => {
    const centerX = 50;
    const centerY = 50;
    const distanceFromCenter = Math.sqrt(
      Math.pow(horizontalPos - centerX, 2) + Math.pow(verticalPos - centerY, 2)
    );

    if (distanceFromCenter <= 8) {
      return 50; // Bull's eye
    } else if (distanceFromCenter <= 12) {
      return 25; // Inner bull
    } else if (distanceFromCenter <= 20) {
      return 20; // High score zone
    } else if (distanceFromCenter <= 30) {
      return 15; // Medium score zone
    } else if (distanceFromCenter <= 40) {
      return 10; // Low score zone
    } else if (distanceFromCenter <= 45) {
      return 5; // Edge zone
    } else {
      return 0; // Miss
    }
  };

  const handleThrow = (horizontalPos: number, verticalPos: number) => {
    const points = calculateScore(horizontalPos, verticalPos);
    onScore(points);
    setShowAiming(false);
  };

  if (showAiming) {
    return <DartAiming3D onThrow={handleThrow} disabled={disabled} />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-96 h-96 rounded-lg overflow-hidden shadow-2xl">
        <Canvas>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} />
          
          <DartboardMesh />
          
          {/* <OrbitControls 
            enableZoom={false} 
            enablePan={false}
          /> */}
        </Canvas>
      </div>

      <button
        onClick={() => setShowAiming(true)}
        disabled={disabled}
        className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        <span className="text-2xl mr-2">🎯</span>
        <span className="text-lg">AIM & THROW 3D</span>
      </button>
    </div>
  );
};

export default Dartboard3D;
