export type Role = 'KING' | 'MINISTER' | 'POLICE' | 'THIEF';

export interface Player {
  id: string;
  name: string;
  isComputer: boolean;
}

export interface PlayerState {
  player: Player;
  role: Role | null;
  revealed: boolean;
}

export type GamePhase = 
  | 'SETUP' 
  | 'PLAYER_ROLE_REVEAL' 
  | 'KING_CALL' 
  | 'MINISTER_REVEAL' 
  | 'MINISTER_GUESS' 
  | 'ROUND_RESULT' 
  | 'SCOREBOARD' 
  | 'GAME_OVER';

export interface RoundResult {
  roundNumber: number;
  ministerGuessCorrect: boolean;
  ministerGuessedPlayerId: string | null;
  scores: Record<string, number>;
}

export interface GameState {
  players: Player[];
  playerStates: PlayerState[];
  currentRound: number;
  totalRounds: number;
  phase: GamePhase;
  scores: Record<string, number>;
  currentPlayerRevealIndex: number;
  roundResults: RoundResult[];
  ministerPlayerId: string | null;
  kingPlayerId: string | null;
  thiefPlayerId: string | null;
  policePlayerId: string | null;
}
