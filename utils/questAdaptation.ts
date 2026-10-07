import type { PlayerData } from '../types/playerState';
import type { QuestAdaptation } from '../types/questAdaptation';

export const applyQuestAdaptationToPlayer = (
  player: PlayerData,
  adaptation: QuestAdaptation
): PlayerData | null => {
  if (
    !Number.isInteger(adaptation.availableMinutes) ||
    adaptation.availableMinutes < 1 ||
    adaptation.availableMinutes > 180 ||
    adaptation.quests.length === 0 ||
    adaptation.quests.length > 5
  ) {
    return null;
  }

  const questIds = new Set<string>();
  const completedQuestIds = new Set(player.completedQuests.map((quest) => quest.id));
  for (const quest of adaptation.quests) {
    if (
      !quest.id ||
      questIds.has(quest.id) ||
      completedQuestIds.has(quest.id) ||
      quest.status !== 'inProgress' ||
      !quest.title.trim() ||
      !Number.isInteger(quest.expReward) ||
      quest.expReward < 50 ||
      quest.expReward > 500 ||
      !Number.isInteger(quest.estimatedMinutes) ||
      !quest.estimatedMinutes ||
      quest.estimatedMinutes > adaptation.availableMinutes ||
      Object.values(quest.statBonuses).some(
        (amount) => amount !== undefined && (!Number.isInteger(amount) || amount < 0 || amount > 5)
      )
    ) {
      return null;
    }
    questIds.add(quest.id);
  }

  if (
    adaptation.mode === 'PHYSICAL_LIMITATION' &&
    adaptation.quests.some((quest) => quest.goalCategory !== 'Recovery')
  ) {
    return null;
  }
  const totalEstimatedMinutes = adaptation.quests.reduce(
    (total, quest) => total + (quest.estimatedMinutes ?? 181),
    0
  );
  if (
    (adaptation.mode === 'TIME_CONSTRAINT' &&
      totalEstimatedMinutes > adaptation.availableMinutes) ||
    (adaptation.mode === 'BURNOUT' && totalEstimatedMinutes > 15)
  ) {
    return null;
  }
  if (
    adaptation.mode === 'BURNOUT' &&
    adaptation.quests.some(
      (quest) => quest.difficulty !== 'EASY' || (quest.estimatedMinutes ?? 181) > 15
    )
  ) {
    return null;
  }

  const isPhysicalLimitation = adaptation.mode === 'PHYSICAL_LIMITATION';
  return {
    ...player,
    activeQuests: adaptation.quests.map((quest) => ({
      ...quest,
      progress: 0,
      target: 1,
      statBonuses: { ...quest.statBonuses },
    })),
    ...(isPhysicalLimitation
      ? { hasInjuryOrMedicalCondition: true, safetyState: 'ADAPTIVE' as const }
      : {}),
  };
};
