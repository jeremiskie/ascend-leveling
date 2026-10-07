import { Pressable, Text, View } from 'react-native';
import type { CombatOutcome, DungeonTier } from '../types/combat';

interface CombatVictorySummaryProps {
  outcome: CombatOutcome;
  tier: DungeonTier;
  onContinue: () => void;
}

export const CombatVictorySummary: React.FC<CombatVictorySummaryProps> = ({
  outcome,
  tier,
  onContinue,
}) => {
  const isVictory = outcome === 'victory';

  return (
    <View className="flex-1 justify-center px-7 py-8">
      <View
        className={`gap-6 rounded-xl border p-6 ${
          isVictory
            ? 'border-cyan-200/30 bg-cyan-300/[0.05]'
            : 'border-rose-300/30 bg-rose-300/[0.05]'
        }`}>
        <View className="items-center gap-3">
          <View
            className={`h-16 w-16 items-center justify-center rounded-full border ${
              isVictory
                ? 'border-cyan-200/50 bg-cyan-300/[0.08]'
                : 'border-rose-200/50 bg-rose-300/[0.08]'
            }`}>
            <Text
              className={`text-2xl font-semibold ${isVictory ? 'text-cyan-100' : 'text-rose-100'}`}>
              {isVictory ? '✓' : '!'}
            </Text>
          </View>
          <Text
            className={`text-center text-2xl font-semibold tracking-[0.16em] ${
              isVictory ? 'text-cyan-100' : 'text-rose-100'
            }`}>
            {isVictory ? 'VICTORY' : 'DEFEAT'}
          </Text>
          <Text className="text-center text-sm text-slate-400">
            {isVictory
              ? `${tier.enemyName} has been defeated.`
              : 'You have been forced to retreat.'}
          </Text>
        </View>

        <View className="gap-3 border-t border-slate-700 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs tracking-[0.14em] text-slate-500">DUNGEON</Text>
            <Text className="text-xs font-semibold text-slate-200">{tier.name}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs tracking-[0.14em] text-slate-500">REWARD</Text>
            <Text className="text-right text-xs font-semibold text-cyan-200">
              {isVictory ? tier.reward : 'No reward earned'}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
          onPress={onContinue}>
          <Text className="text-xs font-semibold tracking-[0.18em] text-cyan-100">
            RETURN TO DUNGEON SELECT
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
