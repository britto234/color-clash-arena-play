
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Medal, Award } from 'lucide-react';
import Dartboard3D from '../components/Dartboard3D';
import Scoreboard from '../components/Scoreboard';
import PlayerSetup from '../components/PlayerSetup';
import WinnerModal from '../components/WinnerModal';

export interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
  throws: number;
}

const DartGame = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [targetScore] = useState(501);
  const [throwsInTurn, setThrowsInTurn] = useState(0);
  const [maxThrowsPerTurn] = useState(3);

  const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

  const startGame = (playerCount: number) => {
    const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      score: targetScore,
      color: playerColors[i],
      throws: 0
    }));
    setPlayers(newPlayers);
    setGameStarted(true);
    setCurrentPlayerIndex(0);
    setThrowsInTurn(0);
  };

  const handleScore = (points: number) => {
    if (gameEnded || throwsInTurn >= maxThrowsPerTurn) return;

    const newPlayers = [...players];
    const currentPlayer = newPlayers[currentPlayerIndex];
    
    if (currentPlayer.score - points >= 0) {
      currentPlayer.score -= points;
      currentPlayer.throws++;
      
      if (currentPlayer.score === 0) {
        setGameEnded(true);
        return;
      }
    }
    
    setPlayers(newPlayers);
    setThrowsInTurn(prev => prev + 1);
    
    if (throwsInTurn + 1 >= maxThrowsPerTurn) {
      nextPlayer();
    }
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setThrowsInTurn(0);
  };

  const resetGame = () => {
    setPlayers([]);
    setGameStarted(false);
    setGameEnded(false);
    setCurrentPlayerIndex(0);
    setThrowsInTurn(0);
  };

  const getRankedPlayers = () => {
    return [...players].sort((a, b) => a.score - b.score);
  };

  if (!gameStarted) {
    return <PlayerSetup onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in">
            🎯 Dart Game Championship
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xl text-white">
            <Star className="text-yellow-400" />
            <span>Current Player: {players[currentPlayerIndex]?.name}</span>
            <Star className="text-yellow-400" />
          </div>
          <p className="text-white/80 mt-2">
            Throws left this turn: {maxThrowsPerTurn - throwsInTurn}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-center">Dartboard</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Dartboard3D onScore={handleScore} disabled={gameEnded} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Scoreboard 
              players={players} 
              currentPlayerIndex={currentPlayerIndex}
              targetScore={targetScore}
            />
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={nextPlayer} 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
                  disabled={gameEnded || throwsInTurn === 0}
                >
                  Skip Turn
                </Button>
                <Button 
                  onClick={resetGame} 
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  New Game
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {gameEnded && (
          <WinnerModal 
            players={getRankedPlayers()} 
            onNewGame={resetGame}
            isOpen={gameEnded}
          />
        )}
      </div>
    </div>
  );
};

export default DartGame;
