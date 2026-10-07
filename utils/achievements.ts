import type { Achievement } from '../types/achievement';
import type { PlayerData } from '../types/playerState';

export const achievementCatalog: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first quest.',
    reward: 'Title · First Step',
    rarity: 'common',
    earned: false,
  },
  {
    id: 'awakened',
    title: 'Awakened',
    description: 'Reach Level 2.',
    reward: 'Title · Awakened',
    rarity: 'rare',
    earned: false,
  },
  {
    id: 'disciplined',
    title: 'Disciplined',
    description: 'Complete three daily quests.',
    reward: 'Title · Disciplined',
    rarity: 'common',
    earned: false,
  },
  {
    id: 'dungeon-crawler',
    title: 'Dungeon Crawler',
    description: 'Complete your first combat or dungeon task.',
    reward: 'Title · Dungeon Crawler',
    rarity: 'rare',
    earned: false,
  },
  {
    id: 'stat-novice',
    title: 'Stat Novice',
    description: 'Allocate a stat point or reach 15 total core stats.',
    reward: 'Title · Stat Novice',
    rarity: 'common',
    earned: false,
  },
];

const getUnlocks = (player: PlayerData): Set<string> => {
  const completedQuests = player.completedQuests;
  const totalCoreStats = Object.values(player.coreStats).reduce((sum, value) => sum + value, 0);
  const unlocked = new Set<string>();

  if (completedQuests.length >= 1) unlocked.add('first-step');
  if (player.level >= 2) unlocked.add('awakened');
  if (completedQuests.filter((quest) => quest.category === 'Daily').length >= 3) {
    unlocked.add('disciplined');
  }
  if (completedQuests.some((quest) => quest.category === 'Dungeon')) {
    unlocked.add('dungeon-crawler');
  }
  if (player.statPointsSpent > 0 || totalCoreStats >= 15) unlocked.add('stat-novice');

  return unlocked;
};

export const evaluateAchievements = (player: PlayerData, now: Date = new Date()): PlayerData => {
  const unlocks = getUnlocks(player);
  const alreadyUnlocked = new Set(player.achievementsUnlocked.map((achievement) => achievement.id));
  const unlockedAt = now.toISOString();

  const newlyUnlocked = achievementCatalog
    .filter((achievement) => unlocks.has(achievement.id) && !alreadyUnlocked.has(achievement.id))
    .map((achievement) => ({
      ...achievement,
      earned: true,
      unlockedAt,
      earnedAt: unlockedAt,
    }));

  if (newlyUnlocked.length === 0) return player;

  return {
    ...player,
    achievementsUnlocked: [...player.achievementsUnlocked, ...newlyUnlocked],
  };
};
