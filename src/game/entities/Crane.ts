import type { CraneState, CraneConfig, ItemDefinition, MoveDirection } from '@/types/index';

export class Crane {
  private state: CraneState = 'IDLE';
  private positionX = 0;
  private positionZ = 0;
  private heldItem: ItemDefinition | null = null;
  private moveDir: MoveDirection = { x: 0, z: 0 };

  constructor(private config: CraneConfig) {}

  getState(): CraneState {
    return this.state;
  }

  getPositionX(): number {
    return this.positionX;
  }

  getPositionZ(): number {
    return this.positionZ;
  }

  getHeldItem(): ItemDefinition | null {
    return this.heldItem;
  }

  move(direction: MoveDirection): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.moveDir = { ...direction };
    this.state = direction.x === 0 && direction.z === 0 ? 'IDLE' : 'MOVING';
  }

  startDrop(): void {
    if (this.state !== 'IDLE' && this.state !== 'MOVING') return;
    this.moveDir = { x: 0, z: 0 };
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
    if (this.state === 'MOVING') {
      if (this.moveDir.x !== 0) {
        this.positionX += this.moveDir.x * this.config.moveSpeed * deltaTime;
        this.positionX = Math.max(this.config.minX, Math.min(this.config.maxX, this.positionX));
      }
      if (this.moveDir.z !== 0) {
        this.positionZ += this.moveDir.z * this.config.moveSpeed * deltaTime;
        this.positionZ = Math.max(this.config.minZ, Math.min(this.config.maxZ, this.positionZ));
      }
    }
  }
}
