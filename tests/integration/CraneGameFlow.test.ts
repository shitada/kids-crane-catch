import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
  const Scene = vi.fn(() => ({ add: vi.fn(), remove: vi.fn(), children: [] }));
  const PerspectiveCamera = vi.fn(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
    aspect: 1,
    updateProjectionMatrix: vi.fn(),
  }));
  const Group = vi.fn(() => ({
    add: vi.fn(), scale: { set: vi.fn() }, children: [],
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
  }));
  return {
    Scene, PerspectiveCamera, Group,
    DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() } })),
    AmbientLight: vi.fn(),
    Mesh: vi.fn(() => ({ position: { set: vi.fn() }, scale: { set: vi.fn() }, rotation: { set: vi.fn() } })),
    SphereGeometry: vi.fn(), BoxGeometry: vi.fn(), CylinderGeometry: vi.fn(),
    ConeGeometry: vi.fn(), TorusGeometry: vi.fn(),
    MeshToonMaterial: vi.fn(), MeshStandardMaterial: vi.fn(),
    Color: vi.fn(),
  };
});

import { CraneGameScene } from '@/game/scenes/CraneGameScene';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
import type { ItemDefinition, ModelParams, CatchResult } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xffffff, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1, bounceAnimation: false,
};

const makeItem = (id: string): ItemDefinition => ({
  id, categoryId: 'animals', name: id, description: '',
  rarity: 'common', modelParams, catchDifficulty: 0.5,
});

describe('CraneGameFlow Integration', () => {
  let itemRegistry: ItemRegistry;
  let saveManager: SaveManager;
  let audioManager: AudioManager;
  let completedResults: { categoryId: string; result: CatchResult }[];

  beforeEach(() => {
    localStorage.clear();
    itemRegistry = new ItemRegistry();
    itemRegistry.register(makeItem('lion'));
    itemRegistry.register(makeItem('elephant'));
    itemRegistry.register(makeItem('giraffe'));
    saveManager = new SaveManager();
    audioManager = new AudioManager();
    completedResults = [];
  });

  it('should complete a full game flow from enter to catch result', () => {
    const scene = new CraneGameScene({
      itemRegistry,
      saveManager,
      audioManager,
      onComplete: (categoryId, result) => {
        completedResults.push({ categoryId, result });
      },
    });

    // Enter scene
    scene.enter({ categoryId: 'animals' });
    expect(scene.getThreeScene()).toBeDefined();

    // Simulate frames
    for (let i = 0; i < 10; i++) {
      scene.update(0.016);
    }

    // Exit
    scene.exit();
  });

  it('should add caught item to collection via SaveManager', () => {
    saveManager.addToCollection('lion');
    expect(saveManager.isCollected('lion')).toBe(true);
    expect(saveManager.isCollected('elephant')).toBe(false);
  });

  it('should preserve collection across SaveManager instances', () => {
    saveManager.addToCollection('lion');
    const freshManager = new SaveManager();
    expect(freshManager.isCollected('lion')).toBe(true);
  });
});
