import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InputSystem } from '@/game/systems/InputSystem';

describe('InputSystem', () => {
  let input: InputSystem;
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    input = new InputSystem();
    input.initialize(container);
  });

  afterEach(() => {
    input.dispose();
    document.body.removeChild(container);
  });

  describe('initial state', () => {
    it('should have neutral move direction', () => {
      const dir = input.getState().moveDirection;
      expect(dir.x).toBe(0);
      expect(dir.z).toBe(0);
    });

    it('should have catchPressed as false', () => {
      expect(input.getState().catchPressed).toBe(false);
    });
  });

  describe('moveDirection', () => {
    it('should set moveDirection to left', () => {
      input.setMoveDirection({ x: -1, z: 0 });
      expect(input.getState().moveDirection).toEqual({ x: -1, z: 0 });
    });

    it('should set moveDirection to right', () => {
      input.setMoveDirection({ x: 1, z: 0 });
      expect(input.getState().moveDirection).toEqual({ x: 1, z: 0 });
    });

    it('should set moveDirection to forward', () => {
      input.setMoveDirection({ x: 0, z: -1 });
      expect(input.getState().moveDirection).toEqual({ x: 0, z: -1 });
    });

    it('should reset moveDirection to neutral', () => {
      input.setMoveDirection({ x: 1, z: 0 });
      input.setMoveDirection({ x: 0, z: 0 });
      expect(input.getState().moveDirection).toEqual({ x: 0, z: 0 });
    });
  });

  describe('catchPressed', () => {
    it('should set catchPressed to true', () => {
      input.setCatchPressed(true);
      expect(input.getState().catchPressed).toBe(true);
    });

    it('should reset catchPressed', () => {
      input.setCatchPressed(true);
      input.setCatchPressed(false);
      expect(input.getState().catchPressed).toBe(false);
    });
  });

  describe('swipe detection', () => {
    it('should detect left swipe', () => {
      const start = new PointerEvent('pointerdown', { clientX: 200, clientY: 100 });
      const end = new PointerEvent('pointerup', { clientX: 100, clientY: 100 });
      container.dispatchEvent(start);
      container.dispatchEvent(end);
      expect(input.getState().moveDirection).toEqual({ x: -1, z: 0 });
    });

    it('should detect right swipe', () => {
      const start = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 });
      const end = new PointerEvent('pointerup', { clientX: 200, clientY: 100 });
      container.dispatchEvent(start);
      container.dispatchEvent(end);
      expect(input.getState().moveDirection).toEqual({ x: 1, z: 0 });
    });

    it('should detect up swipe', () => {
      const start = new PointerEvent('pointerdown', { clientX: 100, clientY: 200 });
      const end = new PointerEvent('pointerup', { clientX: 100, clientY: 100 });
      container.dispatchEvent(start);
      container.dispatchEvent(end);
      expect(input.getState().moveDirection).toEqual({ x: 0, z: -1 });
    });
  });

  describe('reset', () => {
    it('should reset all input state', () => {
      input.setMoveDirection({ x: 1, z: 0 });
      input.setCatchPressed(true);
      input.reset();
      const state = input.getState();
      expect(state.moveDirection).toEqual({ x: 0, z: 0 });
      expect(state.catchPressed).toBe(false);
    });
  });

  describe('dispose', () => {
    it('should not throw when disposed', () => {
      expect(() => input.dispose()).not.toThrow();
    });
  });
});
