import React from 'react';
import { GameProvider, useGame } from './game/GameContext';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { GameEngine } from './game/GameEngine';
import { Tutorial } from './pages/Tutorial';

const AppContent: React.FC = () => {
  const { state } = useGame();
  const [showTutorial, setShowTutorial] = React.useState(false);

  if (showTutorial) {
    return <Tutorial onBack={() => setShowTutorial(false)} />;
  }

  // Determine which screen to show based on room state
  if (!state.room) {
    return <Home onHowToPlay={() => setShowTutorial(true)} onJoinSuccess={() => {}} />;
  }

  if (state.room.phase === 'LOBBY') {
    return <Lobby />;
  }

  return <GameEngine />;
};

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
