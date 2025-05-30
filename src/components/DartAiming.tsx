
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface DartAimingProps {
  onThrow: (horizontalPosition: number, verticalPosition: number) => void;
  disabled: boolean;
}

const DartAiming: React.FC<DartAimingProps> = ({ onThrow, disabled }) => {
  const [aimingPhase, setAimingPhase] = useState<'horizontal' | 'vertical' | 'throwing' | 'ready'>('horizontal');
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [isMoving, setIsMoving] = useState(true);
  const [direction, setDirection] = useState({ horizontal: 1, vertical: 1 });
  const [dartPosition, setDartPosition] = useState({ x: 50, y: 90 });
  const [isThrown, setIsThrown] = useState(false);

  useEffect(() => {
    if (!isMoving || disabled) return;

    const interval = setInterval(() => {
      if (aimingPhase === 'horizontal') {
        setHorizontalPosition(prev => {
          let newPos = prev + (direction.horizontal * 1.5);
          if (newPos >= 95 || newPos <= 5) {
            setDirection(d => ({ ...d, horizontal: -d.horizontal }));
            newPos = Math.max(5, Math.min(95, newPos));
          }
          return newPos;
        });
      } else if (aimingPhase === 'vertical') {
        setVerticalPosition(prev => {
          let newPos = prev + (direction.vertical * 1.5);
          if (newPos >= 95 || newPos <= 5) {
            setDirection(d => ({ ...d, vertical: -d.vertical }));
            newPos = Math.max(5, Math.min(95, newPos));
          }
          return newPos;
        });
      }
    }, 50);

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
      
      // Animate dart throw
      setIsThrown(true);
      const startX = 50;
      const startY = 90;
      const endX = horizontalPosition;
      const endY = verticalPosition;
      
      let progress = 0;
      const throwInterval = setInterval(() => {
        progress += 0.05;
        if (progress >= 1) {
          clearInterval(throwInterval);
          setTimeout(() => {
            onThrow(horizontalPosition, verticalPosition);
            resetAiming();
          }, 200);
        } else {
          setDartPosition({
            x: startX + (endX - startX) * progress,
            y: startY + (endY - startY) * progress
          });
        }
      }, 20);
    }
  };

  const resetAiming = () => {
    setAimingPhase('horizontal');
    setHorizontalPosition(50);
    setVerticalPosition(50);
    setIsMoving(true);
    setDirection({ horizontal: 1, vertical: 1 });
    setDartPosition({ x: 50, y: 90 });
    setIsThrown(false);
  };

  const getPhaseText = () => {
    switch (aimingPhase) {
      case 'horizontal': return 'Click to lock horizontal aim';
      case 'vertical': return 'Click to lock vertical aim';
      case 'throwing': return 'Throwing dart...';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-80 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-4 border-white/20 overflow-hidden">
        {/* Enhanced Dartboard background */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center shadow-2xl">
          {/* Dartboard segments with alternating colors */}
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
          <div className="absolute inset-6 rounded-full border-4 border-yellow-400/50">
            {/* Triple ring */}
            <div className="absolute inset-8 rounded-full border-4 border-green-400/50">
              {/* Inner scoring area */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                {/* Bull ring - properly centered */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative shadow-lg">
                  <div className="absolute text-white font-bold text-sm -top-5 bg-black/50 rounded px-1">25</div>
                  {/* Bull's eye - properly centered */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xs">50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Numbers around the dartboard */}
          <div className="absolute inset-0 rounded-full">
            {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map((number, index) => {
              const angle = (index * 18) - 90;
              const radius = 130;
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <div
                  key={number}
                  className="absolute text-white font-bold text-lg bg-black/70 rounded px-2 py-1 shadow-lg"
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

        {/* Crosshairs */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-full h-0.5 bg-yellow-400 shadow-lg transition-all duration-100"
            style={{ top: `${verticalPosition}%` }}
          />
          <div 
            className="absolute h-full w-0.5 bg-yellow-400 shadow-lg transition-all duration-100"
            style={{ left: `${horizontalPosition}%` }}
          />
          <div 
            className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg transition-all duration-100 -translate-x-1.5 -translate-y-1.5"
            style={{ 
              left: `${horizontalPosition}%`, 
              top: `${verticalPosition}%` 
            }}
          />
        </div>

        {/* Thicker Dart Arrow */}
        <div 
          className={`absolute transition-all duration-300 ${isThrown ? 'z-20' : 'z-10'}`}
          style={{ 
            left: `${dartPosition.x}%`, 
            top: `${dartPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            {/* Thicker dart shaft */}
            <div className="w-2 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 mx-auto rounded-sm shadow-lg"></div>
            {/* Thicker dart point */}
            <div className="w-1 h-6 bg-gradient-to-t from-gray-400 to-gray-200 mx-auto -mt-1 shadow-md"></div>
            {/* Enhanced dart flights */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-3 h-4 bg-gradient-to-r from-red-500 to-red-600 transform rotate-12 shadow-lg"></div>
                <div className="w-3 h-4 bg-gradient-to-r from-red-500 to-red-600 transform -rotate-12 shadow-lg"></div>
              </div>
            </div>
            {/* Dart grip */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-t from-gray-600 to-gray-400 rounded-sm shadow-inner"></div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="absolute top-2 left-2">
          <div className={`w-3 h-3 rounded-full ${aimingPhase === 'horizontal' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${aimingPhase === 'vertical' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-lg">{getPhaseText()}</p>
        <div className="flex space-x-2">
          <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${aimingPhase === 'horizontal' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
            H: {horizontalPosition.toFixed(0)}%
          </div>
          <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${aimingPhase === 'vertical' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
            V: {verticalPosition.toFixed(0)}%
          </div>
        </div>
      </div>

      <Button
        onClick={handleClick}
        disabled={disabled || aimingPhase === 'throwing'}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {aimingPhase === 'throwing' ? 'Throwing...' : 'AIM'}
      </Button>
    </div>
  );
};

export default DartAiming;
