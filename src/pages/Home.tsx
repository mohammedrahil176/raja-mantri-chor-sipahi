import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Button } from '../components/Button';
import { useGame } from '../game/GameContext';

interface HomeProps {
  onHowToPlay: () => void;
  onJoinSuccess: () => void;
}

export const Home: React.FC<HomeProps> = ({ onHowToPlay, onJoinSuccess }) => {
  const { createRoom, joinRoom, error, clearError } = useGame();
  
  const [mode, setMode] = useState<'IDLE' | 'CREATE' | 'JOIN'>('IDLE');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [rounds, setRounds] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    setIsLoading(true);
    try {
      await createRoom(playerName, rounds);
      onJoinSuccess();
    } catch (e) {
      // Error is handled in context
    }
    setIsLoading(false);
  };

  const handleJoin = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    setIsLoading(true);
    try {
      await joinRoom(roomCode, playerName);
      onJoinSuccess();
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <div className="flex justify-center mb-6 relative">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Crown className="w-24 h-24 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </motion.div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-700 drop-shadow-sm mb-4 leading-tight tracking-tight uppercase font-serif">
          Raja Mantri<br />Chor Sipahi
        </h1>
        <p className="text-xl md:text-2xl text-amber-500/80 font-medium tracking-wide">
          Multiplayer Online
        </p>
      </motion.div>

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg max-w-sm w-full flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="font-bold ml-4">✕</button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        {mode === 'IDLE' && (
          <>
            <Button size="lg" onClick={() => { setMode('CREATE'); clearError(); }}>
              CREATE ROOM
            </Button>
            <Button size="lg" variant="secondary" onClick={() => { setMode('JOIN'); clearError(); }}>
              JOIN ROOM
            </Button>
            <Button variant="outline" onClick={onHowToPlay} className="mt-4">
              HOW TO PLAY
            </Button>
          </>
        )}

        {mode === 'CREATE' && (
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-amber-500 mb-4">Host Game</h2>
            <input
              type="text"
              placeholder="Your Name"
              maxLength={12}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-amber-500"
            />
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-400 mb-2">Rounds</h3>
              <div className="flex gap-2">
                {[3, 5, 10].map(num => (
                  <button
                    key={num}
                    onClick={() => setRounds(num)}
                    className={`flex-1 py-2 rounded-lg border-2 font-bold ${
                      rounds === num ? 'border-amber-500 bg-amber-500/20 text-amber-500' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <Button size="lg" className="w-full mb-3" onClick={handleCreate} disabled={isLoading || !playerName}>
              {isLoading ? 'CREATING...' : 'CREATE ROOM'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setMode('IDLE')}>BACK</Button>
          </div>
        )}

        {mode === 'JOIN' && (
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-amber-500 mb-4">Join Game</h2>
            <input
              type="text"
              placeholder="Room Code (e.g. A7K92P)"
              maxLength={6}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-amber-500 uppercase tracking-widest text-center font-bold text-xl"
            />
            <input
              type="text"
              placeholder="Your Name"
              maxLength={12}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-amber-500"
            />
            <Button size="lg" className="w-full mb-3" onClick={handleJoin} disabled={isLoading || !playerName || roomCode.length < 6}>
              {isLoading ? 'JOINING...' : 'JOIN ROOM'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setMode('IDLE')}>BACK</Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
