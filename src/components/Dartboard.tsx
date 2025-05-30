
import React, { useState } from 'react';
import DartAiming from './DartAiming';

interface DartboardProps {
  onScore: (points: number) => void;
  disabled: boolean;
}

const Dartboard: React.FC<DartboardProps> = ({ onScore, disabled }) => {
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
    return <DartAiming onThrow={handleThrow} disabled={disabled} />;
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Enhanced Dartboard */}
      <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 p-3 shadow-2xl">
        <div className="w-full h-full rounded-full bg-black relative overflow-hidden shadow-inner">
          {/* Dartboard segments with alternating colors */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center shadow-2xl">
            {/* Segment pattern */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {Array.from({ length: 20 }, (_, i) => {
                const angle = i * 18;
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`absolute w-full h-full origin-center ${isEven ? 'bg-black/20' : 'bg-white/10'}`}
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: 'polygon(50% 50%, 50% 0%, 59.4% 0%)',
                    }}
                  />
                );
              })}
            </div>

            {/* Double ring */}
            <div className="absolute inset-6 rounded-full border-4 border-yellow-400/70 shadow-lg">
              {/* Triple ring */}
              <div className="absolute inset-8 rounded-full border-4 border-green-400/70 shadow-lg">
                {/* Inner scoring area */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg flex items-center justify-center">
                  {/* Bull ring - properly centered */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative shadow-xl">
                    <div className="absolute text-white font-bold text-sm -top-6 bg-black/60 rounded-full px-2 py-1 shadow-lg">25</div>
                    {/* Bull's eye - properly centered */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl border-2 border-yellow-400/50">
                      <span className="text-white font-bold text-xs drop-shadow-lg">50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced numbers around the dartboard */}
            <div className="absolute inset-0 rounded-full">
              {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map((number, index) => {
                const angle = (index * 18) - 90;
                const radius = 120;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div
                    key={number}
                    className="absolute text-white font-bold text-lg bg-gradient-to-r from-black/80 to-black/60 rounded-lg px-2 py-1 shadow-xl border border-white/20"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {number}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Decorative rings */}
          {[0, 1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border-2 border-white/20 shadow-lg"
              style={{
                top: `${10 + ring * 15}%`,
                left: `${10 + ring * 15}%`,
                right: `${10 + ring * 15}%`,
                bottom: `${10 + ring * 15}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Aiming Mode Button */}
      <button
        onClick={() => setShowAiming(true)}
        disabled={disabled}
        className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 active:scale-95 border-2 border-white/20"
      >
        <span className="text-2xl mr-2">🎯</span>
        <span className="text-lg">AIM & THROW</span>
      </button>
    </div>
  );
};

export default Dartboard;
