import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, RotateCcw, Home } from 'lucide-react';
import { useGame } from '../GameContext';
import { Button } from '../../components/Button';

interface GameOverProps {
  onBackToHome: () => void;
}

export const PhaseGameOver: React.FC<GameOverProps> = ({ onBackToHome }) => {
  const { state, resetGame } = useGame();
  
  // Sort players by score
  const sortedPlayers = [...state.players].sort(
    (a, b) => state.scores[b.id] - state.scores[a.id]
  );
  
  const highestScore = state.scores[sortedPlayers[0].id];
  const winners = sortedPlayers.filter(p => state.scores[p.id] === highestScore);
  const isTie = winners.length > 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md rounded-3xl border border-amber-500/30 p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)]"
      >
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, ease: "easeInOut", repeatDelay: 5, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <Trophy className="w-24 h-24 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
        </motion.div>
        
        <h2 className="text-xl font-bold text-amber-500 tracking-widest mb-2 uppercase">Game Over</h2>
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          {isTie ? 'IT\'S A DRAW!' : 'WINNER!'}
        </h1>
        
        <div className="mb-10 text-3xl font-bold text-amber-400">
          {winners.map(w => w.name).join(' & ')}
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Final Leaderboard</h3>
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const isWinner = state.scores[player.id] === highestScore;
              return (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    isWinner ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-500 text-slate-900' :
                      index === 1 ? 'bg-slate-300 text-slate-900' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`font-bold text-lg ${isWinner ? 'text-amber-400' : 'text-white'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className="font-black text-xl text-white">
                    {state.scores[player.id]} <span className="text-sm text-slate-500 font-medium">pts</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => {
              onBackToHome();
            }} 
            className="flex-1"
          >
            PLAY AGAIN
          </Button>
          <Button variant="outline" onClick={onBackToHome} className="flex-1">
            <Home className="w-5 h-5 mr-2" />
            HOME
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
