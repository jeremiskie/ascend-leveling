import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface SystemActivityScreenProps {
  onBack: () => void;
}

export const SystemActivityScreen: React.FC<SystemActivityScreenProps> = ({ onBack }) => (
  <SafeAreaView className="flex-1 bg-[#05070D]">
    <StatusBar style="light" />
    <ScrollView
      className="flex-1"
      contentContainerClassName="flex-grow justify-between gap-8 px-7 py-8"
      showsVerticalScrollIndicator={false}>
      <View className="gap-8">
        <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
          SYSTEM // COMBAT
        </Text>
        <View className="gap-3">
          <Text className="text-3xl font-semibold tracking-[0.1em] text-white">COMBAT</Text>
          <Text className="text-sm leading-6 text-slate-400">
            Prepare for the field. Your next encounter will appear here.
          </Text>
        </View>

        <View className="items-center gap-4 rounded-lg border border-slate-800 bg-slate-950/40 p-6">
          <Text className="text-xs font-semibold tracking-[0.24em] text-cyan-300">
            COMBAT READINESS
          </Text>
          <Text className="text-center text-sm leading-6 text-slate-400">
            No encounter is currently active. Return when you are ready to enter the field.
          </Text>
        </View>
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
