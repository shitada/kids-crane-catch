import { describe, it, expect } from 'vitest';
import { categories } from '@/game/config/categories';

describe('categories config', () => {
  it('should define the animals category', () => {
    const animals = categories.find((c) => c.id === 'animals');
    expect(animals).toBeDefined();
    expect(animals!.name).toBe('どうぶつ');
    expect(animals!.icon).toBe('🦁');
    expect(animals!.unlocked).toBe(true);
  });

  it('all categories should have required fields', () => {
    for (const cat of categories) {
      expect(cat.id).toMatch(/^[a-z-]+$/);
      expect(cat.name.length).toBeGreaterThan(0);
      expect(cat.icon.length).toBeGreaterThan(0);
      expect(cat.description.length).toBeGreaterThan(0);
      expect(typeof cat.unlocked).toBe('boolean');
      expect(cat.sortOrder).toBeGreaterThanOrEqual(0);
    }
  });

  it('all categories should have unique ids', () => {
    const ids = categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
