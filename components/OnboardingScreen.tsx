import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type {
  ExperienceLevel,
  PlayerClass,
  PlayerGoal,
  PlayerProfile,
  PlayerSex,
} from '../types/player';

type OnboardingStep = 'identity' | 'readiness' | 'class' | 'agreement';

interface OnboardingScreenProps {
  onBack?: () => void;
  onComplete?: (profile: PlayerProfile) => void;
}

const steps: OnboardingStep[] = ['identity', 'readiness', 'class', 'agreement'];
const sexOptions: { value: PlayerSex; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'intersex', label: 'Intersex' },
  { value: 'preferNotToSay', label: 'Prefer not to say' },
];
const experienceOptions: { value: ExperienceLevel; label: string; detail: string }[] = [
  { value: 'beginner', label: 'Beginner', detail: 'New or returning to regular training' },
  { value: 'intermediate', label: 'Intermediate', detail: 'Regular training experience' },
  { value: 'advanced', label: 'Advanced', detail: 'Consistent, established training practice' },
];
const goalOptions: { value: PlayerGoal; label: string }[] = [
  { value: 'physical', label: 'Physical' },
  { value: 'mental', label: 'Mental' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'combat', label: 'Combat' },
];
const playerClasses: { name: PlayerClass; description: string }[] = [
  { name: 'Vanguard', description: 'Strength, discipline, and resolve.' },
  { name: 'Arcanist', description: 'Focus, knowledge, and adaptability.' },
  { name: 'Ranger', description: 'Agility, awareness, and precision.' },
];

const stepTitles: Record<OnboardingStep, string> = {
  identity: 'PLAYER PROFILE',
  readiness: 'SAFETY & GOALS',
  class: 'CHOOSE YOUR CLASS',
  agreement: 'SYSTEM AGREEMENT',
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('identity');
  const [playerName, setPlayerName] = useState('');
  const [ageInput, setAgeInput] = useState('');
  const [sex, setSex] = useState<PlayerSex | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [goals, setGoals] = useState<PlayerGoal[]>([]);
  const [hasSafetyConcern, setHasSafetyConcern] = useState<boolean | null>(null);
  const [playerClass, setPlayerClass] = useState<PlayerClass | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentStepIndex = steps.indexOf(step);
  const age = Number(ageInput);
  const canContinue =
    (step === 'identity' &&
      playerName.trim().length > 0 &&
      Number.isInteger(age) &&
      age > 0 &&
      age <= 120 &&
      sex !== null) ||
    (step === 'readiness' &&
      experienceLevel !== null &&
      goals.length > 0 &&
      hasSafetyConcern !== null) ||
    (step === 'class' && playerClass !== null) ||
    (step === 'agreement' && hasAgreed);

  const handleContinue = () => {
    if (!canContinue) return;

    if (step === 'identity') {
      setStep('readiness');
      return;
    }

    if (step === 'readiness') {
      setStep('class');
      return;
    }

    if (step === 'class') {
      setStep('agreement');
      return;
    }

    if (!playerClass || !sex || !experienceLevel || hasSafetyConcern === null) return;

    const profile: PlayerProfile = {
      name: playerName.trim(),
      playerClass,
      age,
      sex,
      experienceLevel,
      goals,
      hasInjuryOrMedicalCondition: hasSafetyConcern,
      safetyState: hasSafetyConcern ? 'ADAPTIVE' : 'SAFETY',
    };
    onComplete?.(profile);
    setIsComplete(true);
  };

  const handleBack = () => {
    if (step === 'agreement') {
      setStep('class');
      return;
    }

    if (step === 'class') {
      setStep('readiness');
      return;
    }

    if (step === 'readiness') {
      setStep('identity');
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
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-8 pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold tracking-[0.3em] text-cyan-200">
              SYSTEM // ONBOARDING
            </Text>
            <Text className="text-[10px] tracking-[0.2em] text-slate-500">
              0{currentStepIndex + 1} / 04
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

          {step === 'identity' && (
            <View className="gap-4">
              <Text className="text-sm leading-6 text-slate-400">
                Set up your player profile. Your age and sex are used only to contextualize this
                prototype.
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
              <TextInput
                accessibilityLabel="Age"
                className="rounded-lg border border-cyan-200/30 bg-cyan-300/[0.04] px-4 py-4 text-base text-white"
                keyboardType="number-pad"
                maxLength={3}
                onChangeText={(value) => setAgeInput(value.replace(/[^0-9]/g, ''))}
                placeholder="Age"
                placeholderTextColor="#64748B"
                value={ageInput}
              />
              <Text className="text-xs font-medium tracking-[0.14em] text-slate-400">SEX</Text>
              <View className="flex-row flex-wrap gap-2">
                {sexOptions.map((option) => {
                  const selected = sex === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      className={`rounded-lg border px-3 py-3 ${
                        selected
                          ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                      onPress={() => setSex(option.value)}>
                      <Text className={`text-xs ${selected ? 'text-cyan-100' : 'text-slate-300'}`}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 'readiness' && (
            <View className="gap-5">
              <View className="gap-3">
                <Text className="text-xs font-medium tracking-[0.14em] text-slate-400">
                  TRAINING EXPERIENCE
                </Text>
                {experienceOptions.map((option) => {
                  const selected = experienceLevel === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      className={`gap-1 rounded-lg border px-4 py-3 ${
                        selected
                          ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                          : 'border-slate-800 bg-slate-950/40'
                      }`}
                      onPress={() => setExperienceLevel(option.value)}>
                      <Text
                        className={`text-sm font-semibold ${selected ? 'text-cyan-100' : 'text-slate-200'}`}>
                        {option.label}
                      </Text>
                      <Text className="text-xs text-slate-500">{option.detail}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View className="gap-3">
                <Text className="text-xs font-medium tracking-[0.14em] text-slate-400">
                  YOUR GOALS · SELECT ALL THAT APPLY
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {goalOptions.map((option) => {
                    const selected = goals.includes(option.value);
                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        className={`rounded-lg border px-4 py-3 ${
                          selected
                            ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                            : 'border-slate-800 bg-slate-950/40'
                        }`}
                        onPress={() =>
                          setGoals((current) =>
                            selected
                              ? current.filter((goal) => goal !== option.value)
                              : [...current, option.value]
                          )
                        }>
                        <Text
                          className={`text-xs ${selected ? 'text-cyan-100' : 'text-slate-300'}`}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-3">
                <Text className="text-xs font-medium tracking-[0.14em] text-slate-400">
                  SAFETY CHECK
                </Text>
                <Text className="text-sm leading-6 text-slate-400">
                  Do you have an injury or medical condition that could affect physical activity?
                  This is not a diagnosis; no details are requested.
                </Text>
                <View className="flex-row gap-3">
                  {[
                    { value: false, label: 'No limitations reported' },
                    { value: true, label: 'Yes · adapt conservatively' },
                  ].map((option) => {
                    const selected = hasSafetyConcern === option.value;
                    return (
                      <Pressable
                        key={option.label}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        className={`flex-1 items-center rounded-lg border px-3 py-3 ${
                          selected
                            ? 'border-cyan-200/60 bg-cyan-300/[0.08]'
                            : 'border-slate-800 bg-slate-950/40'
                        }`}
                        onPress={() => setHasSafetyConcern(option.value)}>
                        <Text
                          className={`text-center text-xs ${selected ? 'text-cyan-100' : 'text-slate-300'}`}>
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
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
        </ScrollView>

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
              {step === 'identity' ? 'BACK TO AWAKENING' : 'PREVIOUS STEP'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
