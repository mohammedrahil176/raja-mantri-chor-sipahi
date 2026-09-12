import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../GameContext';

import { HelpCircle } from 'lucide-react';

export const PhaseMinisterGuess: React.FC = () => {
  const { state, makeMinisterGuess } = useGame();
  
  const ministerPlayer = state.players.find(p => p.id === state.ministerPlayerId);
  const remainingPlayers = state.players.filter(
    p => p.id !== state.kingPlayerId && p.id !== state.ministerPlayerId
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-slate-400 mb-2">MINISTER'S DECISION</h2>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-10">
          {ministerPlayer?.name}, who is the Thief?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remainingPlayers.map((player) => (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => makeMinisterGuess(player.id)}
              className="bg-slate-900/80 backdrop-blur-md border-2 border-slate-700 hover:border-amber-500 rounded-3xl p-8 cursor-pointer shadow-xl transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-slate-700">
                  <HelpCircle className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{player.name}</h3>
                <p className="text-slate-400 font-medium tracking-widest text-sm uppercase">Hidden Role</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
