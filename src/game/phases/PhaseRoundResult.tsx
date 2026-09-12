import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhaseRoundResult: React.FC = () => {
  const { state, nextRound } = useGame();
  
  if (!state.room) return null;

  const { guess_correct, guessed_thief_id, thief_id, minister_id } = state.room;
  
  const minister = state.players.find(p => p.id === minister_id);
  const thief = state.players.find(p => p.id === thief_id);
  const guessedPlayer = state.players.find(p => p.id === guessed_thief_id);
  
  const isHost = state.players.find(p => p.id === state.myPlayerId)?.is_host;

  return (
    <div className="flex-1 flex flex-col items-center p-6 pt-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-center mb-8"
      >
        <span className="text-6xl mb-4 block">
          {guess_correct ? '🎉' : '❌'}
        </span>
        <h2 className={`text-4xl font-black mb-2 ${guess_correct ? 'text-green-500' : 'text-red-500'}`}>
          {guess_correct ? 'CORRECT!' : 'WRONG!'}
        </h2>
        <p className="text-xl text-slate-300">
          Minister {minister?.name} guessed {guessedPlayer?.name}
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4 mb-8">
        <Card className="bg-slate-900 border-slate-800 flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚜️</span>
            <div>
              <div className="text-sm text-slate-400 font-bold">MINISTER</div>
              <div className="font-bold text-lg text-slate-200">{minister?.name}</div>
            </div>
          </div>
          <div className={`font-black text-xl ${guess_correct ? 'text-green-500' : 'text-slate-600'}`}>
            {guess_correct ? '+500' : '0'}
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🕵️</span>
            <div>
              <div className="text-sm text-slate-400 font-bold">THIEF</div>
              <div className="font-bold text-lg text-slate-200">{thief?.name}</div>
            </div>
          </div>
          <div className={`font-black text-xl ${!guess_correct ? 'text-red-500' : 'text-slate-600'}`}>
            {!guess_correct ? '+500' : '0'}
          </div>
        </Card>
      </div>

      <div className="w-full max-w-sm mb-8">
        <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest text-center">Scoreboard</h3>
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
          {state.players.slice().sort((a, b) => b.score - a.score).map((player, idx) => (
            <div key={player.id} className="flex justify-between items-center p-3 border-b border-slate-800/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-bold w-4">{idx + 1}.</span>
                <span className={`font-medium ${player.id === state.myPlayerId ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                  {player.name}
                </span>
              </div>
              <span className="font-mono text-amber-500 font-bold">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      {isHost ? (
        <Button size="lg" className="w-full max-w-sm mb-4" onClick={nextRound}>
          {state.room.current_round >= state.room.total_rounds ? 'FINISH GAME' : 'NEXT ROUND'}
        </Button>
      ) : (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 font-medium text-center max-w-sm w-full animate-pulse">
          Waiting for Host to continue...
        </div>
      )}
    </div>
  );
};
