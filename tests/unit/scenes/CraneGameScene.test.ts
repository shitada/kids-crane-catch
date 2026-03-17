import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => {
  const Scene = vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn(),
    children: [],
  }));
  const PerspectiveCamera = vi.fn(() => ({
    position: { set: vi.fn() },
    lookAt: vi.fn(),
    aspect: 1,
    updateProjectionMatrix: vi.fn(),
  }));
  const DirectionalLight = vi.fn(() => ({
    position: { set: vi.fn() },
  }));
  const AmbientLight = vi.fn();
  const Group = vi.fn(() => ({
    add: vi.fn(),
    scale: { set: vi.fn() },
    children: [],
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
  }));
  return {
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
    Group,
    Mesh: vi.fn(() => ({
      position: { set: vi.fn(), x: 0, y: 0, z: 0 },
      scale: { set: vi.fn() },
      rotation: { set: vi.fn() },
    })),
    BoxGeometry: vi.fn(),
    CylinderGeometry: vi.fn(),
    SphereGeometry: vi.fn(),
    ConeGeometry: vi.fn(),
    TorusGeometry: vi.fn(),
    MeshToonMaterial: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Color: vi.fn(),
  };
});

import { CraneGameScene } from '@/game/scenes/CraneGameScene';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
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

describe('CraneGameScene', () => {
  let scene: CraneGameScene;
  let itemRegistry: ItemRegistry;
  let saveManager: SaveManager;
  let audioManager: AudioManager;

  beforeEach(() => {
    localStorage.clear();
    itemRegistry = new ItemRegistry();
    itemRegistry.register(makeItem('lion'));
    itemRegistry.register(makeItem('elephant'));
    saveManager = new SaveManager();
    audioManager = new AudioManager();

    scene = new CraneGameScene({
      itemRegistry,
      saveManager,
      audioManager,
      onComplete: vi.fn(),
    });
  });

  it('should create scene and camera', () => {
    expect(scene.getThreeScene()).toBeDefined();
    expect(scene.getCamera()).toBeDefined();
  });

  it('should enter with categoryId context', () => {
    expect(() => scene.enter({ categoryId: 'animals' })).not.toThrow();
  });

  it('should update without error', () => {
    scene.enter({ categoryId: 'animals' });
    expect(() => scene.update(0.016)).not.toThrow();
  });

  it('should exit without error', () => {
    scene.enter({ categoryId: 'animals' });
    expect(() => scene.exit()).not.toThrow();
  });
});
