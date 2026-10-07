export interface ActiveQuest {
  title: string;
  description: string;
  category: 'Daily' | 'Main';
  progress: number;
  target: number;
  reward: string;
}

export type QuestStatus = 'completed' | 'inProgress' | 'failed';

export interface QuestListItem extends ActiveQuest {
  id: string;
  status: QuestStatus;
}

export interface DailyPenalty {
  title: string;
  description: string;
  remainingSeconds: number;
}
