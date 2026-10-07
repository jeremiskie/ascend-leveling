import type { ActiveQuest, DailyPenalty, QuestListItem } from '../types/quest';

export const mockActiveQuests: QuestListItem[] = [
  {
    id: 'daily-conditioning',
    title: 'Daily Conditioning',
    description: 'Complete three training sessions to strengthen your resolve.',
    category: 'Daily',
    progress: 1,
    target: 3,
    reward: '+50 XP  ·  +1 Stat Point',
    status: 'inProgress',
  },
  {
    id: 'first-awakening',
    title: 'First Awakening',
    description: 'Register your identity and accept the System Agreement.',
    category: 'Main',
    progress: 1,
    target: 1,
    reward: '+100 XP',
    status: 'completed',
  },
  {
    id: 'gate-investigation',
    title: 'Gate Investigation',
    description: 'Investigate the dormant gate before the deadline.',
    category: 'Main',
    progress: 0,
    target: 1,
    reward: '+200 XP  ·  Unknown item',
    status: 'failed',
  },
];

export const mockDailyTasks: QuestListItem[] = [
  {
    id: 'push-ups',
    title: '100 Push-ups',
    description: 'Build strength through consistent effort.',
    category: 'Daily',
    progress: 40,
    target: 100,
    reward: '+20 XP',
    status: 'inProgress',
  },
  {
    id: 'ten-kilometer-run',
    title: '10km Run',
    description: 'Complete your daily endurance run.',
    category: 'Daily',
    progress: 0,
    target: 10,
    reward: '+30 XP',
    status: 'inProgress',
  },
  {
    id: 'mobility',
    title: 'Mobility Training',
    description: 'Complete a short mobility session.',
    category: 'Daily',
    progress: 1,
    target: 1,
    reward: '+10 XP',
    status: 'completed',
  },
];

export const mockDailyPenalty: DailyPenalty = {
  title: 'Daily Penalty Zone',
  description: 'Penalty protocol activates if daily objectives remain incomplete.',
  remainingSeconds: 2 * 60 * 60 + 34 * 60 + 12,
};

export const mockActiveQuest: ActiveQuest = mockActiveQuests[0];
