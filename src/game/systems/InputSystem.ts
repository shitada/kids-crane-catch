import type { JoystickInput } from '../../types';

/**
 * ジョイスティック + ボタン入力のまとめ管理
 */
export class InputSystem {
  joystick: JoystickInput = { x: 0, z: 0 };
  dropPressed = false;

  private onDropCallback: (() => void) | null = null;

  setDropCallback(cb: () => void): void {
    this.onDropCallback = cb;
  }

  /** ジョイスティック入力更新 */
  updateJoystick(x: number, z: number): void {
    this.joystick.x = x;
    this.joystick.z = z;
  }

  /** ドロップボタン押下 */
  triggerDrop(): void {
    this.dropPressed = true;
    this.onDropCallback?.();
  }

  /** フレーム末に呼ぶ */
  resetFrame(): void {
    this.dropPressed = false;
  }
}
