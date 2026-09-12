import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Button } from '../components/Button';

interface HomeProps {
  onPlayFriends: () => void;
  onPlayComputer: () => void;
  onHowToPlay: () => void;
  onScoreboard: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onPlayFriends,
  onPlayComputer,
  onHowToPlay,
  onScoreboard,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
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
          The Classic Indian Deduction Game
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Button size="lg" onClick={onPlayFriends}>
          PLAY WITH FRIENDS
        </Button>
        <Button size="lg" variant="secondary" onClick={onPlayComputer} disabled>
          PLAY WITH COMPUTER (Coming Soon)
        </Button>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button variant="outline" onClick={onHowToPlay}>
            HOW TO PLAY
          </Button>
          <Button variant="outline" onClick={onScoreboard}>
            SCOREBOARD
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
