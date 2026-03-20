import type * as THREE from 'three';

// Scene types
export type SceneType = 'title' | 'machineSelect' | 'play' | 'result' | 'encyclopedia';

export interface SceneContext {
  machineId?: string;
  caughtItems?: string[];
}

export interface Scene {
  enter(context: SceneContext): void;
  update(deltaTime: number): void;
  exit(): void;
  getThreeScene(): THREE.Scene;
  getCamera(): THREE.Camera;
}

// Crane states
export type CraneState = 'IDLE' | 'MOVING' | 'DESCENDING' | 'GRABBING' | 'ASCENDING' | 'RETURNING' | 'DROPPING';

// Vehicle IDs
export type VehicleId =
  | 'shinkansen'
  | 'airplane'
  | 'bus'
  | 'policeCar'
  | 'excavator'
  | 'helicopter'
  | 'rocket'
  | 'ship';

// Machine category
export interface MachineCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  themeColor: number;
  itemIds: VehicleId[];
}

// Encyclopedia entry
export interface EncyclopediaEntry {
  id: VehicleId;
  name: string;
  emoji: string;
  trivia: string;
  themeColor: number;
  soundType: SFXType;
}

// Sound effects
export type SFXType =
  | 'catchSuccess'
  | 'catchFail'
  | 'buttonTap'
  | 'drop'
  | 'itemDrop'
  | 'shinkansen'
  | 'airplane'
  | 'bus'
  | 'policeCar'
  | 'excavator'
  | 'helicopter'
  | 'rocket'
  | 'ship';

// Save data
export interface SaveData {
  collectedVehicles: VehicleId[];
}

// Input
export interface JoystickInput {
  x: number;
  z: number;
}
