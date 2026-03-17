import * as THREE from 'three';
import { GameLoop } from '@/game/GameLoop';
import { SceneManager } from '@/game/SceneManager';
import { SaveManager } from '@/game/storage/SaveManager';
import { AudioManager } from '@/game/audio/AudioManager';
import { CategoryRegistry } from '@/game/entities/registry/CategoryRegistry';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';
import { categories } from '@/game/config/categories';
import { items } from '@/game/config/items';
import { OrientationGuard } from '@/ui/OrientationGuard';
import { TitleScene } from '@/game/scenes/TitleScene';
import { CategorySelectScene } from '@/game/scenes/CategorySelectScene';
import { CraneGameScene } from '@/game/scenes/CraneGameScene';
import { ResultScene } from '@/game/scenes/ResultScene';
import { ZukanScene } from '@/game/scenes/ZukanScene';

// Registry setup
const categoryRegistry = new CategoryRegistry();
for (const cat of categories) {
  categoryRegistry.register(cat);
}

const itemRegistry = new ItemRegistry();
for (const item of items) {
  itemRegistry.register(item);
}

// Core systems
const saveManager = new SaveManager();
const audioManager = new AudioManager();
const sceneManager = new SceneManager();
const gameLoop = new GameLoop();

// Three.js renderer
const app = document.getElementById('app')!;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x87ceeb);
app.appendChild(renderer.domElement);

// Orientation guard
const orientationGuard = new OrientationGuard(app);

// === Scene Registration ===

const titleScene = new TitleScene({
  audioManager,
  onPlay: () => sceneManager.enter('categorySelect'),
  onZukan: () => sceneManager.enter('zukan'),
});

const categorySelectScene = new CategorySelectScene({
  categoryRegistry,
  audioManager,
  onSelect: (categoryId) => sceneManager.enter('craneGame', { categoryId }),
  onBack: () => sceneManager.enter('title'),
});

const craneGameScene = new CraneGameScene({
  itemRegistry,
  saveManager,
  audioManager,
  onComplete: (categoryId, result) => {
    sceneManager.enter('result', { categoryId, catchResult: result });
  },
});

const resultScene = new ResultScene({
  audioManager,
  onNavigate: (target, categoryId) => {
    switch (target) {
      case 'retry':
        sceneManager.enter('craneGame', { categoryId });
        break;
      case 'zukan':
        sceneManager.enter('zukan');
        break;
      case 'title':
        sceneManager.enter('title');
        break;
    }
  },
});

const zukanScene = new ZukanScene({
  categoryRegistry,
  itemRegistry,
  saveManager,
  audioManager,
  onBack: () => sceneManager.enter('title'),
});

sceneManager.register('title', titleScene);
sceneManager.register('categorySelect', categorySelectScene);
sceneManager.register('craneGame', craneGameScene);
sceneManager.register('result', resultScene);
sceneManager.register('zukan', zukanScene);

// Start at title
sceneManager.enter('title');

// Resize handler
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const scene = sceneManager.getActiveScene();
  if (scene) {
    const camera = scene.getCamera();
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  }
});

// Audio resume on first touch (Safari)
const resumeAudio = () => {
  audioManager.initialize();
  audioManager.resume();
  document.removeEventListener('pointerdown', resumeAudio);
};
document.addEventListener('pointerdown', resumeAudio);

// Game loop
gameLoop.start((deltaTime) => {
  if (orientationGuard.isBlocking()) return;

  sceneManager.update(deltaTime);

  const scene = sceneManager.getActiveScene();
  if (scene) {
    renderer.render(scene.getThreeScene(), scene.getCamera());
  }
});
