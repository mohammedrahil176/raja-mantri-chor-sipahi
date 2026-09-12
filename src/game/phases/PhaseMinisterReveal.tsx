import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhaseMinisterReveal: React.FC = () => {
  const { state, updatePhase } = useGame();
  
  const isMinister = state.myRole === 'MINISTER';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-12"
      >
        <span className="text-8xl mb-6 block drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]">⚜️</span>
        <h2 className="text-3xl font-bold text-indigo-400 mb-2">THE MINISTER REVEALS THEMSELVES</h2>
      </motion.div>

      {isMinister ? (
        <div className="space-y-8 max-w-sm w-full">
          <p className="text-xl font-medium text-slate-300">The King is waiting for you.</p>
          <Button size="lg" className="w-full text-xl py-6 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 text-white border-indigo-400" onClick={() => updatePhase('MINISTER_GUESS')}>
            "I AM HERE, MY KING!"
          </Button>
        </div>
      ) : (
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse">
          <p className="text-xl text-slate-400 font-medium">Waiting for the Minister to reveal themselves...</p>
        </div>
      )}
    </div>
  );
};
