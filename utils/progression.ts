import type { PlayerData } from '../types/playerState';

export interface LevelUpEvent {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  statPointsGained: number;
  oldRank: PlayerData['rank'];
  newRank: PlayerData['rank'];
}

export interface AddExpResult {
  playerData: PlayerData;
  event: LevelUpEvent;
}

export const getRankForLevel = (level: number): PlayerData['rank'] => {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError('Player level must be a positive integer.');
  }

  if (level <= 5) return 'E';
  if (level <= 15) return 'D';
  if (level <= 30) return 'C';
  if (level <= 50) return 'B';
  if (level <= 75) return 'A';
  return 'S';
};

export const expToNextLevel = (level: number): number => {
  if (!Number.isInteger(level) || level < 1) {
    throw new RangeError('Player level must be a positive integer.');
  }

  return level * 1000;
};

export const addExpToPlayer = (player: PlayerData, amount: number): AddExpResult => {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new RangeError('EXP amount must be a non-negative safe integer.');
  }

  if (!Number.isInteger(player.level) || player.level < 1) {
    throw new RangeError('Player level must be a positive integer.');
  }

  if (!Number.isSafeInteger(player.exp) || player.exp < 0) {
    throw new RangeError('Current EXP must be a non-negative safe integer.');
  }

  const oldLevel = player.level;
  const oldRank = player.rank;
  let level = player.level;
  let exp = player.exp + amount;
  let levelsGained = 0;

  if (!Number.isSafeInteger(exp)) {
    throw new RangeError('Combined EXP exceeds the safe integer range.');
  }

  while (exp >= expToNextLevel(level)) {
    exp -= expToNextLevel(level);
    level += 1;
    levelsGained += 1;
  }

  const newRank = getRankForLevel(level);
  const statPointsGained = levelsGained * 3;

  return {
    playerData: {
      ...player,
      level,
      rank: newRank,
      exp,
      statPoints: player.statPoints + statPointsGained,
    },
    event: {
      leveledUp: levelsGained > 0,
      oldLevel,
      newLevel: level,
      statPointsGained,
      oldRank,
      newRank,
    },
  };
};
