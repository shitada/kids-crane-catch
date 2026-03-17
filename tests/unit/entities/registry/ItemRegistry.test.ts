import { describe, it, expect, beforeEach } from 'vitest';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import type { ItemDefinition, ModelParams } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xd4a017, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1,
  bounceAnimation: true,
};

const makeItem = (overrides: Partial<ItemDefinition> = {}): ItemDefinition => ({
  id: 'lion',
  categoryId: 'animals',
  name: 'らいおん',
  description: 'たてがみが りっぱな どうぶつの おうさま',
  rarity: 'common',
  modelParams,
  catchDifficulty: 0.5,
  ...overrides,
});

describe('ItemRegistry', () => {
  let registry: ItemRegistry;

  beforeEach(() => {
    registry = new ItemRegistry();
  });

  describe('register', () => {
    it('should register an item', () => {
      const item = makeItem();
      registry.register(item);
      expect(registry.get('lion')).toEqual(item);
    });
  });

  describe('get', () => {
    it('should return undefined for unregistered id', () => {
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('getByCategory', () => {
    it('should return items for a specific category', () => {
      registry.register(makeItem({ id: 'lion', categoryId: 'animals' }));
      registry.register(makeItem({ id: 'apple', categoryId: 'fruits' }));
      const animals = registry.getByCategory('animals');
      expect(animals).toHaveLength(1);
      expect(animals[0]!.id).toBe('lion');
    });

    it('should return empty array for unknown category', () => {
      expect(registry.getByCategory('unknown')).toEqual([]);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no items registered', () => {
      expect(registry.getAll()).toEqual([]);
    });

    it('should return all registered items', () => {
      registry.register(makeItem({ id: 'lion' }));
      registry.register(makeItem({ id: 'elephant' }));
      expect(registry.getAll()).toHaveLength(2);
    });
  });
});
