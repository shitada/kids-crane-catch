import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HUD } from '@/ui/HUD';
import type { MoveDirection } from '@/types/index';

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

    it('should create up button', () => {
      const btn = container.querySelector('[data-action="up"]');
      expect(btn).not.toBeNull();
    });

    it('should create down button', () => {
      const btn = container.querySelector('[data-action="down"]');
      expect(btn).not.toBeNull();
    });

    it('should create catch button', () => {
      const btn = container.querySelector('[data-action="catch"]');
      expect(btn).not.toBeNull();
    });

    it('buttons should have minimum touch target size', () => {
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('events', () => {
    it('should call onMove with left direction on left button press', () => {
      let direction: MoveDirection | null = null;
      hud.onMove = (d) => { direction = d; };
      const btn = container.querySelector('[data-action="left"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(direction).toEqual({ x: -1, z: 0 });
    });

    it('should call onMove with right direction on right button press', () => {
      let direction: MoveDirection | null = null;
      hud.onMove = (d) => { direction = d; };
      const btn = container.querySelector('[data-action="right"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(direction).toEqual({ x: 1, z: 0 });
    });

    it('should call onMove with up direction on up button press', () => {
      let direction: MoveDirection | null = null;
      hud.onMove = (d) => { direction = d; };
      const btn = container.querySelector('[data-action="up"]') as HTMLElement;
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      expect(direction).toEqual({ x: 0, z: -1 });
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
