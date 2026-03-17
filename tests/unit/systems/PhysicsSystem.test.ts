import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsSystem } from '@/game/systems/PhysicsSystem';
import type { CraneConfig } from '@/types/index';

const config: CraneConfig = {
  moveSpeed: 3.0,
  dropSpeed: 2.5,
  liftSpeed: 2.0,
  minX: -3.0,
  maxX: 3.0,
  grabRadius: 0.8,
  baseCatchRate: 0.7,
};

describe('PhysicsSystem', () => {
  let physics: PhysicsSystem;

  beforeEach(() => {
    physics = new PhysicsSystem(config);
  });

  describe('moveHorizontal', () => {
    it('should move position by speed * deltaTime * direction', () => {
      const pos = physics.moveHorizontal(0, 1, 0.5);
      expect(pos).toBeCloseTo(1.5);
    });

    it('should clamp to maxX', () => {
      const pos = physics.moveHorizontal(2.5, 1, 1.0);
      expect(pos).toBeLessThanOrEqual(config.maxX);
    });

    it('should clamp to minX', () => {
      const pos = physics.moveHorizontal(-2.5, -1, 1.0);
      expect(pos).toBeGreaterThanOrEqual(config.minX);
    });
  });

  describe('drop', () => {
    it('should move arm down by dropSpeed * deltaTime', () => {
      const y = physics.drop(5, 0.5);
      expect(y).toBeCloseTo(5 - config.dropSpeed * 0.5);
    });
  });

  describe('lift', () => {
    it('should move arm up by liftSpeed * deltaTime', () => {
      const y = physics.lift(0, 0.5);
      expect(y).toBeCloseTo(0 + config.liftSpeed * 0.5);
    });
  });
});
