export class GameLoop {
  private running = false;
  private lastTime = 0;
  private animationFrameId = 0;
  private updateFn: ((deltaTime: number) => void) | null = null;
  private paused = false;
  private handleVisibility: (() => void) | null = null;

  start(update: (deltaTime: number) => void): void {
    this.updateFn = update;
    this.running = true;
    this.paused = false;
    this.lastTime = performance.now();

    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibility);

    this.tick(this.lastTime);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animationFrameId);
    if (this.handleVisibility) {
      document.removeEventListener('visibilitychange', this.handleVisibility);
      this.handleVisibility = null;
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    if (this.paused) {
      this.paused = false;
      this.lastTime = performance.now();
    }
  }

  isPaused(): boolean {
    return this.paused;
  }

  isRunning(): boolean {
    return this.running;
  }

  private tick = (now: number): void => {
    if (!this.running) return;
    this.animationFrameId = requestAnimationFrame(this.tick);

    if (this.paused) {
      this.lastTime = now;
      return;
    }

    const deltaTime = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.updateFn?.(deltaTime);
  };
}
