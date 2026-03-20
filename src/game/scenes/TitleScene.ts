import * as THREE from 'three';
import type { Scene, SceneContext } from '@/types/index';
import type { AudioManager } from '@/game/audio/AudioManager';

interface TitleSceneOptions {
  audioManager: AudioManager;
  onPlay: () => void;
  onZukan: () => void;
}

export class TitleScene implements Scene {
  private threeScene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private overlay: HTMLElement | null = null;
  private decorations: THREE.Group[] = [];
  private readonly opts: TitleSceneOptions;

  constructor(opts: TitleSceneOptions) {
    this.opts = opts;
    this.threeScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2, 6);
    this.camera.lookAt(0, 1, 0);

    this.threeScene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(3, 5, 3);
    this.threeScene.add(dirLight);
  }

  enter(_context: SceneContext): void {
    this.threeScene.background = new THREE.Color(0x87ceeb);
    this.createOverlay();
    this.createDecorations();
    this.opts.audioManager.playBGM('title');
  }

  update(deltaTime: number): void {
    // Gentle float animation for decorations
    for (let i = 0; i < this.decorations.length; i++) {
      const d = this.decorations[i]!;
      d.rotation.y += deltaTime * 0.5;
      d.position.y += Math.sin(Date.now() * 0.001 + i * 2) * 0.002;
    }
  }

  exit(): void {
    this.opts.audioManager.stopBGM();
    this.overlay?.remove();
    this.overlay = null;
    for (const d of this.decorations) {
      this.threeScene.remove(d);
    }
    this.decorations = [];
  }

  getThreeScene(): THREE.Scene {
    return this.threeScene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }

  handlePlay(): void {
    this.opts.audioManager.playSFX('buttonTap');
    this.opts.onPlay();
  }

  handleZukan(): void {
    this.opts.audioManager.playSFX('buttonTap');
    this.opts.onZukan();
  }

  private createOverlay(): void {
    const app = document.getElementById('app');
    if (!app) return;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; z-index: 100; pointer-events: none;
      font-family: 'Hiragino Kaku Gothic ProN', sans-serif;
    `;

    this.overlay.innerHTML = `
      <div style="text-align: center; pointer-events: auto;">
        <div style="font-size: 48px; font-weight: bold; color: #ff6b6b; text-shadow: 3px 3px 0 #fff; margin-bottom: 10px;">
          🏗️ くれーんきゃっち
        </div>
        <div style="font-size: 18px; color: #666; margin-bottom: 40px;">
          どうぶつを つかまえよう！
        </div>
        <div style="display: flex; gap: 20px; justify-content: center;">
          <button id="title-play-btn" style="background: #ff6b6b; color: #fff; border: none; border-radius: 20px; padding: 18px 40px; font-size: 24px; font-weight: bold; cursor: pointer; min-width: 44px; min-height: 44px; box-shadow: 0 4px 0 #cc5555;">
            あそぶ
          </button>
          <button id="title-zukan-btn" style="background: #6bcb77; color: #fff; border: none; border-radius: 20px; padding: 18px 40px; font-size: 24px; font-weight: bold; cursor: pointer; min-width: 44px; min-height: 44px; box-shadow: 0 4px 0 #4aa05a;">
            ずかん
          </button>
        </div>
      </div>
    `;

    this.overlay.querySelector('#title-play-btn')?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handlePlay();
    });
    this.overlay.querySelector('#title-zukan-btn')?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.handleZukan();
    });

    app.appendChild(this.overlay);
  }

  private createDecorations(): void {
    const colors = [0xff6b6b, 0xffd93d, 0x6bcb77, 0x4d96ff, 0xff6bcb];
    for (let i = 0; i < 5; i++) {
      const geo = new THREE.SphereGeometry(0.3, 8, 8);
      const mat = new THREE.MeshToonMaterial({ color: colors[i % colors.length] });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((i - 2) * 1.5, 0.5 + Math.random(), -2 + Math.random());

      const group = new THREE.Group();
      group.add(mesh);
      this.threeScene.add(group);
      this.decorations.push(group);
    }
  }
}
