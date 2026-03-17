import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpawnSystem } from '@/game/systems/SpawnSystem';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import type { ItemDefinition, ModelParams } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xffffff, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1,
  bounceAnimation: false,
};

const makeItem = (id: string): ItemDefinition => ({
  id,
  categoryId: 'animals',
  name: id,
  description: '',
  rarity: 'common',
  modelParams,
  catchDifficulty: 0.5,
});

describe('SpawnSystem', () => {
  let system: SpawnSystem;
  let registry: ItemRegistry;

  beforeEach(() => {
    registry = new ItemRegistry();
    registry.register(makeItem('lion'));
    registry.register(makeItem('elephant'));
    registry.register(makeItem('giraffe'));
    system = new SpawnSystem(registry);
  });

  describe('spawnItems', () => {
    it('should spawn the requested number of items', () => {
      const spawned = system.spawnItems('animals', 3, 5, 3);
      expect(spawned).toHaveLength(3);
    });

    it('should place items within the area bounds', () => {
      const areaWidth = 5;
      const areaDepth = 3;
      const spawned = system.spawnItems('animals', 6, areaWidth, areaDepth);
      for (const item of spawned) {
        expect(item.position.x).toBeGreaterThanOrEqual(-areaWidth / 2);
        expect(item.position.x).toBeLessThanOrEqual(areaWidth / 2);
        expect(item.position.z).toBeGreaterThanOrEqual(-areaDepth / 2);
        expect(item.position.z).toBeLessThanOrEqual(areaDepth / 2);
      }
    });

    it('should select items from the specified category', () => {
      const spawned = system.spawnItems('animals', 3, 5, 3);
      for (const item of spawned) {
        expect(item.itemDefinition.categoryId).toBe('animals');
      }
    });

    it('should return empty array for unknown category', () => {
      const spawned = system.spawnItems('unknown', 3, 5, 3);
      expect(spawned).toHaveLength(0);
    });
  });
});
