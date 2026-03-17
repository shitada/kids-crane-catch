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
  const AmbientLight = vi.fn();
  const DirectionalLight = vi.fn(() => ({
    position: { set: vi.fn() },
  }));
  const Group = vi.fn(() => ({
    add: vi.fn(),
    scale: { set: vi.fn() },
    rotation: { y: 0 },
    children: [],
    position: { x: 0, y: 0, z: 0, set: vi.fn() },
  }));
  return {
    Scene,
    PerspectiveCamera,
    AmbientLight,
    DirectionalLight,
    Group,
    Mesh: vi.fn(() => ({
      position: { set: vi.fn() },
      scale: { set: vi.fn() },
      rotation: { set: vi.fn() },
    })),
    SphereGeometry: vi.fn(),
    BoxGeometry: vi.fn(),
    CylinderGeometry: vi.fn(),
    ConeGeometry: vi.fn(),
    TorusGeometry: vi.fn(),
    MeshToonMaterial: vi.fn(),
    MeshStandardMaterial: vi.fn(),
    Color: vi.fn(),
  };
});

import { ResultScene } from '@/game/scenes/ResultScene';
import { AudioManager } from '@/game/audio/AudioManager';

describe('ResultScene', () => {
  let scene: ResultScene;
  let onNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onNavigate = vi.fn();
    scene = new ResultScene({
      audioManager: new AudioManager(),
      onNavigate,
    });
  });

  it('should create scene and camera', () => {
    expect(scene.getThreeScene()).toBeDefined();
    expect(scene.getCamera()).toBeDefined();
  });

  describe('success result', () => {
    it('should enter with success result', () => {
      expect(() =>
        scene.enter({
          catchResult: {
            success: true,
            item: {
              id: 'lion',
              categoryId: 'animals',
              name: 'らいおん',
              description: '',
              rarity: 'common',
              modelParams: { parts: [], scale: 1, bounceAnimation: false },
              catchDifficulty: 0.5,
            },
            isNewItem: true,
          },
          categoryId: 'animals',
        })
      ).not.toThrow();
    });
  });

  describe('failure result', () => {
    it('should enter with failure result', () => {
      expect(() =>
        scene.enter({
          catchResult: { success: false, item: null, isNewItem: false },
          categoryId: 'animals',
        })
      ).not.toThrow();
    });
  });

  describe('navigation', () => {
    it('should support retry navigation', () => {
      scene.enter({
        catchResult: { success: false, item: null, isNewItem: false },
        categoryId: 'animals',
      });
      scene.navigateTo('retry');
      expect(onNavigate).toHaveBeenCalledWith('retry', 'animals');
    });

    it('should support zukan navigation', () => {
      scene.enter({
        catchResult: { success: false, item: null, isNewItem: false },
        categoryId: 'animals',
      });
      scene.navigateTo('zukan');
      expect(onNavigate).toHaveBeenCalledWith('zukan', 'animals');
    });

    it('should support title navigation', () => {
      scene.enter({
        catchResult: { success: false, item: null, isNewItem: false },
        categoryId: 'animals',
      });
      scene.navigateTo('title');
      expect(onNavigate).toHaveBeenCalledWith('title', 'animals');
    });
  });

  it('should exit without error', () => {
    scene.enter({
      catchResult: { success: false, item: null, isNewItem: false },
      categoryId: 'animals',
    });
    expect(() => scene.exit()).not.toThrow();
  });
});
