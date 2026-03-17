import type { CraneState, CraneConfig, ItemDefinition } from '@/types/index';

export class Crane {
  private state: CraneState = 'IDLE';
  private positionX = 0;
  private heldItem: ItemDefinition | null = null;
  private moveDirection: -1 | 0 | 1 = 0;

  constructor(private config: CraneConfig) {}

  getState(): CraneState {
    return this.state;
  }

  getPositionX(): number {
    return this.positionX;
  }

  getHeldItem(): ItemDefinition | null {
    return this.heldItem;
  }

  move(direction: -1 | 0 | 1): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.moveDirection = direction;
    this.state = direction === 0 ? 'IDLE' : 'MOVING';
  }

  startDrop(): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.moveDirection = 0;
    this.state = 'DROPPING';
  }

  setReachedBottom(): void {
    if (this.state !== 'DROPPING') return;
    this.state = 'GRABBING';
  }

  completGrab(item: ItemDefinition | null): void {
    if (this.state !== 'GRABBING') return;
    this.heldItem = item;
    this.state = 'LIFTING';
  }

  setReachedTop(): void {
    if (this.state !== 'LIFTING') return;
    this.state = 'RETURNING';
  }

  completeReturn(): void {
    if (this.state !== 'RETURNING') return;
    this.heldItem = null;
    this.state = 'IDLE';
  }

  update(deltaTime: number): void {
    if (this.state === 'MOVING' && this.moveDirection !== 0) {
      this.positionX += this.moveDirection * this.config.moveSpeed * deltaTime;
      this.positionX = Math.max(this.config.minX, Math.min(this.config.maxX, this.positionX));
    }
  }
}
