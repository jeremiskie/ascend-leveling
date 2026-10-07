import { mockFallbackQuests } from '../data/mockQuest';
import type { PlayerData } from '../types/playerState';
import type { QuestGoalCategory, QuestListItem } from '../types/quest';
import {
  validateQuestJson,
  type GeneratedQuestCategory,
  type ValidatedQuestJson,
} from './utils/validateQuestJson';

declare const process: {
  env: {
    EXPO_PUBLIC_GEMINI_API_KEY?: string;
  };
};

const MODEL = 'gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 20_000;
let questIdCounter = 0;

interface GeminiQuestRequest {
  systemInstruction: { parts: { text: string }[] };
  contents: { role: 'user'; parts: { text: string }[] }[];
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
    responseMimeType: 'application/json';
    responseSchema: {
      type: 'OBJECT';
      properties: Record<
        string,
        {
          type: 'STRING' | 'INTEGER' | 'OBJECT';
          enum?: string[];
          properties?: Record<string, { type: 'INTEGER' }>;
        }
      >;
      required: string[];
    };
  };
}

const questResponseSchema: GeminiQuestRequest['generationConfig']['responseSchema'] = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    description: { type: 'STRING' },
    category: {
      type: 'STRING',
      enum: ['PHYSICAL', 'MENTAL', 'DISCIPLINE', 'RECOVERY', 'COMBAT'],
    },
    difficulty: { type: 'STRING', enum: ['EASY', 'MEDIUM', 'HARD'] },
    estimatedMinutes: { type: 'INTEGER' },
    recommendedExp: { type: 'INTEGER' },
    statRewards: {
      type: 'OBJECT',
      properties: {
        strength: { type: 'INTEGER' },
        endurance: { type: 'INTEGER' },
        agility: { type: 'INTEGER' },
        vitality: { type: 'INTEGER' },
        discipline: { type: 'INTEGER' },
        focus: { type: 'INTEGER' },
        resilience: { type: 'INTEGER' },
        combat: { type: 'INTEGER' },
      },
    },
  },
  required: [
    'title',
    'description',
    'category',
    'difficulty',
    'estimatedMinutes',
    'recommendedExp',
    'statRewards',
  ],
};

const extractResponseText = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object' || !('candidates' in payload)) return null;
  const candidates = payload.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const candidate: unknown = candidates[0];
  if (!candidate || typeof candidate !== 'object' || !('content' in candidate)) return null;
  const content = candidate.content;
  if (!content || typeof content !== 'object' || !('parts' in content)) return null;
  if (!Array.isArray(content.parts)) return null;

  const text = content.parts
    .flatMap((part: unknown) =>
      part && typeof part === 'object' && 'text' in part && typeof part.text === 'string'
        ? [part.text]
        : []
    )
    .join('')
    .trim();
  return text || null;
};

const parseJsonResponse = (text: string): unknown => {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fencedMatch ? fencedMatch[1] : trimmed) as unknown;
};

const getQuestCategories = (
  category: GeneratedQuestCategory
): { category: QuestListItem['category']; goalCategory: QuestGoalCategory } => {
  switch (category) {
    case 'PHYSICAL':
      return { category: 'Daily', goalCategory: 'Physical' };
    case 'MENTAL':
      return { category: 'Daily', goalCategory: 'Mental' };
    case 'DISCIPLINE':
      return { category: 'Daily', goalCategory: 'Discipline' };
    case 'RECOVERY':
      return { category: 'Daily', goalCategory: 'Recovery' };
    case 'COMBAT':
      return { category: 'Dungeon', goalCategory: 'Physical' };
  }
};

const formatReward = (exp: number, rewards: QuestListItem['statBonuses']): string => {
  const stats = Object.entries(rewards)
    .filter(([, value]) => value && value > 0)
    .map(([name, amount]) => `+${amount} ${name[0].toUpperCase()}${name.slice(1)}`);
  return [`+${exp} EXP`, ...stats].join(' · ');
};

export const createQuestListItem = (quest: ValidatedQuestJson): QuestListItem => {
  const mappedCategory = getQuestCategories(quest.category);
  questIdCounter += 1;

  return {
    id: `ai-quest-${Date.now()}-${questIdCounter}`,
    title: quest.title,
    description: quest.description,
    category: mappedCategory.category,
    goalCategory: mappedCategory.goalCategory,
    progress: 0,
    target: 1,
    reward: formatReward(quest.recommendedExp, quest.statRewards),
    expReward: quest.recommendedExp,
    statBonuses: quest.statRewards,
    status: 'inProgress',
    difficulty: quest.difficulty,
    estimatedMinutes: quest.estimatedMinutes,
    isAiGenerated: true,
  };
};

