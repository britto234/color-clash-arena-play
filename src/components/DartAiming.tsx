
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

  useEffect(() => {
    if (!isMoving || disabled) return;

    const interval = setInterval(() => {
      if (aimingPhase === 'horizontal') {
        setHorizontalPosition(prev => {
          const newPos = prev + (Math.random() > 0.5 ? 2 : -2);
          return Math.max(0, Math.min(100, newPos));
        });
      } else if (aimingPhase === 'vertical') {
        setVerticalPosition(prev => {
          const newPos = prev + (Math.random() > 0.5 ? 2 : -2);
          return Math.max(0, Math.min(100, newPos));
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [aimingPhase, isMoving, disabled]);

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
        {/* Dartboard background */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700"></div>
          </div>
        </div>

        {/* Crosshairs */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Horizontal line */}
          <div 
            className="absolute w-full h-0.5 bg-yellow-400 shadow-lg transition-all duration-100"
            style={{ top: `${verticalPosition}%` }}
          />
          {/* Vertical line */}
          <div 
            className="absolute h-full w-0.5 bg-yellow-400 shadow-lg transition-all duration-100"
            style={{ left: `${horizontalPosition}%` }}
          />
          {/* Center dot */}
          <div 
            className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg transition-all duration-100 -translate-x-1.5 -translate-y-1.5"
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
