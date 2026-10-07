import type { QuestAdaptation } from './questAdaptation';

export type ChatRole = 'system' | 'player';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
  questAdaptation?: QuestAdaptation;
  adaptationAccepted?: boolean;
}

export type ChatResponder = (message: string) => Promise<string>;
