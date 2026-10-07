import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { initialSystemMessage } from '../data/mockChat';
import type { ChatMessage, ChatResponder } from '../types/chat';
import type { PlayerData } from '../types/playerState';
import type { QuestAdaptation } from '../types/questAdaptation';
import { sendGeminiMessage } from '../services/geminiService';
import { parseQuestAdaptationResponse } from '../services/utils/parseQuestAdaptation';
import { ChatComposer } from './ChatComposer';
import { ChatMessageBubble } from './ChatMessageBubble';

interface SystemChatScreenProps {
  playerData: PlayerData;
  onBack: () => void;
  onAcceptQuestAdaptation: (adaptation: QuestAdaptation) => boolean;
  responder?: ChatResponder;
}

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();

export const SystemChatScreen: React.FC<SystemChatScreenProps> = ({
  playerData,
  onBack,
  onAcceptQuestAdaptation,
  responder,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialSystemMessage]);
  const [draft, setDraft] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const requestInFlightRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, isResponding, responseError]);

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || requestInFlightRef.current) return;

    requestInFlightRef.current = true;
    setDraft('');
    setIsResponding(true);
    setResponseError(null);

    const playerMessage: ChatMessage = {
      id: `player-${Date.now()}`,
      role: 'player',
      text,
      timestamp: getTimestamp(),
    };
    setMessages((current) => [...current, playerMessage]);

    try {
      const response = responder
        ? await responder(text)
        : await sendGeminiMessage(text, playerData, messages);
      const parsedResponse = parseQuestAdaptationResponse(response, text);
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}`,
        role: 'system',
        text:
          parsedResponse.text ||
          (parsedResponse.adaptation
            ? 'An adapted quest pool is ready for your review.'
            : 'Adaptation data could not be verified. No changes were made.'),
        timestamp: getTimestamp(),
        questAdaptation: parsedResponse.adaptation ?? undefined,
      };
      setMessages((current) => [...current, systemMessage]);
    } catch {
      setResponseError('The System could not respond. Please try sending your message again.');
    } finally {
      requestInFlightRef.current = false;
      setIsResponding(false);
    }
  };

  const handleAcceptAdaptation = (messageId: string, adaptation: QuestAdaptation) => {
    const accepted = onAcceptQuestAdaptation(adaptation);
    if (!accepted) {
      setResponseError('The adaptation could not be applied. Your quest pool is unchanged.');
      return;
    }

    setResponseError(null);
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, adaptationAccepted: true } : message
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#05070D]">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1">
          <View className="flex-row items-center justify-between border-b border-slate-800 px-5 py-4">
            <View className="flex-row items-center gap-3">
              <Pressable
                accessibilityLabel="Return to overview"
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-lg border border-slate-700 active:bg-slate-900"
                onPress={onBack}>
                <Text className="text-lg text-cyan-200">{'<'}</Text>
              </Pressable>
              <View className="gap-1">
                <Text className="text-xs font-semibold tracking-[0.22em] text-cyan-100">
                  SYSTEM CHAT
                </Text>
                <Text className="text-[9px] tracking-[0.12em] text-slate-500">
                  CONNECTED · {playerData.name.toUpperCase()}
                </Text>
              </View>
            </View>
            <View className="h-2 w-2 rounded-full bg-emerald-300" />
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerClassName="gap-5 px-5 py-5"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View className="self-center rounded-full border border-slate-800 px-3 py-1">
              <Text className="text-[9px] tracking-[0.16em] text-slate-500">SYSTEM CHANNEL</Text>
            </View>
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                onAcceptQuestAdaptation={(adaptation) =>
                  handleAcceptAdaptation(message.id, adaptation)
                }
              />
            ))}
            {isResponding && (
              <View accessibilityLiveRegion="polite" className="self-start">
                <Text className="text-xs tracking-[0.12em] text-cyan-300">
                  SYSTEM IS RESPONDING...
                </Text>
              </View>
            )}
            {responseError && (
              <Text accessibilityLiveRegion="assertive" className="text-xs leading-5 text-rose-300">
                {responseError}
              </Text>
            )}
          </ScrollView>

          <ChatComposer
            isResponding={isResponding}
            onChangeText={setDraft}
            onSend={sendMessage}
            value={draft}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
