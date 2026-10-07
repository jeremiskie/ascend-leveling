import { Text, View } from 'react-native';
import type { DungeonTier } from '../types/combat';
import { ProgressBar } from './ProgressBar';

interface EnemyStatusCardProps {
  tier: DungeonTier;
  currentHp: number;
}

export const EnemyStatusCard: React.FC<EnemyStatusCardProps> = ({ tier, currentHp }) => (
  <View className="gap-5 rounded-lg border border-rose-300/20 bg-rose-300/[0.04] p-5">
    <View className="flex-row items-center justify-between">
      <View className="gap-1">
        <Text className="text-[10px] font-medium tracking-[0.2em] text-rose-300">
          {tier.enemyTitle.toUpperCase()}
        </Text>
        <Text className="text-lg font-semibold tracking-[0.08em] text-white">{tier.enemyName}</Text>
      </View>
      <View className="h-12 w-12 items-center justify-center rounded-lg border border-rose-200/25 bg-rose-300/[0.08]">
        <Text className="text-xl font-semibold text-rose-200">!</Text>
      </View>
    </View>
    <ProgressBar color="cyan" current={currentHp} label="ENEMY HP" maximum={tier.enemyMaxHp} />
    <View className="flex-row items-center justify-between border-t border-rose-300/15 pt-3">
      <Text className="text-[10px] tracking-[0.14em] text-slate-500">THREAT</Text>
      <Text className="text-xs font-semibold tracking-[0.12em] text-rose-200">
        {tier.id}-RANK · {tier.enemyAttack} ATK
      </Text>
    </View>
  </View>
);
