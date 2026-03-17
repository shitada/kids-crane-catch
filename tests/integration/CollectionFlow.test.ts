import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
  const Scene = vi.fn(() => ({ add: vi.fn(), remove: vi.fn(), children: [], background: null }));
  const PerspectiveCamera = vi.fn(() => ({
    position: { set: vi.fn() }, lookAt: vi.fn(), aspect: 1, updateProjectionMatrix: vi.fn(),
  }));
  const Group = vi.fn(() => ({
    add: vi.fn(), scale: { set: vi.fn() }, rotation: { y: 0 },
    children: [], position: { x: 0, y: 0, z: 0, set: vi.fn() },
  }));
  return {
    Scene, PerspectiveCamera, Group, Color: vi.fn(),
    DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() } })),
    AmbientLight: vi.fn(),
    Mesh: vi.fn(() => ({
      position: { set: vi.fn() }, scale: { set: vi.fn() }, rotation: { set: vi.fn() },
    })),
    SphereGeometry: vi.fn(), BoxGeometry: vi.fn(), CylinderGeometry: vi.fn(),
    ConeGeometry: vi.fn(), TorusGeometry: vi.fn(),
    MeshToonMaterial: vi.fn(), MeshStandardMaterial: vi.fn(),
  };
});

import { SaveManager } from '@/game/storage/SaveManager';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import type { ModelParams } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xffffff, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1, bounceAnimation: false,
};

describe('CollectionFlow Integration', () => {
  let saveManager: SaveManager;
  let itemRegistry: ItemRegistry;

  beforeEach(() => {
    localStorage.clear();
    saveManager = new SaveManager();
    itemRegistry = new ItemRegistry();
    itemRegistry.register({
      id: 'lion', categoryId: 'animals', name: 'らいおん', description: 'test',
      rarity: 'common', modelParams, catchDifficulty: 0.5,
    });
    itemRegistry.register({
      id: 'elephant', categoryId: 'animals', name: 'ぞう', description: 'test',
      rarity: 'common', modelParams, catchDifficulty: 0.6,
    });
  });

  it('should persist caught items to SaveManager', () => {
    saveManager.addToCollection('lion');
    expect(saveManager.isCollected('lion')).toBe(true);
  });

  it('should reflect collection in new SaveManager instance', () => {
    saveManager.addToCollection('lion');
    const fresh = new SaveManager();
    expect(fresh.isCollected('lion')).toBe(true);
  });

  it('should track multiple collected items', () => {
    saveManager.addToCollection('lion');
    saveManager.addToCollection('elephant');
    const collection = saveManager.getCollection();
    expect(collection.size).toBe(2);
  });

  it('should differentiate collected vs uncollected items', () => {
    saveManager.addToCollection('lion');
    const items = itemRegistry.getByCategory('animals');
    const collected = items.filter((i) => saveManager.isCollected(i.id));
    const uncollected = items.filter((i) => !saveManager.isCollected(i.id));
    expect(collected).toHaveLength(1);
    expect(uncollected).toHaveLength(1);
  });
});
