import { ScrollView, Text, View } from 'react-native';
import type { CombatLogEntry } from '../types/combat';

interface CombatActionLogProps {
  entries: CombatLogEntry[];
}

const actorColors: Record<CombatLogEntry['actor'], string> = {
  PLAYER: 'text-cyan-200',
  ENEMY: 'text-rose-200',
  SYSTEM: 'text-slate-400',
};

export const CombatActionLog: React.FC<CombatActionLogProps> = ({ entries }) => (
  <View className="gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
    <Text className="text-xs font-semibold tracking-[0.22em] text-slate-300">COMBAT LOG</Text>
    <ScrollView className="max-h-32" nestedScrollEnabled showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        {entries.length === 0 ? (
          <Text className="text-xs leading-5 text-slate-500">
            The dungeon is quiet. Choose an action to begin.
          </Text>
        ) : (
          entries.map((entry) => (
            <View key={entry.id} className="flex-row gap-2">
              <Text
                className={`text-[9px] font-semibold tracking-[0.1em] ${actorColors[entry.actor]}`}>
                {entry.actor}
              </Text>
              <Text className="flex-1 text-xs leading-5 text-slate-400">{entry.message}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  </View>
);
