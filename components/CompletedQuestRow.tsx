import { Text, View } from 'react-native';
import type { CompletedQuestEntry } from '../types/progress';

interface CompletedQuestRowProps {
  quest: CompletedQuestEntry;
}

export const CompletedQuestRow: React.FC<CompletedQuestRowProps> = ({ quest }) => (
  <View className="flex-row items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3">
    <View className="h-8 w-8 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.08]">
      <Text className="text-xs font-semibold text-emerald-200">✓</Text>
    </View>
    <View className="flex-1 gap-1">
      <Text className="text-sm font-semibold text-slate-100">{quest.title}</Text>
      <Text className="text-[10px] tracking-[0.08em] text-slate-500">{quest.completedAt}</Text>
    </View>
    <Text className="text-right text-[10px] font-medium text-cyan-200">{quest.reward}</Text>
  </View>
);
