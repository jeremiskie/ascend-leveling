import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { DailyPenalty } from '../types/quest';

interface DailyPenaltyTimerProps {
  penalty: DailyPenalty;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
};

export const DailyPenaltyTimer: React.FC<DailyPenaltyTimerProps> = ({ penalty }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(penalty.remainingSeconds);

  useEffect(() => {
    if (remainingSeconds === 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);

  return (
    <View className="gap-3 rounded-lg border border-rose-300/25 bg-rose-300/[0.04] p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-[0.2em] text-rose-200">
          {penalty.title.toUpperCase()}
        </Text>
        <Text className="text-[9px] font-semibold tracking-[0.12em] text-rose-300">PENDING</Text>
      </View>
      <Text className="text-sm leading-5 text-slate-400">{penalty.description}</Text>
      <View className="flex-row items-end justify-between border-t border-rose-300/15 pt-3">
        <Text className="text-[10px] tracking-[0.16em] text-slate-500">TIME UNTIL RESET</Text>
        <Text
          accessibilityLabel={`Penalty timer ${formatTime(remainingSeconds)}`}
          className="text-2xl font-semibold tabular-nums tracking-[0.1em] text-rose-100">
          {formatTime(remainingSeconds)}
        </Text>
      </View>
    </View>
  );
};
