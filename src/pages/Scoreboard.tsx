import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft } from 'lucide-react';
import { useGame } from '../game/GameContext';
import { Button } from '../components/Button';

export const Scoreboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state } = useGame();
  
  const hasGameData = state.players.length > 0;

  const sortedPlayers = [...state.players].sort(
    (a, b) => (state.scores[b.id] || 0) - (state.scores[a.id] || 0)
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-amber-500">
            <Trophy className="w-8 h-8" />
            <h2 className="text-3xl font-bold text-white">Scoreboard</h2>
          </div>
        </div>

        {!hasGameData ? (
          <div className="text-slate-400 py-10">
            No active game data found. Play a game to see scores!
          </div>
        ) : (
          <>
            <div className="mb-4 text-left">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                Current Game - Round {state.currentRound > state.totalRounds ? state.totalRounds : state.currentRound}/{state.totalRounds}
              </span>
            </div>
            <div className="space-y-3 mb-8">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      {index + 1}
                    </div>
                    <span className="font-bold text-lg text-white">
                      {player.name}
                    </span>
                  </div>
                  <span className="font-black text-xl text-amber-500">
                    {state.scores[player.id]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="w-5 h-5 mr-2" />
          BACK TO HOME
        </Button>
      </motion.div>
    </div>
  );
};
