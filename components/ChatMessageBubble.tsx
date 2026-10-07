import { Text, View } from 'react-native';
import type { ChatMessage } from '../types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
}

const SystemMessageBubble: React.FC<ChatBubbleProps> = ({ message }) => (
  <View className="max-w-[88%] gap-2 self-start">
    <Text className="text-[9px] font-semibold tracking-[0.2em] text-cyan-300">SYSTEM</Text>
    <View className="rounded-2xl rounded-tl-sm border border-cyan-200/20 bg-cyan-300/[0.05] px-4 py-3">
      <Text className="text-sm leading-6 text-slate-200">{message.text}</Text>
    </View>
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

export const ChatMessageBubble: React.FC<ChatBubbleProps> = ({ message }) =>
  message.role === 'system' ? (
    <SystemMessageBubble message={message} />
  ) : (
    <PlayerMessageBubble message={message} />
  );
