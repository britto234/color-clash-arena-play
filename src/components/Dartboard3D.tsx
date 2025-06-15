import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import DartAiming3D from './DartAiming3D';

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
      {/* Main dartboard base */}
      <Cylinder args={[4, 4, 0.2, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>

      {/* Dartboard face */}
      <Cylinder args={[3.8, 3.8, 0.05, 32]} position={[0, 0, 0.1]}>
        <meshStandardMaterial color="#2C1810" />
      </Cylinder>

      {/* Scoring rings */}
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

            {/* Numbers - wrap Text in a group for rotation if needed */}
            <group position={[Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0.15]} rotation={[0, 0, 0]}>
              <Text
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5][i].toString()}
              </Text>
            </group>
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

      {/* Bull's eye text */}
      <group position={[0, -0.6, 0.16]}>
        <Text
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {"25"}
        </Text>
      </group>
      <group position={[0, 0, 0.16]}>
        <Text
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {"50"}
        </Text>
      </group>
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
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
          />
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
