export class HUD {
  private container: HTMLElement;
  private hudElement: HTMLElement;
  private catchButton!: HTMLButtonElement;
  public onMove: ((direction: -1 | 0 | 1) => void) | null = null;
  public onCatch: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.hudElement = document.createElement('div');
    this.hudElement.className = 'hud';
    this.hudElement.style.cssText = `
      position: absolute; bottom: 20px; left: 0; right: 0;
      display: flex; justify-content: center; align-items: center;
      gap: 20px; z-index: 100; pointer-events: none;
      padding: env(safe-area-inset-bottom, 10px);
    `;
    this.createButtons();
    this.container.appendChild(this.hudElement);
  }

  setCatchEnabled(enabled: boolean): void {
    this.catchButton.disabled = !enabled;
    this.catchButton.style.opacity = enabled ? '1' : '0.5';
  }

  dispose(): void {
    this.hudElement.remove();
  }

  private createButtons(): void {
    // Left button
    const leftBtn = this.createButton('◀', 'left');
    leftBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onMove?.(-1);
    });
    leftBtn.addEventListener('pointerup', () => this.onMove?.(0));
    leftBtn.addEventListener('pointerleave', () => this.onMove?.(0));

    // Catch button
    this.catchButton = this.createButton('つかむ', 'catch');
    this.catchButton.style.width = '80px';
    this.catchButton.style.minWidth = '80px';
    this.catchButton.style.background = '#ff6b6b';
    this.catchButton.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onCatch?.();
    });

    // Right button
    const rightBtn = this.createButton('▶', 'right');
    rightBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onMove?.(1);
    });
    rightBtn.addEventListener('pointerup', () => this.onMove?.(0));
    rightBtn.addEventListener('pointerleave', () => this.onMove?.(0));
  }

  private createButton(label: string, action: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.dataset['action'] = action;
    btn.style.cssText = `
      width: 60px; height: 60px; min-width: 44px; min-height: 44px;
      border-radius: 50%; border: 3px solid #fff;
      background: #4d96ff; color: #fff; font-size: 20px; font-weight: bold;
      cursor: pointer; pointer-events: auto; touch-action: none;
      display: flex; align-items: center; justify-content: center;
      -webkit-tap-highlight-color: transparent;
    `;
    this.hudElement.appendChild(btn);
    return btn;
  }
}
