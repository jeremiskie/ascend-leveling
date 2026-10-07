export interface ActiveQuest {
  title: string;
  description: string;
  category: 'Daily' | 'Weekly' | 'Dungeon' | 'Main';
  progress: number;
  target: number;
  reward: string;
}

export type QuestStatus = 'completed' | 'inProgress' | 'failed';
export type QuestGoalCategory = 'Physical' | 'Mental' | 'Discipline' | 'Recovery';

export interface QuestStatBonuses {
  strength?: number;
  endurance?: number;
  agility?: number;
  vitality?: number;
  discipline?: number;
  focus?: number;
  resilience?: number;
  combat?: number;
}

export interface QuestListItem extends ActiveQuest {
  id: string;
  status: QuestStatus;
  goalCategory: QuestGoalCategory;
  expReward: number;
  statBonuses: QuestStatBonuses;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  estimatedMinutes?: number;
  isAiGenerated?: boolean;
}

export interface QuestCompletionResult {
  completed: boolean;
  quest: QuestListItem | null;
  levelUpEvent: import('../utils/progression').LevelUpEvent | null;
}

export interface DailyPenalty {
  title: string;
  description: string;
  remainingSeconds: number;
}
