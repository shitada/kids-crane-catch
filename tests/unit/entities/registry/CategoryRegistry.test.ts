import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import type { CategoryDefinition } from '@/types/index';

const makeCategory = (overrides: Partial<CategoryDefinition> = {}): CategoryDefinition => ({
  id: 'animals',
  name: 'どうぶつ',
  icon: '🦁',
  description: 'いろんな どうぶつを つかまえよう！',
  unlocked: true,
  sortOrder: 0,
  ...overrides,
});

describe('CategoryRegistry', () => {
  let registry: CategoryRegistry;

  beforeEach(() => {
    registry = new CategoryRegistry();
  });

  describe('register', () => {
    it('should register a category', () => {
      const cat = makeCategory();
      registry.register(cat);
      expect(registry.get('animals')).toEqual(cat);
    });

    it('should overwrite existing category with same id', () => {
      registry.register(makeCategory({ name: 'old' }));
      const updated = makeCategory({ name: 'new' });
      registry.register(updated);
      expect(registry.get('animals')?.name).toBe('new');
    });
  });

  describe('get', () => {
    it('should return undefined for unregistered id', () => {
      expect(registry.get('nonexistent')).toBeUndefined();
    });

    it('should return registered category', () => {
      const cat = makeCategory();
      registry.register(cat);
      expect(registry.get('animals')).toEqual(cat);
    });
  });

  describe('getAll', () => {
    it('should return empty array when no categories registered', () => {
      expect(registry.getAll()).toEqual([]);
    });

    it('should return all registered categories sorted by sortOrder', () => {
      registry.register(makeCategory({ id: 'b', sortOrder: 2 }));
      registry.register(makeCategory({ id: 'a', sortOrder: 1 }));
      const all = registry.getAll();
      expect(all).toHaveLength(2);
      expect(all[0]!.id).toBe('a');
      expect(all[1]!.id).toBe('b');
    });
  });

  describe('getUnlocked', () => {
    it('should return only unlocked categories', () => {
      registry.register(makeCategory({ id: 'locked', unlocked: false, sortOrder: 0 }));
      registry.register(makeCategory({ id: 'unlocked', unlocked: true, sortOrder: 1 }));
      const unlocked = registry.getUnlocked();
      expect(unlocked).toHaveLength(1);
      expect(unlocked[0]!.id).toBe('unlocked');
    });
  });
});
