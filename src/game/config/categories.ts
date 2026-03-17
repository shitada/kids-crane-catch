import type { CategoryDefinition } from '@/types/index';

export const categories: readonly CategoryDefinition[] = [
  {
    id: 'animals',
    name: 'どうぶつ',
    icon: '🦁',
    description: 'いろんな どうぶつを つかまえよう！',
    unlocked: true,
    sortOrder: 0,
  },
];
