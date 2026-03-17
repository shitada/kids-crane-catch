import type { InputState, MoveDirection } from '@/types/index';

const SWIPE_THRESHOLD = 50;

export class InputSystem {
  private state: InputState = { moveDirection: { x: 0, z: 0 }, catchPressed: false };
  private container: HTMLElement | null = null;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private onPointerDown: ((e: PointerEvent) => void) | null = null;
  private onPointerUp: ((e: PointerEvent) => void) | null = null;

  initialize(container: HTMLElement): void {
    this.container = container;

    this.onPointerDown = (e: PointerEvent) => {
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
    };

    this.onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;
      if (Math.abs(dx) >= SWIPE_THRESHOLD || Math.abs(dy) >= SWIPE_THRESHOLD) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.state.moveDirection = { x: dx < 0 ? -1 : 1, z: 0 };
        } else {
          this.state.moveDirection = { x: 0, z: dy < 0 ? -1 : 1 };
        }
      }
    };

    container.addEventListener('pointerdown', this.onPointerDown);
    container.addEventListener('pointerup', this.onPointerUp);
  }

  getState(): InputState {
    return { moveDirection: { ...this.state.moveDirection }, catchPressed: this.state.catchPressed };
  }

  setMoveDirection(direction: MoveDirection): void {
    this.state.moveDirection = { ...direction };
  }

  setCatchPressed(pressed: boolean): void {
    this.state.catchPressed = pressed;
  }

  reset(): void {
    this.state.moveDirection = { x: 0, z: 0 };
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
