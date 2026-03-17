import * as THREE from 'three';
import type { Scene, SceneContext, CatchResult, SpawnedItem } from '@/types/index';
import { Crane } from '@/game/entities/Crane';
import { CraneArm } from '@/game/entities/CraneArm';
import { ItemFactory } from '@/game/entities/ItemFactory';
import { CatchSystem } from '@/game/systems/CatchSystem';
import { SpawnSystem } from '@/game/systems/SpawnSystem';
import { PhysicsSystem } from '@/game/systems/PhysicsSystem';
import { CatchCelebration } from '@/game/effects/CatchCelebration';
import { HUD } from '@/ui/HUD';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
import { gameSettings, spawnSettings } from '@/game/config/gameSettings';
import { TutorialSystem } from '@/game/systems/TutorialSystem';
import { TutorialOverlay } from '@/ui/TutorialOverlay';

interface CraneGameSceneOptions {
  itemRegistry: ItemRegistry;
  saveManager: SaveManager;
  audioManager: AudioManager;
  onComplete: (categoryId: string, result: CatchResult) => void;
}

export class CraneGameScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private crane: Crane;
  private craneArm: CraneArm;
  private itemFactory: ItemFactory;
  private catchSystem: CatchSystem;
  private spawnSystem: SpawnSystem;
  private physicsSystem: PhysicsSystem;
  private celebration: CatchCelebration;
  private hud: HUD | null = null;
  private spawnedItems: SpawnedItem[] = [];
  private itemMeshes: THREE.Group[] = [];
  private categoryId = '';
  private armY = 3;
  private readonly armTopY = 3;
  private readonly armBottomY = 0.5;
  private celebrationTimer = 0;
  private readonly opts: CraneGameSceneOptions;
  private _tutorialSystem: TutorialSystem | null = null;
  private _tutorialOverlay: TutorialOverlay | null = null;

  constructor(opts: CraneGameSceneOptions) {
    this.opts = opts;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 4, 8);
    this.camera.lookAt(0, 1.5, 0);

    this.crane = new Crane(gameSettings);
    this.craneArm = new CraneArm();
    this.itemFactory = new ItemFactory();
    this.catchSystem = new CatchSystem();
    this.spawnSystem = new SpawnSystem(opts.itemRegistry);
    this.physicsSystem = new PhysicsSystem(gameSettings);
    this.celebration = new CatchCelebration(this.threeScene, opts.audioManager);

    // Lighting
    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    this.threeScene.add(dirLight);

    // Crane arm 3D
    this.threeScene.add(this.craneArm.group);
  }

  enter(context: SceneContext): void {
    this.categoryId = context.categoryId ?? 'animals';
    this.crane = new Crane(gameSettings);
    this.armY = this.armTopY;
    this.celebrationTimer = 0;

    // Spawn items
    this.clearItems();
    this.spawnedItems = this.spawnSystem.spawnItems(
      this.categoryId,
      spawnSettings.spawnCount,
      spawnSettings.areaWidth,
      spawnSettings.areaDepth,
    );

    // Create 3D meshes for items
    for (const spawned of this.spawnedItems) {
      const mesh = this.itemFactory.create(spawned.itemDefinition);
      mesh.position.set(spawned.position.x, spawned.position.y, spawned.position.z);
      this.threeScene.add(mesh);
      this.itemMeshes.push(mesh);
    }

    // HUD
    const app = document.getElementById('app');
    if (app) {
      this.hud = new HUD(app);
      this.hud.onMove = (dir) => {
        this.crane.move(dir);
        if (dir !== 0) this.opts.audioManager.playSFX('craneMove');
      };
      this.hud.onCatch = () => {
        this.opts.audioManager.playSFX('armDrop');
        this.crane.startDrop();
        this.hud?.setCatchEnabled(false);
      };
    }

    this.threeScene.background = new THREE.Color(0x87ceeb);

    // Tutorial check
    const tutorialSystem = new TutorialSystem(this.opts.saveManager);
    if (!tutorialSystem.shouldSkip()) {
      this._tutorialSystem = tutorialSystem;
      const app2 = document.getElementById('app');
      if (app2) {
        this._tutorialOverlay = new TutorialOverlay(app2);
        this._tutorialOverlay.show(tutorialSystem.getCurrentMessage());
      }
    }
  }

  update(deltaTime: number): void {
    // Update tutorial if active
    if (this._tutorialSystem && this._tutorialOverlay) {
      if (this._tutorialSystem.isComplete()) {
        this._tutorialOverlay.hide();
        this._tutorialSystem = null;
        this._tutorialOverlay = null;
      } else {
        this._tutorialOverlay.show(this._tutorialSystem.getCurrentMessage());
      }
    }

    const state = this.crane.getState();

    // Update crane movement
    this.crane.update(deltaTime);

    // Update arm position
    this.craneArm.setPositionX(this.crane.getPositionX());

    switch (state) {
      case 'DROPPING': {
        this.armY = this.physicsSystem.drop(this.armY, deltaTime);
        this.craneArm.close();
        if (this.armY <= this.armBottomY) {
          this.armY = this.armBottomY;
          this.crane.setReachedBottom();
        }
        break;
      }
      case 'GRABBING': {
        const result = this.catchSystem.evaluate(
          this.crane.getPositionX(),
          gameSettings.grabRadius,
          this.spawnedItems,
          gameSettings.baseCatchRate,
        );
        if (result.success && result.item) {
          this.crane.completGrab(result.item);
        } else {
          this.crane.completGrab(null);
        }
        break;
      }
      case 'LIFTING': {
        this.armY = this.physicsSystem.lift(this.armY, deltaTime);
        if (this.armY >= this.armTopY) {
          this.armY = this.armTopY;
          this.crane.setReachedTop();
        }
        break;
      }
      case 'RETURNING': {
        const heldItem = this.crane.getHeldItem();
        const isNewItem = heldItem ? !this.opts.saveManager.isCollected(heldItem.id) : false;
        const catchResult: CatchResult = {
          success: heldItem !== null,
          item: heldItem,
          isNewItem,
        };

        if (heldItem) {
          this.opts.saveManager.addToCollection(heldItem.id);
          this.celebration.playSuccess(new THREE.Vector3(this.crane.getPositionX(), 3, 0));
        } else {
          this.celebration.playFail();
        }

        this.crane.completeReturn();
        this.celebrationTimer = 1.5;
        this.hud?.setCatchEnabled(true);

        // Store the result for navigation after celebration
        (this as unknown as { _pendingResult: CatchResult })._pendingResult = catchResult;
        break;
      }
    }

    this.craneArm.setArmY(this.armY);
    this.craneArm.update(deltaTime);
    this.celebration.update(deltaTime);

    // Bounce animation for items
    for (let i = 0; i < this.itemMeshes.length; i++) {
      const mesh = this.itemMeshes[i]!;
      if (this.spawnedItems[i]?.itemDefinition.modelParams.bounceAnimation) {
        mesh.position.y = Math.sin(Date.now() * 0.003 + i) * 0.1;
      }
    }

    // Wait for celebration then navigate
    if (this.celebrationTimer > 0) {
      this.celebrationTimer -= deltaTime;
      if (this.celebrationTimer <= 0) {
        const result = (this as unknown as { _pendingResult?: CatchResult })._pendingResult;
        if (result) {
          this.opts.onComplete(this.categoryId, result);
          delete (this as unknown as { _pendingResult?: CatchResult })._pendingResult;
        }
      }
    }
  }

  exit(): void {
    this.hud?.dispose();
    this.hud = null;
    this.celebration.dispose();
    this.clearItems();
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  private clearItems(): void {
    for (const mesh of this.itemMeshes) {
      this.threeScene.remove(mesh);
    }
    this.itemMeshes = [];
    this.spawnedItems = [];
  }
}
