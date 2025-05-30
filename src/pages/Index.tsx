
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Trophy, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="text-yellow-400 animate-pulse" size={40} />
            <CardTitle className="text-4xl font-bold text-white">🎯 Dart Game</CardTitle>
            <Trophy className="text-yellow-400 animate-pulse" size={40} />
          </div>
          <p className="text-white/80 text-lg">Ultimate Pass 'N Play Championship</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white/5 rounded-lg p-6 space-y-4">
            <h3 className="text-white font-bold text-xl text-center mb-4">🏆 Game Features</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-white/90">
                <Star className="text-yellow-400" size={16} />
                <span>2-4 Players</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Star className="text-green-400" size={16} />
                <span>Live Scoreboard</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Star className="text-blue-400" size={16} />
                <span>Player Rankings</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <Star className="text-purple-400" size={16} />
                <span>Colorful Interface</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-bold text-center mb-2">🎮 How to Play</h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Start with 501 points</li>
              <li>• Take turns throwing darts</li>
              <li>• First to exactly 0 points wins!</li>
              <li>• Each player gets 3 throws per turn</li>
            </ul>
          </div>

          <Button
            onClick={() => navigate('/dart-game')}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 text-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Gamepad className="mr-2" />
            🚀 Start Playing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
