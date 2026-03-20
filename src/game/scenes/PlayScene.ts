import * as THREE from 'three';
import type { Scene, SceneContext, VehicleId } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AudioManager } from '../audio/AudioManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import type { SaveManager } from '../storage/SaveManager';
import { CraneMachine } from '../entities/CraneMachine';
import { CraneArm } from '../entities/CraneArm';
import { ItemPool } from '../entities/ItemPool';
import { CraneController } from '../systems/CraneController';
import { CatchSystem } from '../systems/CatchSystem';
import { CatchEffect } from '../effects/CatchEffect';
import { MissEffect } from '../effects/MissEffect';
import { MACHINES } from '../config/MachineConfig';
import { GAME_SETTINGS } from '../config/GameSettings';
import { VirtualJoystick } from '../../ui/VirtualJoystick';
import { DropButton } from '../../ui/DropButton';
import { HUD } from '../../ui/HUD';
import { createVehicleModel } from '../entities/vehicles/VehicleFactory';
import { BGMGenerator } from '../audio/BGMGenerator';

export class PlayScene implements Scene {
  private threeScene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private audioManager: AudioManager;
  private sfx: SFXGenerator;
  private saveManager: SaveManager;

  private craneMachine: CraneMachine | null = null;
  private craneArm: CraneArm | null = null;
  private craneController: CraneController | null = null;
  private itemPool: ItemPool;
  private catchSystem: CatchSystem;
  private catchEffect: CatchEffect;
  private missEffect: MissEffect;

  // UI
  private joystick: VirtualJoystick;
  private dropButton: DropButton;
  private hud: HUD;
  private bgm: BGMGenerator;

  // Game state
  private attemptsRemaining = GAME_SETTINGS.maxAttempts;
  private caughtItems: VehicleId[] = [];
  private machineId = '';

  // ボックス落下演出用
  private dropItem: THREE.Group | null = null;
  private dropTimer = 0;
  private dropStart = new THREE.Vector3();
  private dropEnd = new THREE.Vector3();
  private static readonly DROP_DURATION = 0.5;
  private static readonly DROP_FADE_DURATION = 0.4;

  // Notification overlay
  private notifyEl: HTMLDivElement | null = null;

  constructor(sceneManager: SceneManager, audioManager: AudioManager, sfx: SFXGenerator, saveManager: SaveManager) {
    this.sceneManager = sceneManager;
    this.audioManager = audioManager;
    this.sfx = sfx;
    this.saveManager = saveManager;

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 6, 7);
    this.camera.lookAt(0, 1.5, 0);

