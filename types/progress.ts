import type { PlayerStatKey } from './player';

export interface StatGainEntry {
  id: string;
  dateLabel: string;
  gains: Record<PlayerStatKey, number>;
}

export interface CompletedQuestEntry {
  id: string;
  title: string;
  completedAt: string;
  reward: string;
}

export interface LevelMilestone {
  id: string;
  level: number;
  title: string;
  reached: boolean;
}
