import { Text, View } from 'react-native';

interface ProgressBarProps {
  label: string;
  current: number;
  maximum: number;
  color: 'cyan' | 'violet';
}

const colorClasses = {
  cyan: 'bg-cyan-300',
  violet: 'bg-violet-300',
} satisfies Record<ProgressBarProps['color'], string>;

export const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, maximum, color }) => {
  const percentage = maximum > 0 ? Math.min(Math.max((current / maximum) * 100, 0), 100) : 0;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-[0.2em] text-slate-300">{label}</Text>
        <Text className="text-xs tabular-nums text-slate-400">
          {current} / {maximum}
        </Text>
      </View>
      <View
        accessibilityLabel={`${label}: ${current} of ${maximum}`}
        className="h-2 overflow-hidden rounded-full bg-slate-800">
        <View
          className={`h-full rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
};
