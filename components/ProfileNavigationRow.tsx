import { Pressable, Text, View } from 'react-native';

interface ProfileNavigationRowProps {
  title: string;
  description: string;
  isDarkTheme: boolean;
  onPress: () => void;
}

export const ProfileNavigationRow: React.FC<ProfileNavigationRowProps> = ({
  title,
  description,
  isDarkTheme,
  onPress,
}) => (
  <Pressable
    accessibilityRole="button"
    className="flex-row items-center justify-between gap-4 py-3 active:opacity-70"
    onPress={onPress}>
    <View className="flex-1 gap-1">
      <Text
        className={`text-sm font-semibold ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>
        {title}
      </Text>
      <Text className={`text-xs leading-5 ${isDarkTheme ? 'text-slate-500' : 'text-slate-600'}`}>
        {description}
      </Text>
    </View>
    <Text className="text-lg text-cyan-200">{'>'}</Text>
  </Pressable>
);
