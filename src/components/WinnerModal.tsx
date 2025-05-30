
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { Player } from '../pages/DartGame';

interface WinnerModalProps {
  players: Player[];
  onNewGame: () => void;
  isOpen: boolean;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ players, onNewGame, isOpen }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={32} />;
      case 1:
        return <Medal className="text-gray-400" size={28} />;
      case 2:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <Star className="text-blue-400" size={20} />;
    }
  };

  const getRankTitle = (index: number) => {
    switch (index) {
      case 0:
        return '🏆 CHAMPION';
      case 1:
        return '🥈 2nd Place';
      case 2:
        return '🥉 3rd Place';
      default:
        return `#${index + 1}`;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-400 to-orange-500';
      case 1:
        return 'from-gray-300 to-gray-500';
      case 2:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            🎉 Game Complete! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-2">🎯</div>
            <h2 className="text-3xl font-bold text-yellow-400 animate-pulse">
              {players[0]?.name} WINS!
            </h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-center mb-3">Final Rankings</h3>
            {players.map((player, index) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg bg-gradient-to-r ${getRankColor(index)} 
                  shadow-lg transition-all duration-300 hover:scale-105 ${
                    index === 0 ? 'ring-4 ring-yellow-400 animate-pulse' : ''
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getRankIcon(index)}
                    <div>
                      <div className="font-bold text-lg">{getRankTitle(index)}</div>
                      <div className="text-sm opacity-90">{player.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{player.score} pts left</div>
                    <div className="text-sm opacity-75">{player.throws} throws</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={onNewGame}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🔄 Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;
