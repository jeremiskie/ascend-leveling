import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { PlayerStatus } from '../types/player';
import type { ActiveQuest } from '../types/quest';
import { ActiveQuestCard } from './ActiveQuestCard';
import { DailyQuickStats } from './DailyQuickStats';
import { HomeShortcut } from './HomeShortcut';

interface HomeDashboardScreenProps {
  player: PlayerStatus;
  activeQuest: ActiveQuest;
  onOpenQuests: () => void;
  onOpenCombat: () => void;
  onOpenProgress: () => void;
  onOpenChat: () => void;
  onOpenAchievements: () => void;
  onOpenProfile: () => void;
  onOpenStatus: () => void;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  player,
  activeQuest,
  onOpenQuests,
  onOpenCombat,
  onOpenProgress,
  onOpenChat,
  onOpenAchievements,
  onOpenProfile,
  onOpenStatus,
}) => (
  <SafeAreaView className="flex-1 bg-[#05070D]">
    <StatusBar style="light" />
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-7 px-7 py-8"
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
            SYSTEM // OVERVIEW
          </Text>
          <Text className="text-xs text-slate-500">WELCOME BACK, {player.name.toUpperCase()}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          className="rounded-lg border border-slate-700 px-3 py-2 active:bg-slate-900"
          onPress={onOpenStatus}>
          <Text className="text-xs font-semibold tracking-[0.12em] text-slate-300">
            PLAYER STATUS
          </Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <Text className="text-3xl font-semibold tracking-[0.08em] text-white">SYSTEM HUB</Text>
        <Text className="text-sm leading-6 text-slate-400">
          Your current standing and next objectives, all in one place.
        </Text>
      </View>

      <DailyQuickStats player={player} />
      <ActiveQuestCard onViewQuest={onOpenQuests} quest={activeQuest} />

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
            QUICK ACCESS
          </Text>
          <Pressable
            accessibilityRole="button"
            className="rounded-lg border border-slate-700 px-3 py-2 active:bg-slate-900"
            onPress={onOpenProfile}>
            <Text className="text-[10px] font-semibold tracking-[0.12em] text-cyan-200">
              PROFILE
            </Text>
          </Pressable>
        </View>
        <View className="flex-row gap-3">
          <HomeShortcut description="Review objectives" label="QUESTS" onPress={onOpenQuests} />
          <HomeShortcut description="Enter the field" label="COMBAT" onPress={onOpenCombat} />
        </View>
        <HomeShortcut
          description="Review stat gains and milestones"
          fullWidth
          label="PROGRESS"
          onPress={onOpenProgress}
        />
        <HomeShortcut
          description="Message the System"
          fullWidth
          label="SYSTEM CHAT"
          onPress={onOpenChat}
        />
        <HomeShortcut
          description="View earned titles and rewards"
          fullWidth
          label="ACHIEVEMENTS"
          onPress={onOpenAchievements}
        />
      </View>
    </ScrollView>
  </SafeAreaView>
);
