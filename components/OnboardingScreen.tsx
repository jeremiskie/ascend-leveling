import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { PlayerClass, PlayerProfile } from '../types/player';

type OnboardingStep = 'name' | 'class' | 'agreement';

interface OnboardingScreenProps {
  onBack?: () => void;
  onComplete?: (profile: PlayerProfile) => void;
}

const steps: OnboardingStep[] = ['name', 'class', 'agreement'];
const playerClasses: { name: PlayerClass; description: string }[] = [
  { name: 'Vanguard', description: 'Strength, discipline, and resolve.' },
  { name: 'Arcanist', description: 'Focus, knowledge, and adaptability.' },
  { name: 'Ranger', description: 'Agility, awareness, and precision.' },
];

const stepTitles: Record<OnboardingStep, string> = {
  name: 'REGISTER YOUR NAME',
  class: 'CHOOSE YOUR CLASS',
  agreement: 'SYSTEM AGREEMENT',
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('name');
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState<PlayerClass | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentStepIndex = steps.indexOf(step);
  const canContinue =
    (step === 'name' && playerName.trim().length > 0) ||
    (step === 'class' && playerClass !== null) ||
    (step === 'agreement' && hasAgreed);

  const handleContinue = () => {
    if (!canContinue) return;

    if (step === 'name') {
      setStep('class');
      return;
    }

    if (step === 'class') {
      setStep('agreement');
      return;
    }

    if (!playerClass) return;

    const profile: PlayerProfile = { name: playerName.trim(), playerClass };
    onComplete?.(profile);
    setIsComplete(true);
  };

  const handleBack = () => {
    if (step === 'agreement') {
      setStep('class');
      return;
    }

    if (step === 'class') {
      setStep('name');
      return;
    }

    onBack?.();
  };

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-[#05070D]">
        <StatusBar style="light" />
        <View className="flex-1 justify-between px-7 py-8">
          <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
            SYSTEM // REGISTRATION
          </Text>

          <View className="gap-5">
            <Text className="text-xs font-medium tracking-[0.28em] text-cyan-300">
              AGREEMENT ACCEPTED
            </Text>
            <Text className="text-4xl font-semibold leading-tight text-white">
              Welcome, {playerName.trim()}.
            </Text>
            <Text className="text-base leading-7 text-slate-400">
              Your {playerClass} path is registered. Your journey is ready to begin.
            </Text>
          </View>

          <Text className="text-center text-[10px] tracking-[0.2em] text-slate-600">
            REGISTRATION COMPLETE
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <View className="flex-1 justify-between px-7 py-8">
        <View className="gap-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
              SYSTEM // ONBOARDING
            </Text>
            <Text className="text-[10px] tracking-[0.2em] text-slate-500">
              0{currentStepIndex + 1} / 03
            </Text>
          </View>

          <View className="flex-row gap-2">
            {steps.map((item, index) => (
              <View
                key={item}
                className={`h-1 flex-1 rounded-full ${
                  index <= currentStepIndex ? 'bg-cyan-300' : 'bg-slate-800'
                }`}
              />
            ))}
          </View>

          <View className="gap-3">
            <Text className="text-xs font-medium tracking-[0.28em] text-cyan-300">
              PROTOCOL {String(currentStepIndex + 1).padStart(2, '0')}
            </Text>
            <Text className="text-3xl font-semibold tracking-[0.1em] text-white">
              {stepTitles[step]}
            </Text>
          </View>

          {step === 'name' && (
            <View className="gap-4">
              <Text className="text-sm leading-6 text-slate-400">
                The System requires a name to identify its new player.
              </Text>
              <TextInput
                accessibilityLabel="Player name"
                autoCapitalize="words"
                autoCorrect={false}
                className="rounded-lg border border-cyan-200/30 bg-cyan-300/[0.04] px-4 py-4 text-base text-white"
                maxLength={24}
                onChangeText={setPlayerName}
                placeholder="Enter your name"
                placeholderTextColor="#64748B"
                returnKeyType="done"
                value={playerName}
              />
            </View>
          )}

          {step === 'class' && (
            <View className="gap-3">
              <Text className="mb-1 text-sm leading-6 text-slate-400">
                Select the path that best reflects your potential.
              </Text>
              {playerClasses.map((item) => {
                const isSelected = playerClass === item.name;
                return (
                  <Pressable
                    key={item.name}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    className={`gap-2 rounded-lg border px-4 py-4 ${
                      isSelected
                        ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                        : 'border-slate-800 bg-slate-950/40'
                    }`}
                    onPress={() => setPlayerClass(item.name)}>
                    <Text
                      className={`text-base font-semibold tracking-[0.12em] ${
                        isSelected ? 'text-cyan-100' : 'text-slate-200'
                      }`}>
                      {item.name.toUpperCase()}
                    </Text>
                    <Text className="text-sm text-slate-400">{item.description}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {step === 'agreement' && (
            <View className="gap-5">
              <Text className="text-sm leading-6 text-slate-400">
                By accepting, you agree to pursue your growth, take responsibility for your choices,
                and continue your journey at your own pace.
              </Text>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: hasAgreed }}
                className={`flex-row items-center gap-3 rounded-lg border px-4 py-4 ${
                  hasAgreed
                    ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
                onPress={() => setHasAgreed((agreed) => !agreed)}>
                <View
                  className={`h-5 w-5 items-center justify-center rounded border ${
                    hasAgreed ? 'border-cyan-200 bg-cyan-200' : 'border-slate-600'
                  }`}>
                  {hasAgreed && <Text className="text-xs font-bold text-slate-950">✓</Text>}
                </View>
                <Text className="flex-1 text-sm leading-5 text-slate-200">
                  I understand and accept the System Agreement.
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View className="gap-4">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canContinue }}
            className={`items-center rounded-lg border px-6 py-4 ${
              canContinue
                ? 'border-cyan-200/50 bg-cyan-300/[0.08] active:bg-cyan-300/15'
                : 'border-slate-800 bg-slate-950/40'
            }`}
            disabled={!canContinue}
            onPress={handleContinue}>
            <Text
              className={`text-sm font-semibold tracking-[0.22em] ${
                canContinue ? 'text-cyan-100' : 'text-slate-600'
              }`}>
              {step === 'agreement' ? 'ACCEPT & AWAKEN' : 'CONTINUE'}
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" className="items-center py-2" onPress={handleBack}>
            <Text className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
              {step === 'name' ? 'BACK TO AWAKENING' : 'PREVIOUS STEP'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
