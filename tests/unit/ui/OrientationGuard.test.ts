import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OrientationGuard } from '@/ui/OrientationGuard';

describe('OrientationGuard', () => {
  let guard: OrientationGuard;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    guard?.dispose();
    document.body.removeChild(container);
  });

  describe('landscape mode', () => {
    it('should not show overlay in landscape', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('landscape'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      guard = new OrientationGuard(container);
      expect(guard.isBlocking()).toBe(false);
    });
  });

  describe('portrait mode', () => {
    it('should show rotation prompt in portrait', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('portrait'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      guard = new OrientationGuard(container);
      guard.check();
      expect(guard.isBlocking()).toBe(true);
    });

    it('should display hiragana message', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('portrait'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      guard = new OrientationGuard(container);
      guard.check();
      const overlay = container.querySelector('.orientation-overlay');
      expect(overlay).not.toBeNull();
      expect(overlay!.textContent).toContain('よこむき');
    });
  });

  describe('dispose', () => {
    it('should clean up event listeners', () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('landscape'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      guard = new OrientationGuard(container);
      expect(() => guard.dispose()).not.toThrow();
    });
  });
});
