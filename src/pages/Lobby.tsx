import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Users, Crown } from 'lucide-react';
import { useGame } from '../game/GameContext';
import { Button } from '../components/Button';

export const Lobby: React.FC = () => {
  const { state, startRound } = useGame();
  
  if (!state.room) return null;

  const isHost = state.players.find(p => p.id === state.myPlayerId)?.is_host;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(state.room!.code);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Game!',
        text: `Play Raja Mantri Chor Sipahi with me! Room Code: ${state.room!.code}`,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl"
      >
        <div className="mb-8">
          <h2 className="text-slate-400 font-bold tracking-widest text-sm uppercase mb-2">Room Code</h2>
          <div className="text-5xl font-black text-amber-500 tracking-[0.2em] mb-4">
            {state.room.code}
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" /> COPY
            </Button>
            {typeof navigator.share === 'function' && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                SHARE
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Players
            </h3>
            <span className="text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full text-sm">
              {state.players.length} / 4
            </span>
          </div>

          <div className="space-y-3 text-left">
            {state.players.map(player => (
              <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                {player.is_host ? (
                  <Crown className="w-5 h-5 text-yellow-500" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-xl">👤</span>
                )}
                <span className={`font-bold text-lg ${player.id === state.myPlayerId ? 'text-amber-400' : 'text-slate-200'}`}>
                  {player.name} {player.id === state.myPlayerId && '(You)'}
                </span>
                {!player.is_connected && (
                  <span className="ml-auto text-xs text-red-400 font-bold uppercase">Offline</span>
                )}
              </div>
            ))}
            
            {/* Empty slots placeholder */}
            {Array.from({ length: 4 - state.players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/50 border-dashed">
                <span className="w-5 h-5 flex items-center justify-center text-xl opacity-20">⏳</span>
                <span className="font-medium text-slate-500">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <Button 
            size="lg" 
            className="w-full" 
            disabled={state.players.length < 4}
            onClick={startRound}
          >
            START GAME
          </Button>
        ) : (
          <div className="p-4 bg-slate-800/50 rounded-xl text-slate-300 font-medium animate-pulse">
            Waiting for host to start...
          </div>
        )}
      </motion.div>
    </div>
  );
};
