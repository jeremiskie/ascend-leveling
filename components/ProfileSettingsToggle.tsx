import { Switch, Text, View } from 'react-native';

interface ProfileSettingsToggleProps {
  title: string;
  description: string;
  value: boolean;
  isDarkTheme: boolean;
  onValueChange: (value: boolean) => void;
}

export const ProfileSettingsToggle: React.FC<ProfileSettingsToggleProps> = ({
  title,
  description,
  value,
  isDarkTheme,
  onValueChange,
}) => (
  <View className="flex-row items-center justify-between gap-4 py-3">
    <View className="flex-1 gap-1">
      <Text
        className={`text-sm font-semibold ${isDarkTheme ? 'text-slate-100' : 'text-slate-900'}`}>
        {title}
      </Text>
      <Text className={`text-xs leading-5 ${isDarkTheme ? 'text-slate-500' : 'text-slate-600'}`}>
        {description}
      </Text>
    </View>
    <Switch
      accessibilityLabel={title}
      onValueChange={onValueChange}
      thumbColor={value ? '#CFFAFE' : '#94A3B8'}
      trackColor={{ false: '#334155', true: '#0891B2' }}
      value={value}
    />
  </View>
);
