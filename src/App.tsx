import React, { useState } from 'react';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { Scoreboard } from './pages/Scoreboard';
import { Tutorial } from './pages/Tutorial';
import { GameEngine } from './game/GameEngine';
import { GameProvider, useGame } from './game/GameContext';
import type { Player } from './types';

type Screen = 'HOME' | 'SETUP' | 'GAME' | 'SCOREBOARD' | 'TUTORIAL';

const AppContent: React.FC = () => {
  const { startNewGame, state } = useGame();
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');

  const handleStartGame = (players: Player[], rounds: number) => {
    startNewGame(players, rounds);
    setCurrentScreen('GAME');
  };

  // If there's an active game not finished, we might want to resume
  // But let's just use the screen state for now
  // We can add a "Resume Game" button to HOME if state.players.length > 0 and phase !== 'GAME_OVER'
  const hasActiveGame = state.players.length > 0 && state.phase !== 'GAME_OVER' && state.phase !== 'SETUP';

  return (
    <div className="min-h-screen">
      {currentScreen === 'HOME' && (
        <div className="relative">
          {hasActiveGame && (
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setCurrentScreen('GAME')}
                className="bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-amber-400 transition-colors"
              >
                RESUME GAME
              </button>
            </div>
          )}
          <Home
            onPlayFriends={() => setCurrentScreen('SETUP')}
            onPlayComputer={() => {}}
            onHowToPlay={() => setCurrentScreen('TUTORIAL')}
            onScoreboard={() => setCurrentScreen('SCOREBOARD')}
          />
        </div>
      )}

      {currentScreen === 'SETUP' && (
        <Setup
          onStart={handleStartGame}
          onBack={() => setCurrentScreen('HOME')}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameEngine onBackToHome={() => setCurrentScreen('HOME')} />
      )}

      {currentScreen === 'SCOREBOARD' && (
        <Scoreboard onBack={() => setCurrentScreen('HOME')} />
      )}

      {currentScreen === 'TUTORIAL' && (
        <Tutorial onBack={() => setCurrentScreen('HOME')} />
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
