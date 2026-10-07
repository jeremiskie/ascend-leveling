import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { Achievement } from '../types/achievement';
import { AchievementCard } from './AchievementCard';

interface AchievementsScreenProps {
  achievements: Achievement[];
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements, onBack }) => {
  const earnedCount = achievements.filter((achievement) => achievement.earned).length;

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-6 py-7"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
              SYSTEM // ACHIEVEMENTS
            </Text>
            <Text className="text-[10px] tracking-[0.14em] text-slate-500">
              TITLES, BADGES & REWARDS
            </Text>
          </View>
          <Text className="text-xs font-semibold tracking-[0.12em] text-cyan-300">
            {earnedCount} / {achievements.length}
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-3xl font-semibold tracking-[0.1em] text-white">ACHIEVEMENTS</Text>
          <Text className="text-sm leading-6 text-slate-400">
            Earn titles by proving your strength. Each achievement grants a status reward.
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between gap-y-3">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
          onPress={onBack}>
          <Text className="text-sm font-semibold tracking-[0.2em] text-cyan-100">
            RETURN TO OVERVIEW
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
