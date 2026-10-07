import type { CompletedQuestEntry, LevelMilestone, StatGainEntry } from '../types/progress';

export const mockStatGains: StatGainEntry[] = [
  { id: 'day-1', dateLabel: 'DAY 01', gains: { STR: 1, AGI: 0, INT: 1, VIT: 0 } },
  { id: 'day-2', dateLabel: 'DAY 02', gains: { STR: 0, AGI: 1, INT: 0, VIT: 1 } },
  { id: 'day-3', dateLabel: 'DAY 03', gains: { STR: 2, AGI: 1, INT: 0, VIT: 1 } },
  { id: 'day-4', dateLabel: 'DAY 04', gains: { STR: 1, AGI: 0, INT: 2, VIT: 0 } },
  { id: 'day-5', dateLabel: 'DAY 05', gains: { STR: 0, AGI: 2, INT: 1, VIT: 1 } },
];

export const mockCompletedQuests: CompletedQuestEntry[] = [
  {
    id: 'first-awakening-history',
    title: 'First Awakening',
    completedAt: 'Today · 09:42',
    reward: '+100 XP',
  },
  {
    id: 'mobility-history',
    title: 'Mobility Training',
    completedAt: 'Today · 08:15',
    reward: '+10 XP',
  },
  {
    id: 'daily-focus-history',
    title: 'Daily Focus',
    completedAt: 'Yesterday · 18:30',
    reward: '+25 XP · +1 INT',
  },
];

export const mockLevelMilestones: LevelMilestone[] = [
  { id: 'level-1', level: 1, title: 'System Initiate', reached: true },
  { id: 'level-2', level: 2, title: 'First Evolution', reached: false },
  { id: 'level-5', level: 5, title: 'Proven Hunter', reached: false },
  { id: 'level-10', level: 10, title: 'Awakened Potential', reached: false },
];
