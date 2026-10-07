import { Text, View } from 'react-native';
import type { QuestStatus } from '../types/quest';

interface QuestStatusBadgeProps {
  status: QuestStatus;
}

const statusLabels: Record<QuestStatus, string> = {
  completed: 'COMPLETED',
  inProgress: 'IN PROGRESS',
  failed: 'FAILED',
};

const badgeClasses: Record<QuestStatus, string> = {
  completed: 'border-emerald-300/30 bg-emerald-300/[0.08]',
  inProgress: 'border-cyan-200/30 bg-cyan-300/[0.08]',
  failed: 'border-rose-300/30 bg-rose-300/[0.08]',
};

const textClasses: Record<QuestStatus, string> = {
  completed: 'text-emerald-200',
  inProgress: 'text-cyan-100',
  failed: 'text-rose-200',
};

export const QuestStatusBadge: React.FC<QuestStatusBadgeProps> = ({ status }) => (
  <View className={`rounded border px-2 py-1 ${badgeClasses[status]}`}>
    <Text className={`text-[9px] font-semibold tracking-[0.12em] ${textClasses[status]}`}>
      {statusLabels[status]}
    </Text>
  </View>
);
