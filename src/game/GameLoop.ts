export class GameLoop {
  private running = false;
  private lastTime = 0;
  private animationId = 0;
  private updateCallback: ((deltaTime: number) => void) | null = null;
  private renderCallback: (() => void) | null = null;

  start(
    onUpdate: (deltaTime: number) => void,
    onRender: () => void,
  ): void {
    this.updateCallback = onUpdate;
    this.renderCallback = onRender;
    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  pause(): void {
    this.running = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  resume(): void {
    if (!this.running && this.updateCallback && this.renderCallback) {
      this.running = true;
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  isRunning(): boolean {
    return this.running;
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.updateCallback?.(deltaTime);
    this.renderCallback?.();

    this.animationId = requestAnimationFrame(this.loop);
  };
}
