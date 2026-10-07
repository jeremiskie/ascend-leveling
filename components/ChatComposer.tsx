import { Pressable, Text, TextInput, View } from 'react-native';

interface ChatComposerProps {
  value: string;
  isResponding: boolean;
  onChangeText: (value: string) => void;
  onSend: () => void;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  value,
  isResponding,
  onChangeText,
  onSend,
}) => {
  const canSend = value.trim().length > 0 && !isResponding;

  return (
    <View className="flex-row items-end gap-3 border-t border-slate-800 bg-[#05070D] px-5 py-3">
      <TextInput
        accessibilityLabel="Message the System"
        className="max-h-28 min-h-12 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-5 text-white"
        editable={!isResponding}
        maxLength={500}
        multiline
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        placeholder="Message the System..."
        placeholderTextColor="#64748B"
        returnKeyType="send"
        value={value}
      />
      <Pressable
        accessibilityLabel="Send message"
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSend }}
        className={`h-12 items-center justify-center rounded-xl border px-4 ${
          canSend
            ? 'border-cyan-200/50 bg-cyan-300/[0.08] active:bg-cyan-300/15'
            : 'border-slate-800 bg-slate-950'
        }`}
        disabled={!canSend}
        onPress={onSend}>
        <Text
          className={`text-[10px] font-semibold tracking-[0.16em] ${
            canSend ? 'text-cyan-100' : 'text-slate-600'
          }`}>
          SEND
        </Text>
      </Pressable>
    </View>
  );
};
