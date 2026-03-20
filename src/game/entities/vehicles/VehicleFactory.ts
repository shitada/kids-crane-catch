import * as THREE from 'three';
import type { VehicleId } from '../../../types';
import { createShinkansen } from './Shinkansen';
import { createAirplane } from './Airplane';
import { createBus } from './Bus';
import { createPoliceCar } from './PoliceCar';
import { createExcavator } from './Excavator';
import { createHelicopter } from './Helicopter';
import { createRocket } from './Rocket';
import { createShip } from './Ship';

const CREATORS: Record<VehicleId, () => THREE.Group> = {
  shinkansen: createShinkansen,
  airplane: createAirplane,
  bus: createBus,
  policeCar: createPoliceCar,
  excavator: createExcavator,
  helicopter: createHelicopter,
  rocket: createRocket,
  ship: createShip,
};

export function createVehicleModel(id: VehicleId): THREE.Group {
  const creator = CREATORS[id];
  return creator();
}
