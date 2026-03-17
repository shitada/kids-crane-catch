import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => ({
  Scene: vi.fn(() => ({ add: vi.fn(), remove: vi.fn(), children: [], background: null })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() }, lookAt: vi.fn(), aspect: 1, updateProjectionMatrix: vi.fn(),
  })),
  Color: vi.fn(),
  DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() } })),
  AmbientLight: vi.fn(),
}));

import { CategorySelectScene } from '@/game/scenes/CategorySelectScene';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import { AudioManager } from '@/game/audio/AudioManager';

describe('CategorySelectScene', () => {
  let scene: CategorySelectScene;
  let onSelect: ReturnType<typeof vi.fn>;
  let onBack: ReturnType<typeof vi.fn>;
  let registry: CategoryRegistry;

  beforeEach(() => {
    registry = new CategoryRegistry();
    registry.register({
      id: 'animals', name: 'どうぶつ', icon: '🦁',
      description: 'test', unlocked: true, sortOrder: 0,
    });
    registry.register({
      id: 'fruits', name: 'くだもの', icon: '🍎',
      description: 'test', unlocked: false, sortOrder: 1,
    });

    onSelect = vi.fn();
    onBack = vi.fn();
    scene = new CategorySelectScene({
      categoryRegistry: registry,
      audioManager: new AudioManager(),
      onSelect,
      onBack,
    });
  });

  it('should create scene and camera', () => {
    expect(scene.getThreeScene()).toBeDefined();
    expect(scene.getCamera()).toBeDefined();
  });

  it('should enter without error', () => {
    expect(() => scene.enter({})).not.toThrow();
  });

  it('should call onSelect for unlocked category', () => {
    scene.enter({});
    scene.selectCategory('animals');
    expect(onSelect).toHaveBeenCalledWith('animals');
  });

  it('should not call onSelect for locked category', () => {
    scene.enter({});
    scene.selectCategory('fruits');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('should call onBack', () => {
    scene.enter({});
    scene.goBack();
    expect(onBack).toHaveBeenCalled();
  });

  it('should exit without error', () => {
    scene.enter({});
    expect(() => scene.exit()).not.toThrow();
  });
});
