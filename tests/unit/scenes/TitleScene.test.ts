import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three', () => ({
  Scene: vi.fn(() => ({ add: vi.fn(), remove: vi.fn(), children: [], background: null })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() }, lookAt: vi.fn(), aspect: 1, updateProjectionMatrix: vi.fn(),
  })),
  Group: vi.fn(() => ({
    add: vi.fn(), scale: { set: vi.fn() }, rotation: { y: 0 },
    children: [], position: { x: 0, y: 0, z: 0, set: vi.fn() },
  })),
  Color: vi.fn(),
  DirectionalLight: vi.fn(() => ({ position: { set: vi.fn() } })),
  AmbientLight: vi.fn(),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn() }, scale: { set: vi.fn() }, rotation: { set: vi.fn(), y: 0 },
  })),
  SphereGeometry: vi.fn(), BoxGeometry: vi.fn(), CylinderGeometry: vi.fn(),
  ConeGeometry: vi.fn(), TorusGeometry: vi.fn(),
  MeshToonMaterial: vi.fn(), MeshStandardMaterial: vi.fn(),
}));

import { TitleScene } from '@/game/scenes/TitleScene';
import { AudioManager } from '@/game/audio/AudioManager';

describe('TitleScene', () => {
  let scene: TitleScene;
  let onPlay: ReturnType<typeof vi.fn>;
  let onZukan: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onPlay = vi.fn();
    onZukan = vi.fn();
    scene = new TitleScene({
      audioManager: new AudioManager(),
      onPlay,
      onZukan,
    });
  });

  it('should create scene and camera', () => {
    expect(scene.getThreeScene()).toBeDefined();
    expect(scene.getCamera()).toBeDefined();
  });

  it('should enter without error', () => {
    expect(() => scene.enter({})).not.toThrow();
  });

  it('should navigate to play on あそぶ', () => {
    scene.enter({});
    scene.handlePlay();
    expect(onPlay).toHaveBeenCalled();
  });

  it('should navigate to zukan on ずかん', () => {
    scene.enter({});
    scene.handleZukan();
    expect(onZukan).toHaveBeenCalled();
  });

  it('should exit without error', () => {
    scene.enter({});
    expect(() => scene.exit()).not.toThrow();
  });
});
