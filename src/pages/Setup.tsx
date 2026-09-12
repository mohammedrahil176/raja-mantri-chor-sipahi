import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import type { Player } from '../types';

interface SetupProps {
  onStart: (players: Player[], rounds: number) => void;
  onBack: () => void;
}

export const Setup: React.FC<SetupProps> = ({ onStart, onBack }) => {
  const [names, setNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [rounds, setRounds] = useState(5);
  const [error, setError] = useState('');

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
    setError('');
  };

  const handleStart = () => {
    const trimmed = names.map(n => n.trim());
    
    if (trimmed.some(n => n === '')) {
      setError('All player names must be filled.');
      return;
    }
    
    const unique = new Set(trimmed);
    if (unique.size !== 4) {
      setError('All player names must be unique.');
      return;
    }

    const players: Player[] = trimmed.map((name, i) => ({
      id: `p${i + 1}`,
      name,
      isComputer: false,
    }));

    onStart(players, rounds);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-8 text-amber-500">
          <Users className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Setup Game</h2>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Players</h3>
          {names.map((name, i) => (
            <div key={i}>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`Player ${i + 1}`}
                maxLength={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          ))}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Number of Rounds</h3>
          <div className="flex gap-2">
            {[3, 5, 10].map(num => (
              <button
                key={num}
                onClick={() => setRounds(num)}
                className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${
                  rounds === num 
                    ? 'border-amber-500 bg-amber-500/20 text-amber-500' 
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleStart} size="lg">START GAME</Button>
          <Button variant="outline" onClick={onBack}>BACK TO HOME</Button>
        </div>
      </motion.div>
    </div>
  );
};
