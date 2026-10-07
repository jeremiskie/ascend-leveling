import type { PlayerProfile, PlayerStatus } from '../types/player';

export const createMockPlayerStatus = (profile: PlayerProfile): PlayerStatus => ({
  ...profile,
  level: 1,
  currentHp: 100,
  maxHp: 100,
  currentMp: 50,
  maxMp: 50,
  attributes: {
    STR: 10,
    AGI: 10,
    INT: 10,
    VIT: 10,
  },
  availableStatPoints: 5,
});
