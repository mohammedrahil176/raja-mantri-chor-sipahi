import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useGame } from '../GameContext';
import { Button } from '../../components/Button';

export const PhaseMinisterReveal: React.FC = () => {
  const { state, revealMinister } = useGame();
  const ministerPlayer = state.players.find(p => p.id === state.ministerPlayerId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/80 backdrop-blur-md p-10 rounded-3xl border border-blue-500/30 max-w-lg w-full shadow-2xl shadow-blue-500/10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <Shield className="w-20 h-20 text-blue-500" />
        </motion.div>
        
        <h2 className="text-xl font-bold text-slate-400 mb-2">THE MINISTER IS FOUND</h2>
        <h1 className="text-4xl font-black text-white mb-8">
          {ministerPlayer?.name} is the Minister ⚜️
        </h1>

        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-blue-500" />
          <p className="text-2xl font-serif italic text-blue-100">
            "Ji Maharaj! Chor ka pata lagao!"<br/>
            <span className="text-lg text-blue-400/80 not-italic font-sans mt-2 block">(Yes Your Majesty! Find the Thief!)</span>
          </p>
        </div>

        <Button onClick={revealMinister} size="lg" className="w-full bg-blue-600 hover:bg-blue-500 hover:border-blue-400 text-white border-2 border-blue-600 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]">
          FIND THE THIEF
        </Button>
      </motion.div>
    </div>
  );
};
