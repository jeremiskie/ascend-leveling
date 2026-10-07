import type { ExperienceLevel, PlayerClass, PlayerGoal, PlayerSex, SafetyState } from './player';
import type { Achievement } from './achievement';
import type { QuestListItem } from './quest';

export interface PlayerCoreStats {
  strength: number;
  endurance: number;
  agility: number;
  vitality: number;
  discipline: number;
  focus: number;
  resilience: number;
  combat: number;
}

export interface PlayerData {
  name: string;
  playerClass: PlayerClass | null;
  age: number | null;
  sex: PlayerSex | null;
  experienceLevel: ExperienceLevel | null;
  goals: PlayerGoal[];
  hasInjuryOrMedicalCondition: boolean;
  safetyState: SafetyState;
  level: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  exp: number;
  statPoints: number;
  statPointsSpent: number;
  coreStats: PlayerCoreStats;
  activeQuests: QuestListItem[];
  completedQuests: QuestListItem[];
  achievementsUnlocked: Achievement[];
}
