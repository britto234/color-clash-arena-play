
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface DartAimingProps {
  onThrow: (horizontalPosition: number, verticalPosition: number) => void;
  disabled: boolean;
}

const DartAiming: React.FC<DartAimingProps> = ({ onThrow, disabled }) => {
  const [aimingPhase, setAimingPhase] = useState<'horizontal' | 'vertical' | 'ready'>('horizontal');
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [isMoving, setIsMoving] = useState(true);
  const [direction, setDirection] = useState({ horizontal: 1, vertical: 1 });

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
    }, 30);

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
      setAimingPhase('ready');
      setTimeout(() => {
        onThrow(horizontalPosition, verticalPosition);
        resetAiming();
      }, 200);
    }
  };

  const resetAiming = () => {
    setAimingPhase('horizontal');
    setHorizontalPosition(50);
    setVerticalPosition(50);
    setIsMoving(true);
    setDirection({ horizontal: 1, vertical: 1 });
  };

  const getPhaseText = () => {
    switch (aimingPhase) {
      case 'horizontal': return 'Click to lock horizontal aim';
      case 'vertical': return 'Click to lock vertical aim';
      case 'ready': return 'Throwing dart...';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-80 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-4 border-white/20 overflow-hidden">
        {/* Dartboard background with numbers */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
          {/* Outer ring with numbers */}
          <div className="absolute inset-0 rounded-full">
            {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map((number, index) => {
              const angle = (index * 18) - 90; // 360/20 = 18 degrees per segment
              const radius = 120; // Distance from center
              const x = Math.cos(angle * Math.PI / 180) * radius;
              const y = Math.sin(angle * Math.PI / 180) * radius;
              
              return (
                <div
                  key={number}
                  className="absolute text-white font-bold text-lg"
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
          
          {/* Inner bull area */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative">
            <div className="absolute text-white font-bold text-sm top-2">25</div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">50</span>
            </div>
          </div>
        </div>

        {/* Crosshairs */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Horizontal line */}
          <div 
            className="absolute w-full h-0.5 bg-yellow-400 shadow-lg transition-all duration-75"
            style={{ top: `${verticalPosition}%` }}
          />
          {/* Vertical line */}
          <div 
            className="absolute h-full w-0.5 bg-yellow-400 shadow-lg transition-all duration-75"
            style={{ left: `${horizontalPosition}%` }}
          />
          {/* Center dot */}
          <div 
            className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg transition-all duration-75 -translate-x-1.5 -translate-y-1.5"
            style={{ 
              left: `${horizontalPosition}%`, 
              top: `${verticalPosition}%` 
            }}
          />
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
        <p className="text-white font-semibold">{getPhaseText()}</p>
        <div className="flex space-x-2">
          <div className={`px-2 py-1 rounded text-xs ${aimingPhase === 'horizontal' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
            Horizontal: {horizontalPosition.toFixed(0)}%
          </div>
          <div className={`px-2 py-1 rounded text-xs ${aimingPhase === 'vertical' ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
            Vertical: {verticalPosition.toFixed(0)}%
          </div>
        </div>
      </div>

      <Button
        onClick={handleClick}
        disabled={disabled || aimingPhase === 'ready'}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {aimingPhase === 'ready' ? 'Throwing...' : 'AIM'}
      </Button>
    </div>
  );
};

export default DartAiming;
