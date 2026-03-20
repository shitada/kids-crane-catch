import { GAME_SETTINGS } from '../config/GameSettings';
import type { CraneArm } from '../entities/CraneArm';
import type { JoystickInput } from '../../types';

/**
 * クレーンの移動ロジックを管理
 */
export class CraneController {
  private craneArm: CraneArm;

  constructor(craneArm: CraneArm) {
    this.craneArm = craneArm;
  }

  /** ジョイスティック入力を適用 */
  applyInput(input: JoystickInput, deltaTime: number): void {
    if (!this.craneArm.isIdle() && this.craneArm.state !== 'MOVING') return;

    const speed = GAME_SETTINGS.craneSpeed * deltaTime;
    const dx = input.x * speed;
    const dz = input.z * speed;

    if (Math.abs(dx) > 0.001 || Math.abs(dz) > 0.001) {
      this.craneArm.move(dx, dz);
    } else {
      this.craneArm.stopMoving();
    }
  }

  /** 降下を開始 */
  triggerDrop(): void {
    this.craneArm.startDescent();
  }

  /** クレーンが操作可能かどうか */
  canOperate(): boolean {
    return this.craneArm.isIdle() || this.craneArm.state === 'MOVING';
  }
}
