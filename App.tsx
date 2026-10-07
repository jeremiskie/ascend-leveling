import { useMemo, useState } from 'react';
import { SystemAwakeningScreen } from './components/SystemAwakeningScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { PlayerStatusScreen } from './components/PlayerStatusScreen';
import { HomeDashboardScreen } from './components/HomeDashboardScreen';
import { CombatScreen } from './components/CombatScreen';
import { SystemChatScreen } from './components/SystemChatScreen';
import { QuestScreen } from './components/QuestScreen';
import { ProgressTrackingScreen } from './components/ProgressTrackingScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { createMockPlayerStatus, createPlayerDataFromOnboarding } from './data/mockPlayer';
import { mockCompletedQuests, mockLevelMilestones, mockStatGains } from './data/mockProgress';
import { achievementCatalog } from './utils/achievements';
import { mockActiveQuest, mockDailyPenalty } from './data/mockQuest';
import { generateQuestRecommendation } from './services/questGeneratorService';
import type { PlayerProfile } from './types/player';
import {
  createInitialPlayerData,
  PlayerStateProvider,
  usePlayerState,
} from './state/PlayerStateContext';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <PlayerStateProvider>
      <AppNavigation />
    </PlayerStateProvider>
  );
}

function AppNavigation() {
  const {
    playerData,
    setPlayerData,
    resetPlayerData,
    completeQuest,
    addQuest,
    applyQuestAdaptation,
    allocateStatPoint,
  } = usePlayerState();
  const [activeScreen, setActiveScreen] = useState<
    | 'awakening'
    | 'onboarding'
    | 'status'
    | 'home'
    | 'quests'
    | 'combat'
    | 'progress'
    | 'chat'
    | 'achievements'
    | 'profile'
  >('awakening');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const player = useMemo(() => {
    if (
      !playerData.name ||
      !playerData.playerClass ||
      playerData.age === null ||
      !playerData.sex ||
      !playerData.experienceLevel
    ) {
      return null;
    }

    const profile: PlayerProfile = {
      name: playerData.name,
      playerClass: playerData.playerClass,
      age: playerData.age,
      sex: playerData.sex,
      experienceLevel: playerData.experienceLevel,
      goals: playerData.goals,
      hasInjuryOrMedicalCondition: playerData.hasInjuryOrMedicalCondition,
      safetyState: playerData.safetyState,
    };

    const basePlayer = createMockPlayerStatus(profile);
    return {
      ...basePlayer,
      level: playerData.level,
      availableStatPoints: playerData.statPoints,
      attributes: {
        STR: playerData.coreStats.strength,
        AGI: playerData.coreStats.agility,
        INT: playerData.coreStats.focus,
        VIT: playerData.coreStats.vitality,
      },
    };
  }, [playerData]);

  const handleOnboardingComplete = (profile: PlayerProfile) => {
    setPlayerData(createPlayerDataFromOnboarding(profile));
    setActiveScreen('status');
  };

  const handleResetPlayerData = () => {
    if (__DEV__) {
      resetPlayerData();
    } else {
      setPlayerData(createInitialPlayerData());
    }
    setIsDarkTheme(true);
    setAudioEnabled(false);
    setActiveScreen('awakening');
  };
  const dashboardQuest =
    playerData.activeQuests.find((quest) => quest.status === 'inProgress') ?? mockActiveQuest;

  const handleGenerateQuest = async (availableMinutes: number) => {
    const result = await generateQuestRecommendation(playerData, availableMinutes);
    if (!addQuest(result.quest)) {
      throw new Error('The generated quest could not be added to the active quest list.');
    }
    return result;
  };

  return (
    <SafeAreaProvider>
      {activeScreen === 'awakening' ? (
        <SystemAwakeningScreen onContinue={() => setActiveScreen('onboarding')} />
      ) : activeScreen === 'onboarding' ? (
        <OnboardingScreen
          onBack={() => setActiveScreen('awakening')}
          onComplete={handleOnboardingComplete}
        />
      ) : player && activeScreen === 'status' ? (
        <PlayerStatusScreen
          player={player}
          onBack={() => setActiveScreen('onboarding')}
          onContinue={() => setActiveScreen('home')}
          onAllocateStat={allocateStatPoint}
        />
      ) : player && activeScreen === 'home' ? (
        <HomeDashboardScreen
          activeQuest={dashboardQuest}
          onOpenCombat={() => setActiveScreen('combat')}
          onOpenChat={() => setActiveScreen('chat')}
          onOpenAchievements={() => setActiveScreen('achievements')}
          onOpenProfile={() => setActiveScreen('profile')}
          onOpenProgress={() => setActiveScreen('progress')}
          onOpenQuests={() => setActiveScreen('quests')}
          onOpenStatus={() => setActiveScreen('status')}
          player={player}
        />
      ) : player && activeScreen === 'quests' ? (
        <QuestScreen
          quests={[...playerData.activeQuests, ...playerData.completedQuests]}
          onCompleteQuest={completeQuest}
          onGenerateQuest={handleGenerateQuest}
          onBack={() => setActiveScreen('home')}
          penalty={mockDailyPenalty}
        />
      ) : player && activeScreen === 'progress' ? (
        <ProgressTrackingScreen
          completedQuests={mockCompletedQuests}
          milestones={mockLevelMilestones}
          onBack={() => setActiveScreen('home')}
          player={player}
          statGains={mockStatGains}
        />
      ) : player && activeScreen === 'combat' ? (
        <CombatScreen onBack={() => setActiveScreen('home')} player={player} />
      ) : player && activeScreen === 'chat' ? (
        <SystemChatScreen
          onAcceptQuestAdaptation={applyQuestAdaptation}
          onBack={() => setActiveScreen('home')}
          playerData={playerData}
        />
      ) : player && activeScreen === 'achievements' ? (
        <AchievementsScreen
          achievements={achievementCatalog.map(
            (achievement) =>
              playerData.achievementsUnlocked.find((unlocked) => unlocked.id === achievement.id) ??
              achievement
          )}
          onBack={() => setActiveScreen('home')}
        />
      ) : player && activeScreen === 'profile' ? (
        <ProfileScreen
          audioEnabled={audioEnabled}
          isDarkTheme={isDarkTheme}
          onBack={() => setActiveScreen('home')}
          onOpenAchievements={() => setActiveScreen('achievements')}
          onOpenStatus={() => setActiveScreen('status')}
          onResetData={handleResetPlayerData}
          onToggleAudio={setAudioEnabled}
          onToggleTheme={(enabled) => setIsDarkTheme(!enabled)}
          player={player}
        />
      ) : (
        <OnboardingScreen onBack={() => setActiveScreen('awakening')} />
      )}
    </SafeAreaProvider>
  );
}
