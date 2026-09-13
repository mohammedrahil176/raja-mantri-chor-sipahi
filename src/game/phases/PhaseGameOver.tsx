import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal } from 'lucide-react';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhaseGameOver: React.FC = () => {
  const { state, leaveRoom } = useGame();

  const sortedPlayers = state.players.slice().sort((a, b) => b.score - a.score);
  const highestScore = sortedPlayers[0]?.score || 0;
  const winners = sortedPlayers.filter(p => p.score === highestScore);
  const isTie = winners.length > 1;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pt-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-10 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full -z-10" />
        {isTie ? (
          <div className="text-6xl mb-4 mx-auto drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">🤝</div>
        ) : (
          <Trophy className="w-24 h-24 text-amber-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
        )}
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 mb-2 uppercase tracking-tight">
          GAME OVER 🎉
        </h2>
        <p className="text-xl text-slate-300">
          {isTie ? (
            <>
              <span className="font-bold text-amber-400">IT'S A TIE!</span>
              <br/>
              Winners: {winners.map(w => w.name).join(', ')}
            </>
          ) : (
            <>🏆 WINNER: <span className="font-bold text-amber-400">{winners[0]?.name}</span></>
          )}
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-3 mb-10">
        {sortedPlayers.map((player, idx) => {
          const isWinner = player.score === highestScore;
          return (
            <motion.div
              key={player.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                isWinner
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-900/20 border-amber-500/50' 
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center">
                  {isWinner ? <Crown className="w-6 h-6 text-amber-500" /> :
                   idx === 1 && !isTie ? <Medal className="w-6 h-6 text-slate-300" /> :
                   idx === 2 && !isTie ? <Medal className="w-6 h-6 text-orange-700" /> :
                   <span className="text-slate-500 font-bold">{idx + 1}</span>}
                </div>
                <span className={`text-lg font-bold ${player.id === state.myPlayerId ? 'text-white' : 'text-slate-300'}`}>
                  {player.name} {player.id === state.myPlayerId && '(You)'}
                </span>
              </div>
              <span className={`text-xl font-black font-mono ${isWinner ? 'text-amber-500' : 'text-slate-400'}`}>
                {player.score}
              </span>
            </motion.div>
          );
        })}
      </div>

      <Button size="lg" className="w-full max-w-sm mb-4" onClick={leaveRoom}>
        RETURN TO HOME
      </Button>
    </div>
  );
};
