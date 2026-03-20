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

// Item IDs (all categories)
export type VehicleId =
  // のりもの
  | 'shinkansen'
  | 'airplane'
  | 'bus'
  | 'policeCar'
  | 'excavator'
  | 'helicopter'
  | 'rocket'
  | 'ship'
  // うみのいきもの
  | 'whale'
  | 'dolphin'
  | 'clownfish'
  | 'octopus'
  | 'seaTurtle'
  | 'jellyfish'
  | 'manta'
  | 'seahorse'
  // こっき
  | 'flagJapan'
  | 'flagUSA'
  | 'flagBrazil'
  | 'flagFrance'
  | 'flagChina'
  | 'flagAustralia'
  | 'flagIndia'
  | 'flagKorea'
  // がっき
  | 'piano'
  | 'guitar'
  | 'taiko'
  | 'trumpet'
  | 'violin'
  | 'harmonica'
  | 'cymbal'
  | 'recorder'
  // きょうりゅう
  | 'trex'
  | 'triceratops'
  | 'stegosaurus'
  | 'pteranodon'
  | 'brachiosaurus'
  | 'velociraptor'
  | 'ankylosaurus'
  | 'parasaurolophus'
  // むし
  | 'beetleKabuto'
  | 'beetleKuwagata'
  | 'butterfly'
  | 'ladybug'
  | 'dragonfly'
  | 'grasshopper'
  | 'firefly'
  | 'mantis';

// Machine category
export interface MachineCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  themeColor: number;
  bgColor: number;
  frameColor: number;
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
  // のりもの
  | 'shinkansen' | 'airplane' | 'bus' | 'policeCar'
  | 'excavator' | 'helicopter' | 'rocket' | 'ship'
  // うみのいきもの
  | 'whale' | 'dolphin' | 'clownfish' | 'octopus'
  | 'seaTurtle' | 'jellyfish' | 'manta' | 'seahorse'
  // こっき
  | 'flagJapan' | 'flagUSA' | 'flagBrazil' | 'flagFrance'
  | 'flagChina' | 'flagAustralia' | 'flagIndia' | 'flagKorea'
  // がっき
  | 'piano' | 'guitar' | 'taiko' | 'trumpet'
  | 'violin' | 'harmonica' | 'cymbal' | 'recorder'
  // きょうりゅう
  | 'trex' | 'triceratops' | 'stegosaurus' | 'pteranodon'
  | 'brachiosaurus' | 'velociraptor' | 'ankylosaurus' | 'parasaurolophus'
  // むし
  | 'beetleKabuto' | 'beetleKuwagata' | 'butterfly' | 'ladybug'
  | 'dragonfly' | 'grasshopper' | 'firefly' | 'mantis';
// Save data
export interface SaveData {
  collectedVehicles: VehicleId[];
  catchCounts: Record<string, number>;
  totalPlays: number;
  totalCatches: number;
}

// Input
export interface JoystickInput {
  x: number;
  z: number;
}
