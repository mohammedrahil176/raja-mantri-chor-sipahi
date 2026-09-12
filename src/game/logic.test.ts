import { describe, it, expect } from 'vitest';
import { createRoles, shuffleRoles, assignRoles, calculateRoundScores } from './logic';
import type { Player, PlayerState } from '../types';

describe('Game Logic', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Rahul', isComputer: false },
    { id: '2', name: 'Arjun', isComputer: false },
    { id: '3', name: 'Sameer', isComputer: false },
    { id: '4', name: 'Vivek', isComputer: false },
  ];

  it('should create 4 unique roles', () => {
    const roles = createRoles();
    expect(roles).toHaveLength(4);
    expect(roles).toContain('KING');
    expect(roles).toContain('MINISTER');
    expect(roles).toContain('POLICE');
    expect(roles).toContain('THIEF');
  });

  it('should shuffle roles', () => {
    const roles = createRoles();
    const shuffled = shuffleRoles([...roles]);
    expect(shuffled).toHaveLength(4);
    expect(shuffled).toEqual(expect.arrayContaining(roles));
  });

  it('should assign roles to players', () => {
    const states = assignRoles(mockPlayers);
    expect(states).toHaveLength(4);
    const roles = states.map(s => s.role);
    expect(roles).toContain('KING');
    expect(roles).toContain('MINISTER');
    expect(roles).toContain('POLICE');
    expect(roles).toContain('THIEF');
  });

  it('should calculate scores for correct Minister guess', () => {
    const states: PlayerState[] = [
      { player: mockPlayers[0], role: 'KING', revealed: true },
      { player: mockPlayers[1], role: 'MINISTER', revealed: true },
      { player: mockPlayers[2], role: 'POLICE', revealed: true },
      { player: mockPlayers[3], role: 'THIEF', revealed: true },
    ];

    const scores = calculateRoundScores(states, true);
    
    expect(scores['1']).toBe(1000);
    expect(scores['2']).toBe(500);
    expect(scores['3']).toBe(300);
    expect(scores['4']).toBe(0);
  });

  it('should calculate scores for incorrect Minister guess', () => {
    const states: PlayerState[] = [
      { player: mockPlayers[0], role: 'KING', revealed: true },
      { player: mockPlayers[1], role: 'MINISTER', revealed: true },
      { player: mockPlayers[2], role: 'POLICE', revealed: true },
      { player: mockPlayers[3], role: 'THIEF', revealed: true },
    ];

    const scores = calculateRoundScores(states, false);
    
    expect(scores['1']).toBe(1000);
    expect(scores['2']).toBe(0);
    expect(scores['3']).toBe(300);
    expect(scores['4']).toBe(500);
  });
});
