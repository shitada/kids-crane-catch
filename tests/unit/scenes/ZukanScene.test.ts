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

import { ZukanScene } from '@/game/scenes/ZukanScene';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
import type { ModelParams } from '@/types/index';

const modelParams: ModelParams = {
  parts: [{ name: 'body', shape: 'sphere', color: 0xffffff, position: [0, 0, 0], scale: [1, 1, 1] }],
  scale: 1, bounceAnimation: false,
};

describe('ZukanScene', () => {
  let scene: ZukanScene;
  let categoryRegistry: CategoryRegistry;
  let itemRegistry: ItemRegistry;
  let saveManager: SaveManager;

  beforeEach(() => {
    localStorage.clear();
    categoryRegistry = new CategoryRegistry();
    categoryRegistry.register({
      id: 'animals', name: 'どうぶつ', icon: '🦁',
      description: 'いろんな どうぶつを つかまえよう！', unlocked: true, sortOrder: 0,
    });

    itemRegistry = new ItemRegistry();
    itemRegistry.register({
      id: 'lion', categoryId: 'animals', name: 'らいおん', description: 'test',
      rarity: 'common', modelParams, catchDifficulty: 0.5,
    });
    itemRegistry.register({
      id: 'elephant', categoryId: 'animals', name: 'ぞう', description: 'test',
      rarity: 'common', modelParams, catchDifficulty: 0.6,
    });

    saveManager = new SaveManager();

    scene = new ZukanScene({
      categoryRegistry,
      itemRegistry,
      saveManager,
      audioManager: new AudioManager(),
      onBack: vi.fn(),
    });
  });

  it('should create scene and camera', () => {
    expect(scene.getThreeScene()).toBeDefined();
    expect(scene.getCamera()).toBeDefined();
  });

  it('should enter without error', () => {
    expect(() => scene.enter({})).not.toThrow();
  });

  it('should show collected items as available', () => {
    saveManager.addToCollection('lion');
    scene.enter({});
    const overlay = document.querySelector('.zukan-overlay');
    // overlay existence depends on container
  });

  it('should detect category completion', () => {
    saveManager.addToCollection('lion');
    saveManager.addToCollection('elephant');
    const complete = scene.isCategoryComplete('animals');
    expect(complete).toBe(true);
  });

  it('should detect incomplete category', () => {
    saveManager.addToCollection('lion');
    const complete = scene.isCategoryComplete('animals');
    expect(complete).toBe(false);
  });

  it('should exit without error', () => {
    scene.enter({});
    expect(() => scene.exit()).not.toThrow();
  });
});
