import type { DungeonTier } from '../types/combat';

export const mockDungeonTiers: DungeonTier[] = [
  {
    id: 'E',
    name: 'E-RANK GATE',
    recommendedLevel: 1,
    enemyName: 'Cave Goblin',
    enemyTitle: 'Gate Guardian',
    enemyMaxHp: 60,
    enemyAttack: 8,
    reward: '+80 XP · 30 Gold',
  },
  {
    id: 'D',
    name: 'D-RANK GATE',
    recommendedLevel: 3,
    enemyName: 'Ironfang Wolf',
    enemyTitle: 'Pack Alpha',
    enemyMaxHp: 100,
    enemyAttack: 13,
    reward: '+160 XP · 60 Gold',
  },
  {
    id: 'C',
    name: 'C-RANK GATE',
    recommendedLevel: 6,
    enemyName: 'Abyss Warden',
    enemyTitle: 'Gate Overlord',
    enemyMaxHp: 150,
    enemyAttack: 18,
    reward: '+300 XP · 120 Gold',
  },
];
