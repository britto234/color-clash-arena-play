
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Star } from 'lucide-react';

interface PlayerSetupProps {
  onStartGame: (playerCount: number) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onStartGame }) => {
  const [selectedPlayers, setSelectedPlayers] = useState(2);

  const playerOptions = [
    { count: 2, color: 'from-red-500 to-pink-500', icon: '👥' },
    { count: 3, color: 'from-blue-500 to-cyan-500', icon: '👥👤' },
    { count: 4, color: 'from-green-500 to-emerald-500', icon: '👥👥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Gamepad className="text-yellow-400" size={40} />
            <CardTitle className="text-4xl font-bold text-white">🎯 Dart Game</CardTitle>
            <Gamepad className="text-yellow-400" size={40} />
          </div>
          <p className="text-white/80 text-lg">Select number of players to start the championship!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playerOptions.map((option) => (
              <button
                key={option.count}
                onClick={() => setSelectedPlayers(option.count)}
                className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                  selectedPlayers === option.count
                    ? 'bg-gradient-to-br ring-4 ring-yellow-400 shadow-xl'
                    : 'bg-white/5 hover:bg-white/10'
                } ${option.color}`}
              >
                <div className="text-4xl mb-2">{option.icon}</div>
                <div className="text-white font-bold text-xl">{option.count} Players</div>
                {selectedPlayers === option.count && (
                  <Star className="text-yellow-400 mx-auto mt-2 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-white font-bold text-lg mb-2">Game Rules</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>🎯 Start with 501 points</li>
                <li>🎲 3 throws per turn</li>
                <li>🏆 First to reach exactly 0 wins!</li>
                <li>🎨 Each player has a unique color</li>
              </ul>
            </div>

            <Button
              onClick={() => onStartGame(selectedPlayers)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start Game with {selectedPlayers} Players
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerSetup;
