import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AudioManager } from '../audio/AudioManager';
import type { SaveManager } from '../storage/SaveManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import { BGMGenerator } from '../audio/BGMGenerator';
import { EncyclopediaOverlay } from '../../ui/EncyclopediaOverlay';

export class TitleScene implements Scene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private audioManager: AudioManager;
  private saveManager: SaveManager;
  private sfx: SFXGenerator;
  private bgm: BGMGenerator;
  private overlay: HTMLDivElement | null = null;
  private resetBtn: HTMLButtonElement | null = null;
  private encyclopediaOverlay: EncyclopediaOverlay;
  private decorations: THREE.Group;
  private time = 0;

  constructor(sceneManager: SceneManager, audioManager: AudioManager, saveManager: SaveManager, sfx: SFXGenerator) {
    this.sceneManager = sceneManager;
    this.audioManager = audioManager;
    this.saveManager = saveManager;
    this.sfx = sfx;
    this.bgm = new BGMGenerator(audioManager);
    this.encyclopediaOverlay = new EncyclopediaOverlay(sfx);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1, 0);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0x6644aa, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 8, 5);
    this.scene.add(dir);

    // Background color
    this.scene.background = new THREE.Color(0x1a0a2e);

    // Decorations
    this.decorations = new THREE.Group();
    this.buildDecorations();
    this.scene.add(this.decorations);
  }

  private buildDecorations(): void {
    // Floating stars
    const starGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const colors = [0xFFD700, 0xFF6B6B, 0x6BCB77, 0x4488FF, 0xFF88CC];
    for (let i = 0; i < 30; i++) {
      const mat = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.3,
      });
      const star = new THREE.Mesh(starGeo, mat);
      star.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * 6,
        (Math.random() - 0.5) * 8 - 2,
      );
      star.userData.speed = 0.3 + Math.random() * 0.5;
      star.userData.baseY = star.position.y;
      this.decorations.add(star);
    }

    // Simple crane machine silhouette (decorative)
    const frameMat = new THREE.MeshPhongMaterial({ color: 0x6622aa });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 2), frameMat);
    frame.position.set(0, 2, -1);
    frame.material.transparent = true;
    frame.material.opacity = 0.3;
    this.decorations.add(frame);
  }

  enter(_context: SceneContext): void {
    this.time = 0;
    this.buildUI();
    this.bgm.start('title');
  }

  private buildUI(): void {
    const uiOverlay = document.getElementById('ui-overlay')!;

    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      gap: 1.2rem;
    `;

    // Title
    const title = document.createElement('h1');
    title.textContent = '🏗️ クレーンキャッチ';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3);
      margin-bottom: 0.5rem;
    `;
    this.overlay.appendChild(title);

    // Subtitle
    const sub = document.createElement('p');
    sub.textContent = 'いろんな のりものを あつめよう！';
    sub.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3vw, 1.4rem);
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      margin-bottom: 1rem;
    `;
    this.overlay.appendChild(sub);

    // Play button
    const playBtn = this.createButton('あそぶ', '#FF6B6B', '#FFD93D');
    playBtn.addEventListener('click', () => {
      this.audioManager.init();
      this.audioManager.ensureResumed();
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('machineSelect');
    });
    this.overlay.appendChild(playBtn);

    // Encyclopedia button
    const encBtn = this.createButton('ずかん', '#4488FF', '#44DDFF');
    encBtn.addEventListener('click', () => {
      this.audioManager.init();
      this.audioManager.ensureResumed();
      this.sfx.play('buttonTap');
      const data = this.saveManager.load();
      this.encyclopediaOverlay.show(data.collectedVehicles);
    });
    this.overlay.appendChild(encBtn);

    // Reset button (左下に小さく配置)
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🗑️ リセット';
    resetBtn.style.cssText = `
      position: fixed;
      left: max(12px, env(safe-area-inset-left, 12px));
      bottom: max(12px, env(safe-area-inset-bottom, 12px));
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 1rem;
      padding: 0.4rem 0.8rem;
      color: rgba(255,255,255,0.5);
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
      z-index: 30;
    `;
    resetBtn.addEventListener('click', () => {
      if (confirm('ぜんぶの ずかんデータを けしますか？')) {
        this.saveManager.clear();
        this.sfx.play('buttonTap');
        resetBtn.textContent = '✅ リセットしたよ！';
        setTimeout(() => { resetBtn.textContent = '🗑️ リセット'; }, 1500);
      }
    });
    document.body.appendChild(resetBtn);
    // Store ref for cleanup
    this.resetBtn = resetBtn;

    uiOverlay.appendChild(this.overlay);

    // Encyclopedia overlay
    this.encyclopediaOverlay.onClose = () => {};
    this.encyclopediaOverlay.mount(document.body);
  }

  private createButton(text: string, color1: string, color2: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      background: linear-gradient(135deg, ${color1}, ${color2});
      border: none;
      border-radius: 2rem;
      padding: 1rem 3rem;
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.2rem, 3vw, 1.6rem);
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      min-width: 180px;
      transition: transform 0.1s;
    `;
    btn.addEventListener('pointerdown', () => { btn.style.transform = 'scale(0.95)'; });
    btn.addEventListener('pointerup', () => { btn.style.transform = 'scale(1)'; });
    btn.addEventListener('pointerleave', () => { btn.style.transform = 'scale(1)'; });
    return btn;
  }

  update(deltaTime: number): void {
    this.time += deltaTime;

    // Animate decorations
    for (const child of this.decorations.children) {
      if (child.userData.speed) {
        child.position.y = child.userData.baseY + Math.sin(this.time * child.userData.speed) * 0.3;
      }
    }
  }

  exit(): void {
    this.bgm.stop();
    this.encyclopediaOverlay.unmount();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.resetBtn) {
      this.resetBtn.remove();
      this.resetBtn = null;
    }
  }

  getThreeScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }
}
