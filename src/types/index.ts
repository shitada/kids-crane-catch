import type * as THREE from 'three';

// === Scene System ===

export type SceneType = 'title' | 'categorySelect' | 'craneGame' | 'result' | 'zukan';

export interface SceneContext {
  categoryId?: string;
  catchResult?: CatchResult;
}

export interface Scene {
  enter(context: SceneContext): void;
  update(deltaTime: number): void;
  exit(): void;
  getThreeScene(): THREE.Scene;
  getCamera(): THREE.Camera;
}

// === Crane ===

export type CraneState =
  | 'IDLE'
  | 'MOVING'
  | 'DROPPING'
  | 'GRABBING'
  | 'LIFTING'
  | 'RETURNING';

export interface CraneConfig {
  readonly moveSpeed: number;
  readonly dropSpeed: number;
  readonly liftSpeed: number;
  readonly minX: number;
  readonly maxX: number;
  readonly grabRadius: number;
  readonly baseCatchRate: number;
}

// === Data-Driven Definitions ===

export type Rarity = 'common' | 'rare' | 'legendary';

export interface PartDefinition {
  readonly name: string;
  readonly shape: 'sphere' | 'box' | 'cylinder' | 'cone' | 'torus';
  readonly color: number;
  readonly position: readonly [number, number, number];
  readonly scale: readonly [number, number, number];
  readonly rotation?: readonly [number, number, number];
}

export interface ModelParams {
  readonly parts: readonly PartDefinition[];
  readonly scale: number;
  readonly bounceAnimation: boolean;
}

export interface CategoryDefinition {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly unlocked: boolean;
  readonly sortOrder: number;
}

export interface ItemDefinition {
  readonly id: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description: string;
  readonly rarity: Rarity;
  readonly modelParams: ModelParams;
  readonly catchDifficulty: number;
}

// === Collection ===

export interface CollectionEntry {
  readonly itemId: string;
  readonly capturedAt: string;
}

export interface CollectionState {
  readonly entries: ReadonlyMap<string, CollectionEntry>;
}

// === Play Session ===

export interface PlaySession {
  readonly categoryId: string;
  readonly spawnedItems: readonly SpawnedItem[];
  catchResult: CatchResult | null;
}

export interface SpawnedItem {
  readonly itemDefinition: ItemDefinition;
  position: { x: number; y: number; z: number };
}

export interface CatchResult {
  readonly success: boolean;
  readonly item: ItemDefinition | null;
  readonly isNewItem: boolean;
}

// === Save Data ===

export interface GameSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
}

export interface SaveData {
  readonly version: number;
  collection: Record<string, { capturedAt: string }>;
  tutorialCompleted: boolean;
  settings: GameSettings;
}

// === Input ===

export interface InputState {
  moveDirection: -1 | 0 | 1;
  catchPressed: boolean;
}

// === Audio ===

export type SFXType =
  | 'catchSuccess'
  | 'catchFail'
  | 'buttonTap'
  | 'craneMove'
  | 'armDrop'
  | 'complete'
  | 'transition';
