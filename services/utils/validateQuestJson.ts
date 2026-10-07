import type { QuestStatBonuses } from '../../types/quest';

export type GeneratedQuestCategory = 'PHYSICAL' | 'MENTAL' | 'DISCIPLINE' | 'RECOVERY' | 'COMBAT';
export type GeneratedQuestDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ValidatedQuestJson {
  title: string;
  description: string;
  category: GeneratedQuestCategory;
  difficulty: GeneratedQuestDifficulty;
  estimatedMinutes: number;
  recommendedExp: number;
  statRewards: QuestStatBonuses;
}

const statNames: Record<string, keyof QuestStatBonuses> = {
  strength: 'strength',
  str: 'strength',
  endurance: 'endurance',
  agility: 'agility',
  agi: 'agility',
  vitality: 'vitality',
  vit: 'vitality',
  discipline: 'discipline',
  focus: 'focus',
  intelligence: 'focus',
  int: 'focus',
  resilience: 'resilience',
  combat: 'combat',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeStatRewards = (value: unknown): QuestStatBonuses => {
  if (!isRecord(value)) return {};

  const rewards: QuestStatBonuses = {};
  for (const [rawName, rawAmount] of Object.entries(value)) {
    const normalizedName = rawName.trim().toLowerCase();
    const stat = Object.hasOwn(statNames, normalizedName) ? statNames[normalizedName] : undefined;
    if (!stat || typeof rawAmount !== 'number' || !Number.isFinite(rawAmount)) continue;

    const amount = Math.min(Math.floor(rawAmount), 5);
    if (amount > 0) rewards[stat] = Math.max(rewards[stat] ?? 0, amount);
  }
  return rewards;
};

export const validateQuestJson = (data: unknown): ValidatedQuestJson | null => {
  if (!isRecord(data)) return null;

  const categories = ['PHYSICAL', 'MENTAL', 'DISCIPLINE', 'RECOVERY', 'COMBAT'] as const;
  const difficulties = ['EASY', 'MEDIUM', 'HARD'] as const;

  if (typeof data.title !== 'string' || typeof data.description !== 'string') return null;
  if (
    typeof data.category !== 'string' ||
    !categories.some((category) => category === data.category)
  ) {
    return null;
  }
  if (
    typeof data.difficulty !== 'string' ||
    !difficulties.some((difficulty) => difficulty === data.difficulty)
  ) {
    return null;
  }
  if (
    typeof data.estimatedMinutes !== 'number' ||
    !Number.isInteger(data.estimatedMinutes) ||
    data.estimatedMinutes < 1 ||
    data.estimatedMinutes > 180
  ) {
    return null;
  }
  if (
    typeof data.recommendedExp !== 'number' ||
    !Number.isInteger(data.recommendedExp) ||
    data.recommendedExp < 50 ||
    data.recommendedExp > 500
  ) {
    return null;
  }
  if (!isRecord(data.statRewards)) return null;

  const title = data.title.trim();
  const description = data.description.trim();
  if (
    title.length === 0 ||
    title.length > 80 ||
    description.length === 0 ||
    description.length > 500
  ) {
    return null;
  }

  return {
    title,
    description,
    category: data.category as GeneratedQuestCategory,
    difficulty: data.difficulty as GeneratedQuestDifficulty,
    estimatedMinutes: data.estimatedMinutes,
    recommendedExp: data.recommendedExp,
    statRewards: sanitizeStatRewards(data.statRewards),
  };
};
