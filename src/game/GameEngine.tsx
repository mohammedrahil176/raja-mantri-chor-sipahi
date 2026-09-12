import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from './GameContext';
import { PhaseRevealRole } from './phases/PhaseRevealRole';
import { PhaseKingCall } from './phases/PhaseKingCall';
import { PhaseMinisterReveal } from './phases/PhaseMinisterReveal';
import { PhaseMinisterGuess } from './phases/PhaseMinisterGuess';
import { PhaseRoundResult } from './phases/PhaseRoundResult';
import { PhaseGameOver } from './phases/PhaseGameOver';

export const GameEngine: React.FC = () => {
  const { state } = useGame();
  
  if (!state.room) return null;

  const renderPhase = () => {
    switch (state.room!.phase) {
      case 'PLAYER_ROLE_REVEAL':
        return <PhaseRevealRole key="reveal" />;
      case 'KING_CALL':
        return <PhaseKingCall key="king" />;
      case 'MINISTER_REVEAL':
        return <PhaseMinisterReveal key="minister-reveal" />;
      case 'MINISTER_GUESS':
        return <PhaseMinisterGuess key="guess" />;
      case 'ROUND_RESULT':
        return <PhaseRoundResult key="result" />;
      case 'GAME_OVER':
        return <PhaseGameOver key="over" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />
      
      {/* Top Bar info */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 opacity-60 text-sm font-bold tracking-widest">
        <div>ROOM: {state.room.code}</div>
        <div>ROUND {state.room.current_round} / {state.room.total_rounds}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.room.phase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen flex flex-col"
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
