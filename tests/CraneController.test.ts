import { describe, it, expect, beforeEach } from 'vitest';
import { CraneArm } from '../src/game/entities/CraneArm';
import { CraneController } from '../src/game/systems/CraneController';
import { GAME_SETTINGS } from '../src/game/config/GameSettings';

describe('CraneController', () => {
  let arm: CraneArm;
  let controller: CraneController;

  beforeEach(() => {
    arm = new CraneArm();
    controller = new CraneController(arm);
  });

  it('moves crane arm with joystick input', () => {
    controller.applyInput({ x: 1, z: 0 }, 0.1);
    expect(arm.position.x).toBeGreaterThan(0);
  });

  it('does not exceed machine boundaries', () => {
    const hw = GAME_SETTINGS.machineHalfWidth - 0.5;
    for (let i = 0; i < 100; i++) {
      controller.applyInput({ x: 1, z: 0 }, 0.1);
    }
    expect(arm.position.x).toBeLessThanOrEqual(hw);
  });

  it('canOperate returns true when idle', () => {
    expect(controller.canOperate()).toBe(true);
  });

  it('canOperate returns false during descent', () => {
    arm.startDescent();
    expect(controller.canOperate()).toBe(false);
  });

  it('triggerDrop starts descent', () => {
    controller.triggerDrop();
    expect(arm.state).toBe('DESCENDING');
  });
});
