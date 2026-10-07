import { Text, View } from 'react-native';
import type { LevelMilestone } from '../types/progress';

interface LevelMilestoneRowProps {
  milestone: LevelMilestone;
  currentLevel: number;
}

export const LevelMilestoneRow: React.FC<LevelMilestoneRowProps> = ({
  milestone,
  currentLevel,
}) => {
  const isCurrent = milestone.level === currentLevel;
  const isReached = milestone.reached || currentLevel > milestone.level;

  return (
    <View className="flex-row items-center gap-3">
      <View
        className={`h-9 w-9 items-center justify-center rounded-full border ${
          isReached ? 'border-cyan-200/50 bg-cyan-300/[0.08]' : 'border-slate-700 bg-slate-950/40'
        }`}>
        <Text className={`text-xs font-semibold ${isReached ? 'text-cyan-100' : 'text-slate-500'}`}>
          {milestone.level}
        </Text>
      </View>
      <View className="flex-1 gap-1">
        <Text
          className={`text-sm font-semibold ${isReached ? 'text-slate-100' : 'text-slate-400'}`}>
          {milestone.title}
        </Text>
        <Text className="text-[10px] tracking-[0.12em] text-slate-500">
          {isCurrent ? 'CURRENT LEVEL' : isReached ? 'MILESTONE REACHED' : 'UPCOMING'}
        </Text>
      </View>
      <Text className="text-xs font-semibold tracking-[0.1em] text-slate-500">
        LV. {milestone.level}
      </Text>
    </View>
  );
};