const categoryForGoal = (player: PlayerData): GeneratedQuestCategory => {
  if (player.hasInjuryOrMedicalCondition || player.safetyState === 'ADAPTIVE') {
    if (player.goals.includes('mental')) return 'MENTAL';
    if (player.goals.includes('lifestyle')) return 'DISCIPLINE';
    return 'RECOVERY';
  }
  if (player.goals.includes('combat')) return 'COMBAT';
  if (player.goals.includes('physical')) return 'PHYSICAL';
  if (player.goals.includes('mental')) return 'MENTAL';
  if (player.goals.includes('lifestyle')) return 'DISCIPLINE';
  return 'DISCIPLINE';
};

const createFallbackQuest = (player: PlayerData, availableMinutes: number): QuestListItem => {
  const preferredCategory = categoryForGoal(player);
  const categoryGoals: Record<GeneratedQuestCategory, QuestGoalCategory> = {
    PHYSICAL: 'Physical',
    MENTAL: 'Mental',
    DISCIPLINE: 'Discipline',
    RECOVERY: 'Recovery',
    COMBAT: 'Physical',
  };
  const estimatedMinutes: Record<string, number> = {
    'daily-strength': 15,
    'daily-focus': 25,
    'daily-recovery': 5,
    'weekly-endurance': 45,
    'weekly-discipline': 10,
    'dungeon-gate': 20,
  };
  const preferredGoalCategory = categoryGoals[preferredCategory];
  const eligibleQuests = mockFallbackQuests.filter(
    (quest) =>
      estimatedMinutes[quest.id] <= availableMinutes &&
      (preferredCategory === 'COMBAT'
        ? quest.category === 'Dungeon'
        : quest.category === 'Daily' && quest.goalCategory === preferredGoalCategory)
  );
  const fallback =
    eligibleQuests[0] ?? mockFallbackQuests.find((quest) => quest.id === 'daily-recovery')!;
  const category: GeneratedQuestCategory =
    fallback.goalCategory === 'Mental'
      ? 'MENTAL'
      : fallback.goalCategory === 'Recovery'
        ? 'RECOVERY'
        : fallback.goalCategory === 'Discipline'
          ? 'DISCIPLINE'
          : preferredCategory === 'COMBAT'
            ? 'COMBAT'
            : 'PHYSICAL';
  const questEstimatedMinutes = estimatedMinutes[fallback.id];

  return createQuestListItem({
    title: fallback.title,
    description: `${fallback.description} (Offline recommendation.)`,
    category,
    difficulty: 'EASY',
    estimatedMinutes: questEstimatedMinutes,
    recommendedExp: Math.max(50, Math.min(fallback.expReward, 500)),
    statRewards: { ...fallback.statBonuses },
  });
};

export interface QuestGenerationResult {
  quest: QuestListItem;
  usedFallback: boolean;
}

export const generateQuestRecommendation = async (
  player: PlayerData,
  availableMinutes: number
): Promise<QuestGenerationResult> => {
  const safeAvailableMinutes = Number.isFinite(availableMinutes)
    ? Math.min(Math.max(Math.floor(availableMinutes), 1), 180)
    : 30;
  const fallbackResult = (): QuestGenerationResult => ({
    quest: createFallbackQuest(player, safeAvailableMinutes),
    usedFallback: true,
  });
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return fallbackResult();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const request: GeminiQuestRequest = {
      systemInstruction: {
        parts: [
          {
            text: [
              'You are the ASCEND System: calm, objective, direct, encouraging, and slightly mysterious.',
              'Recommend one safe, realistic, actionable quest tailored to the player profile and time limit.',
              'If safetyFlag is ADAPTIVE, avoid intense or risky physical tasks and prefer conservative options.',
              'Return exactly one JSON object matching the provided schema. Do not add Markdown or commentary.',
              'Use only stat reward keys from the schema. Keep each stat reward between 0 and 5 and recommendedExp between 50 and 500.',
              'Recommendations do not modify game progression; local app logic owns all state changes.',
            ].join('\n'),
          },
        ],
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Player context: ${JSON.stringify({
                name: player.name,
                level: player.level,
                rank: player.rank,
                coreStats: player.coreStats,
                goals: player.goals,
                safetyFlag: player.hasInjuryOrMedicalCondition ? 'ADAPTIVE' : player.safetyState,
              })}\nAvailable time: ${safeAvailableMinutes} minutes.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
        responseSchema: questResponseSchema,
      },
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      }
    );
    if (!response.ok) return fallbackResult();

    const responseText = extractResponseText(await response.json());
    if (!responseText) return fallbackResult();

    try {
      const validated = validateQuestJson(parseJsonResponse(responseText));
      return validated && validated.estimatedMinutes <= safeAvailableMinutes
        ? { quest: createQuestListItem(validated), usedFallback: false }
        : fallbackResult();
    } catch {
      return fallbackResult();
    }
  } catch {
    return fallbackResult();
  } finally {
    clearTimeout(timeout);
  }
};
