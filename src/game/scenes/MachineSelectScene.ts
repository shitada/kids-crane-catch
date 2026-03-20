import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AudioManager } from '../audio/AudioManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import { MACHINES } from '../config/MachineConfig';

export class MachineSelectScene implements Scene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private audioManager: AudioManager;
  private sfx: SFXGenerator;
  private overlay: HTMLDivElement | null = null;

  constructor(sceneManager: SceneManager, audioManager: AudioManager, sfx: SFXGenerator) {
    this.sceneManager = sceneManager;
    this.audioManager = audioManager;
    this.sfx = sfx;

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

    // Machine cards container
    const cardContainer = document.createElement('div');
    cardContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
      max-width: 800px;
    `;

    for (const machine of MACHINES) {
      const card = document.createElement('div');
      const colorHex = '#' + machine.themeColor.toString(16).padStart(6, '0');
      card.style.cssText = `
        background: linear-gradient(135deg, ${colorHex}88, ${colorHex}44);
        border: 2px solid ${colorHex};
        border-radius: 20px;
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        min-width: 200px;
        transition: transform 0.2s;
        font-family: 'Zen Maru Gothic', sans-serif;
      `;

      card.innerHTML = `
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${machine.emoji}</div>
        <div style="color: #FFD700; font-size: 1.5rem; font-weight: 900; margin-bottom: 0.3rem;">${machine.name}</div>
        <div style="color: #fff; font-size: 0.9rem;">${machine.description}</div>
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
