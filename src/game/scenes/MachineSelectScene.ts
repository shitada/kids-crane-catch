import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AudioManager } from '../audio/AudioManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import type { SaveManager } from '../storage/SaveManager';
import { MACHINES } from '../config/MachineConfig';
import { ALL_ENCYCLOPEDIA } from '../config/VehicleEncyclopedia';

export class MachineSelectScene implements Scene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private audioManager: AudioManager;
  private sfx: SFXGenerator;
  private saveManager: SaveManager;
  private overlay: HTMLDivElement | null = null;

  constructor(sceneManager: SceneManager, audioManager: AudioManager, sfx: SFXGenerator, saveManager: SaveManager) {
    this.sceneManager = sceneManager;
    this.audioManager = audioManager;
    this.sfx = sfx;
    this.saveManager = saveManager;

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1, 0);

    this.scene.background = new THREE.Color(0x1a0a2e);
    this.scene.add(new THREE.AmbientLight(0x6644aa, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 8, 5);
    this.scene.add(dir);
  }

  enter(_context: SceneContext): void {
    this.buildUI();
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
      gap: 1.5rem;
    `;

    // Title
    const title = document.createElement('h1');
    title.textContent = 'マシンを えらぼう！';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.6rem, 5vw, 2.5rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 3px 6px rgba(0,0,0,0.5);
    `;
    this.overlay.appendChild(title);

    // Machine cards container (3列×2行のグリッド)
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      max-width: 700px;
      width: 100%;
      padding: 0 1rem;
    `;

    for (const machine of MACHINES) {
      const card = document.createElement('div');
      const colorHex = '#' + machine.themeColor.toString(16).padStart(6, '0');
      const saveData = this.saveManager.load();
      const catEntries = ALL_ENCYCLOPEDIA[machine.id] ?? [];
      const collected = catEntries.filter(e => saveData.collectedVehicles.includes(e.id)).length;
      const total = catEntries.length;
      const isComplete = collected >= total && total > 0;
      const pct = total > 0 ? (collected / total) * 100 : 0;
      card.style.cssText = `
        background: linear-gradient(135deg, ${colorHex}88, ${colorHex}44);
        border: 2px solid ${isComplete ? '#FFD700' : colorHex};
        border-radius: 16px;
        padding: 1rem 0.8rem;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        font-family: 'Zen Maru Gothic', sans-serif;
      `;

      card.innerHTML = `
        <div style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 0.3rem;">${isComplete ? '🏆' : machine.emoji}</div>
        <div style="color: #FFD700; font-size: clamp(0.9rem, 2.5vw, 1.2rem); font-weight: 900; margin-bottom: 0.2rem;">${machine.name}</div>
        <div style="color: #fff; font-size: clamp(0.6rem, 1.5vw, 0.7rem); margin-bottom: 0.3rem;">${collected}/${total}</div>
        <div style="background: rgba(0,0,0,0.3); border-radius: 4px; height: 6px; width: 100%; overflow: hidden;">
          <div style="background: ${isComplete ? '#FFD700' : colorHex}; height: 100%; width: ${pct}%; border-radius: 4px;"></div>
        </div>
      `;

      card.addEventListener('click', () => {
        this.sfx.play('buttonTap');
        this.sceneManager.requestTransition('play', { machineId: machine.id });
      });
      card.addEventListener('pointerenter', () => { card.style.transform = 'scale(1.05)'; });
      card.addEventListener('pointerleave', () => { card.style.transform = 'scale(1)'; });

      cardContainer.appendChild(card);
    }

    this.overlay.appendChild(cardContainer);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.textContent = 'もどる';
    backBtn.style.cssText = `
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 2rem;
      padding: 0.7rem 2rem;
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      touch-action: manipulation;
    `;
    backBtn.addEventListener('click', () => {
      this.sfx.play('buttonTap');
      this.sceneManager.requestTransition('title');
    });
    this.overlay.appendChild(backBtn);

    uiOverlay.appendChild(this.overlay);
  }

  update(_deltaTime: number): void {}

  exit(): void {
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
