import * as THREE from 'three';
import type { Scene, SceneContext } from '@/types/index';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
import { ZukanOverlay } from '@/ui/ZukanOverlay';

interface ZukanSceneOptions {
  categoryRegistry: CategoryRegistry;
  itemRegistry: ItemRegistry;
  saveManager: SaveManager;
  audioManager: AudioManager;
  onBack: () => void;
}

export class ZukanScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private overlay: HTMLElement | null = null;
  private zukanOverlay: ZukanOverlay | null = null;
  private readonly opts: ZukanSceneOptions;

  constructor(opts: ZukanSceneOptions) {
    this.opts = opts;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 4);
    this.camera.lookAt(0, 0.5, 0);

    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(3, 5, 3);
    this.threeScene.add(dirLight);
  }

  enter(_context: SceneContext): void {
    this.threeScene.background = new THREE.Color(0xf0f8ff);
    this.createOverlay();
  }

  update(_deltaTime: number): void {
    // ZukanOverlay handles its own animation
  }

  exit(): void {
    this.zukanOverlay?.dispose();
    this.zukanOverlay = null;
    this.overlay?.remove();
    this.overlay = null;
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  isCategoryComplete(categoryId: string): boolean {
    const items = this.opts.itemRegistry.getByCategory(categoryId);
    return items.length > 0 && items.every((item) => this.opts.saveManager.isCollected(item.id));
  }

  private createOverlay(): void {
    const app = document.getElementById('app');
    if (!app) return;

    this.zukanOverlay = new ZukanOverlay(app, this.threeScene);

    this.overlay = document.createElement('div');
    this.overlay.className = 'zukan-overlay';
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; z-index: 100;
      font-family: sans-serif; pointer-events: none;
    `;

    // Category tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = `
      display: flex; gap: 8px; padding: 15px; overflow-x: auto;
      pointer-events: auto; -webkit-overflow-scrolling: touch;
    `;

    const categories = this.opts.categoryRegistry.getAll();
    for (const cat of categories) {
      const tab = document.createElement('button');
      tab.textContent = `${cat.icon} ${cat.name}`;
      tab.style.cssText = `
        background: #fff; border: 2px solid #4d96ff; border-radius: 20px;
        padding: 8px 16px; font-size: 16px; cursor: pointer;
        white-space: nowrap; min-height: 44px; min-width: 44px;
        touch-action: none; -webkit-tap-highlight-color: transparent;
      `;
      tab.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.showCategory(cat.id);
      });
      tabs.appendChild(tab);
    }
    this.overlay.appendChild(tabs);

    // Item grid
    const grid = document.createElement('div');
    grid.className = 'zukan-grid';
    grid.style.cssText = `
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 12px; padding: 15px; flex: 1; overflow-y: auto;
      pointer-events: auto;
    `;
    this.overlay.appendChild(grid);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      background: #aaa; color: #fff; border: none; border-radius: 12px;
      padding: 12px 24px; font-size: 18px; font-weight: bold; cursor: pointer;
      margin: 10px; align-self: center; pointer-events: auto;
      min-width: 44px; min-height: 44px;
    `;
    backBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.opts.onBack();
    });
    this.overlay.appendChild(backBtn);

    app.appendChild(this.overlay);

    // Show first category
    if (categories.length > 0) {
      this.showCategory(categories[0]!.id);
    }
  }

  private showCategory(categoryId: string): void {
    const grid = this.overlay?.querySelector('.zukan-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const items = this.opts.itemRegistry.getByCategory(categoryId);
    const isComplete = this.isCategoryComplete(categoryId);

    if (isComplete) {
      this.opts.audioManager.playSFX('complete');
    }

    for (const item of items) {
      const collected = this.opts.saveManager.isCollected(item.id);
      const cell = document.createElement('div');
      cell.style.cssText = `
        display: flex; flex-direction: column; align-items: center;
        padding: 10px; border-radius: 12px; cursor: ${collected ? 'pointer' : 'default'};
        background: ${collected ? '#fff' : '#ddd'};
        border: 2px solid ${collected ? '#4d96ff' : '#ccc'};
        min-height: 80px; justify-content: center;
      `;

      if (collected) {
        cell.innerHTML = `
          <div style="font-size: 14px; font-weight: bold; color: #333;">${this.escapeHtml(item.name)}</div>
          <div style="font-size: 10px; color: #999;">${item.rarity === 'rare' ? '⭐⭐' : item.rarity === 'legendary' ? '⭐⭐⭐' : '⭐'}</div>
        `;
        cell.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.zukanOverlay?.show(item);
        });
      } else {
        cell.innerHTML = `
          <div style="font-size: 28px; color: #bbb;">？</div>
        `;
      }

      grid.appendChild(cell);
    }

    // Show completion banner
    if (isComplete) {
      const banner = document.createElement('div');
      banner.style.cssText = `
        grid-column: 1 / -1; background: linear-gradient(135deg, #ffd93d, #ff6b6b);
        border-radius: 12px; padding: 15px; text-align: center;
        font-size: 20px; font-weight: bold; color: #fff;
      `;
      banner.textContent = '🎉 コンプリート！すごいね！';
      grid.prepend(banner);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
