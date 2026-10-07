import { createQuestListItem } from '../questGeneratorService';
import { validateQuestJson } from './validateQuestJson';
import type { QuestAdaptation, QuestAdaptationMode } from '../../types/questAdaptation';

const adaptationBlockPattern = /\[ADAPT_QUEST\]([\s\S]*?)(?:\[\/ADAPT_QUEST\]|$)/g;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parsePayload = (rawPayload: string, userMessage: string): QuestAdaptation | null => {
  let payload: unknown;
  try {
    const trimmed = rawPayload.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    payload = JSON.parse(fenced ? fenced[1] : trimmed) as unknown;
  } catch {
    return null;
  }

  if (!isRecord(payload)) return null;
  const modes = ['TIME_CONSTRAINT', 'PHYSICAL_LIMITATION', 'BURNOUT'] as const;
  const availableMinutes = payload.availableMinutes;
  if (typeof payload.mode !== 'string' || !modes.some((mode) => mode === payload.mode)) {
    return null;
  }
  if (
    typeof availableMinutes !== 'number' ||
    !Number.isInteger(availableMinutes) ||
    availableMinutes < 1 ||
    availableMinutes > 180 ||
    !Array.isArray(payload.quests) ||
    payload.quests.length < 1 ||
    payload.quests.length > 5
  ) {
    return null;
  }

  const mode = payload.mode as QuestAdaptationMode;
  if (mode === 'TIME_CONSTRAINT') {
    const statedMinutes = userMessage.match(/\b(\d{1,3})\s*(?:minutes?|mins?)\b/i);
    if (!statedMinutes || availableMinutes > Math.min(Number(statedMinutes[1]), 180)) {
      return null;
    }
  }

  const quests = [];
  for (const candidate of payload.quests) {
    const quest = validateQuestJson(candidate);
    if (!quest) return null;
    quests.push(createQuestListItem(quest));
  }
  const totalEstimatedMinutes = quests.reduce(
    (total, quest) => total + (quest.estimatedMinutes ?? 181),
    0
  );
  if (totalEstimatedMinutes > availableMinutes) return null;
  if (mode === 'PHYSICAL_LIMITATION' && quests.some((quest) => quest.goalCategory !== 'Recovery')) {
    return null;
  }
  if (
    mode === 'BURNOUT' &&
    (quests.some((quest) => quest.difficulty !== 'EASY' || quest.estimatedMinutes! > 15) ||
      totalEstimatedMinutes > 15)
  ) {
    return null;
  }

  return { mode, availableMinutes, quests };
};

export interface ParsedQuestAdaptationResponse {
  text: string;
  adaptation: QuestAdaptation | null;
}

export const parseQuestAdaptationResponse = (
  response: string,
  userMessage: string
): ParsedQuestAdaptationResponse => {
  let adaptation: QuestAdaptation | null = null;
  let blockCount = 0;
  const visibleText = response.replace(adaptationBlockPattern, (_block, rawPayload: string) => {
    blockCount += 1;
    if (blockCount === 1) adaptation = parsePayload(rawPayload, userMessage);
    return '';
  });

  return {
    text: visibleText.replace(/\n{3,}/g, '\n\n').trim(),
    adaptation: blockCount === 1 ? adaptation : null,
  };
};
