import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { PlayerStatus } from '../types/player';
import { ProfileNavigationRow } from './ProfileNavigationRow';
import { ProfileSettingsToggle } from './ProfileSettingsToggle';

interface ProfileScreenProps {
  player: PlayerStatus;
  isDarkTheme: boolean;
  audioEnabled: boolean;
  onToggleTheme: (enabled: boolean) => void;
  onToggleAudio: (enabled: boolean) => void;
  onOpenStatus: () => void;
  onOpenAchievements: () => void;
  onResetData: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  player,
  isDarkTheme,
  audioEnabled,
  onToggleTheme,
  onToggleAudio,
  onOpenStatus,
  onOpenAchievements,
  onResetData,
  onBack,
}) => {
  const handleResetData = () => {
    Alert.alert(
      'Reset player data?',
      'This clears the current player session and returns to System Awakening.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset data', style: 'destructive', onPress: onResetData },
      ]
    );
  };

  const backgroundClass = isDarkTheme ? 'bg-[#05070D]' : 'bg-slate-100';
  const panelClass = isDarkTheme ? 'border-slate-800 bg-slate-950/40' : 'border-slate-300 bg-white';
  const headingClass = isDarkTheme ? 'text-white' : 'text-slate-950';

  return (
    <SafeAreaView className={`flex-1 ${backgroundClass}`}>
      <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-7 px-6 py-7"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-300">
              SYSTEM // PROFILE
            </Text>
            <Text
              className={`text-[10px] tracking-[0.14em] ${isDarkTheme ? 'text-slate-500' : 'text-slate-600'}`}>
              ACCOUNT & PREFERENCES
            </Text>
          </View>
          <Text className="text-[10px] tracking-[0.12em] text-slate-500">PLAYER 001</Text>
        </View>

        <View className={`items-center gap-3 rounded-xl border p-6 ${panelClass}`}>
          <View className="h-16 w-16 items-center justify-center rounded-full border border-cyan-200/40 bg-cyan-300/[0.08]">
            <Text className="text-2xl font-semibold text-cyan-100">
              {player.name.slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text className={`text-xl font-semibold tracking-[0.08em] ${headingClass}`}>
              {player.name}
            </Text>
            <Text className="text-xs tracking-[0.18em] text-cyan-300">
              {player.playerClass.toUpperCase()} · LEVEL {player.level}
            </Text>
          </View>
          <Text className="text-[10px] tracking-[0.1em] text-slate-500">ASCEND PLAYER PROFILE</Text>
        </View>

        <View className={`gap-1 rounded-xl border px-4 py-2 ${panelClass}`}>
          <Text className="py-2 text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
            ACCOUNT
          </Text>
          <ProfileNavigationRow
            description="View level, health, mana, and attributes"
            isDarkTheme={isDarkTheme}
            onPress={onOpenStatus}
            title="Player status"
          />
          <View className="h-px bg-slate-800" />
          <ProfileNavigationRow
            description="Review earned titles and status rewards"
            isDarkTheme={isDarkTheme}
            onPress={onOpenAchievements}
            title="Achievements & titles"
          />
        </View>

        <View className={`gap-1 rounded-xl border px-4 py-2 ${panelClass}`}>
          <Text className="py-2 text-[10px] font-semibold tracking-[0.2em] text-cyan-300">
            SYSTEM SETTINGS
          </Text>
          <ProfileSettingsToggle
            description="Preview the light interface theme on this screen"
            isDarkTheme={isDarkTheme}
            onValueChange={onToggleTheme}
            title="Light theme preview"
            value={!isDarkTheme}
          />
          <View className="h-px bg-slate-800" />
          <ProfileSettingsToggle
            description="Enable interface sound effects (prototype preference)"
            isDarkTheme={isDarkTheme}
            onValueChange={onToggleAudio}
            title="Audio"
            value={audioEnabled}
          />
        </View>

        <View className={`gap-3 rounded-xl border p-4 ${panelClass}`}>
          <Text className="text-[10px] font-semibold tracking-[0.2em] text-rose-300">
            DATA MANAGEMENT
          </Text>
          <Text className="text-xs leading-5 text-slate-500">
            Reset the local prototype session and return to the Awakening screen.
          </Text>
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-lg border border-rose-300/30 bg-rose-300/[0.05] px-4 py-3 active:bg-rose-300/10"
            onPress={handleResetData}>
            <Text className="text-xs font-semibold tracking-[0.16em] text-rose-200">
              RESET PLAYER DATA
            </Text>
          </Pressable>
        </View>

        <View className="items-center gap-2 py-2">
          <Text className="text-xs font-semibold tracking-[0.24em] text-slate-400">
            ASCEND SYSTEM
          </Text>
          <Text className="text-[10px] text-slate-600">A leveling prototype · Version 1.0.0</Text>
          <Text className="text-[9px] tracking-[0.1em] text-slate-700">
            DESIGNED FOR THE NEXT AWAKENING
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className={`items-center rounded-lg border px-5 py-4 ${
            isDarkTheme
              ? 'border-slate-700 active:bg-slate-900'
              : 'border-slate-300 active:bg-slate-200'
          }`}
          onPress={onBack}>
          <Text
            className={`text-xs font-semibold tracking-[0.18em] ${
              isDarkTheme ? 'text-slate-300' : 'text-slate-700'
            }`}>
            RETURN TO OVERVIEW
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
