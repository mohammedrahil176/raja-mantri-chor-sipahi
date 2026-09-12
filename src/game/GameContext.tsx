import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GameState, GamePhase, Player, PlayerState, RoundResult } from '../types';
import { assignRoles, calculateRoundScores } from './logic';

interface GameContextType {
  state: GameState;
  startNewGame: (players: Player[], rounds: number) => void;
  nextPhase: () => void;
  revealRole: (playerIndex: number) => void;
  startKingCall: () => void;
  revealMinister: () => void;
  makeMinisterGuess: (guessedPlayerId: string) => void;
  startNextRound: () => void;
  resetGame: () => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
}

const defaultState: GameState = {
  players: [],
  playerStates: [],
  currentRound: 1,
  totalRounds: 5,
  phase: 'SETUP',
  scores: {},
  currentPlayerRevealIndex: 0,
  roundResults: [],
  ministerPlayerId: null,
  kingPlayerId: null,
  thiefPlayerId: null,
  policePlayerId: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('raja-mantri-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('raja-mantri-state', JSON.stringify(state));
  }, [state]);

  const startNewGame = (players: Player[], rounds: number) => {
    const initialScores = players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {});
    
    setState({
      ...defaultState,
      players,
      totalRounds: rounds,
      scores: initialScores,
      playerStates: assignRoles(players),
      phase: 'PLAYER_ROLE_REVEAL',
      currentPlayerRevealIndex: 0,
    });
  };

  const revealRole = (playerIndex: number) => {
    setState((prev) => {
      const newPlayerStates = [...prev.playerStates];
      newPlayerStates[playerIndex].revealed = true;
      return { ...prev, playerStates: newPlayerStates };
    });
  };

  const nextPhase = () => {
    setState((prev) => {
      if (prev.phase === 'PLAYER_ROLE_REVEAL') {
        const nextIndex = prev.currentPlayerRevealIndex + 1;
        if (nextIndex < prev.players.length) {
          // Hide previous, ready for next
          const newPlayerStates = prev.playerStates.map(ps => ({ ...ps, revealed: false }));
          return {
            ...prev,
            currentPlayerRevealIndex: nextIndex,
            playerStates: newPlayerStates,
          };
        } else {
          // All revealed, move to King Call
          return {
            ...prev,
            phase: 'KING_CALL',
            kingPlayerId: prev.playerStates.find(p => p.role === 'KING')?.player.id || null,
            ministerPlayerId: prev.playerStates.find(p => p.role === 'MINISTER')?.player.id || null,
            thiefPlayerId: prev.playerStates.find(p => p.role === 'THIEF')?.player.id || null,
            policePlayerId: prev.playerStates.find(p => p.role === 'POLICE')?.player.id || null,
          };
        }
      }
      return prev;
    });
  };

  const startKingCall = () => {
    setState((prev) => ({ ...prev, phase: 'MINISTER_REVEAL' }));
  };

  const revealMinister = () => {
    setState((prev) => ({ ...prev, phase: 'MINISTER_GUESS' }));
  };

  const makeMinisterGuess = (guessedPlayerId: string) => {
    setState((prev) => {
      const isCorrect = guessedPlayerId === prev.thiefPlayerId;
      const roundScores = calculateRoundScores(prev.playerStates, isCorrect);
      
      const newScores = { ...prev.scores };
      Object.keys(roundScores).forEach((id) => {
        newScores[id] = (newScores[id] || 0) + roundScores[id];
      });

      const roundResult: RoundResult = {
        roundNumber: prev.currentRound,
        ministerGuessCorrect: isCorrect,
        ministerGuessedPlayerId: guessedPlayerId,
        scores: roundScores,
      };

      const isGameOver = prev.currentRound >= prev.totalRounds;

      return {
        ...prev,
        scores: newScores,
        roundResults: [...prev.roundResults, roundResult],
        phase: 'ROUND_RESULT',
      };
    });
  };

  const startNextRound = () => {
    setState((prev) => {
      if (prev.currentRound >= prev.totalRounds) {
        return { ...prev, phase: 'GAME_OVER' };
      }
      
      return {
        ...prev,
        currentRound: prev.currentRound + 1,
        playerStates: assignRoles(prev.players),
        phase: 'PLAYER_ROLE_REVEAL',
        currentPlayerRevealIndex: 0,
        kingPlayerId: null,
        ministerPlayerId: null,
        thiefPlayerId: null,
        policePlayerId: null,
      };
    });
  };

  const resetGame = () => {
    setState(defaultState);
  };

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

  return (
    <GameContext.Provider
      value={{
        state,
        startNewGame,
        nextPhase,
        revealRole,
        startKingCall,
        revealMinister,
        makeMinisterGuess,
        startNextRound,
        resetGame,
        isAudioEnabled,
        toggleAudio,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
