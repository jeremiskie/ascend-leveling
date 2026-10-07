export type DungeonTierId = 'E' | 'D' | 'C';
export type CombatOutcome = 'victory' | 'defeat';
export type CombatActionType = 'strike' | 'skill' | 'enemy';

export interface DungeonTier {
  id: DungeonTierId;
  name: string;
  recommendedLevel: number;
  enemyName: string;
  enemyTitle: string;
  enemyMaxHp: number;
  enemyAttack: number;
  reward: string;
}

export interface CombatLogEntry {
  id: number;
  actor: 'PLAYER' | 'ENEMY' | 'SYSTEM';
  message: string;
  action: CombatActionType;
}
