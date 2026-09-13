import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { useGame } from '../GameContext';

export const PhasePoliceGuess: React.FC = () => {
  const { state, submitGuess } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  const isPolice = state.myRole === 'SIPAHI' || state.myRole === 'MINISTER';

  // Suspects are everyone except the current player
  // But wait, the requirements say: "Show the list of eligible players. Example: Who is the Chor? [ Player A ] [ Player B ] [ Player C ] [ Player D ]"
  // It's probably best to show all players except the current SIPAHI who is guessing. Or just all players except SIPAHI? 
  // Wait, if there are multiple Sipahis, can a Sipahi guess another Sipahi? Yes, because they don't know who the other Sipahis are. 
  // Everyone is a suspect to the Police except themselves.
  const suspects = state.players.filter(p => p.id !== state.myPlayerId);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-12">
      {isPolice ? (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 w-full max-w-sm"
        >
          <h2 className="text-3xl font-bold text-blue-500 mb-2">👮 Find the CHOR</h2>
          <p className="text-slate-400 mb-6">Who is the Chor?</p>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            {suspects.map((player) => (
              <motion.div key={player.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={selectedPlayerId === player.id ? "primary" : "outline"}
                  className={`w-full text-xl py-6 h-auto flex flex-col items-center justify-center gap-2 ${
                    selectedPlayerId === player.id 
                      ? 'border-blue-500 bg-blue-600/20' 
                      : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800'
                  }`}
                  onClick={() => setSelectedPlayerId(player.id)}
                >
                  <span>{player.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Button 
              variant="primary" 
              className="w-full text-lg font-bold"
              disabled={!selectedPlayerId}
              onClick={() => {
                if (selectedPlayerId) submitGuess(selectedPlayerId);
              }}
            >
              CONFIRM GUESS
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-sm">
           {(state.myRole === 'RAJA' || state.myRole === 'KING') && (
             <div className="mb-6">
               <div className="text-6xl mb-4">👑</div>
               <h2 className="text-2xl font-bold text-amber-500 mb-2">You are RAJA</h2>
               <p className="text-slate-400">Your identity is secret.</p>
               <p className="text-slate-400">Wait for the Police to make a decision.</p>
             </div>
           )}
           {(state.myRole === 'MANTRI' || state.myRole === 'POLICE') && (
             <div className="mb-6">
               <div className="text-6xl mb-4">🧑‍💼</div>
               <h2 className="text-2xl font-bold text-purple-500 mb-2">You are MANTRI</h2>
               <p className="text-slate-400">Your identity is secret.</p>
               <p className="text-slate-400">Wait for the Police.</p>
             </div>
           )}
           {(state.myRole === 'CHOR' || state.myRole === 'THIEF') && (
             <div className="mb-6">
               <div className="text-6xl mb-4">🕵️</div>
               <h2 className="text-2xl font-bold text-red-500 mb-2">You are CHOR</h2>
               <p className="text-slate-400">Stay hidden!</p>
               <p className="text-slate-400">The Police is trying to find you.</p>
             </div>
           )}
           {!state.myRole && (
             <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse mb-6">
               <p className="text-xl text-slate-400 font-medium">Wait for the Police to make a decision...</p>
             </div>
           )}

          <div className="grid grid-cols-1 gap-4 w-full mt-4 opacity-50 pointer-events-none">
            {suspects.map((player) => (
              <Button
                key={player.id}
                variant="outline"
                className="w-full text-xl py-6 h-auto flex flex-col items-center justify-center gap-2 border-slate-700 bg-slate-800"
                disabled
              >
                <span>{player.name}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
