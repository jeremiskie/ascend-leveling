import type { QuestListItem } from './quest';

export type QuestAdaptationMode = 'TIME_CONSTRAINT' | 'PHYSICAL_LIMITATION' | 'BURNOUT';

export interface QuestAdaptation {
  mode: QuestAdaptationMode;
  availableMinutes: number;
  quests: QuestListItem[];
}
