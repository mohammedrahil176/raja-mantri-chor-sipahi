import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useGame } from '../GameContext';
import { Button } from '../../components/Button';

export const PhaseKingCall: React.FC = () => {
  const { state, startKingCall } = useGame();
  const kingPlayer = state.players.find(p => p.id === state.kingPlayerId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl border border-amber-500/30 max-w-lg w-full shadow-2xl shadow-amber-500/10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <Crown className="w-20 h-20 text-amber-500" />
        </motion.div>
        
        <h2 className="text-xl font-bold text-slate-400 mb-2">THE KING HAS BEEN CHOSEN</h2>
        <h1 className="text-4xl font-black text-white mb-8">
          {kingPlayer?.name} is the King 👑
        </h1>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-amber-500" />
          <p className="text-2xl font-serif italic text-amber-100">
            "Mera Mantri Kaun Hai?"<br/>
            <span className="text-lg text-amber-500/80 not-italic font-sans mt-2 block">(Who is my Minister?)</span>
          </p>
        </div>

        <Button onClick={startKingCall} size="lg" className="w-full">
          CALL MY MINISTER
        </Button>
      </motion.div>
    </div>
  );
};
