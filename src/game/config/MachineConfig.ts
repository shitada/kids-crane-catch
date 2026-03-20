import type { MachineCategory } from '../../types';

export const MACHINES: MachineCategory[] = [
  {
    id: 'vehicles',
    name: 'のりもの',
    emoji: '🚗',
    description: 'いろんな のりものを あつめよう！',
    themeColor: 0x4488ff,
    itemIds: ['shinkansen', 'airplane', 'bus', 'policeCar', 'excavator', 'helicopter', 'rocket', 'ship'],
  },
];
