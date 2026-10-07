import type { Achievement } from '../types/achievement';

export const mockAchievements: Achievement[] = [
  {
    id: 'one-who-overcomes',
    title: 'One Who Overcomes',
    description: 'Complete your first System challenge.',
    reward: 'Title · +50 Max HP',
    rarity: 'rare',
    earned: true,
    earnedAt: 'Today',
  },
  {
    id: 'monarch-of-shadows',
    title: 'Monarch of Shadows',
    description: 'Reach the highest hunter rank.',
    reward: 'Title · +10% Attack',
    rarity: 'legendary',
    earned: false,
  },
  {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Clear your first dungeon gate.',
    reward: 'Title · +5 STR',
    rarity: 'common',
    earned: false,
  },
  {
    id: 'daily-discipline',
    title: 'Daily Discipline',
    description: 'Complete every daily task for seven days.',
    reward: 'Title · +5 VIT',
    rarity: 'rare',
    earned: false,
  },
  {
    id: 'awakening',
    title: 'Awakening',
    description: 'Register as a player with the System.',
    reward: 'Title · +1 Stat Point',
    rarity: 'common',
    earned: true,
    earnedAt: 'Today',
  },
  {
    id: 'gate-breaker',
    title: 'Gate Breaker',
    description: 'Clear ten dungeon gates.',
    reward: 'Title · +10% XP',
    rarity: 'rare',
    earned: false,
  },
];
