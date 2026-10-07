import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { DailyPenalty, QuestListItem } from '../types/quest';
import { DailyPenaltyTimer } from './DailyPenaltyTimer';
import { QuestListItemCard } from './QuestListItemCard';

interface QuestScreenProps {
  activeQuests: QuestListItem[];
  dailyTasks: QuestListItem[];
  penalty: DailyPenalty;
  onBack: () => void;
}

export const QuestScreen: React.FC<QuestScreenProps> = ({
  activeQuests,
  dailyTasks,
  penalty,
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
            SYSTEM // QUESTS
          </Text>
          <Text className="text-xs text-slate-500">OBJECTIVES & DAILY PROTOCOLS</Text>
        </View>
        <Text className="text-[10px] tracking-[0.16em] text-cyan-300">
          {activeQuests.filter((quest) => quest.status === 'inProgress').length} ACTIVE
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-3xl font-semibold tracking-[0.1em] text-white">QUEST LOG</Text>
        <Text className="text-sm leading-6 text-slate-400">
          Complete your objectives to claim their rewards.
        </Text>
      </View>

      <View className="gap-3">
        <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">QUESTS</Text>
        {activeQuests.map((quest) => (
          <QuestListItemCard key={quest.id} quest={quest} />
        ))}
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
            DAILY TASKS
          </Text>
          <Text className="text-[10px] tracking-[0.14em] text-slate-500">RESET AT 00:00</Text>
        </View>
        {dailyTasks.map((task) => (
          <QuestListItemCard key={task.id} quest={task} />
        ))}
      </View>

      <DailyPenaltyTimer penalty={penalty} />

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
