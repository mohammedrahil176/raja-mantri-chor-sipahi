import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Crown, Shield, ShieldAlert, UserX } from 'lucide-react';
import { Button } from '../components/Button';

export const Tutorial: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center min-h-screen p-6 max-w-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl mb-8"
      >
        <div className="flex items-center gap-3 mb-8 text-amber-500">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">How to Play</h2>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300">
          <p className="text-lg leading-relaxed mb-6">
            Raja Mantri Chor Sipahi is a traditional Indian 4-player deduction game. In each round, roles are secretly assigned and the Minister must figure out who the Thief is!
          </p>

          <h3 className="text-xl font-bold text-amber-500 mt-8 mb-4 border-b border-slate-800 pb-2">Roles & Points</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="font-bold text-white">Raja (King)</div>
                <div className="text-yellow-500 font-black">1000 pts</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-bold text-white">Mantri (Minister)</div>
                <div className="text-blue-500 font-black">500 or 0 pts</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <ShieldAlert className="w-8 h-8 text-slate-400" />
              <div>
                <div className="font-bold text-white">Sipahi (Police)</div>
                <div className="text-slate-400 font-black">300 pts</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <UserX className="w-8 h-8 text-red-500" />
              <div>
                <div className="font-bold text-white">Chor (Thief)</div>
                <div className="text-red-500 font-black">0 or 500 pts</div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-amber-500 mt-8 mb-4 border-b border-slate-800 pb-2">How a Round Works</h3>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Four players receive hidden roles.</li>
            <li>Each player privately views their role.</li>
            <li>The <strong>King</strong> calls out: <em>"Who is my Minister?"</em></li>
            <li>The <strong>Minister</strong> reveals themselves.</li>
            <li>The King commands the Minister to find the <strong>Thief</strong> among the two remaining hidden players.</li>
            <li>The Minister guesses who the Thief is.</li>
          </ol>

          <h3 className="text-xl font-bold text-amber-500 mt-8 mb-4 border-b border-slate-800 pb-2">The Golden Rule</h3>
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8">
            <p className="mb-2 text-amber-100">If the Minister guesses correctly:</p>
            <ul className="list-disc pl-5 text-amber-400/80 mb-4">
              <li>Minister gets 500 pts</li>
              <li>Thief gets 0 pts</li>
            </ul>
            <p className="mb-2 text-amber-100">If the Minister guesses incorrectly:</p>
            <ul className="list-disc pl-5 text-amber-400/80">
              <li>Minister gets 0 pts</li>
              <li>Thief escapes and gets 500 pts</li>
            </ul>
          </div>
        </div>

        <Button variant="outline" onClick={onBack} className="w-full mt-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          BACK TO HOME
        </Button>
      </motion.div>
    </div>
  );
};
