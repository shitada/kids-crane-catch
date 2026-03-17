import type { CraneConfig } from '@/types/index';

export const gameSettings: CraneConfig = {
  moveSpeed: 3.0,
  dropSpeed: 2.5,
  liftSpeed: 2.0,
  minX: -3.0,
  maxX: 3.0,
  grabRadius: 0.8,
  baseCatchRate: 0.7,
};

export const spawnSettings = {
  spawnCount: 6,
  areaWidth: 5.0,
  areaDepth: 3.0,
} as const;
