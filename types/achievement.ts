export type AchievementRarity = 'common' | 'rare' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: string;
  rarity: AchievementRarity;
  earned: boolean;
  unlockedAt?: string;
  earnedAt?: string;
}
