import * as THREE from 'three';
import type { Scene, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { SFXGenerator } from '../audio/SFXGenerator';
import type { AudioManager } from '../audio/AudioManager';
import { BGMGenerator } from '../audio/BGMGenerator';
import { EncyclopediaOverlay } from '../../ui/EncyclopediaOverlay';

export class EncyclopediaScene implements Scene {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private sceneManager: SceneManager;
  private saveManager: SaveManager;
  private sfx: SFXGenerator;
  private bgm: BGMGenerator;
  private encyclopediaOverlay: EncyclopediaOverlay;

  constructor(sceneManager: SceneManager, saveManager: SaveManager, sfx: SFXGenerator, audioManager: AudioManager) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.sfx = sfx;
    this.bgm = new BGMGenerator(audioManager);
    this.encyclopediaOverlay = new EncyclopediaOverlay(sfx);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 3, 8);
    this.camera.lookAt(0, 1, 0);

    this.scene.background = new THREE.Color(0x1a0a2e);
    this.scene.add(new THREE.AmbientLight(0x6644aa, 0.5));
  }

  enter(_context: SceneContext): void {
    this.bgm.start('title');
    const data = this.saveManager.load();
    this.encyclopediaOverlay.mount(document.body);
    this.encyclopediaOverlay.onClose = () => {
      this.sceneManager.requestTransition('title');
    };
    this.encyclopediaOverlay.show(data.collectedVehicles);
  }

  update(_deltaTime: number): void {}

  exit(): void {
    this.bgm.stop();
    this.encyclopediaOverlay.hide();
    this.encyclopediaOverlay.unmount();
  }

  getThreeScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.Camera {
    return this.camera;
  }
}
