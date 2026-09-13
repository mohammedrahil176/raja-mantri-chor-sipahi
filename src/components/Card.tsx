import React from 'react';
import { motion } from 'framer-motion';
import type { Role } from '../types';
import { Crown, Shield, ShieldAlert, UserX, HelpCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChitCardProps {
  role?: Role | null;
  revealed: boolean;
  onClick?: () => void;
  className?: string;
  playerName?: string;
}

const roleConfig = {
  RAJA: { icon: Crown, title: 'RAJA', points: 1000, colors: 'from-yellow-400 to-amber-600', text: 'text-amber-100' },
  KING: { icon: Crown, title: 'RAJA', points: 1000, colors: 'from-yellow-400 to-amber-600', text: 'text-amber-100' },
  MANTRI: { icon: Shield, title: 'MANTRI', points: 500, colors: 'from-blue-500 to-indigo-700', text: 'text-blue-100' },
  POLICE: { icon: Shield, title: 'MANTRI', points: 500, colors: 'from-blue-500 to-indigo-700', text: 'text-blue-100' },
  SIPAHI: { icon: ShieldAlert, title: 'SIPAHI', points: 300, colors: 'from-emerald-500 to-green-700', text: 'text-emerald-100' },
  MINISTER: { icon: ShieldAlert, title: 'SIPAHI', points: 300, colors: 'from-emerald-500 to-green-700', text: 'text-emerald-100' },
  CHOR: { icon: UserX, title: 'CHOR', points: 0, colors: 'from-red-500 to-rose-700', text: 'text-rose-100' },
  THIEF: { icon: UserX, title: 'CHOR', points: 0, colors: 'from-red-500 to-rose-700', text: 'text-rose-100' },
};

export const ChitCard: React.FC<ChitCardProps> = ({ role, revealed, onClick, className, playerName }) => {
  return (
    <div 
      className={cn('relative w-64 h-80 perspective-1000 cursor-pointer', className)}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (Hidden) */}
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-4 border-amber-500/30 flex flex-col items-center justify-center shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-amber-500 mb-2">MYSTERY CHIT</h3>
          {playerName && (
            <p className="text-slate-400 font-medium">{playerName}'s Turn</p>
          )}
        </div>

        {/* Back (Revealed) */}
        {role && (
          <div 
            className={cn(
              'absolute inset-0 backface-hidden rounded-2xl border-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden',
              'bg-gradient-to-br', roleConfig[role].colors,
              'border-white/20'
            )}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <p className="text-white/80 font-bold tracking-widest text-sm mb-4">YOUR ROLE</p>
              
              {React.createElement(roleConfig[role].icon, { 
                className: 'w-20 h-20 text-white drop-shadow-md mb-4' 
              })}
              
              <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                {roleConfig[role].title}
              </h2>
              
              <div className="mt-6 bg-black/30 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                <p className="text-white font-bold text-lg">
                  {roleConfig[role].points} POINTS
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
