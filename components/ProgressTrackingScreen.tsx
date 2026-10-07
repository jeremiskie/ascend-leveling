import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { PlayerStatus } from '../types/player';
import type { CompletedQuestEntry, LevelMilestone, StatGainEntry } from '../types/progress';
import { CompletedQuestRow } from './CompletedQuestRow';
import { LevelMilestoneRow } from './LevelMilestoneRow';
import { StatGainChart } from './StatGainChart';

interface ProgressTrackingScreenProps {
  player: PlayerStatus;
  statGains: StatGainEntry[];
  completedQuests: CompletedQuestEntry[];
  milestones: LevelMilestone[];
  onBack: () => void;
}

export const ProgressTrackingScreen: React.FC<ProgressTrackingScreenProps> = ({
  player,
  statGains,
  completedQuests,
  milestones,
  onBack,
}) => (
  <SafeAreaView className="flex-1 bg-[#05070D]">
    <StatusBar style="light" />
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-8 px-7 py-8"
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
            SYSTEM // PROGRESS
          </Text>
          <Text className="text-xs text-slate-500">
            {player.name.toUpperCase()} · CAREER RECORD
          </Text>
        </View>
        <Text className="text-xs font-semibold tracking-[0.12em] text-cyan-300">
          LV. {player.level}
        </Text>
      </View>

      <View className="gap-2">
        <Text className="text-3xl font-semibold tracking-[0.1em] text-white">PROGRESS</Text>
        <Text className="text-sm leading-6 text-slate-400">
          Review your growth, completed objectives, and upcoming milestones.
        </Text>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">STAT GAINS</Text>
          <Text className="text-[10px] tracking-[0.12em] text-slate-500">RECENT ACTIVITY</Text>
        </View>
        <StatGainChart entries={statGains} />
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
            COMPLETED QUESTS
          </Text>
          <Text className="text-[10px] tracking-[0.12em] text-emerald-300">
            {completedQuests.length} CLEARED
          </Text>
        </View>
        {completedQuests.map((quest) => (
          <CompletedQuestRow key={quest.id} quest={quest} />
        ))}
      </View>

      <View className="gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-5">
        <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
          LEVEL MILESTONES
        </Text>
        <View className="gap-5">
          {milestones.map((milestone) => (
            <LevelMilestoneRow
              key={milestone.id}
              currentLevel={player.level}
              milestone={milestone}
            />
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
        onPress={onBack}>
        <Text className="text-sm font-semibold tracking-[0.2em] text-cyan-100">
          RETURN TO OVERVIEW
        </Text>
      </Pressable>
    </ScrollView>
  </SafeAreaView>
);
