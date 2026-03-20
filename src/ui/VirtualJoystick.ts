/**
 * バーチャルジョイスティック（タッチ/マウス対応）
 * 画面左側に配置
 */
export class VirtualJoystick {
  private container: HTMLDivElement;
  private stick: HTMLDivElement;
  private active = false;
  private startX = 0;
  private startY = 0;
  private maxDist = 40;

  /** -1〜1 のX方向入力 */
  x = 0;
  /** -1〜1 のZ方向入力（画面上がマイナス=奥） */
  z = 0;

  constructor() {
    this.container = document.createElement('div');
    this.stick = document.createElement('div');
    this.setupDOM();
    this.setupEvents();
  }

  private setupDOM(): void {
    const c = this.container;
    c.style.cssText = `
      position: fixed;
      left: max(20px, env(safe-area-inset-left, 20px));
      bottom: max(30px, env(safe-area-inset-bottom, 30px));
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.12);
      border: 2px solid rgba(255,255,255,0.25);
      z-index: 30;
      touch-action: none;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const s = this.stick;
    s.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF6B6B, #FFD93D);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.05s;
      pointer-events: none;
    `;

    c.appendChild(s);
  }

  private setupEvents(): void {
    const c = this.container;

    const onStart = (cx: number, cy: number) => {
      this.active = true;
      const rect = c.getBoundingClientRect();
      this.startX = rect.left + rect.width / 2;
      this.startY = rect.top + rect.height / 2;
      this.onMove(cx, cy);
    };

    const onMove = (cx: number, cy: number) => {
      if (!this.active) return;
      this.onMove(cx, cy);
    };

    const onEnd = () => {
      this.active = false;
      this.x = 0;
      this.z = 0;
      this.stick.style.transform = 'translate(0, 0)';
    };

    c.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      onStart(t.clientX, t.clientY);
    }, { passive: false });

    c.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: false });

    c.addEventListener('touchend', onEnd);
    c.addEventListener('touchcancel', onEnd);

    // Mouse fallback for PC
    c.addEventListener('mousedown', (e) => {
      onStart(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onEnd);
  }

  private onMove(cx: number, cy: number): void {
    let dx = cx - this.startX;
    let dy = cy - this.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxDist) {
      dx = (dx / dist) * this.maxDist;
      dy = (dy / dist) * this.maxDist;
    }

    this.x = dx / this.maxDist;
    this.z = dy / this.maxDist; // screen Y maps to world Z
    this.stick.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  unmount(): void {
    this.container.remove();
  }

  show(): void {
    this.container.style.display = 'flex';
  }

  hide(): void {
    this.container.style.display = 'none';
  }
}
