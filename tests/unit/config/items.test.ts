import { describe, it, expect } from 'vitest';
import { items } from '@/game/config/items';

describe('items config', () => {
  it('should define 8 animal items', () => {
    expect(items).toHaveLength(8);
  });

  it('all items should belong to animals category', () => {
    for (const item of items) {
      expect(item.categoryId).toBe('animals');
    }
  });

  it('all items should have valid ids', () => {
    for (const item of items) {
      expect(item.id).toMatch(/^[a-z-]+$/);
    }
  });

  it('all items should have unique ids', () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all items should have valid catchDifficulty (0.0-1.0)', () => {
    for (const item of items) {
      expect(item.catchDifficulty).toBeGreaterThanOrEqual(0);
      expect(item.catchDifficulty).toBeLessThanOrEqual(1);
    }
  });

  it('all items should have valid rarity', () => {
    for (const item of items) {
      expect(['common', 'rare', 'legendary']).toContain(item.rarity);
    }
  });

  it('all items should have modelParams with at least one part', () => {
    for (const item of items) {
      expect(item.modelParams.parts.length).toBeGreaterThan(0);
      expect(item.modelParams.scale).toBeGreaterThan(0);
    }
  });

  it('should include specific animals', () => {
    const ids = items.map((i) => i.id);
    expect(ids).toContain('lion');
    expect(ids).toContain('elephant');
    expect(ids).toContain('giraffe');
    expect(ids).toContain('penguin');
    expect(ids).toContain('panda');
    expect(ids).toContain('koala');
    expect(ids).toContain('dolphin');
    expect(ids).toContain('rabbit');
  });

  it('all modelParams parts should have valid shapes', () => {
    const validShapes = ['sphere', 'box', 'cylinder', 'cone', 'torus'];
    for (const item of items) {
      for (const part of item.modelParams.parts) {
        expect(validShapes).toContain(part.shape);
        expect(part.position).toHaveLength(3);
        expect(part.scale).toHaveLength(3);
      }
    }
  });
});
