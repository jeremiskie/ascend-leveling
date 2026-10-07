import { Pressable, Text, View } from 'react-native';
import type { ActiveQuest } from '../types/quest';

interface ActiveQuestCardProps {
  quest: ActiveQuest;
  onViewQuest: () => void;
}

export const ActiveQuestCard: React.FC<ActiveQuestCardProps> = ({ quest, onViewQuest }) => {
  const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);

  return (
    <View className="gap-4 rounded-lg border border-cyan-200/20 bg-cyan-300/[0.04] p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-[0.24em] text-cyan-200">
          ACTIVE {quest.category.toUpperCase()} QUEST
        </Text>
        <Text className="text-xs tabular-nums text-slate-400">
          {quest.progress}/{quest.target}
        </Text>
      </View>
      <View className="gap-2">
        <Text className="text-lg font-semibold tracking-[0.08em] text-white">{quest.title}</Text>
        <Text className="text-sm leading-5 text-slate-400">{quest.description}</Text>
      </View>
      <View className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <View
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${progressPercent}%` }}
        />
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[10px] tracking-[0.12em] text-slate-500">REWARD</Text>
        <Text className="text-xs font-medium text-cyan-200">{quest.reward}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        className="items-center rounded-lg border border-slate-700 px-4 py-3 active:bg-slate-900"
        onPress={onViewQuest}>
        <Text className="text-xs font-semibold tracking-[0.18em] text-slate-200">VIEW QUESTS</Text>
      </Pressable>
    </View>
  );
};
