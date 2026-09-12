import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GameState, GamePhase, Room, Role } from '../types';
import { supabase } from '../lib/supabase';

interface GameContextType {
  state: GameState;
  createRoom: (name: string, rounds: number) => Promise<void>;
  joinRoom: (code: string, name: string) => Promise<void>;
  startRound: () => Promise<void>;
  setReady: () => Promise<void>;
  updatePhase: (phase: GamePhase) => Promise<void>;
  submitGuess: (targetId: string) => Promise<void>;
  nextRound: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  fetchMyRole: () => Promise<void>;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  error: string | null;
  clearError: () => void;
}

const defaultState: GameState = {
  room: null,
  players: [],
  myPlayerId: null,
  mySecret: null,
  myRole: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('raja-mantri-session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return defaultState; }
    }
    return defaultState;
  });

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.myPlayerId && state.mySecret && state.room?.id) {
      localStorage.setItem('raja-mantri-session', JSON.stringify({
        myPlayerId: state.myPlayerId,
        mySecret: state.mySecret,
        room: { id: state.room.id }
      }));
    } else {
      localStorage.removeItem('raja-mantri-session');
    }
  }, [state.myPlayerId, state.mySecret, state.room?.id]);

  const generateSecret = () => crypto.randomUUID();

  // Subscription setup
  useEffect(() => {
    if (!state.room?.id) return;

    const roomId = state.room.id;

    // Fetch initial state
    const fetchState = async () => {
      const { data: roomData } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      const { data: playersData } = await supabase.from('players').select('*').eq('room_id', roomId).order('joined_at');
      
      if (roomData && playersData) {
        setState(s => ({ ...s, room: roomData, players: playersData }));
      } else {
        // Room not found or deleted
        setState(defaultState);
      }
    };
    fetchState();

    const roomSub = supabase.channel(`room:${roomId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, (payload) => {
        setState(s => ({ ...s, room: payload.new as Room }));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomId}` }, async () => {
        const { data } = await supabase.from('players').select('*').eq('room_id', roomId).order('joined_at');
        if (data) setState(s => ({ ...s, players: data }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomSub);
    };
  }, [state.room?.id]);

  const fetchMyRole = useCallback(async () => {
    if (!state.room?.id || !state.mySecret) return;
    const { data, error } = await supabase.rpc('get_my_role', {
      p_room_id: state.room.id,
      p_secret: state.mySecret
    });
    if (!error && data) {
      setState(s => ({ ...s, myRole: data as Role }));
    }
  }, [state.room?.id, state.mySecret]);

  // Auto fetch role when entering PLAYER_ROLE_REVEAL
  useEffect(() => {
    if (state.room?.phase === 'PLAYER_ROLE_REVEAL' && !state.myRole) {
      fetchMyRole();
    }
    if (state.room?.phase === 'LOBBY' || state.room?.phase === 'GAME_OVER') {
      setState(s => ({ ...s, myRole: null }));
    }
  }, [state.room?.phase, fetchMyRole, state.myRole]);

  const createRoom = async (name: string, rounds: number) => {
    try {
      const secret = generateSecret();
      const { data, error } = await supabase.rpc('create_room', { p_name: name, p_secret: secret, p_rounds: rounds });
      if (error) throw error;
      
      setState({
        ...defaultState,
        room: { id: data.room_id } as Room,
        myPlayerId: data.player_id,
        mySecret: secret
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      throw err;
    }
  };

  const joinRoom = async (code: string, name: string) => {
    try {
      const secret = generateSecret();
      const { data, error } = await supabase.rpc('join_room', { p_code: code.toUpperCase(), p_name: name, p_secret: secret });
      if (error) throw error;
      
      setState({
        ...defaultState,
        room: { id: data.room_id } as Room,
        myPlayerId: data.player_id,
        mySecret: secret
      });
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
      throw err;
    }
  };

  const startRound = async () => {
    if (!state.room || !state.mySecret) return;
    const { error } = await supabase.rpc('start_round', { p_room_id: state.room.id, p_secret: state.mySecret });
    if (error) setError(error.message);
  };

  const setReady = async () => {
    if (!state.room || !state.mySecret) return;
    await supabase.rpc('set_ready', { p_room_id: state.room.id, p_secret: state.mySecret });
  };

  const updatePhase = async (phase: GamePhase) => {
    if (!state.room || !state.mySecret) return;
    await supabase.rpc('update_phase', { p_room_id: state.room.id, p_secret: state.mySecret, p_phase: phase });
  };

  const submitGuess = async (targetId: string) => {
    if (!state.room || !state.mySecret) return;
    const { error } = await supabase.rpc('submit_guess', { p_room_id: state.room.id, p_secret: state.mySecret, p_target_id: targetId });
    if (error) setError(error.message);
  };

  const nextRound = async () => {
    if (!state.room || !state.mySecret) return;
    const { error } = await supabase.rpc('next_round', { p_room_id: state.room.id, p_secret: state.mySecret });
    if (error) setError(error.message);
  };

  const leaveRoom = async () => {
    if (state.room?.id && state.mySecret) {
      await supabase.rpc('leave_room', { p_room_id: state.room.id, p_secret: state.mySecret });
    }
    setState(defaultState);
  };

  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);
  const clearError = () => setError(null);

  return (
    <GameContext.Provider
      value={{ state, createRoom, joinRoom, startRound, setReady, updatePhase, submitGuess, nextRound, leaveRoom, fetchMyRole, isAudioEnabled, toggleAudio, error, clearError }}
    >
      {children}
    </GameContext.Provider>
  );
};
