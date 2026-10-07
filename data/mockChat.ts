import type { ChatMessage, ChatResponder } from '../types/chat';

export const initialSystemMessage: ChatMessage = {
  id: 'system-welcome',
  role: 'system',
  text: 'System connection established. Ask a question or request guidance for your next objective.',
  timestamp: 'NOW',
};

export const createMockSystemResponse: ChatResponder = async (message) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('quest')) {
    return 'Your active objective is Daily Conditioning. Complete three training sessions to claim its reward.';
  }

  if (normalizedMessage.includes('stat') || normalizedMessage.includes('level')) {
    return 'Consistent training and completed objectives contribute to your growth. Check Progress for your recorded gains and milestones.';
  }

  if (normalizedMessage.includes('combat') || normalizedMessage.includes('dungeon')) {
    return 'Review your HP and MP before entering a gate. Begin with a dungeon tier that matches your current level.';
  }

  return 'Acknowledged. Stay focused on your objectives, Hunter. The System will record your progress.';
};
