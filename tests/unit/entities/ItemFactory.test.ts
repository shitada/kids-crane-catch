import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ItemDefinition, ModelParams } from '@/types/index';

// Mock THREE.js
vi.mock('three', () => {
  const Group = vi.fn(() => ({
    add: vi.fn(),
    scale: { set: vi.fn() },
    children: [],
    position: { x: 0, y: 0, z: 0 },
  }));
  const Mesh = vi.fn(() => ({
    position: { set: vi.fn() },
    scale: { set: vi.fn() },
    rotation: { set: vi.fn() },
  }));
  return {
    Group,
    Mesh,
    SphereGeometry: vi.fn(),
    BoxGeometry: vi.fn(),
    CylinderGeometry: vi.fn(),
    ConeGeometry: vi.fn(),
    TorusGeometry: vi.fn(),
    MeshToonMaterial: vi.fn(),
  };
});

import { ItemFactory } from '@/game/entities/ItemFactory';

const modelParams: ModelParams = {
  parts: [
    { name: 'body', shape: 'sphere', color: 0xd4a017, position: [0, 0, 0], scale: [1, 0.9, 0.8] },
    { name: 'head', shape: 'sphere', color: 0xd4a017, position: [0, 0.8, 0.4], scale: [0.6, 0.6, 0.6] },
  ],
  scale: 0.5,
  bounceAnimation: true,
};

const item: ItemDefinition = {
  id: 'lion',
  categoryId: 'animals',
  name: 'らいおん',
  description: 'test',
  rarity: 'common',
  modelParams,
  catchDifficulty: 0.5,
};

describe('ItemFactory', () => {
  let factory: ItemFactory;

  beforeEach(() => {
    factory = new ItemFactory();
  });

  it('should create a THREE.Group from ModelParams', () => {
    const group = factory.create(item);
    expect(group).toBeDefined();
  });

  it('should add parts to the group', () => {
    const group = factory.create(item);
    expect(group.add).toHaveBeenCalledTimes(modelParams.parts.length);
  });

  it('should set overall scale', () => {
    const group = factory.create(item);
    expect(group.scale.set).toHaveBeenCalledWith(0.5, 0.5, 0.5);
  });
});
