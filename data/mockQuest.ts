import type { ActiveQuest, DailyPenalty, QuestListItem } from '../types/quest';

export const mockFallbackQuests: QuestListItem[] = [
  {
    id: 'daily-strength',
    title: '100 Push-ups',
    description: 'Complete the set at a pace appropriate for your current ability.',
    category: 'Daily',
    goalCategory: 'Physical',
    progress: 0,
    target: 100,
    reward: '+100 EXP · +2 Discipline',
    expReward: 100,
    statBonuses: { discipline: 2 },
    status: 'inProgress',
  },
  {
    id: 'daily-focus',
    title: 'Focused Study',
    description: 'Spend 25 minutes on a task that develops your focus.',
    category: 'Daily',
    goalCategory: 'Mental',
    progress: 0,
    target: 25,
    reward: '+80 EXP · +1 Focus',
    expReward: 80,
    statBonuses: { focus: 1 },
    status: 'inProgress',
  },
  {
    id: 'daily-recovery',
    title: 'Recovery Check-in',
    description: 'Take a deliberate rest break and check in with your energy.',
    category: 'Daily',
    goalCategory: 'Recovery',
    progress: 0,
    target: 1,
    reward: '+60 EXP · +1 Resilience',
    expReward: 60,
    statBonuses: { resilience: 1 },
    status: 'inProgress',
  },
  {
    id: 'weekly-endurance',
    title: 'Build Your Endurance',
    description: 'Complete three manageable endurance sessions this week.',
    category: 'Weekly',
    goalCategory: 'Physical',
    progress: 0,
    target: 3,
    reward: '+250 EXP · +3 Endurance',
    expReward: 250,
    statBonuses: { endurance: 3 },
    status: 'inProgress',
  },
  {
    id: 'weekly-discipline',
    title: 'Seven-Day Discipline',
    description: 'Show up for one small, meaningful habit each day this week.',
    category: 'Weekly',
    goalCategory: 'Discipline',
    progress: 0,
    target: 7,
    reward: '+300 EXP · +2 Discipline',
    expReward: 300,
    statBonuses: { discipline: 2 },
    status: 'inProgress',
  },
  {
    id: 'dungeon-gate',
    title: 'E-Rank Gate Preview',
    description: 'Complete a simulated dungeon encounter in the Combat screen.',
    category: 'Dungeon',
    goalCategory: 'Physical',
    progress: 0,
    target: 1,
    reward: '+1,200 EXP · +2 Combat',
    expReward: 1200,
    statBonuses: { combat: 2 },
    status: 'inProgress',
  },
];

export const mockActiveQuests = mockFallbackQuests;
export const mockDailyTasks = mockFallbackQuests.filter((quest) => quest.category === 'Daily');
export const mockWeeklyChallenges = mockFallbackQuests.filter(
  (quest) => quest.category === 'Weekly'
);
export const mockDungeonQuests = mockFallbackQuests.filter((quest) => quest.category === 'Dungeon');
export const mockDailyPenalty: DailyPenalty = {
  title: 'Daily Penalty Zone',
  description: 'Penalty protocol activates if daily objectives remain incomplete.',
  remainingSeconds: 2 * 60 * 60 + 34 * 60 + 12,
};

export const mockActiveQuest: ActiveQuest = mockFallbackQuests[0];
