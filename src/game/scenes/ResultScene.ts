import * as THREE from 'three';
import type { Scene, SceneContext, VehicleId } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AudioManager } from '../audio/AudioManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import type { SaveManager } from '../storage/SaveManager';
import { VEHICLE_ENCYCLOPEDIA } from '../config/VehicleEncyclopedia';
import { createVehicleModel } from '../entities/vehicles/VehicleFactory';
import { BGMGenerator } from '../audio/BGMGenerator';

export class ResultScene implements Scene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private audioManager: AudioManager;
  private sfx: SFXGenerator;
  private saveManager: SaveManager;
  private bgm: BGMGenerator;
  private overlay: HTMLDivElement | null = null;
  private models: THREE.Group[] = [];
  private time = 0;

  constructor(sceneManager: SceneManager, audioManager: AudioManager, sfx: SFXGenerator, saveManager: SaveManager) {
    this.sceneManager = sceneManager;
    this.audioManager = audioManager;
    this.sfx = sfx;
    this.saveManager = saveManager;
    this.bgm = new BGMGenerator(audioManager);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0.5, 0);
  }

  enter(context: SceneContext): void {
    const caughtItems = (context.caughtItems ?? []) as VehicleId[];
    this.time = 0;
    this.models = [];

    // Clear scene
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    this.scene.background = new THREE.Color(0x1a0a2e);
    this.scene.add(new THREE.AmbientLight(0x8866cc, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 8, 5);
    this.scene.add(dir);

    // Place caught items in 3D
    if (caughtItems.length > 0) {
      const spacing = Math.min(2.5, 6 / caughtItems.length);
      const startX = -(caughtItems.length - 1) * spacing / 2;

      for (let i = 0; i < caughtItems.length; i++) {
        const model = createVehicleModel(caughtItems[i]);
        model.position.set(startX + i * spacing, 0.5, 0);
        model.scale.setScalar(1.2);
        this.scene.add(model);
        this.models.push(model);
      }
    }

    this.buildUI(caughtItems);
    this.bgm.start('result');
  }

  private buildUI(caughtItems: VehicleId[]): void {
    const uiOverlay = document.getElementById('ui-overlay')!;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      padding-top: max(2rem, env(safe-area-inset-top, 2rem));
      gap: 0.8rem;
    `;

    // Title
    const title = document.createElement('h1');
    if (caughtItems.length > 0) {
      title.textContent = '🎉 けっか はっぴょう！';
    } else {
      title.textContent = 'またちょうせんしよう！';
    }
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 3px 6px rgba(0,0,0,0.5);
    `;
    this.overlay.appendChild(title);

    // Item names
    if (caughtItems.length > 0) {
      const list = document.createElement('div');
      list.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 0.5rem;
      `;

      for (const id of caughtItems) {
        const entry = VEHICLE_ENCYCLOPEDIA.find(e => e.id === id);
        if (!entry) continue;

        const badge = document.createElement('span');
        badge.textContent = `${entry.emoji} ${entry.name}`;
        badge.style.cssText = `
          background: rgba(255,255,255,0.15);
          border-radius: 1rem;
          padding: 0.4rem 1rem;
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
        `;
        list.appendChild(badge);
      }
      this.overlay.appendChild(list);
    }

    // Spacer to push buttons to bottom
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    this.overlay.appendChild(spacer);

    // プレイ統計
    const stats = this.saveManager.load();
    const statsEl = document.createElement('div');
    statsEl.style.cssText = `
      color: #aaa;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.8rem;
      text-align: center;
      margin-bottom: 0.5rem;
    `;
    statsEl.textContent = `あそんだ: ${stats.totalPlays}かい ｜ つかんだ: ${stats.totalCatches}こ`;
    this.overlay.appendChild(statsEl);

    // Buttons
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      justify-content: center;
      padding-bottom: max(2rem, env(safe-area-inset-bottom, 2rem));
    `;

    // ずかんをみる
    const encBtn = this.createButton('ずかんを みる', '#4488FF', '#44DDFF');
    encBtn.addEventListener('click', () => {
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('encyclopedia');
    });
    btnContainer.appendChild(encBtn);

    // もういっかい
    const retryBtn = this.createButton('もういっかい', '#FF6B6B', '#FFD93D');
    retryBtn.addEventListener('click', () => {
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('play', { machineId: 'vehicles' });
    });
    btnContainer.appendChild(retryBtn);

    // ホームにもどる
    const homeBtn = this.createButton('ホームに もどる', '#888', '#aaa');
    homeBtn.addEventListener('click', () => {
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('title');
    });
    btnContainer.appendChild(homeBtn);

    this.overlay.appendChild(btnContainer);
    uiOverlay.appendChild(this.overlay);
  }

  private createButton(text: string, c1: string, c2: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      background: linear-gradient(135deg, ${c1}, ${c2});
      border: none;
      border-radius: 2rem;
      padding: 0.8rem 2rem;
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 2.5vw, 1.2rem);
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    `;
    return btn;
  }

  update(deltaTime: number): void {
    this.time += deltaTime;
    for (const model of this.models) {
      model.rotation.y += deltaTime * 0.8;
      model.position.y = 0.5 + Math.sin(this.time * 2) * 0.1;
    }
  }

  exit(): void {
    this.bgm.stop();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  getThreeScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }
}
