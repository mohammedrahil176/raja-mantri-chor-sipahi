import React from 'react';
import { useGame } from './GameContext';
import { PhaseRevealRole } from './phases/PhaseRevealRole';
import { PhaseKingCall } from './phases/PhaseKingCall';
import { PhaseMinisterReveal } from './phases/PhaseMinisterReveal';
import { PhaseMinisterGuess } from './phases/PhaseMinisterGuess';
import { PhaseRoundResult } from './phases/PhaseRoundResult';
import { PhaseGameOver } from './phases/PhaseGameOver';

interface GameEngineProps {
  onBackToHome: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({ onBackToHome }) => {
  const { state } = useGame();

  const renderPhase = () => {
    switch (state.phase) {
      case 'PLAYER_ROLE_REVEAL':
        return <PhaseRevealRole />;
      case 'KING_CALL':
        return <PhaseKingCall />;
      case 'MINISTER_REVEAL':
        return <PhaseMinisterReveal />;
      case 'MINISTER_GUESS':
        return <PhaseMinisterGuess />;
      case 'ROUND_RESULT':
        return <PhaseRoundResult />;
      case 'GAME_OVER':
        return <PhaseGameOver onBackToHome={onBackToHome} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Optional: Add a top bar here indicating round number if needed */}
      {state.phase !== 'GAME_OVER' && state.phase !== 'SETUP' && (
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 px-4 py-1.5 rounded-full text-amber-500 font-bold text-sm tracking-widest">
            ROUND {state.currentRound} / {state.totalRounds}
          </div>
          <button 
            onClick={onBackToHome}
            className="text-slate-400 hover:text-white text-sm font-bold bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-800 backdrop-blur-sm transition-colors"
          >
            QUIT
          </button>
        </div>
      )}
      
      {renderPhase()}
    </div>
  );
};
