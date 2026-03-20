import * as THREE from 'three';
import { GameLoop } from './game/GameLoop';
import { SceneManager } from './game/SceneManager';
import { SaveManager } from './game/storage/SaveManager';
import { AudioManager } from './game/audio/AudioManager';
import { SFXGenerator } from './game/audio/SFXGenerator';
import { TitleScene } from './game/scenes/TitleScene';
import { MachineSelectScene } from './game/scenes/MachineSelectScene';
import { PlayScene } from './game/scenes/PlayScene';
import { ResultScene } from './game/scenes/ResultScene';
import { EncyclopediaScene } from './game/scenes/EncyclopediaScene';
import type { SceneType, SceneContext } from './types';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a0a2e);

const sceneManager = new SceneManager();
const gameLoop = new GameLoop();
const saveManager = new SaveManager();
const audioManager = new AudioManager();
const sfx = new SFXGenerator(audioManager);

// Create scenes
const titleScene = new TitleScene(sceneManager, audioManager, saveManager, sfx);
const machineSelectScene = new MachineSelectScene(sceneManager, audioManager, sfx);
const playScene = new PlayScene(sceneManager, audioManager, sfx, saveManager);
const resultScene = new ResultScene(sceneManager, audioManager, sfx, saveManager);
const encyclopediaScene = new EncyclopediaScene(sceneManager, saveManager, sfx, audioManager);

// Register scenes
sceneManager.registerScene('title', titleScene);
sceneManager.registerScene('machineSelect', machineSelectScene);
sceneManager.registerScene('play', playScene);
sceneManager.registerScene('result', resultScene);
sceneManager.registerScene('encyclopedia', encyclopediaScene);

// Handle transitions
sceneManager.setTransitionHandler((sceneType: SceneType, context?: SceneContext) => {
  sceneManager.transitionTo(sceneType, context);
});

// Start from title
sceneManager.transitionTo('title');

gameLoop.start(
  (deltaTime: number) => {
    sceneManager.update(deltaTime);
  },
  () => {
    const scene = sceneManager.getCurrentThreeScene();
    const camera = sceneManager.getCurrentCamera();
    if (scene && camera) {
      renderer.render(scene, camera);
    }
  },
);

// Handle resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const camera = sceneManager.getCurrentCamera();
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
});

// Auto-pause on background
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause();
  } else {
    gameLoop.resume();
    audioManager.ensureResumed();
  }
});
