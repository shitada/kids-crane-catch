import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TutorialOverlay } from '@/ui/TutorialOverlay';

describe('TutorialOverlay', () => {
  let overlay: TutorialOverlay;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    overlay = new TutorialOverlay(container);
  });

  afterEach(() => {
    overlay.dispose();
    document.body.removeChild(container);
  });

  it('should show guide text', () => {
    overlay.show('くれーんを みぎに うごかしてみよう！');
    const el = container.querySelector('.tutorial-overlay');
    expect(el).not.toBeNull();
    expect(el!.textContent).toContain('みぎ');
  });

  it('should hide overlay', () => {
    overlay.show('test');
    overlay.hide();
    const el = container.querySelector('.tutorial-overlay');
    expect(el).toBeNull();
  });

  it('should update text', () => {
    overlay.show('step 1');
    overlay.show('ぼたんを おしてみよう！');
    const el = container.querySelector('.tutorial-overlay');
    expect(el!.textContent).toContain('ぼたん');
  });

  it('should dispose cleanly', () => {
    overlay.show('test');
    expect(() => overlay.dispose()).not.toThrow();
    expect(container.querySelector('.tutorial-overlay')).toBeNull();
  });
});
