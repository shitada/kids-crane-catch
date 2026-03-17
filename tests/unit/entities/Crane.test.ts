import { describe, it, expect, beforeEach } from 'vitest';
import { Crane } from '@/game/entities/Crane';
import type { CraneConfig } from '@/types/index';

const config: CraneConfig = {
  moveSpeed: 3.0,
  dropSpeed: 2.5,
  liftSpeed: 2.0,
  minX: -3.0,
  maxX: 3.0,
  minZ: -1.5,
  maxZ: 1.5,
  grabRadius: 0.8,
  baseCatchRate: 0.7,
};

describe('Crane', () => {
  let crane: Crane;

  beforeEach(() => {
    crane = new Crane(config);
  });

  describe('initial state', () => {
    it('should start in IDLE state', () => {
      expect(crane.getState()).toBe('IDLE');
    });

    it('should start at position 0', () => {
      expect(crane.getPositionX()).toBe(0);
    });

    it('should have no held item', () => {
      expect(crane.getHeldItem()).toBeNull();
    });
  });

  describe('state transitions', () => {
    it('IDLE → MOVING on move input', () => {
      crane.move({ x: 1, z: 0 });
      expect(crane.getState()).toBe('MOVING');
    });

    it('MOVING → IDLE on move release', () => {
      crane.move({ x: 1, z: 0 });
      crane.move({ x: 0, z: 0 });
      expect(crane.getState()).toBe('IDLE');
    });

    it('IDLE → DROPPING on catch press', () => {
      crane.startDrop();
      expect(crane.getState()).toBe('DROPPING');
    });

    it('MOVING → DROPPING on catch press', () => {
      crane.move({ x: 1, z: 0 });
      crane.startDrop();
      expect(crane.getState()).toBe('DROPPING');
    });

    it('DROPPING → GRABBING on reaching bottom', () => {
      crane.startDrop();
      crane.setReachedBottom();
      expect(crane.getState()).toBe('GRABBING');
    });

    it('GRABBING → LIFTING on grab complete', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(null);
      expect(crane.getState()).toBe('LIFTING');
    });

    it('LIFTING → RETURNING on reaching top', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(null);
      crane.setReachedTop();
      expect(crane.getState()).toBe('RETURNING');
    });

    it('RETURNING → IDLE on return complete', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(null);
      crane.setReachedTop();
      crane.completeReturn();
      expect(crane.getState()).toBe('IDLE');
    });
  });

  describe('movement', () => {
    it('should move right with positive direction', () => {
      crane.move({ x: 1, z: 0 });
      crane.update(1.0);
      expect(crane.getPositionX()).toBeGreaterThan(0);
    });

    it('should move left with negative direction', () => {
      crane.move({ x: -1, z: 0 });
      crane.update(1.0);
      expect(crane.getPositionX()).toBeLessThan(0);
    });

    it('should not exceed maxX boundary', () => {
      crane.move({ x: 1, z: 0 });
      crane.update(10.0);
      expect(crane.getPositionX()).toBeLessThanOrEqual(config.maxX);
    });

    it('should not exceed minX boundary', () => {
      crane.move({ x: -1, z: 0 });
      crane.update(10.0);
      expect(crane.getPositionX()).toBeGreaterThanOrEqual(config.minX);
    });

    it('should move forward with negative Z direction', () => {
      crane.move({ x: 0, z: -1 });
      crane.update(1.0);
      expect(crane.getPositionZ()).toBeLessThan(0);
    });

    it('should not exceed maxZ boundary', () => {
      crane.move({ x: 0, z: 1 });
      crane.update(10.0);
      expect(crane.getPositionZ()).toBeLessThanOrEqual(config.maxZ);
    });
  });

  describe('rapid press prevention', () => {
    it('should ignore drop during DROPPING state', () => {
      crane.startDrop();
      expect(crane.getState()).toBe('DROPPING');
      crane.startDrop();
      expect(crane.getState()).toBe('DROPPING');
    });

    it('should ignore drop during GRABBING state', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.startDrop();
      expect(crane.getState()).toBe('GRABBING');
    });

    it('should ignore drop during LIFTING state', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(null);
      crane.startDrop();
      expect(crane.getState()).toBe('LIFTING');
    });

    it('should ignore drop during RETURNING state', () => {
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(null);
      crane.setReachedTop();
      crane.startDrop();
      expect(crane.getState()).toBe('RETURNING');
    });
  });

  describe('held item', () => {
    it('should hold item after successful grab', () => {
      const mockItem = { id: 'lion' } as any;
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(mockItem);
      expect(crane.getHeldItem()).toBe(mockItem);
    });

    it('should clear held item on return complete', () => {
      const mockItem = { id: 'lion' } as any;
      crane.startDrop();
      crane.setReachedBottom();
      crane.completGrab(mockItem);
      crane.setReachedTop();
      crane.completeReturn();
      expect(crane.getHeldItem()).toBeNull();
    });
  });
});
