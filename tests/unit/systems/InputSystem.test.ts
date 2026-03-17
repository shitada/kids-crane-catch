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
      expect(input.getState().moveDirection).toBe(0);
    });

    it('should have catchPressed as false', () => {
      expect(input.getState().catchPressed).toBe(false);
    });
  });

  describe('moveDirection', () => {
    it('should set moveDirection to -1 when left button pressed', () => {
      input.setMoveDirection(-1);
      expect(input.getState().moveDirection).toBe(-1);
    });

    it('should set moveDirection to 1 when right button pressed', () => {
      input.setMoveDirection(1);
      expect(input.getState().moveDirection).toBe(1);
    });

    it('should reset moveDirection to 0', () => {
      input.setMoveDirection(1);
      input.setMoveDirection(0);
      expect(input.getState().moveDirection).toBe(0);
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
      expect(input.getState().moveDirection).toBe(-1);
    });

    it('should detect right swipe', () => {
      const start = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 });
      const end = new PointerEvent('pointerup', { clientX: 200, clientY: 100 });
      container.dispatchEvent(start);
      container.dispatchEvent(end);
      expect(input.getState().moveDirection).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset all input state', () => {
      input.setMoveDirection(1);
      input.setCatchPressed(true);
      input.reset();
      const state = input.getState();
      expect(state.moveDirection).toBe(0);
      expect(state.catchPressed).toBe(false);
    });
  });

  describe('dispose', () => {
    it('should not throw when disposed', () => {
      expect(() => input.dispose()).not.toThrow();
    });
  });
});
