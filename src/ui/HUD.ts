import type { MoveDirection } from '@/types/index';

export class HUD {
  private container: HTMLElement;
  private hudElement: HTMLElement;
  private catchButton!: HTMLButtonElement;
  public onMove: ((direction: MoveDirection) => void) | null = null;
  public onCatch: (() => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.hudElement = document.createElement('div');
    this.hudElement.className = 'hud';
    this.hudElement.style.cssText = `
      position: absolute; bottom: 20px; left: 0; right: 0;
      display: flex; justify-content: space-between; align-items: flex-end;
      z-index: 100; pointer-events: none;
      padding: 0 30px env(safe-area-inset-bottom, 10px) 30px;
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
    // D-pad (left side) - cross layout
    const dpad = document.createElement('div');
    dpad.style.cssText = `
      display: grid; grid-template-columns: 60px 60px 60px; grid-template-rows: 60px 60px 60px;
      gap: 4px; pointer-events: auto;
    `;

    // Up button (row 1, col 2)
    const upBtn = this.createButton('▲', 'up');
    upBtn.style.gridColumn = '2'; upBtn.style.gridRow = '1';
    this.addMoveListeners(upBtn, { x: 0, z: -1 });
    dpad.appendChild(upBtn);

    // Left button (row 2, col 1)
    const leftBtn = this.createButton('◀', 'left');
    leftBtn.style.gridColumn = '1'; leftBtn.style.gridRow = '2';
    this.addMoveListeners(leftBtn, { x: -1, z: 0 });
    dpad.appendChild(leftBtn);

    // Right button (row 2, col 3)
    const rightBtn = this.createButton('▶', 'right');
    rightBtn.style.gridColumn = '3'; rightBtn.style.gridRow = '2';
    this.addMoveListeners(rightBtn, { x: 1, z: 0 });
    dpad.appendChild(rightBtn);

    // Down button (row 3, col 2)
    const downBtn = this.createButton('▼', 'down');
    downBtn.style.gridColumn = '2'; downBtn.style.gridRow = '3';
    this.addMoveListeners(downBtn, { x: 0, z: 1 });
    dpad.appendChild(downBtn);

    this.hudElement.appendChild(dpad);

    // Catch button (right side)
    this.catchButton = this.createButton('つかむ', 'catch');
    this.catchButton.style.width = '80px';
    this.catchButton.style.height = '80px';
    this.catchButton.style.minWidth = '80px';
    this.catchButton.style.background = '#ff6b6b';
    this.catchButton.style.pointerEvents = 'auto';
    this.catchButton.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onCatch?.();
    });
    this.hudElement.appendChild(this.catchButton);
  }

  private addMoveListeners(btn: HTMLButtonElement, dir: MoveDirection): void {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.onMove?.(dir);
    });
    btn.addEventListener('pointerup', () => this.onMove?.({ x: 0, z: 0 }));
    btn.addEventListener('pointerleave', () => this.onMove?.({ x: 0, z: 0 }));
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
    return btn;
  }
}
