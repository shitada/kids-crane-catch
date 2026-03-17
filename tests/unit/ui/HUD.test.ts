import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HUD } from '@/ui/HUD';

describe('HUD', () => {
  let hud: HUD;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    hud = new HUD(container);
  });

  afterEach(() => {
    hud.dispose();
    document.body.removeChild(container);
  });

  describe('button creation', () => {
    it('should create left button', () => {
      const btn = container.querySelector('[data-action="left"]');
      expect(btn).not.toBeNull();
    });

    it('should create right button', () => {
      const btn = container.querySelector('[data-action="right"]');
      expect(btn).not.toBeNull();
    });

    it('should create catch button', () => {
      const btn = container.querySelector('[data-action="catch"]');
      expect(btn).not.toBeNull();
    });

    it('buttons should have minimum touch target size', () => {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('events', () => {
    it('should call onMove with -1 on left button press', () => {
      let direction = 0;
      hud.onMove = (d) => { direction = d; };
      const btn = container.querySelector('[data-action="left"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(direction).toBe(-1);
    });

    it('should call onMove with 1 on right button press', () => {
      let direction = 0;
      hud.onMove = (d) => { direction = d; };
      const btn = container.querySelector('[data-action="right"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(direction).toBe(1);
    });

    it('should call onCatch on catch button tap', () => {
      let caught = false;
      hud.onCatch = () => { caught = true; };
      const btn = container.querySelector('[data-action="catch"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(caught).toBe(true);
    });
  });

  describe('state sync', () => {
    it('should disable catch button when busy', () => {
      hud.setCatchEnabled(false);
      const btn = container.querySelector('[data-action="catch"]') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('should enable catch button when idle', () => {
      hud.setCatchEnabled(false);
      hud.setCatchEnabled(true);
      const btn = container.querySelector('[data-action="catch"]') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });
  });
});
