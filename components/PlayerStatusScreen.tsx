import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { PlayerStatKey, PlayerStatus } from '../types/player';
import { ProgressBar } from './ProgressBar';
import { StatRow } from './StatRow';

interface PlayerStatusScreenProps {
  player: PlayerStatus;
  onBack?: () => void;
  onContinue?: () => void;
  onAllocateStat?: (stat: PlayerStatKey) => void;
}

const statDescriptions: Record<PlayerStatKey, string> = {
  STR: 'Strength',
  AGI: 'Agility',
  INT: 'Intelligence',
  VIT: 'Vitality',
};

const statKeys: PlayerStatKey[] = ['STR', 'AGI', 'INT', 'VIT'];

export const PlayerStatusScreen: React.FC<PlayerStatusScreenProps> = ({
  player,
  onBack,
  onContinue,
  onAllocateStat,
}) => {
  const [attributes, setAttributes] = useState(player.attributes);
  const [availableStatPoints, setAvailableStatPoints] = useState(player.availableStatPoints);

  const allocatePoint = (stat: PlayerStatKey) => {
    if (availableStatPoints === 0) return;

    setAttributes((current) => ({ ...current, [stat]: current[stat] + 1 }));
    setAvailableStatPoints((current) => current - 1);
    onAllocateStat?.(stat);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 px-7 py-8"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
            SYSTEM // PLAYER STATUS
          </Text>
          <Text className="text-[10px] tracking-[0.2em] text-slate-500">PROFILE 001</Text>
        </View>

        <View className="gap-2 border-b border-slate-800 pb-6">
          <Text className="text-xs font-medium tracking-[0.28em] text-cyan-300">PLAYER LEVEL</Text>
          <View className="flex-row items-end justify-between">
            <Text className="text-4xl font-semibold tracking-[0.08em] text-white">
              {player.name}
            </Text>
            <Text className="text-2xl font-semibold tabular-nums text-cyan-100">
              LV. {player.level}
            </Text>
          </View>
          <Text className="text-xs tracking-[0.18em] text-slate-500">
            {player.playerClass.toUpperCase()}
          </Text>
        </View>

        <View className="gap-5 rounded-lg border border-slate-800 bg-slate-950/40 p-5">
          <ProgressBar color="cyan" current={player.currentHp} label="HP" maximum={player.maxHp} />
          <ProgressBar
            color="violet"
            current={player.currentMp}
            label="MP"
            maximum={player.maxMp}
          />
        </View>

        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
              ATTRIBUTES
            </Text>
            <Text className="text-xs font-medium tracking-[0.12em] text-cyan-300">
              {availableStatPoints} POINTS AVAILABLE
            </Text>
          </View>
          <View className="gap-2">
            {statKeys.map((stat) => (
              <StatRow
                key={stat}
                canIncrease={availableStatPoints > 0}
                description={statDescriptions[stat]}
                label={stat}
                onIncrease={() => allocatePoint(stat)}
                value={attributes[stat]}
              />
            ))}
          </View>
        </View>

        {onBack && (
          <Pressable accessibilityRole="button" className="items-center py-2" onPress={onBack}>
            <Text className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
              RETURN TO ONBOARDING
            </Text>
          </Pressable>
        )}
        {onContinue && (
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
            onPress={onContinue}>
            <Text className="text-sm font-semibold tracking-[0.2em] text-cyan-100">
              CONTINUE TO OVERVIEW
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
