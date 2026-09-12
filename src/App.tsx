import React from 'react';
import { GameProvider, useGame } from './game/GameContext';
import { Home } from './pages/Home';
import { Lobby } from './pages/Lobby';
import { GameEngine } from './game/GameEngine';
import { Tutorial } from './pages/Tutorial';
import { isSupabaseConfigured } from './lib/supabase';

const AppContent: React.FC = () => {
  const { state } = useGame();
  const [showTutorial, setShowTutorial] = React.useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Missing</h1>
          <p className="text-gray-700 mb-4">
            It looks like Supabase is not configured. Please create a <code>.env</code> file in the root of the project with your Supabase URL and Anon Key.
          </p>
          <pre className="text-left bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto text-gray-800">
            VITE_SUPABASE_URL=your_url{'\n'}
            VITE_SUPABASE_ANON_KEY=your_key
          </pre>
        </div>
      </div>
    );
  }

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
