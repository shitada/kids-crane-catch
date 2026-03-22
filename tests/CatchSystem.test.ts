import { describe, it, expect } from 'vitest';
import { CatchSystem } from '../src/game/systems/CatchSystem';
import * as THREE from 'three';
import type { PlacedItem } from '../src/game/entities/ItemPool';

describe('CatchSystem', () => {
  const catchSystem = new CatchSystem();

  function makeItem(x: number, z: number, id = 'bus' as const): PlacedItem {
    return {
      id,
      model: new THREE.Group(),
      position: new THREE.Vector3(x, 0.3, z),
      caught: false,
    };
  }

  it('returns null when no items are in range', () => {
    const items = [makeItem(5, 5)];
    const result = catchSystem.evaluate(new THREE.Vector3(0, 0.8, 0), items);
    expect(result).toBeNull();
  });

  it('catches item within radius', () => {
    const items = [makeItem(0.3, 0.2)];
    const result = catchSystem.evaluate(new THREE.Vector3(0, 0.8, 0), items);
    expect(result).toBe(items[0]);
  });

  it('catches the closest item when multiple in range', () => {
    const far = makeItem(1.0, 0, 'airplane');
    const near = makeItem(0.2, 0, 'shinkansen');
    const items = [far, near];
    const result = catchSystem.evaluate(new THREE.Vector3(0, 0.8, 0), items);
    expect(result).toBe(near);
  });

  it('ignores already caught items', () => {
    const item = makeItem(0.5, 0);
    item.caught = true;
    const result = catchSystem.evaluate(new THREE.Vector3(0, 0.8, 0), [item]);
    expect(result).toBeNull();
  });

  it('returns null for empty items list', () => {
    const result = catchSystem.evaluate(new THREE.Vector3(0, 0.8, 0), []);
    expect(result).toBeNull();
  });
});
