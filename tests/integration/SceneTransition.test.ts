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

import { SceneManager } from '@/game/SceneManager';

describe('SceneTransition Integration', () => {
  let manager: SceneManager;
  let transitionLog: string[];

  const mockScene = (name: string) => ({
    enter: vi.fn(() => { transitionLog.push(`enter:${name}`); }),
    update: vi.fn(),
    exit: vi.fn(() => { transitionLog.push(`exit:${name}`); }),
    getThreeScene: vi.fn(),
    getCamera: vi.fn(),
  });

  beforeEach(() => {
    manager = new SceneManager();
    transitionLog = [];
  });

  it('should transition title → categorySelect → craneGame → result → title', () => {
    const title = mockScene('title');
    const catSelect = mockScene('categorySelect');
    const craneGame = mockScene('craneGame');
    const result = mockScene('result');
    const zukan = mockScene('zukan');

    manager.register('title', title);
    manager.register('categorySelect', catSelect);
    manager.register('craneGame', craneGame);
    manager.register('result', result);
    manager.register('zukan', zukan);

    manager.enter('title');
    expect(transitionLog).toContain('enter:title');

    manager.enter('categorySelect');
    expect(transitionLog).toContain('exit:title');
    expect(transitionLog).toContain('enter:categorySelect');

    manager.enter('craneGame', { categoryId: 'animals' });
    expect(transitionLog).toContain('exit:categorySelect');
    expect(transitionLog).toContain('enter:craneGame');

    manager.enter('result', { catchResult: { success: true, item: null, isNewItem: false } });
    expect(transitionLog).toContain('exit:craneGame');
    expect(transitionLog).toContain('enter:result');

    manager.enter('title');
    expect(transitionLog).toContain('exit:result');
  });

  it('should transition result → zukan → title', () => {
    const title = mockScene('title');
    const result = mockScene('result');
    const zukan = mockScene('zukan');

    manager.register('title', title);
    manager.register('result', result);
    manager.register('zukan', zukan);

    manager.enter('result', { catchResult: { success: false, item: null, isNewItem: false } });
    manager.enter('zukan');
    manager.enter('title');

    expect(transitionLog).toEqual([
      'enter:result', 'exit:result', 'enter:zukan', 'exit:zukan', 'enter:title',
    ]);
  });

  it('should track active scene type', () => {
    const title = mockScene('title');
    manager.register('title', title);
    manager.enter('title');
    expect(manager.getActiveSceneType()).toBe('title');
  });
});
