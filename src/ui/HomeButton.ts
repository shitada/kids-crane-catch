/**
 * ホームボタン（図鑑画面などで使う）
 */
export class HomeButton {
  private button: HTMLButtonElement;
  private _onClick: (() => void) | null = null;

  constructor() {
    this.button = document.createElement('button');
    this.setupDOM();
  }

  private setupDOM(): void {
    this.button.textContent = '🏠';
    this.button.style.cssText = `
      position: fixed;
      top: max(12px, env(safe-area-inset-top, 12px));
      left: max(12px, env(safe-area-inset-left, 12px));
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.15);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 30;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    `;
    this.button.addEventListener('click', () => this._onClick?.());
  }

  set onClick(cb: (() => void) | null) {
    this._onClick = cb;
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.button);
  }

  unmount(): void {
    this.button.remove();
  }
}
