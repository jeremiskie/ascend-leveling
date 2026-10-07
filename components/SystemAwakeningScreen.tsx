import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface SystemAwakeningScreenProps {
  onContinue?: () => void;
}

export const SystemAwakeningScreen: React.FC<SystemAwakeningScreenProps> = ({ onContinue }) => {
  const [showOnboardingPreview, setShowOnboardingPreview] = useState(false);

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
      return;
    }

    setShowOnboardingPreview(true);
  };

  if (showOnboardingPreview) {
    return (
      <SafeAreaView className="flex-1 bg-[#05070D]">
        <StatusBar style="light" />
        <View className="flex-1 justify-between px-7 py-8">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
            SYSTEM // ONBOARDING
          </Text>

          <View className="gap-5">
            <Text className="text-xs font-medium tracking-[0.28em] text-cyan-300">
              PROTOCOL INITIALIZED
            </Text>
            <Text className="text-4xl font-semibold leading-tight text-white">
              Your journey starts here.
            </Text>
            <Text className="text-base leading-7 text-slate-400">
              This is a preview of the onboarding transition. Connect this screen to your onboarding
              route when it is ready.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="items-center rounded-lg border border-slate-700 px-6 py-4 active:bg-slate-900"
            onPress={() => setShowOnboardingPreview(false)}>
            <Text className="text-sm font-semibold tracking-[0.2em] text-slate-300">
              RETURN TO AWAKENING
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <View className="flex-1 justify-between px-7 py-8">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">ASCEND</Text>
          <Text className="text-[10px] tracking-[0.22em] text-slate-500">SYSTEM // 001</Text>
        </View>

        <View className="items-center gap-10">
          <View className="h-64 w-64 items-center justify-center rounded-full border border-cyan-300/15">
            <View className="h-52 w-52 items-center justify-center rounded-full border border-cyan-300/25">
              <View className="h-36 w-36 items-center justify-center rounded-full border border-cyan-200/40 bg-cyan-300/[0.04]">
                <View className="h-16 w-16 rotate-45 items-center justify-center border border-cyan-200/70 bg-cyan-200/[0.08]">
                  <View className="h-2 w-2 rounded-full bg-cyan-100" />
                </View>
              </View>
            </View>
          </View>

          <View className="items-center gap-4">
            <Text className="text-xs font-medium tracking-[0.32em] text-cyan-300">
              A NEW SIGNAL DETECTED
            </Text>
            <Text className="text-center text-4xl font-semibold tracking-[0.12em] text-white">
              SYSTEM{'\n'}AWAKENING
            </Text>
            <Text className="max-w-xs text-center text-sm leading-6 text-slate-400">
              Your potential has been recognized. The next step is yours.
            </Text>
          </View>
        </View>

        <View className="gap-5">
          <Pressable
            accessibilityRole="button"
            className="items-center rounded-lg border border-cyan-200/50 bg-cyan-300/[0.08] px-6 py-4 active:bg-cyan-300/15"
            onPress={handleContinue}>
            <Text className="text-sm font-semibold tracking-[0.22em] text-cyan-100">
              BEGIN AWAKENING
            </Text>
          </Pressable>
          <Text className="text-center text-[10px] tracking-[0.2em] text-slate-600">
            YOUR JOURNEY BEGINS WITH A SINGLE CHOICE
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
