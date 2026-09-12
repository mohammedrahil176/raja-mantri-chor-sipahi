import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhaseKingCall: React.FC = () => {
  const { state, updatePhase } = useGame();
  
  const isKing = state.myRole === 'KING';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="mb-12"
      >
        <span className="text-8xl mb-6 block drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]">👑</span>
        <h2 className="text-3xl font-bold text-amber-500 mb-2">THE KING HAS BEEN CHOSEN</h2>
      </motion.div>

      {isKing ? (
        <div className="space-y-8 max-w-sm w-full">
          <p className="text-2xl font-medium text-slate-300 italic">"Who is my Minister?"</p>
          <Button size="lg" className="w-full text-xl py-6" onClick={() => updatePhase('MINISTER_REVEAL')}>
            CALL MY MINISTER
          </Button>
        </div>
      ) : (
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse">
          <p className="text-xl text-slate-400 font-medium">Waiting for the King to call their Minister...</p>
        </div>
      )}
    </div>
  );
};
