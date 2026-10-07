import { Text, View } from 'react-native';
import type { PlayerStatKey } from '../types/player';
import type { StatGainEntry } from '../types/progress';

interface StatGainChartProps {
  entries: StatGainEntry[];
}

const statKeys: PlayerStatKey[] = ['STR', 'AGI', 'INT', 'VIT'];
const statColors: Record<PlayerStatKey, string> = {
  STR: 'bg-rose-300',
  AGI: 'bg-emerald-300',
  INT: 'bg-violet-300',
  VIT: 'bg-cyan-300',
};
const statTextColors: Record<PlayerStatKey, string> = {
  STR: 'text-rose-200',
  AGI: 'text-emerald-200',
  INT: 'text-violet-200',
  VIT: 'text-cyan-200',
};

export const StatGainChart: React.FC<StatGainChartProps> = ({ entries }) => {
  const maxGain = Math.max(1, ...entries.flatMap((entry) => Object.values(entry.gains)));

  return (
    <View className="gap-5 rounded-lg border border-slate-800 bg-slate-950/40 p-5">
      <View className="flex-row flex-wrap gap-x-4 gap-y-2">
        {statKeys.map((stat) => (
          <View key={stat} className="flex-row items-center gap-2">
            <View className={`h-2 w-2 rounded-full ${statColors[stat]}`} />
            <Text className={`text-[10px] font-semibold tracking-[0.1em] ${statTextColors[stat]}`}>
              {stat}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-end justify-between gap-2">
        {entries.map((entry) => (
          <View
            key={entry.id}
            accessibilityLabel={`${entry.dateLabel} stat gains: ${statKeys
              .map((stat) => `${stat} ${entry.gains[stat]}`)
              .join(', ')}`}
            className="flex-1 items-center gap-2">
            <View className="h-32 w-full flex-row items-end justify-center gap-1 border-b border-slate-700 pb-1">
              {statKeys.map((stat) => {
                const gain = entry.gains[stat];
                return (
                  <View
                    key={stat}
                    className={`w-2 rounded-t-sm ${gain > 0 ? statColors[stat] : 'bg-slate-800'}`}
                    style={{ height: `${Math.max((gain / maxGain) * 100, 4)}%` }}
                  />
                );
              })}
            </View>
            <Text className="text-[8px] tracking-[0.06em] text-slate-500">{entry.dateLabel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
