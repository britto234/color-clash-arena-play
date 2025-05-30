
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star } from 'lucide-react';
import { Player } from '../pages/DartGame';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
  targetScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerIndex, targetScore }) => {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
          <Trophy className="text-yellow-400" />
          <span>Scoreboard</span>
          <Trophy className="text-yellow-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`p-4 rounded-lg transition-all duration-300 ${
              index === currentPlayerIndex
                ? 'bg-white/20 shadow-lg scale-105 border-2 border-yellow-400'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={{
              borderLeft: `4px solid ${player.color}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-white font-bold text-lg">{player.name}</span>
                {index === currentPlayerIndex && (
                  <Star className="text-yellow-400 animate-pulse" size={20} />
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{player.score}</div>
                <div className="text-sm text-white/70">
                  {targetScore - player.score} points scored
                </div>
                <div className="text-xs text-white/50">
                  {player.throws} throws
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((targetScore - player.score) / targetScore) * 100}%`,
                  backgroundColor: player.color,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
