export type ChatRole = 'system' | 'player';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}

export type ChatResponder = (message: string) => Promise<string>;
