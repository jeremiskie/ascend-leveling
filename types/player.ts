export type PlayerClass = 'Vanguard' | 'Arcanist' | 'Ranger';
export type PlayerStatKey = 'STR' | 'AGI' | 'INT' | 'VIT';

export interface PlayerProfile {
  name: string;
  playerClass: PlayerClass;
}

export interface PlayerStatus extends PlayerProfile {
  level: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  attributes: Record<PlayerStatKey, number>;
  availableStatPoints: number;
}
