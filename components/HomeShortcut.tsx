import { Pressable, Text, View } from 'react-native';

interface HomeShortcutProps {
  label: string;
  description: string;
  onPress: () => void;
  fullWidth?: boolean;
}

export const HomeShortcut: React.FC<HomeShortcutProps> = ({
  label,
  description,
  onPress,
  fullWidth = false,
}) => (
  <Pressable
    accessibilityRole="button"
    className={`${fullWidth ? 'w-full' : 'flex-1'} flex-row items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-4 active:bg-slate-900`}
    onPress={onPress}>
    <View className="flex-1 gap-1">
      <Text className="text-sm font-semibold tracking-[0.16em] text-slate-100">{label}</Text>
      <Text className="text-xs text-slate-500">{description}</Text>
    </View>
    <Text className="ml-2 text-lg text-cyan-200">{'>'}</Text>
  </Pressable>
);
