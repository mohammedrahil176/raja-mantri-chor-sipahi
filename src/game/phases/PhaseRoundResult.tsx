import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../GameContext';
import { Button } from '../../components/Button';


export const PhaseRoundResult: React.FC = () => {
  const { state, startNextRound } = useGame();
  
  const currentResult = state.roundResults[state.roundResults.length - 1];
  const isCorrect = currentResult?.ministerGuessCorrect;
  
  const actualThief = state.players.find(p => p.id === state.thiefPlayerId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
      >
        <div className={`p-8 ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex justify-center mb-4">
            {isCorrect ? (
              <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
              <XCircle className="w-20 h-20 text-red-500" />
            )}
          </div>
          <h1 className={`text-4xl font-black mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'CORRECT!' : 'WRONG!'}
          </h1>
          <p className="text-xl text-white font-medium">
            {isCorrect 
              ? 'The Minister successfully found the Thief!' 
              : 'The Thief escaped!'}
          </p>
          {!isCorrect && (
            <p className="text-slate-300 mt-2">
              (The Thief was actually {actualThief?.name})
            </p>
          )}
        </div>

        <div className="p-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Round Scores</h2>
          
          <div className="space-y-3 mb-8">
            {state.playerStates.map((ps) => {
              const points = currentResult.scores[ps.player.id];
              const isZero = points === 0;
              return (
                <div key={ps.player.id} className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-white text-lg">{ps.player.name}</span>
                    <span className="text-slate-400 text-sm">{ps.role}</span>
                  </div>
                  <span className={`font-black text-xl ${isZero ? 'text-slate-500' : 'text-amber-500'}`}>
                    +{points}
                  </span>
                </div>
              );
            })}
          </div>

          <Button onClick={startNextRound} size="lg" className="w-full">
            {state.currentRound >= state.totalRounds ? 'VIEW FINAL RESULTS' : 'NEXT ROUND'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
