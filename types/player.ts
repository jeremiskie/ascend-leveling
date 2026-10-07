export type PlayerClass = 'Vanguard' | 'Arcanist' | 'Ranger';
export type PlayerStatKey = 'STR' | 'AGI' | 'INT' | 'VIT';
export type PlayerSex = 'female' | 'male' | 'intersex' | 'preferNotToSay';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type PlayerGoal = 'physical' | 'mental' | 'lifestyle' | 'combat';
export type SafetyState = 'SAFETY' | 'ADAPTIVE';

export interface PlayerProfile {
  name: string;
  playerClass: PlayerClass;
  age: number;
  sex: PlayerSex;
  experienceLevel: ExperienceLevel;
  goals: PlayerGoal[];
  hasInjuryOrMedicalCondition: boolean;
  safetyState: SafetyState;
}

export interface PlayerStatus extends PlayerProfile {
  level: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  attributes: Record<PlayerStatKey, number>;
  availableStatPoints: number;
}
