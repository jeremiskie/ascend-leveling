import { Text, View } from 'react-native';
import type { PlayerStatus } from '../types/player';
import { ProgressBar } from './ProgressBar';

interface DailyQuickStatsProps {
  player: PlayerStatus;
}

export const DailyQuickStats: React.FC<DailyQuickStatsProps> = ({ player }) => (
  <View className="gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-5">
    <View className="flex-row items-center justify-between">
      <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
        DAILY QUICK STATS
      </Text>
      <Text className="text-xs font-semibold tracking-[0.14em] text-cyan-300">
        LV. {player.level}
      </Text>
    </View>
    <ProgressBar color="cyan" current={player.currentHp} label="HP" maximum={player.maxHp} />
    <ProgressBar color="violet" current={player.currentMp} label="MP" maximum={player.maxMp} />
    <View className="flex-row items-center justify-between border-t border-slate-800 pt-3">
      <Text className="text-xs tracking-[0.12em] text-slate-400">AVAILABLE STAT POINTS</Text>
      <Text className="text-sm font-semibold tabular-nums text-cyan-100">
        {player.availableStatPoints}
      </Text>
    </View>
  </View>
);
