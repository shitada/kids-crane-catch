import type { InputState } from '@/types/index';

const SWIPE_THRESHOLD = 50;

export class InputSystem {
  private state: InputState = { moveDirection: 0, catchPressed: false };
  private container: HTMLElement | null = null;
  private pointerStartX = 0;
  private onPointerDown: ((e: PointerEvent) => void) | null = null;
  private onPointerUp: ((e: PointerEvent) => void) | null = null;

  initialize(container: HTMLElement): void {
    this.container = container;

    this.onPointerDown = (e: PointerEvent) => {
      this.pointerStartX = e.clientX;
    };

    this.onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - this.pointerStartX;
      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        this.state.moveDirection = dx < 0 ? -1 : 1;
      }
    };

    container.addEventListener('pointerdown', this.onPointerDown);
    container.addEventListener('pointerup', this.onPointerUp);
  }

  getState(): InputState {
    return { ...this.state };
  }

  setMoveDirection(direction: -1 | 0 | 1): void {
    this.state.moveDirection = direction;
  }

  setCatchPressed(pressed: boolean): void {
    this.state.catchPressed = pressed;
  }

  reset(): void {
    this.state.moveDirection = 0;
    this.state.catchPressed = false;
  }

  dispose(): void {
    if (this.container) {
      if (this.onPointerDown) this.container.removeEventListener('pointerdown', this.onPointerDown);
      if (this.onPointerUp) this.container.removeEventListener('pointerup', this.onPointerUp);
      this.container = null;
    }
    this.onPointerDown = null;
    this.onPointerUp = null;
  }
}
