import { Pressable, Text, View } from 'react-native';
import type { DungeonTier, DungeonTierId } from '../types/combat';

interface DungeonTierSelectorProps {
  tiers: DungeonTier[];
  selectedTier: DungeonTierId;
  playerLevel: number;
  onSelect: (tier: DungeonTierId) => void;
}

export const DungeonTierSelector: React.FC<DungeonTierSelectorProps> = ({
  tiers,
  selectedTier,
  playerLevel,
  onSelect,
}) => (
  <View className="gap-3">
    <Text className="text-xs font-semibold tracking-[0.24em] text-slate-300">SELECT DUNGEON</Text>
    <View className="flex-row gap-2">
      {tiers.map((tier) => {
        const isSelected = selectedTier === tier.id;
        const isRecommended = playerLevel >= tier.recommendedLevel;
        return (
          <Pressable
            key={tier.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            className={`flex-1 gap-2 rounded-lg border p-3 ${
              isSelected
                ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                : 'border-slate-800 bg-slate-950/40'
            }`}
            onPress={() => onSelect(tier.id)}>
            <Text
              className={`text-sm font-semibold tracking-[0.1em] ${
                isSelected ? 'text-cyan-100' : 'text-slate-300'
              }`}>
              {tier.id}-RANK
            </Text>
            <Text className={`text-[9px] ${isRecommended ? 'text-emerald-300' : 'text-amber-300'}`}>
              {isRecommended ? 'RECOMMENDED' : `LV. ${tier.recommendedLevel}+`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);
