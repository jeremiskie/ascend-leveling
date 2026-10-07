import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { mockDungeonTiers } from '../data/mockCombat';
import type { CombatLogEntry, CombatOutcome, DungeonTierId } from '../types/combat';
import type { PlayerStatus } from '../types/player';
import { CombatActionLog } from './CombatActionLog';
import { CombatActionPanel } from './CombatActionPanel';
import { CombatVictorySummary } from './CombatVictorySummary';
import { DungeonTierSelector } from './DungeonTierSelector';
import { EnemyStatusCard } from './EnemyStatusCard';
import { ProgressBar } from './ProgressBar';

interface CombatScreenProps {
  player: PlayerStatus;
  onBack: () => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ player, onBack }) => {
  const [selectedTier, setSelectedTier] = useState<DungeonTierId>('E');
  const [isInCombat, setIsInCombat] = useState(false);
  const [enemyHp, setEnemyHp] = useState(mockDungeonTiers[0].enemyMaxHp);
  const [playerHp, setPlayerHp] = useState(player.currentHp);
  const [playerMp, setPlayerMp] = useState(player.currentMp);
  const [logEntries, setLogEntries] = useState<CombatLogEntry[]>([]);
  const [outcome, setOutcome] = useState<CombatOutcome | null>(null);
  const selectedDungeon = mockDungeonTiers.find((tier) => tier.id === selectedTier)!;

  const startCombat = () => {
    setEnemyHp(selectedDungeon.enemyMaxHp);
    setPlayerHp(player.currentHp);
    setPlayerMp(player.currentMp);
    setLogEntries([
      {
        id: 0,
        actor: 'SYSTEM',
        action: 'enemy',
        message: `You entered ${selectedDungeon.name}. ${selectedDungeon.enemyName} approaches.`,
      },
    ]);
    setOutcome(null);
    setIsInCombat(true);
  };

  const takeAction = (action: 'strike' | 'skill') => {
    if (!isInCombat || outcome) return;

    const damage = action === 'skill' ? 35 : 20;
    const nextEnemyHp = Math.max(enemyHp - damage, 0);
    const nextEntries: CombatLogEntry[] = [
      {
        id: logEntries.length,
        actor: 'PLAYER',
        action,
        message:
          action === 'skill'
            ? `Arcane Burst hits ${selectedDungeon.enemyName} for ${damage} damage.`
            : `You strike ${selectedDungeon.enemyName} for ${damage} damage.`,
      },
    ];

    if (action === 'skill') setPlayerMp((current) => Math.max(current - 10, 0));
    setEnemyHp(nextEnemyHp);

    if (nextEnemyHp === 0) {
      setLogEntries((current) => [
        ...current,
        ...nextEntries.map((entry, index) => ({ ...entry, id: current.length + index })),
        {
          id: logEntries.length + 1,
          actor: 'SYSTEM',
          action: 'enemy',
          message: `${selectedDungeon.enemyName} defeated. Dungeon cleared.`,
        },
      ]);
      setOutcome('victory');
      return;
    }

    const nextPlayerHp = Math.max(playerHp - selectedDungeon.enemyAttack, 0);
    setPlayerHp(nextPlayerHp);
    setLogEntries((current) => [
      ...current,
      ...nextEntries.map((entry, index) => ({ ...entry, id: current.length + index })),
      {
        id: logEntries.length + 1,
        actor: 'ENEMY',
        action: 'enemy',
        message: `${selectedDungeon.enemyName} retaliates for ${selectedDungeon.enemyAttack} damage.`,
      },
    ]);

    if (nextPlayerHp === 0) setOutcome('defeat');
  };

  const returnToSelection = () => {
    setIsInCombat(false);
    setOutcome(null);
    setLogEntries([]);
  };

  if (outcome) {
    return (
      <SafeAreaView className="flex-1 bg-[#05070D]">
        <StatusBar style="light" />
        <CombatVictorySummary
          onContinue={returnToSelection}
          outcome={outcome}
          tier={selectedDungeon}
        />
      </SafeAreaView>
    );
  }

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
              SYSTEM // COMBAT
            </Text>
            <Text className="text-[10px] tracking-[0.16em] text-slate-500">
              DUNGEON RAID PREVIEW
            </Text>
          </View>
          <Text className="text-xs font-semibold tracking-[0.12em] text-cyan-300">
            LV. {player.level}
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-3xl font-semibold tracking-[0.1em] text-white">COMBAT</Text>
          <Text className="text-sm leading-6 text-slate-400">
            {isInCombat
              ? `${selectedDungeon.name} · Turn-based encounter`
              : 'Choose a gate tier and prepare for the encounter.'}
          </Text>
        </View>

        {!isInCombat ? (
          <>
            <DungeonTierSelector
              onSelect={setSelectedTier}
              playerLevel={player.level}
              selectedTier={selectedTier}
              tiers={mockDungeonTiers}
            />
            <EnemyStatusCard currentHp={selectedDungeon.enemyMaxHp} tier={selectedDungeon} />
            <View className="gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <Text className="text-xs font-semibold tracking-[0.2em] text-slate-300">
                RAID INTEL
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-slate-500">RECOMMENDED LEVEL</Text>
                <Text className="text-xs font-semibold text-slate-200">
                  {selectedDungeon.recommendedLevel}+
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-slate-500">CLEAR REWARD</Text>
                <Text className="text-right text-xs font-semibold text-cyan-200">
                  {selectedDungeon.reward}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
              onPress={startCombat}>
              <Text className="text-sm font-semibold tracking-[0.2em] text-cyan-100">
                ENTER DUNGEON
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <EnemyStatusCard currentHp={enemyHp} tier={selectedDungeon} />
            <View className="gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
              <Text className="text-xs font-semibold tracking-[0.2em] text-slate-300">
                PLAYER STATUS · {player.name.toUpperCase()}
              </Text>
              <ProgressBar color="cyan" current={playerHp} label="HP" maximum={player.maxHp} />
              <ProgressBar color="violet" current={playerMp} label="MP" maximum={player.maxMp} />
            </View>
            <CombatActionPanel
              canAct={!outcome}
              canUseSkill={!outcome && playerMp >= 10}
              onSkill={() => takeAction('skill')}
              onStrike={() => takeAction('strike')}
            />
            <CombatActionLog entries={logEntries} />
          </>
        )}

        <Pressable accessibilityRole="button" className="items-center py-2" onPress={onBack}>
          <Text className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
            RETURN TO OVERVIEW
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
