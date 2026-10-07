import { Pressable, Text, View } from 'react-native';

interface StatRowProps {
  label: string;
  description: string;
  value: number;
  onIncrease: () => void;
  canIncrease: boolean;
}

export const StatRow: React.FC<StatRowProps> = ({
  label,
  description,
  value,
  onIncrease,
  canIncrease,
}) => (
  <View className="flex-row items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3">
    <View className="flex-1 gap-1">
      <Text className="text-sm font-semibold tracking-[0.2em] text-slate-100">{label}</Text>
      <Text className="text-xs text-slate-500">{description}</Text>
    </View>
    <Text className="mr-4 min-w-6 text-center text-lg font-semibold tabular-nums text-cyan-100">
      {value}
    </Text>
    <Pressable
      accessibilityLabel={`Add one point to ${label}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canIncrease }}
      className={`h-9 w-9 items-center justify-center rounded border ${
        canIncrease
          ? 'border-cyan-200/40 bg-cyan-300/[0.08] active:bg-cyan-300/15'
          : 'border-slate-800'
      }`}
      disabled={!canIncrease}
      onPress={onIncrease}>
      <Text className={`text-lg ${canIncrease ? 'text-cyan-100' : 'text-slate-700'}`}>+</Text>
    </Pressable>
  </View>
);
