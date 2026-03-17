import * as THREE from 'three';
import type { Scene, SceneContext, CatchResult } from '@/types/index';
import { ItemFactory } from '@/game/entities/ItemFactory';
import type { AudioManager } from '@/game/audio/AudioManager';

type NavigateTarget = 'retry' | 'zukan' | 'title';

interface ResultSceneOptions {
  audioManager: AudioManager;
  onNavigate: (target: NavigateTarget, categoryId: string) => void;
}

export class ResultScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private itemFactory: ItemFactory;
  private itemMesh: THREE.Group | null = null;
  private overlay: HTMLElement | null = null;
  private categoryId = '';
  private catchResult: CatchResult | null = null;
  private readonly opts: ResultSceneOptions;

  constructor(opts: ResultSceneOptions) {
    this.opts = opts;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 4);
    this.camera.lookAt(0, 0.5, 0);

    this.itemFactory = new ItemFactory();

    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(3, 5, 3);
    this.threeScene.add(dirLight);
  }

  enter(context: SceneContext): void {
    this.categoryId = context.categoryId ?? '';
    this.catchResult = context.catchResult ?? null;

    this.threeScene.background = new THREE.Color(
      this.catchResult?.success ? 0xfff8dc : 0xe8e8e8,
    );

    // Display caught item model
    if (this.catchResult?.success && this.catchResult.item) {
      this.itemMesh = this.itemFactory.create(this.catchResult.item);
      this.itemMesh.position.set(0, 0.5, 0);
      this.threeScene.add(this.itemMesh);
    }

    // Create HTML overlay
    this.createOverlay();
  }

  update(deltaTime: number): void {
    // Rotate item model for display
    if (this.itemMesh) {
      this.itemMesh.rotation.y += deltaTime * 1.5;
    }
  }

  exit(): void {
    if (this.itemMesh) {
      this.threeScene.remove(this.itemMesh);
      this.itemMesh = null;
    }
    this.overlay?.remove();
    this.overlay = null;
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  navigateTo(target: NavigateTarget): void {
    this.opts.onNavigate(target, this.categoryId);
  }

  private createOverlay(): void {
    const app = document.getElementById('app');
    if (!app) return;

    this.overlay = document.createElement('div');
    this.overlay.className = 'result-overlay';
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; z-index: 50; pointer-events: none;
      font-family: sans-serif;
    `;

    if (this.catchResult?.success && this.catchResult.item) {
      const item = this.catchResult.item;
      const message = this.catchResult.isNewItem
        ? 'ずかんに とうろく したよ！'
        : 'もう つかまえたよ！';

      this.overlay.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); border-radius: 20px; padding: 20px 30px; text-align: center; pointer-events: auto;">
          <div style="font-size: 28px; color: #ff6b6b; margin-bottom: 10px;">🎉 やったね！</div>
          <div style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px;">${this.escapeHtml(item.name)}</div>
          <div style="font-size: 16px; color: #666; margin-bottom: 15px;">${this.escapeHtml(message)}</div>
          ${this.createButtons()}
        </div>
      `;
    } else {
      this.overlay.innerHTML = `
        <div style="background: rgba(255,255,255,0.9); border-radius: 20px; padding: 20px 30px; text-align: center; pointer-events: auto;">
          <div style="font-size: 24px; color: #666; margin-bottom: 15px;">おしい！もういっかい やってみよう！</div>
          ${this.createButtons()}
        </div>
      `;
    }

    this.attachButtonListeners();
    app.appendChild(this.overlay);
  }

  private createButtons(): string {
    return `
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button data-nav="retry" style="${this.btnStyle('#4d96ff')}">もういっかい</button>
        <button data-nav="zukan" style="${this.btnStyle('#6bcb77')}">ずかん</button>
        <button data-nav="title" style="${this.btnStyle('#aaa')}">もどる</button>
      </div>
    `;
  }

  private btnStyle(bg: string): string {
    return `background: ${bg}; color: #fff; border: none; border-radius: 12px; padding: 12px 24px; font-size: 18px; font-weight: bold; cursor: pointer; min-width: 44px; min-height: 44px; touch-action: none; -webkit-tap-highlight-color: transparent;`;
  }

  private attachButtonListeners(): void {
    if (!this.overlay) return;
    for (const btn of this.overlay.querySelectorAll<HTMLButtonElement>('[data-nav]')) {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        const target = btn.dataset['nav'] as NavigateTarget;
        if (target) this.navigateTo(target);
      });
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
