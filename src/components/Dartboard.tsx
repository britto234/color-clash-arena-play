
import React from 'react';

interface DartboardProps {
  onScore: (points: number) => void;
  disabled: boolean;
}

const Dartboard: React.FC<DartboardProps> = ({ onScore, disabled }) => {
  const scoreValues = [
    { label: 'Bull\'s Eye', value: 50, color: 'bg-red-500' },
    { label: 'Inner Bull', value: 25, color: 'bg-green-500' },
    { label: 'Triple 20', value: 60, color: 'bg-yellow-500' },
    { label: 'Double 20', value: 40, color: 'bg-blue-500' },
    { label: '20', value: 20, color: 'bg-purple-500' },
    { label: 'Triple 19', value: 57, color: 'bg-pink-500' },
    { label: 'Double 19', value: 38, color: 'bg-indigo-500' },
    { label: '19', value: 19, color: 'bg-cyan-500' },
    { label: 'Triple 18', value: 54, color: 'bg-orange-500' },
    { label: '18', value: 18, color: 'bg-teal-500' },
    { label: '15', value: 15, color: 'bg-lime-500' },
    { label: '10', value: 10, color: 'bg-emerald-500' },
    { label: '5', value: 5, color: 'bg-amber-500' },
    { label: '1', value: 1, color: 'bg-rose-500' },
    { label: 'Miss', value: 0, color: 'bg-gray-500' },
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 p-2 shadow-2xl">
        <div className="w-full h-full rounded-full bg-black relative overflow-hidden">
          {/* Dartboard rings */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">50</span>
              </div>
            </div>
          </div>
          
          {/* Score rings */}
          {[0, 1, 2, 3].map((ring) => (
            <div
              key={ring}
              className={`absolute rounded-full border-2 border-white/20`}
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

      <div className="grid grid-cols-3 gap-2 w-full max-w-md">
        {scoreValues.map((score) => (
          <button
            key={score.label}
            onClick={() => !disabled && onScore(score.value)}
            disabled={disabled}
            className={`${score.color} hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed 
              text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 
              hover:shadow-xl active:scale-95`}
          >
            <div className="text-xs">{score.label}</div>
            <div className="text-lg">{score.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dartboard;
