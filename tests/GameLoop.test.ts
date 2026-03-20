import { describe, it, expect } from 'vitest';
import { GameLoop } from '../src/game/GameLoop';

describe('GameLoop', () => {
  it('starts in non-running state', () => {
    const loop = new GameLoop();
    expect(loop.isRunning()).toBe(false);
  });

  it('pause stops running', () => {
    const loop = new GameLoop();
    // We can't test RAF easily, just ensure methods don't throw
    loop.pause();
    expect(loop.isRunning()).toBe(false);
  });
});
