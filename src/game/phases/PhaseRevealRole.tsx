import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';
import type { Role } from '../../types';

export const PhaseRevealRole: React.FC = () => {
  const { state, setReady } = useGame();
  const [revealed, setRevealed] = useState(false);
  const myPlayer = state.players.find(p => p.id === state.myPlayerId);

  const getRoleDetails = (role: Role | null) => {
    switch (role) {
      case 'KING': return { title: 'KING 👑', points: '1000 POINTS', color: 'from-amber-400 to-yellow-600' };
      case 'MINISTER': return { title: 'MINISTER ⚜️', points: '500 POINTS', color: 'from-blue-400 to-indigo-600' };
      case 'POLICE': return { title: 'POLICE 👮', points: '300 POINTS', color: 'from-emerald-400 to-green-600' };
      case 'THIEF': return { title: 'THIEF 🕵️', points: '0 POINTS', color: 'from-red-400 to-rose-600' };
      default: return { title: 'LOADING...', points: '', color: 'from-slate-400 to-slate-600' };
    }
  };

  const details = getRoleDetails(state.myRole);
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-amber-500 mb-8">YOUR SECRET ROLE</h2>

      <div className="perspective-1000 w-full max-w-sm aspect-[3/4] mb-8" onClick={() => setRevealed(true)}>
        <motion.div
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Back of Card */}
          <div className="absolute inset-0 backface-hidden">
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 rounded-2xl">
              <span className="text-6xl mb-4 opacity-50">❓</span>
              <span className="text-xl font-bold text-slate-400">TAP TO REVEAL</span>
            </div>
          </div>

          {/* Front of Card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${details.color} border-2 border-white/20 shadow-2xl shadow-amber-500/20 rounded-2xl`}>
              <h3 className="text-4xl md:text-5xl font-black text-white drop-shadow-md mb-2">
                {details.title}
              </h3>
              <span className="text-xl font-bold text-white/90 bg-black/20 px-4 py-2 rounded-full">
                {details.points}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {!myPlayer?.is_ready ? (
        <Button 
          size="lg" 
          disabled={!revealed || !state.myRole} 
          onClick={() => setReady()}
          className="w-full max-w-sm"
        >
          {state.myRole ? "I'M READY" : "FETCHING ROLE..."}
        </Button>
      ) : (
        <div className="w-full max-w-sm bg-slate-900/80 rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-400 mb-4">WAITING FOR OTHERS...</h3>
          <div className="space-y-3">
            {state.players.map(p => (
              <div key={p.id} className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-300">{p.name} {p.id === state.myPlayerId && '(You)'}</span>
                {p.is_ready ? (
                  <span className="text-green-500 font-bold">✓ Ready</span>
                ) : (
                  <span className="text-slate-500">Waiting...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
