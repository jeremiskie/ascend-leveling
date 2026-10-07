import { Pressable, Text, View } from 'react-native';
import type { ChatMessage } from '../types/chat';
import type { QuestAdaptation } from '../types/questAdaptation';

interface ChatBubbleProps {
  message: ChatMessage;
  onAcceptQuestAdaptation?: (adaptation: QuestAdaptation) => void;
}

const SystemMessageBubble: React.FC<ChatBubbleProps> = ({ message, onAcceptQuestAdaptation }) => (
  <View className="max-w-[88%] gap-2 self-start">
    <Text className="text-[9px] font-semibold tracking-[0.2em] text-cyan-300">SYSTEM</Text>
    <View className="rounded-2xl rounded-tl-sm border border-cyan-200/20 bg-cyan-300/[0.05] px-4 py-3">
      <Text className="text-sm leading-6 text-slate-200">{message.text}</Text>
    </View>
    {message.questAdaptation &&
      (message.adaptationAccepted ? (
        <View className="rounded-lg border border-emerald-300/30 bg-emerald-300/[0.06] px-3 py-2">
          <Text
            accessibilityLiveRegion="polite"
            className="text-[10px] font-semibold tracking-[0.12em] text-emerald-200">
            QUEST POOL ADAPTED
          </Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          className="items-center rounded-lg border border-cyan-200/40 bg-cyan-300/[0.06] px-4 py-3 active:bg-cyan-300/15"
          onPress={() => onAcceptQuestAdaptation?.(message.questAdaptation!)}>
          <Text className="text-[10px] font-semibold tracking-[0.14em] text-cyan-100">
            ACCEPT QUEST ADAPTATION
          </Text>
        </Pressable>
      ))}
    <Text className="text-[9px] tracking-[0.1em] text-slate-600">{message.timestamp}</Text>
  </View>
);

const PlayerMessageBubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <View className="max-w-[88%] items-end gap-2 self-end">
    <Text className="text-[9px] font-semibold tracking-[0.2em] text-slate-400">YOU</Text>
    <View className="rounded-2xl rounded-tr-sm border border-slate-700 bg-slate-800/70 px-4 py-3">
      <Text className="text-sm leading-6 text-white">{message.text}</Text>
    </View>
    <Text className="text-[9px] tracking-[0.1em] text-slate-600">{message.timestamp}</Text>
  </View>
);

export const ChatMessageBubble: React.FC<ChatBubbleProps> = ({
  message,
  onAcceptQuestAdaptation,
}) =>
  message.role === 'system' ? (
    <SystemMessageBubble message={message} onAcceptQuestAdaptation={onAcceptQuestAdaptation} />
  ) : (
    <PlayerMessageBubble message={message} />
  );
