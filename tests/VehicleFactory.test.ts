import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { createVehicleModel } from '../src/game/entities/vehicles/VehicleFactory';
import type { VehicleId } from '../src/types';

const ALL_VEHICLES: VehicleId[] = [
  'shinkansen', 'airplane', 'bus', 'policeCar',
  'excavator', 'helicopter', 'rocket', 'ship',
];

describe('VehicleFactory', () => {
  it.each(ALL_VEHICLES)('creates %s model as THREE.Group', (id) => {
    const model = createVehicleModel(id);
    expect(model).toBeInstanceOf(THREE.Group);
    expect(model.children.length).toBeGreaterThan(0);
  });

  it('creates unique models for each call', () => {
    const a = createVehicleModel('bus');
    const b = createVehicleModel('bus');
    expect(a).not.toBe(b);
  });
});
