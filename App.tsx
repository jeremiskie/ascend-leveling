import { useState } from 'react';
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
import { createMockPlayerStatus } from './data/mockPlayer';
import { mockCompletedQuests, mockLevelMilestones, mockStatGains } from './data/mockProgress';
import { mockAchievements } from './data/mockAchievements';
import {
  mockActiveQuest,
  mockActiveQuests,
  mockDailyPenalty,
  mockDailyTasks,
} from './data/mockQuest';
import type { PlayerProfile, PlayerStatus } from './types/player';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
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
  const [player, setPlayer] = useState<PlayerStatus | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleOnboardingComplete = (profile: PlayerProfile) => {
    setPlayer(createMockPlayerStatus(profile));
    setActiveScreen('status');
  };

  const handleResetPlayerData = () => {
    setPlayer(null);
    setIsDarkTheme(true);
    setAudioEnabled(false);
    setActiveScreen('awakening');
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
        />
      ) : player && activeScreen === 'home' ? (
        <HomeDashboardScreen
          activeQuest={mockActiveQuest}
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
          activeQuests={mockActiveQuests}
          dailyTasks={mockDailyTasks}
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
        <SystemChatScreen onBack={() => setActiveScreen('home')} playerName={player.name} />
      ) : player && activeScreen === 'achievements' ? (
        <AchievementsScreen
          achievements={mockAchievements}
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
