import { describe, it, expect } from 'vitest';
import { CatchSystem } from '@/game/systems/CatchSystem';
import type { SpawnedItem, ItemDefinition, ModelParams } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xffffff, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1,
  bounceAnimation: false,
};

const makeItem = (id: string, x: number, difficulty = 0.5): SpawnedItem => ({
  itemDefinition: {
    id,
    categoryId: 'animals',
    name: id,
    description: '',
    rarity: 'common',
    modelParams,
    catchDifficulty: difficulty,
  },
  position: { x, y: 0, z: 0 },
});

describe('CatchSystem', () => {
  let system: CatchSystem;

  beforeEach(() => {
    system = new CatchSystem();
  });

  describe('evaluate', () => {
    it('should return failure when no items are in range', () => {
      const items = [makeItem('lion', 10)];
      const result = system.evaluate(0, 0.8, items, 0.7);
      expect(result.success).toBe(false);
      expect(result.item).toBeNull();
    });

    it('should find item within grab radius (deterministic with high catch rate)', () => {
      const items = [makeItem('lion', 0.3, 0.0)];
      const result = system.evaluate(0, 0.8, items, 1.0);
      expect(result.success).toBe(true);
      expect(result.item?.id).toBe('lion');
    });

    it('should select closest item when multiple are in range', () => {
      const items = [
        makeItem('far', 0.7, 0.0),
        makeItem('close', 0.1, 0.0),
      ];
      const result = system.evaluate(0, 0.8, items, 1.0);
      expect(result.item?.id).toBe('close');
    });

    it('should consider catchDifficulty in success rate', () => {
      // With difficulty 1.0 and baseCatchRate 0.0, should always fail
      const items = [makeItem('lion', 0.1, 1.0)];
      const result = system.evaluate(0, 0.8, items, 0.0);
      expect(result.success).toBe(false);
    });
  });
});
