import * as THREE from 'three';
import type { Scene, SceneContext } from '@/types/index';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import type { AudioManager } from '@/game/audio/AudioManager';

interface CategorySelectSceneOptions {
  categoryRegistry: CategoryRegistry;
  audioManager: AudioManager;
  onSelect: (categoryId: string) => void;
  onBack: () => void;
}

export class CategorySelectScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private overlay: HTMLElement | null = null;
  private readonly opts: CategorySelectSceneOptions;

  constructor(opts: CategorySelectSceneOptions) {
    this.opts = opts;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 1, 0);

    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.7));
  }

  enter(_context: SceneContext): void {
    this.threeScene.background = new THREE.Color(0xfff8dc);
    this.createOverlay();
  }

  update(_deltaTime: number): void {}

  exit(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  selectCategory(categoryId: string): void {
    const cat = this.opts.categoryRegistry.get(categoryId);
    if (cat?.unlocked) {
      this.opts.audioManager.playSFX('buttonTap');
      this.opts.onSelect(categoryId);
    }
  }

  goBack(): void {
    this.opts.audioManager.playSFX('buttonTap');
    this.opts.onBack();
  }

  private createOverlay(): void {
    const app = document.getElementById('app');
    if (!app) return;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; z-index: 100; pointer-events: none;
      font-family: sans-serif; gap: 15px;
    `;

    const title = document.createElement('div');
    title.textContent = 'カテゴリを えらんでね！';
    title.style.cssText = 'font-size: 28px; font-weight: bold; color: #333; pointer-events: none;';
    this.overlay.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = `
      display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;
      pointer-events: auto; padding: 20px;
    `;

    const categories = this.opts.categoryRegistry.getAll();
    for (const cat of categories) {
      const btn = document.createElement('button');
      btn.style.cssText = `
        background: ${cat.unlocked ? '#fff' : '#ccc'}; border: 3px solid ${cat.unlocked ? '#4d96ff' : '#aaa'};
        border-radius: 20px; padding: 20px 30px; font-size: 20px; cursor: ${cat.unlocked ? 'pointer' : 'not-allowed'};
        min-width: 44px; min-height: 44px; opacity: ${cat.unlocked ? '1' : '0.6'};
        display: flex; flex-direction: column; align-items: center; gap: 8px;
        touch-action: none; -webkit-tap-highlight-color: transparent;
      `;

      if (cat.unlocked) {
        btn.innerHTML = `
          <span style="font-size: 40px;">${cat.icon}</span>
          <span style="font-weight: bold; color: #333;">${this.escapeHtml(cat.name)}</span>
        `;
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.selectCategory(cat.id);
        });
      } else {
        btn.innerHTML = `
          <span style="font-size: 40px; filter: grayscale(1);">${cat.icon}</span>
          <span style="font-weight: bold; color: #999;">${this.escapeHtml(cat.name)}</span>
          <span style="font-size: 12px; color: #f66;">きんきゅう</span>
        `;
      }

      grid.appendChild(btn);
    }

    this.overlay.appendChild(grid);

    const backBtn = document.createElement('button');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      background: #aaa; color: #fff; border: none; border-radius: 12px;
      padding: 12px 24px; font-size: 18px; font-weight: bold; cursor: pointer;
      pointer-events: auto; min-width: 44px; min-height: 44px;
    `;
    backBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.goBack();
    });
    this.overlay.appendChild(backBtn);

    app.appendChild(this.overlay);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
