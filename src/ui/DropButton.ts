/**
 * 「おろす」ボタン — 画面右下に配置
 */
export class DropButton {
  private button: HTMLButtonElement;
  private _onDrop: (() => void) | null = null;

  constructor() {
    this.button = document.createElement('button');
    this.setupDOM();
    this.setupEvents();
  }

  private setupDOM(): void {
    const b = this.button;
    b.textContent = 'おろす';
    b.style.cssText = `
      position: fixed;
      right: max(20px, env(safe-area-inset-right, 20px));
      bottom: max(40px, env(safe-area-inset-bottom, 40px));
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3vmin, 1.3rem);
      font-weight: 900;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
      cursor: pointer;
      z-index: 30;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      animation: dropBtnPulse 2s ease-in-out infinite;
    `;

    // Add animation keyframes
    if (!document.getElementById('drop-btn-style')) {
      const style = document.createElement('style');
      style.id = 'drop-btn-style';
      style.textContent = `
        @keyframes dropBtnPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private setupEvents(): void {
    this.button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._onDrop?.();
    }, { passive: false });

    this.button.addEventListener('click', () => {
      this._onDrop?.();
    });
  }

  set onDrop(cb: (() => void) | null) {
    this._onDrop = cb;
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.button);
  }

  unmount(): void {
    this.button.remove();
  }

  setEnabled(enabled: boolean): void {
    this.button.style.opacity = enabled ? '1' : '0.4';
    this.button.style.pointerEvents = enabled ? 'auto' : 'none';
  }

  show(): void {
    this.button.style.display = 'block';
  }

  hide(): void {
    this.button.style.display = 'none';
  }
}
