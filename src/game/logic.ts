import type { Player, PlayerState, Role, RoundResult } from '../types';

export const ROLE_POINTS = {
  KING: 1000,
  MINISTER: 500,
  POLICE: 300,
  THIEF: 0,
};

export function createRoles(): Role[] {
  return ['KING', 'MINISTER', 'POLICE', 'THIEF'];
}

export function shuffleRoles(roles: Role[]): Role[] {
  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function assignRoles(players: Player[]): PlayerState[] {
  const roles = shuffleRoles(createRoles());
  return players.map((player, index) => ({
    player,
    role: roles[index],
    revealed: false,
  }));
}

export function calculateRoundScores(
  playerStates: PlayerState[],
  ministerGuessCorrect: boolean
): Record<string, number> {
  const scores: Record<string, number> = {};

  playerStates.forEach((ps) => {
    const playerId = ps.player.id;
    if (ps.role === 'KING') {
      scores[playerId] = ROLE_POINTS.KING;
    } else if (ps.role === 'POLICE') {
      scores[playerId] = ROLE_POINTS.POLICE;
    } else if (ps.role === 'MINISTER') {
      scores[playerId] = ministerGuessCorrect ? ROLE_POINTS.MINISTER : 0;
    } else if (ps.role === 'THIEF') {
      scores[playerId] = ministerGuessCorrect ? 0 : 500;
    }
  });

  return scores;
}
