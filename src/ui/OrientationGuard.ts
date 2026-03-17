export class OrientationGuard {
  private container: HTMLElement;
  private overlay: HTMLElement | null = null;
  private blocking = false;
  private mediaQuery: MediaQueryList | null = null;
  private onChange: ((e: MediaQueryListEvent) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupListener();
    this.check();
  }

  check(): void {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    if (isPortrait) {
      this.showOverlay();
    } else {
      this.hideOverlay();
    }
  }

  isBlocking(): boolean {
    return this.blocking;
  }

  dispose(): void {
    if (this.mediaQuery && this.onChange) {
      this.mediaQuery.removeEventListener('change', this.onChange);
    }
    this.hideOverlay();
  }

  private setupListener(): void {
    this.mediaQuery = window.matchMedia('(orientation: portrait)');
    this.onChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        this.showOverlay();
      } else {
        this.hideOverlay();
      }
    };
    this.mediaQuery.addEventListener('change', this.onChange);
  }

  private showOverlay(): void {
    if (this.overlay) return;
    this.blocking = true;

    this.overlay = document.createElement('div');
    this.overlay.className = 'orientation-overlay';
    this.overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.9); display: flex; flex-direction: column;
      align-items: center; justify-content: center; z-index: 10000; color: #fff;
      font-size: 24px; text-align: center; font-family: sans-serif;
    `;
    this.overlay.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 20px;">📱↔️</div>
      <div>スマホを よこむきに してね！</div>
    `;
    this.container.appendChild(this.overlay);
  }

  private hideOverlay(): void {
    this.blocking = false;
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
}
