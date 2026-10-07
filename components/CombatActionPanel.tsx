import { Pressable, Text, View } from 'react-native';

interface CombatActionPanelProps {
  canAct: boolean;
  canUseSkill: boolean;
  onStrike: () => void;
  onSkill: () => void;
}

export const CombatActionPanel: React.FC<CombatActionPanelProps> = ({
  canAct,
  canUseSkill,
  onStrike,
  onSkill,
}) => (
  <View className="gap-3">
    <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">YOUR ACTION</Text>
    <View className="flex-row gap-3">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canAct }}
        className={`flex-1 items-center rounded-lg border px-3 py-4 ${
          canAct
            ? 'border-cyan-200/50 bg-cyan-300/[0.08] active:bg-cyan-300/15'
            : 'border-slate-800 bg-slate-950/40'
        }`}
        disabled={!canAct}
        onPress={onStrike}>
        <Text
          className={`text-xs font-semibold tracking-[0.16em] ${canAct ? 'text-cyan-100' : 'text-slate-600'}`}>
          STRIKE
        </Text>
        <Text className="mt-1 text-[9px] text-slate-500">BASIC ATTACK</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canUseSkill }}
        className={`flex-1 items-center rounded-lg border px-3 py-4 ${
          canUseSkill
            ? 'border-violet-200/40 bg-violet-300/[0.08] active:bg-violet-300/15'
            : 'border-slate-800 bg-slate-950/40'
        }`}
        disabled={!canUseSkill}
        onPress={onSkill}>
        <Text
          className={`text-xs font-semibold tracking-[0.16em] ${
            canUseSkill ? 'text-violet-100' : 'text-slate-600'
          }`}>
          ARCANE BURST
        </Text>
        <Text className="mt-1 text-[9px] text-slate-500">10 MP</Text>
      </Pressable>
    </View>
  </View>
);
