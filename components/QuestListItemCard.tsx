import { Text, View } from 'react-native';
import type { QuestListItem } from '../types/quest';
import { QuestStatusBadge } from './QuestStatusBadge';

interface QuestListItemCardProps {
  quest: QuestListItem;
}

export const QuestListItemCard: React.FC<QuestListItemCardProps> = ({ quest }) => {
  const progressPercent =
    quest.target > 0 ? Math.min(Math.max((quest.progress / quest.target) * 100, 0), 100) : 0;
  const progressColor =
    quest.status === 'completed'
      ? 'bg-emerald-300'
      : quest.status === 'failed'
        ? 'bg-rose-300'
        : 'bg-cyan-300';

  return (
    <View className="gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold tracking-[0.06em] text-white">
            {quest.title}
          </Text>
          <Text className="text-sm leading-5 text-slate-400">{quest.description}</Text>
        </View>
        <QuestStatusBadge status={quest.status} />
      </View>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-[10px] font-medium tracking-[0.16em] text-slate-500">
            {quest.category.toUpperCase()} OBJECTIVE
          </Text>
          <Text className="text-xs tabular-nums text-slate-400">
            {quest.progress}/{quest.target}
          </Text>
        </View>
        <View
          accessibilityLabel={`${quest.title}: ${quest.progress} of ${quest.target}`}
          className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <View
            className={`h-full rounded-full ${progressColor}`}
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <View className="flex-row items-center justify-between border-t border-slate-800 pt-3">
        <Text className="text-[10px] tracking-[0.12em] text-slate-500">QUEST REWARD</Text>
        <Text className="text-xs font-medium text-cyan-200">{quest.reward}</Text>
      </View>
    </View>
  );
};
