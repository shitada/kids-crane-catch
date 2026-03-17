import type { CraneConfig } from '@/types/index';

export class PhysicsSystem {
  constructor(private config: CraneConfig) {}

  moveX(currentX: number, direction: number, deltaTime: number): number {
    const newX = currentX + direction * this.config.moveSpeed * deltaTime;
    return Math.max(this.config.minX, Math.min(this.config.maxX, newX));
  }

  moveZ(currentZ: number, direction: number, deltaTime: number): number {
    const newZ = currentZ + direction * this.config.moveSpeed * deltaTime;
    return Math.max(this.config.minZ, Math.min(this.config.maxZ, newZ));
  }

  drop(currentY: number, deltaTime: number): number {
    return currentY - this.config.dropSpeed * deltaTime;
  }

  lift(currentY: number, deltaTime: number): number {
    return currentY + this.config.liftSpeed * deltaTime;
  }
}
