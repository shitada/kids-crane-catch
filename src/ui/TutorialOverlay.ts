export class TutorialOverlay {
  private container: HTMLElement;
  private overlay: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  show(message: string): void {
    this.hide();

    this.overlay = document.createElement('div');
    this.overlay.className = 'tutorial-overlay';
    this.overlay.style.cssText = `
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.8); color: #fff; border-radius: 16px;
      padding: 16px 28px; font-size: 22px; font-weight: bold; z-index: 300;
      text-align: center; font-family: sans-serif; white-space: nowrap;
      animation: tutorialPulse 1.5s ease-in-out infinite;
    `;
    this.overlay.textContent = message;

    // Finger animation
    const finger = document.createElement('div');
    finger.style.cssText = `
      font-size: 36px; margin-top: 8px;
      animation: tutorialBounce 1s ease-in-out infinite;
    `;
    finger.textContent = '👆';
    this.overlay.appendChild(finger);

    // Add CSS animations
    if (!document.getElementById('tutorial-styles')) {
      const style = document.createElement('style');
      style.id = 'tutorial-styles';
      style.textContent = `
        @keyframes tutorialPulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
        }
        @keyframes tutorialBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `;
      document.head.appendChild(style);
    }

    this.container.appendChild(this.overlay);
  }

  hide(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  dispose(): void {
    this.hide();
  }
}
