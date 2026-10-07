import type { PlayerProfile, PlayerStatus } from '../types/player';
import type { PlayerCoreStats, PlayerData } from '../types/playerState';
import { mockFallbackQuests } from './mockQuest';
import { evaluateAchievements } from '../utils/achievements';

const experienceStatDefaults: Record<PlayerProfile['experienceLevel'], PlayerCoreStats> = {
  beginner: {
    strength: 2,
    endurance: 2,
    agility: 2,
    vitality: 2,
    discipline: 2,
    focus: 2,
    resilience: 2,
    combat: 2,
  },
  intermediate: {
    strength: 4,
    endurance: 4,
    agility: 3,
    vitality: 3,
    discipline: 3,
    focus: 3,
    resilience: 3,
    combat: 3,
  },
  advanced: {
    strength: 5,
    endurance: 5,
    agility: 4,
    vitality: 4,
    discipline: 4,
    focus: 4,
    resilience: 4,
    combat: 4,
  },
};

const conservativeStatDefaults: PlayerCoreStats = {
  strength: 1,
  endurance: 1,
  agility: 1,
  vitality: 1,
  discipline: 1,
  focus: 1,
  resilience: 1,
  combat: 1,
};

export const createPlayerDataFromOnboarding = (profile: PlayerProfile): PlayerData => {
  const hasSafetyConcern = profile.hasInjuryOrMedicalCondition;

  const player: PlayerData = {
    ...profile,
    safetyState: hasSafetyConcern ? 'ADAPTIVE' : 'SAFETY',
    level: 1,
    rank: 'E',
    exp: 0,
    statPoints: hasSafetyConcern ? 0 : 5,
    statPointsSpent: 0,
    coreStats: hasSafetyConcern
      ? { ...conservativeStatDefaults }
      : { ...experienceStatDefaults[profile.experienceLevel] },
    activeQuests: mockFallbackQuests.map((quest) => ({
      ...quest,
      statBonuses: { ...quest.statBonuses },
    })),
    completedQuests: [],
    achievementsUnlocked: [],
  };

  return evaluateAchievements(player);
};

export const createMockPlayerStatus = (profile: PlayerProfile): PlayerStatus => {
  const coreStats = profile.hasInjuryOrMedicalCondition
    ? conservativeStatDefaults
    : experienceStatDefaults[profile.experienceLevel];

  return {
    ...profile,
    level: 1,
    currentHp: 100,
    maxHp: 100,
    currentMp: 50,
    maxMp: 50,
    attributes: {
      STR: coreStats.strength,
      AGI: coreStats.agility,
      INT: coreStats.focus,
      VIT: coreStats.vitality,
    },
    availableStatPoints: profile.hasInjuryOrMedicalCondition ? 0 : 5,
  };
};
