
import React from 'react';
import { Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const DartboardCore = () => {
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

            {/* Numbers */}
            <group position={[Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0.15]}>
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

export default DartboardCore;
