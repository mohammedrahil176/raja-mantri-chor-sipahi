export type Role = 'KING' | 'MINISTER' | 'POLICE' | 'THIEF';

export interface Player {
  id: string;
  room_id: string;
  name: string;
  score: number;
  is_host: boolean;
  is_ready: boolean;
  is_connected: boolean;
}

export type GamePhase = 
  | 'LOBBY'
  | 'PLAYER_ROLE_REVEAL' 
  | 'KING_CALL' 
  | 'MINISTER_REVEAL' 
  | 'MINISTER_GUESS' 
  | 'ROUND_RESULT' 
  | 'GAME_OVER';

export interface Room {
  id: string;
  code: string;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  phase: GamePhase;
  current_round: number;
  total_rounds: number;
  king_id: string | null;
  minister_id: string | null;
  thief_id: string | null;
  police_id: string | null;
  guessed_thief_id: string | null;
  guess_correct: boolean | null;
}

export interface GameState {
  room: Room | null;
  players: Player[];
  myPlayerId: string | null;
  mySecret: string | null;
  myRole: Role | null;
}
