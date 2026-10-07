import { createContext, useContext, useRef, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import type { PlayerData } from '../types/playerState';
import type { PlayerStatKey } from '../types/player';
import type { QuestCompletionResult, QuestListItem } from '../types/quest';
import type { QuestAdaptation } from '../types/questAdaptation';
import { addExpToPlayer } from '../utils/progression';
import { evaluateAchievements } from '../utils/achievements';
import { applyQuestAdaptationToPlayer } from '../utils/questAdaptation';

export type { PlayerCoreStats, PlayerData } from '../types/playerState';

export interface StatAllocationResult {
  allocated: boolean;
  stat: PlayerStatKey | null;
}

const statKeyToCoreStat: Record<PlayerStatKey, keyof PlayerData['coreStats']> = {
  STR: 'strength',
  AGI: 'agility',
  INT: 'focus',
  VIT: 'vitality',
};

interface PlayerStateContextValue {
  playerData: PlayerData;
  setPlayerData: Dispatch<SetStateAction<PlayerData>>;
  addExp: (amount: number) => ReturnType<typeof addExpToPlayer>['event'];
  completeQuest: (questId: string) => QuestCompletionResult;
  addQuest: (quest: QuestListItem) => boolean;
  applyQuestAdaptation: (adaptation: QuestAdaptation) => boolean;
  allocateStatPoint: (stat: PlayerStatKey) => StatAllocationResult;
  resetPlayerData: () => void;
}

const PlayerStateContext = createContext<PlayerStateContextValue | null>(null);

export const createInitialPlayerData = (): PlayerData => ({
  name: '',
  playerClass: null,
  age: null,
  sex: null,
  experienceLevel: null,
  goals: [],
  hasInjuryOrMedicalCondition: false,
  safetyState: 'SAFETY',
  level: 1,
  rank: 'E',
  exp: 0,
  statPoints: 0,
  statPointsSpent: 0,
  coreStats: {
    strength: 0,
    endurance: 0,
    agility: 0,
    vitality: 0,
    discipline: 0,
    focus: 0,
    resilience: 0,
    combat: 0,
  },
  activeQuests: [],
  completedQuests: [],
  achievementsUnlocked: [],
});

export const PlayerStateProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [playerData, setPlayerDataState] = useState<PlayerData>(createInitialPlayerData);
  const playerDataRef = useRef(playerData);

  const setPlayerData: Dispatch<SetStateAction<PlayerData>> = (action) => {
    const nextPlayerData = typeof action === 'function' ? action(playerDataRef.current) : action;
    playerDataRef.current = nextPlayerData;
    setPlayerDataState(nextPlayerData);
  };

  const addExp: PlayerStateContextValue['addExp'] = (amount) => {
    const result = addExpToPlayer(playerDataRef.current, amount);
    setPlayerData(evaluateAchievements(result.playerData));
    return result.event;
  };

  const completeQuest: PlayerStateContextValue['completeQuest'] = (questId) => {
    const current = playerDataRef.current;
    const quest = current.activeQuests.find(
      (item) => item.id === questId && item.status === 'inProgress'
    );

    if (!quest) {
      return { completed: false, quest: null, levelUpEvent: null };
    }

    const completedQuest = { ...quest, progress: quest.target, status: 'completed' as const };
    const expResult = addExpToPlayer(current, quest.expReward);
    const nextPlayer = {
      ...expResult.playerData,
      activeQuests: current.activeQuests.filter((item) => item.id !== questId),
      completedQuests: [...current.completedQuests, completedQuest],
      coreStats: {
        ...current.coreStats,
        strength: current.coreStats.strength + (quest.statBonuses.strength ?? 0),
        endurance: current.coreStats.endurance + (quest.statBonuses.endurance ?? 0),
        agility: current.coreStats.agility + (quest.statBonuses.agility ?? 0),
        vitality: current.coreStats.vitality + (quest.statBonuses.vitality ?? 0),
        discipline: current.coreStats.discipline + (quest.statBonuses.discipline ?? 0),
        focus: current.coreStats.focus + (quest.statBonuses.focus ?? 0),
        resilience: current.coreStats.resilience + (quest.statBonuses.resilience ?? 0),
        combat: current.coreStats.combat + (quest.statBonuses.combat ?? 0),
      },
    };
    setPlayerData(evaluateAchievements(nextPlayer));

    return { completed: true, quest: completedQuest, levelUpEvent: expResult.event };
  };

  const addQuest: PlayerStateContextValue['addQuest'] = (quest) => {
    const current = playerDataRef.current;
    if (
      current.activeQuests.some((item) => item.id === quest.id) ||
      current.completedQuests.some((item) => item.id === quest.id)
    ) {
      return false;
    }

    setPlayerData({
      ...current,
      activeQuests: [...current.activeQuests, quest],
    });
    return true;
  };

  const applyQuestAdaptation: PlayerStateContextValue['applyQuestAdaptation'] = (adaptation) => {
    const nextPlayer = applyQuestAdaptationToPlayer(playerDataRef.current, adaptation);
    if (!nextPlayer) return false;

    setPlayerData(nextPlayer);
    return true;
  };

  const allocateStatPoint: PlayerStateContextValue['allocateStatPoint'] = (stat) => {
    const current = playerDataRef.current;
    if (current.statPoints <= 0) return { allocated: false, stat: null };

    const nextPlayer: PlayerData = {
      ...current,
      statPoints: current.statPoints - 1,
      statPointsSpent: current.statPointsSpent + 1,
      coreStats: {
        ...current.coreStats,
        [statKeyToCoreStat[stat]]: current.coreStats[statKeyToCoreStat[stat]] + 1,
      },
    };

    setPlayerData(evaluateAchievements(nextPlayer));
    return { allocated: true, stat };
  };

  const resetPlayerData = () => {
    if (!__DEV__) {
      throw new Error('resetPlayerData is only available in development builds.');
    }

    setPlayerData(createInitialPlayerData());
  };

  return (
    <PlayerStateContext.Provider
      value={{
        playerData,
        setPlayerData,
        addExp,
        completeQuest,
        addQuest,
        applyQuestAdaptation,
        allocateStatPoint,
        resetPlayerData,
      }}>
      {children}
    </PlayerStateContext.Provider>
  );
};

export const usePlayerState = (): PlayerStateContextValue => {
  const context = useContext(PlayerStateContext);

  if (!context) {
    throw new Error('usePlayerState must be used within a PlayerStateProvider.');
  }

  return context;
};
