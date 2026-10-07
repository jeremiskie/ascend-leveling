import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { DailyPenalty, QuestCompletionResult, QuestListItem } from '../types/quest';
import type { QuestGenerationResult } from '../services/questGeneratorService';
import { DailyPenaltyTimer } from './DailyPenaltyTimer';
import { QuestListItemCard } from './QuestListItemCard';

interface QuestScreenProps {
  quests: QuestListItem[];
  penalty: DailyPenalty;
  onCompleteQuest: (questId: string) => QuestCompletionResult;
  onGenerateQuest: (availableMinutes: number) => Promise<QuestGenerationResult>;
  onBack: () => void;
}

export const QuestScreen: React.FC<QuestScreenProps> = ({
  quests,
  penalty,
  onCompleteQuest,
  onGenerateQuest,
  onBack,
}) => {
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [availableMinutes, setAvailableMinutes] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);
  const activeCount = quests.filter((quest) => quest.status === 'inProgress').length;
  const groupedCategories = [
    { category: 'Daily', title: 'DAILY QUESTS' },
    { category: 'Weekly', title: 'WEEKLY CHALLENGES' },
    { category: 'Dungeon', title: 'DUNGEONS' },
    { category: 'Main', title: 'MAIN QUESTS' },
  ] as const;

  const handleCompleteQuest = (questId: string) => {
    const result = onCompleteQuest(questId);
    if (!result.completed || !result.quest) return;

    const levelText = result.levelUpEvent?.leveledUp
      ? ` · LEVEL UP! LV. ${result.levelUpEvent.newLevel}`
      : '';
    const statText = Object.entries(result.quest.statBonuses)
      .filter(([, amount]) => amount && amount > 0)
      .map(([stat, amount]) => `+${amount} ${stat}`)
      .join(' · ');

    setCompletionMessage(
      `QUEST COMPLETE · +${result.quest.expReward} EXP${statText ? ` · ${statText}` : ''}${levelText}`
    );
  };

  const handleGenerateQuest = async () => {
    const minutes = Number(availableMinutes);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 180 || isGenerating) {
      setGenerationMessage('Enter an available time between 5 and 180 minutes.');
      return;
    }

    setIsGenerating(true);
    setGenerationMessage(null);
    try {
      const result = await onGenerateQuest(minutes);
      setGenerationMessage(
        result.usedFallback
          ? 'OFFLINE PROTOCOL · A local quest was added to your active log.'
          : 'AI QUEST GENERATED · A personalized objective was added to your active log.'
      );
    } catch {
      setGenerationMessage('The quest could not be added. Your active quest log is unchanged.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 px-7 py-8"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
              SYSTEM // QUESTS
            </Text>
            <Text className="text-xs text-slate-500">OBJECTIVES & DAILY PROTOCOLS</Text>
          </View>
          <Text className="text-[10px] tracking-[0.16em] text-cyan-300">{activeCount} ACTIVE</Text>
        </View>

        <View className="gap-3">
          <Text className="text-3xl font-semibold tracking-[0.1em] text-white">QUEST LOG</Text>
          <Text className="text-sm leading-6 text-slate-400">
            Complete your objectives to claim their rewards.
          </Text>
        </View>

        {completionMessage && (
          <View
            accessibilityLiveRegion="polite"
            className="rounded-lg border border-emerald-300/30 bg-emerald-300/[0.06] px-4 py-3">
            <Text className="text-xs font-semibold leading-5 text-emerald-200">
              {completionMessage}
            </Text>
          </View>
        )}

        <View className="gap-4 rounded-lg border border-cyan-200/25 bg-cyan-300/[0.04] p-4">
          <View className="gap-1">
            <Text className="text-xs font-semibold tracking-[0.2em] text-cyan-100">
              SYSTEM QUEST GENERATOR
            </Text>
            <Text className="text-xs leading-5 text-slate-400">
              Receive one objective shaped around your goals, current stats, and available time.
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-[10px] font-medium tracking-[0.12em] text-slate-400">
              AVAILABLE MINUTES
            </Text>
            <TextInput
              accessibilityLabel="Available time in minutes"
              className="min-w-16 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-center text-sm text-white"
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={setAvailableMinutes}
              value={availableMinutes}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isGenerating }}
            className={`items-center rounded-lg border px-5 py-3 ${
              isGenerating
                ? 'border-slate-700 bg-slate-900'
                : 'border-cyan-200/50 bg-cyan-300/[0.08] active:bg-cyan-300/15'
            }`}
            disabled={isGenerating}
            onPress={handleGenerateQuest}>
            <Text
              className={`text-xs font-semibold tracking-[0.18em] ${
                isGenerating ? 'text-slate-500' : 'text-cyan-100'
              }`}>
              {isGenerating ? 'GENERATING QUEST...' : 'GENERATE AI QUEST'}
            </Text>
          </Pressable>
          {generationMessage && (
            <Text accessibilityLiveRegion="polite" className="text-xs leading-5 text-cyan-200">
              {generationMessage}
            </Text>
          )}
        </View>

        {groupedCategories.map(({ category, title }) => {
          const categoryQuests = quests.filter((quest) => quest.category === category);
          if (categoryQuests.length === 0) return null;

          return (
            <View key={category} className="gap-3">
              <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">
                {title}
              </Text>
              {categoryQuests.map((quest) => (
                <QuestListItemCard key={quest.id} onComplete={handleCompleteQuest} quest={quest} />
              ))}
            </View>
          );
        })}

        <DailyPenaltyTimer penalty={penalty} />

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
