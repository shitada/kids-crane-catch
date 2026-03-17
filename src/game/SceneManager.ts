import type { Scene, SceneType, SceneContext } from '@/types/index';

export class SceneManager {
  private scenes = new Map<SceneType, Scene>();
  private activeScene: Scene | null = null;
  private activeSceneType: SceneType | null = null;

  register(type: SceneType, scene: Scene): void {
    this.scenes.set(type, scene);
  }

  enter(type: SceneType, context: SceneContext = {}): void {
    if (this.activeScene) {
      this.activeScene.exit();
    }

    const scene = this.scenes.get(type);
    if (!scene) {
      throw new Error(`Scene "${type}" not registered`);
    }

    this.activeScene = scene;
    this.activeSceneType = type;
    scene.enter(context);
  }

  update(deltaTime: number): void {
    this.activeScene?.update(deltaTime);
  }

  getActiveScene(): Scene | null {
    return this.activeScene;
  }

  getActiveSceneType(): SceneType | null {
    return this.activeSceneType;
  }
}