    this.itemPool = new ItemPool();
    this.catchSystem = new CatchSystem();
    this.catchEffect = new CatchEffect();
    this.missEffect = new MissEffect();
    this.joystick = new VirtualJoystick();
    this.dropButton = new DropButton();
    this.hud = new HUD();
    this.bgm = new BGMGenerator(audioManager);
  }

  enter(context: SceneContext): void {
    this.machineId = context.machineId ?? 'vehicles';
    this.attemptsRemaining = GAME_SETTINGS.maxAttempts;
    this.caughtItems = [];
    this.dropItem = null;

    // Lookup machine config
    const machine = MACHINES.find(m => m.id === this.machineId);

    // Clear scene
    while (this.threeScene.children.length > 0) {
      this.threeScene.remove(this.threeScene.children[0]);
    }

    // Set up scene
    this.threeScene.background = new THREE.Color(machine?.bgColor ?? 0x1a0a2e);

    // Lighting (tinted by theme)
    const themeColor = machine?.themeColor ?? 0x8866cc;
    this.threeScene.add(new THREE.AmbientLight(themeColor, 0.4));
    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 5);
    this.threeScene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x9999ff, 0.3);
    fillLight.position.set(-5, 3, -3);
    this.threeScene.add(fillLight);

    // Crane machine (with theme color)
    this.craneMachine = new CraneMachine(machine?.frameColor);
    this.threeScene.add(this.craneMachine.group);

    // Crane arm (themed color)
    this.craneArm = new CraneArm(machine?.themeColor);
    this.threeScene.add(this.craneArm.group);
    this.craneController = new CraneController(this.craneArm);

    // Items
    if (machine) {
      this.itemPool.populate(machine.itemIds, this.threeScene);
    }

    // Crane arm callbacks
    this.craneArm.onGrabComplete = (pos) => this.onGrabComplete(pos);
    this.craneArm.onReturnComplete = () => this.onReturnComplete();
    this.craneArm.onDropInBox = (item) => this.onItemDroppedInBox(item);

    // Mount UI
    const hudEl = document.getElementById('hud')!;

    this.joystick.mount(document.body);
    this.dropButton.mount(document.body);
    this.hud.mount(hudEl);

    // 前回のプレイでhide/disabledのままの可能性があるのでリセット
    this.joystick.show();
    this.dropButton.setEnabled(true);
    this.dropButton.show();

    const machineName = machine?.name ?? '';
    this.hud.setCategory(machineName);
    this.hud.setAttempts(this.attemptsRemaining, GAME_SETTINGS.maxAttempts);
    this.hud.onHome = () => {
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('title');
    };

    this.dropButton.onDrop = () => this.handleDrop();

    this.bgm.start('play');

    // プレイ回数カウント
    this.saveManager.incrementPlays();

    // カテゴリ別背景パーティクル
    this.spawnBackgroundParticles(machine);
  }

  private handleDrop(): void {
    if (!this.craneController || !this.craneArm) return;
    if (this.attemptsRemaining <= 0) return;
    if (!this.craneController.canOperate()) return;

    this.sfx.play('drop');
    this.craneController.triggerDrop();
    this.dropButton.setEnabled(false);
    this.joystick.hide();
  }

  private onGrabComplete(pos: THREE.Vector3): void {
    const items = this.itemPool.getItems();
    const caught = this.catchSystem.evaluate(pos, items);

    if (caught && this.craneArm) {
      // Success — attach caught item model to arm
      this.sfx.play('catchSuccess');
      this.catchEffect.play(pos, this.threeScene);

      const caughtModel = createVehicleModel(caught.id);
      caughtModel.scale.setScalar(0.5);
      this.craneArm.attachItem(caughtModel, this.threeScene);

      this.itemPool.markCaught(caught, this.threeScene);
      this.caughtItems.push(caught.id);
      this.saveManager.addCollected(caught.id);
      this.showNotification('🎉 ゲット！');

      // 連続キャッチボーナス演出
      if (this.caughtItems.length >= 2) {
        const praises = ['すごい！', 'やったね！', 'さいこう！', 'てんさい！', 'かっこいい！'];
        const praise = praises[Math.floor(Math.random() * praises.length)];
        setTimeout(() => this.showNotification(`⭐ ${praise} ${this.caughtItems.length}こ ゲット！`), 1200);
      }
    } else {
      // Miss
      this.sfx.play('catchFail');
      this.missEffect.play(pos, this.threeScene);
      this.showNotification('ざんねん…');
    }

    this.attemptsRemaining--;
    this.hud.setAttempts(this.attemptsRemaining, GAME_SETTINGS.maxAttempts);
  }

  private onReturnComplete(): void {
    this.finishTurn();
  }

  /** ボックスにアイテムが落ちた時 → 落下アニメーション開始 */
  private onItemDroppedInBox(item: THREE.Group): void {
    this.sfx.play('itemDrop');
    this.dropItem = item;
    this.dropTimer = 0;
    this.dropStart.copy(item.position);
    this.dropEnd.set(
      GAME_SETTINGS.dropBoxX,
      GAME_SETTINGS.dropBoxY * 0.3,
      GAME_SETTINGS.dropBoxZ,
    );
    this.threeScene.add(item);
  }

  private finishTurn(): void {
    if (this.attemptsRemaining <= 0) {
      setTimeout(() => {
        this.sceneManager.requestTransition('result', { caughtItems: this.caughtItems });
      }, 500);
    } else {
      this.dropButton.setEnabled(true);
      this.joystick.show();
    }
  }

  private showNotification(text: string): void {
    if (this.notifyEl) this.notifyEl.remove();

    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.7);
      border-radius: 20px;
      padding: 1.5rem 2.5rem;
      color: #FFD700;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 900;
      text-shadow: 0 3px 6px rgba(0,0,0,0.5);
      z-index: 40;
      pointer-events: none;
      animation: notifyPop 0.3s ease-out;
    `;
    el.textContent = text;

    if (!document.getElementById('notify-style')) {
      const style = document.createElement('style');
      style.id = 'notify-style';
      style.textContent = `
        @keyframes notifyPop {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(el);
    this.notifyEl = el;

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.3s';
      setTimeout(() => el.remove(), 300);
      if (this.notifyEl === el) this.notifyEl = null;
    }, 1000);
  }

  update(deltaTime: number): void {
    // Apply joystick input
    if (this.craneController && this.craneArm) {
      this.craneController.applyInput(
        { x: this.joystick.x, z: this.joystick.z },
        deltaTime,
      );
      this.craneArm.update(deltaTime);
    }

    this.itemPool.update(deltaTime);
    this.catchEffect.update(deltaTime, this.threeScene);
    this.missEffect.update(deltaTime, this.threeScene);

    // 背景パーティクルアニメーション
    for (const child of this.threeScene.children) {
      if (child.userData.isBgParticle) {
        child.position.y = child.userData.baseY + Math.sin(performance.now() * 0.001 * child.userData.floatSpeed) * 0.3;
      }
    }

    // ボックス内落下アニメーション
    if (this.dropItem) {
      this.dropTimer += deltaTime;
      const t = Math.min(this.dropTimer / PlayScene.DROP_DURATION, 1);

      // 落下（重力的な加速）
      const easeIn = t * t;
      this.dropItem.position.lerpVectors(this.dropStart, this.dropEnd, easeIn);
      this.dropItem.rotation.y += deltaTime * 3;

      if (t >= 1) {
        // 落下完了後のフェードアウト
        const fadeT = (this.dropTimer - PlayScene.DROP_DURATION) / PlayScene.DROP_FADE_DURATION;
        const s = Math.max(1 - fadeT, 0);
        this.dropItem.scale.setScalar(0.5 * s);

        if (fadeT >= 1) {
          this.threeScene.remove(this.dropItem);
          this.dropItem = null;
        }
      }
    }
  }

  exit(): void {
    this.bgm.stop();
    this.joystick.unmount();
    this.dropButton.unmount();
    this.hud.unmount();
    if (this.notifyEl) {
      this.notifyEl.remove();
      this.notifyEl = null;
    }
    if (this.dropItem) {
      this.threeScene.remove(this.dropItem);
      this.dropItem = null;
    }
    this.itemPool.clear(this.threeScene);
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  /** カテゴリ別背景パーティクル */
  private spawnBackgroundParticles(machine: typeof MACHINES[0] | undefined): void {
    if (!machine) return;
    const cfgs: Record<string, { color: number; count: number; yRange: [number, number] }> = {
      vehicles: { color: 0x4488ff, count: 15, yRange: [0.5, 4] },
      sea: { color: 0x44aaff, count: 20, yRange: [0.5, 4] },
      flags: { color: 0xff4444, count: 12, yRange: [1, 4.5] },
      instruments: { color: 0x44ddff, count: 15, yRange: [0.5, 4] },
      dinosaurs: { color: 0xcc8833, count: 12, yRange: [0.5, 3.5] },
      insects: { color: 0x88ff44, count: 18, yRange: [0.3, 3.5] },
    };
    const cfg = cfgs[machine.id] ?? { color: 0xffffff, count: 10, yRange: [0.5, 4] as [number, number] };
    const geo = new THREE.SphereGeometry(0.04, 4, 4);
    const mat = new THREE.MeshPhongMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.3, transparent: true, opacity: 0.5 });
    for (let i = 0; i < cfg.count; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.set(
        (Math.random() - 0.5) * GAME_SETTINGS.machineHalfWidth * 3,
        cfg.yRange[0] + Math.random() * (cfg.yRange[1] - cfg.yRange[0]),
        (Math.random() - 0.5) * GAME_SETTINGS.machineHalfDepth * 3,
      );
      p.userData.floatSpeed = 0.3 + Math.random() * 0.5;
      p.userData.baseY = p.position.y;
      p.userData.isBgParticle = true;
      this.threeScene.add(p);
    }
  }
}
