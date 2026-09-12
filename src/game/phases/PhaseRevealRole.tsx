import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../GameContext';
import { ChitCard } from '../../components/Card';
import { Button } from '../../components/Button';

export const PhaseRevealRole: React.FC = () => {
  const { state, revealRole, nextPhase } = useGame();
  
  const currentPlayerIndex = state.currentPlayerRevealIndex;
  const playerState = state.playerStates[currentPlayerIndex];

  if (!playerState) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlayerIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            {playerState.player.name}'s Turn
          </h2>
          <p className="text-slate-400 mb-8">
            Pass the device to {playerState.player.name}
          </p>

          <ChitCard
            role={playerState.role}
            revealed={playerState.revealed}
            playerName={playerState.player.name}
            className="mb-12"
          />

          <div className="h-16">
            {!playerState.revealed ? (
              <Button onClick={() => revealRole(currentPlayerIndex)} size="lg">
                TAP TO REVEAL ROLE
              </Button>
            ) : (
              <Button onClick={nextPhase} size="lg" variant="secondary">
                HIDE & PASS DEVICE
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
