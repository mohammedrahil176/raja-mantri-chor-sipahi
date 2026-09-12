import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhaseMinisterGuess: React.FC = () => {
  const { state, submitGuess } = useGame();
  
  const isMinister = state.myRole === 'MINISTER';

  // Suspects are anyone who is not the King and not the Minister
  const suspects = state.players.filter(p => p.id !== state.room?.king_id && p.id !== state.room?.minister_id);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-amber-500 mb-2">FIND THE THIEF</h2>
        <p className="text-slate-400">One of these players is the Thief. Choose wisely.</p>
      </motion.div>

      {isMinister ? (
        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          {suspects.map((player) => (
            <motion.div key={player.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full text-xl py-8 h-auto flex flex-col items-center justify-center gap-2 border-slate-700 hover:border-amber-500 hover:bg-slate-800"
                onClick={() => submitGuess(player.id)}
              >
                <span className="text-4xl">❓</span>
                <span>{player.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse">
          <p className="text-xl text-slate-400 font-medium">Waiting for the Minister to make their guess...</p>
        </div>
      )}
    </div>
  );
};
