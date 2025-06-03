
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Cylinder } from '@react-three/drei';
import { Button } from "@/components/ui/button";
import * as THREE from 'three';

interface DartAiming3DProps {
  onThrow: (horizontalPosition: number, verticalPosition: number) => void;
  disabled: boolean;
}

const DartArrow = ({ position, isThrown, targetPosition }: { 
  position: { x: number; y: number; z: number }, 
  isThrown: boolean,
  targetPosition: { x: number; y: number; z: number }
}) => {
  const dartRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (dartRef.current && isThrown) {
      // Animate dart throw
      dartRef.current.position.lerp(new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z), 0.1);
      dartRef.current.rotation.x = Math.PI / 2;
    }
  });

  return (
    <group ref={dartRef} position={[position.x, position.y, position.z]}>
      {/* Dart tip */}
      <Cylinder args={[0.02, 0.05, 0.3, 8]} position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#C0C0C0" />
      </Cylinder>
      
      {/* Dart shaft */}
      <Cylinder args={[0.05, 0.05, 0.8, 8]} position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Cylinder>
      
      {/* Dart flights */}
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

const DartboardMesh3D = () => {
  return (
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
      <Text position={[0, -0.6, 0.16]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">25</Text>
      <Text position={[0, 0, 0.16]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">50</Text>
    </group>
  );
};

const Crosshairs = ({ horizontalPos, verticalPos }: { horizontalPos: number, verticalPos: number }) => {
  const x = ((horizontalPos - 50) / 50) * 4;
  const y = ((50 - verticalPos) / 50) * 4;

  return (
    <group>
      {/* Horizontal line */}
      <mesh position={[0, y, 0.5]}>
        <planeGeometry args={[8, 0.05]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Vertical line */}
      <mesh position={[x, 0, 0.5]}>
        <planeGeometry args={[0.05, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Center dot */}
      <mesh position={[x, y, 0.5]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const DartAiming3D: React.FC<DartAiming3DProps> = ({ onThrow, disabled }) => {
  const [aimingPhase, setAimingPhase] = useState<'horizontal' | 'vertical' | 'throwing'>('horizontal');
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [isMoving, setIsMoving] = useState(true);
  const [direction, setDirection] = useState({ horizontal: 1, vertical: 1 });
  const [dartPosition, setDartPosition] = useState({ x: 0, y: -6, z: 0 });
  const [isThrown, setIsThrown] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, z: 0.5 });

  // Increased speed for more difficulty
  const AIMING_SPEED = 3.5; // Increased from 1.5 to 3.5
  const UPDATE_INTERVAL = 30; // Decreased from 50 to 30ms for smoother movement

  useEffect(() => {
    if (!isMoving || disabled) return;

    const interval = setInterval(() => {
      if (aimingPhase === 'horizontal') {
        setHorizontalPosition(prev => {
          let newPos = prev + (direction.horizontal * AIMING_SPEED);
          if (newPos >= 95 || newPos <= 5) {
            setDirection(d => ({ ...d, horizontal: -d.horizontal }));
            newPos = Math.max(5, Math.min(95, newPos));
          }
          return newPos;
        });
      } else if (aimingPhase === 'vertical') {
        setVerticalPosition(prev => {
          let newPos = prev + (direction.vertical * AIMING_SPEED);
          if (newPos >= 95 || newPos <= 5) {
            setDirection(d => ({ ...d, vertical: -d.vertical }));
            newPos = Math.max(5, Math.min(95, newPos));
          }
          return newPos;
        });
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [aimingPhase, isMoving, disabled, direction]);

  const handleClick = () => {
    if (disabled) return;

    if (aimingPhase === 'horizontal') {
      setIsMoving(false);
      setTimeout(() => {
        setAimingPhase('vertical');
        setIsMoving(true);
      }, 200);
    } else if (aimingPhase === 'vertical') {
      setIsMoving(false);
      setAimingPhase('throwing');
      
      const targetX = ((horizontalPosition - 50) / 50) * 4;
      const targetY = ((50 - verticalPosition) / 50) * 4;
      setTargetPosition({ x: targetX, y: targetY, z: 0.5 });
      setIsThrown(true);
      
      setTimeout(() => {
        onThrow(horizontalPosition, verticalPosition);
      }, 1000);
    }
  };

  const getPhaseText = () => {
    switch (aimingPhase) {
      case 'horizontal': return 'Click to lock horizontal aim (FAST!)';
      case 'vertical': return 'Click to lock vertical aim (FAST!)';
      case 'throwing': return 'Throwing dart...';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-96 h-96 rounded-lg overflow-hidden shadow-2xl bg-slate-900">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} />
          
          <DartboardMesh3D />
          <Crosshairs horizontalPos={horizontalPosition} verticalPos={verticalPosition} />
          <DartArrow 
            position={dartPosition} 
            isThrown={isThrown} 
            targetPosition={targetPosition}
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={false}
          />
        </Canvas>
      </div>

      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-lg">{getPhaseText()}</p>
        <div className="flex space-x-2">
          <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${aimingPhase === 'horizontal' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>
            H: {horizontalPosition.toFixed(0)}%
          </div>
          <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${aimingPhase === 'vertical' ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-600 text-gray-300'}`}>
            V: {verticalPosition.toFixed(0)}%
          </div>
        </div>
        <div className="text-yellow-400 font-bold text-sm">
          DIFFICULTY: HIGH SPEED ⚡
        </div>
      </div>

      <Button
        onClick={handleClick}
        disabled={disabled || aimingPhase === 'throwing'}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {aimingPhase === 'throwing' ? 'Throwing...' : 'AIM (FAST!)'}
      </Button>
    </div>
  );
};

export default DartAiming3D;
