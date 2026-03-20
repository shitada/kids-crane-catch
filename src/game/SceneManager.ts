import type * as THREE from 'three';
import type { Scene, SceneType, SceneContext } from '../types';

export class SceneManager {
  private scenes = new Map<SceneType, Scene>();
  private currentScene: Scene | null = null;
  private currentType: SceneType | null = null;
  private onTransitionRequest: ((sceneType: SceneType, context?: SceneContext) => void) | null = null;

  registerScene(type: SceneType, scene: Scene): void {
    this.scenes.set(type, scene);
  }

  setTransitionHandler(handler: (sceneType: SceneType, context?: SceneContext) => void): void {
    this.onTransitionRequest = handler;
  }

  requestTransition(sceneType: SceneType, context?: SceneContext): void {
    if (this.onTransitionRequest) {
      this.onTransitionRequest(sceneType, context);
    } else {
      this.transitionTo(sceneType, context);
    }
  }

  transitionTo(sceneType: SceneType, context: SceneContext = {}): void {
    const nextScene = this.scenes.get(sceneType);
    if (!nextScene) return;

    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = nextScene;
    this.currentType = sceneType;
    this.currentScene.enter(context);
  }

  update(deltaTime: number): void {
    this.currentScene?.update(deltaTime);
  }

  getCurrentThreeScene(): THREE.Scene | null {
    return this.currentScene?.getThreeScene() ?? null;
  }

  getCurrentCamera(): THREE.Camera | null {
    return this.currentScene?.getCamera() ?? null;
  }

  getCurrentType(): SceneType | null {
    return this.currentType;
  }
}
