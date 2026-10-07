import { Text, View } from 'react-native';
import type { Achievement, AchievementRarity } from '../types/achievement';

interface AchievementCardProps {
  achievement: Achievement;
}

const rarityStyles: Record<AchievementRarity, { border: string; label: string }> = {
  common: { border: 'border-slate-700', label: 'text-slate-400' },
  rare: { border: 'border-violet-300/40', label: 'text-violet-200' },
  legendary: { border: 'border-amber-300/40', label: 'text-amber-200' },
};

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const rarityStyle = rarityStyles[achievement.rarity];
  const unlockedAt = achievement.unlockedAt ?? achievement.earnedAt;
  const unlockedDate =
    unlockedAt && !Number.isNaN(Date.parse(unlockedAt))
      ? new Date(unlockedAt).toLocaleDateString()
      : unlockedAt;

  return (
    <View
      className={`w-[48%] gap-3 rounded-lg border bg-slate-950/40 p-4 ${
        achievement.earned ? rarityStyle.border : 'border-slate-800'
      } ${achievement.earned ? '' : 'opacity-70'}`}>
      <View className="flex-row items-start justify-between gap-2">
        <View
          className={`h-10 w-10 items-center justify-center rounded-lg border ${
            achievement.earned
              ? 'border-cyan-200/30 bg-cyan-300/[0.08]'
              : 'border-slate-700 bg-slate-900'
          }`}>
          <Text
            className={`text-lg font-semibold ${
              achievement.earned ? 'text-cyan-100' : 'text-slate-600'
            }`}>
            {achievement.earned ? '✦' : '?'}
          </Text>
        </View>
        <Text className={`text-[8px] font-semibold tracking-[0.1em] ${rarityStyle.label}`}>
          {achievement.rarity.toUpperCase()}
        </Text>
      </View>

      <View className="min-h-14 gap-1">
        <Text
          className={`text-sm font-semibold leading-5 ${
            achievement.earned ? 'text-white' : 'text-slate-400'
          }`}>
          {achievement.title}
        </Text>
        <Text className="text-[10px] leading-4 text-slate-500">{achievement.description}</Text>
      </View>

      <View className="gap-1 border-t border-slate-800 pt-3">
        <Text className="text-[8px] font-medium tracking-[0.12em] text-slate-600">REWARD</Text>
        <Text
          className={`text-[10px] font-medium leading-4 ${
            achievement.earned ? 'text-cyan-200' : 'text-slate-500'
          }`}>
          {achievement.reward}
        </Text>
      </View>

      <View
        className={`self-start rounded border px-2 py-1 ${
          achievement.earned
            ? 'border-emerald-300/30 bg-emerald-300/[0.08]'
            : 'border-slate-700 bg-slate-900'
        }`}>
        <Text
          className={`text-[8px] font-semibold tracking-[0.1em] ${
            achievement.earned ? 'text-emerald-200' : 'text-slate-500'
          }`}>
          {achievement.earned ? `EARNED${unlockedDate ? ` · ${unlockedDate}` : ''}` : 'LOCKED'}
        </Text>
      </View>
    </View>
  );
};
