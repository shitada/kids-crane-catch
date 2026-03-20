/**
 * プレイ中のHUD（残り回数を大きく表示＋アニメーション、カテゴリ名、ホームボタン）
 */
export class HUD {
  private container: HTMLDivElement;
  private attemptsContainer: HTMLDivElement;
  private categoryEl: HTMLSpanElement;
  private homeBtn: HTMLButtonElement;
  private _onHome: (() => void) | null = null;
  private prevRemaining = -1;

  constructor() {
    this.container = document.createElement('div');
    this.attemptsContainer = document.createElement('div');
    this.categoryEl = document.createElement('span');
    this.homeBtn = document.createElement('button');
    this.injectStyles();
    this.setupDOM();
  }

  private injectStyles(): void {
    if (document.getElementById('hud-styles')) return;
    const style = document.createElement('style');
    style.id = 'hud-styles';
    style.textContent = `
      @keyframes hudCountFlash {
        0% { transform: scale(1); color: #FFD700; }
        50% { transform: scale(2.0); color: #FF4444; }
        100% { transform: scale(1); color: #FFD700; }
      }
      @keyframes hudBallUsed {
        0% { transform: scale(1); opacity: 1; }
        40% { transform: scale(1.6); opacity: 0.5; }
        100% { transform: scale(1); opacity: 0.25; }
      }
    `;
    document.head.appendChild(style);
  }

  private setupDOM(): void {
    const c = this.container;
    c.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      pointer-events: auto;
      position: relative;
    `;

    // ホームボタン
    this.homeBtn.textContent = '🏠';
    this.homeBtn.style.cssText = `
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.15);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      z-index: 1;
    `;
    this.homeBtn.addEventListener('click', () => this._onHome?.());

    // カテゴリ名（中央配置・ポップなスタイル）
    this.categoryEl.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.2rem, 3.5vw, 1.6rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow:
        0 2px 4px rgba(0,0,0,0.5),
        0 0 10px rgba(255,215,0,0.3),
        2px 2px 0 #FF8C00;
      letter-spacing: 0.1em;
    `;

    // 残り回数コンテナ
    this.attemptsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: rgba(0,0,0,0.4);
      border-radius: 1.5rem;
      padding: 0.4rem 1rem;
    `;

    c.appendChild(this.homeBtn);
    c.appendChild(this.categoryEl);
    c.appendChild(this.attemptsContainer);
  }

  set onHome(cb: (() => void) | null) {
    this._onHome = cb;
  }

  setCategory(name: string): void {
    this.categoryEl.textContent = name;
  }

  setAttempts(remaining: number, max: number): void {
    const wasReduced = this.prevRemaining > 0 && remaining < this.prevRemaining;
    this.attemptsContainer.innerHTML = '';

    // ラベル「のこり」
    const label = document.createElement('span');
    label.textContent = 'のこり';
    label.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.8rem, 2vw, 1rem);
      font-weight: 700;
      color: #fff;
      margin-right: 0.2rem;
    `;
    this.attemptsContainer.appendChild(label);

    // 大きな数字
    const numEl = document.createElement('span');
    numEl.textContent = String(remaining);
    numEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 2px 6px rgba(255,215,0,0.5);
      margin-right: 0.1rem;
      display: inline-block;
    `;
    if (wasReduced) {
      numEl.style.animation = 'hudCountFlash 0.5s ease-out';
    }
    this.attemptsContainer.appendChild(numEl);

    const suffix = document.createElement('span');
    suffix.textContent = 'かい';
    suffix.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(0.8rem, 2vw, 1rem);
      font-weight: 700;
      color: #fff;
      margin-right: 0.5rem;
    `;
    this.attemptsContainer.appendChild(suffix);

    // 🎮 ボール表示
    for (let i = 0; i < max; i++) {
      const ball = document.createElement('span');
      const isActive = i < remaining;
      ball.textContent = '🎮';
      ball.style.cssText = `
        font-size: clamp(1.2rem, 3vw, 1.8rem);
        display: inline-block;
        transition: all 0.3s;
      `;

      if (!isActive) {
        ball.style.opacity = '0.25';
        ball.style.filter = 'grayscale(1)';
        if (wasReduced && i === remaining) {
          ball.style.animation = 'hudBallUsed 0.5s ease-out';
        }
      }

      this.attemptsContainer.appendChild(ball);
    }

    this.prevRemaining = remaining;
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  unmount(): void {
    this.container.remove();
  }
}
