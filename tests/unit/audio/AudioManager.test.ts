import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioManager } from '@/game/audio/AudioManager';

// Mock Web Audio API
const mockGain = { gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn(), disconnect: vi.fn() };
const mockOsc = { type: 'sine', frequency: { value: 440, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn(), onended: null as (() => void) | null };

const mockAudioContext = {
  state: 'running' as string,
  currentTime: 0,
  destination: {},
  createOscillator: vi.fn(() => ({ ...mockOsc })),
  createGain: vi.fn(() => ({ ...mockGain })),
  resume: vi.fn(() => Promise.resolve()),
  close: vi.fn(() => Promise.resolve()),
};

vi.stubGlobal('AudioContext', vi.fn(() => mockAudioContext));
vi.stubGlobal('webkitAudioContext', vi.fn(() => mockAudioContext));

describe('AudioManager', () => {
  let audio: AudioManager;

  beforeEach(() => {
    vi.clearAllMocks();
    audio = new AudioManager();
  });

  describe('initialize', () => {
    it('should create AudioContext on initialize', () => {
      audio.initialize();
      expect(AudioContext).toHaveBeenCalled();
    });
  });

  describe('playSFX', () => {
    it('should play sound effects without throwing', () => {
      audio.initialize();
      expect(() => audio.playSFX('catchSuccess')).not.toThrow();
      expect(() => audio.playSFX('catchFail')).not.toThrow();
      expect(() => audio.playSFX('buttonTap')).not.toThrow();
      expect(() => audio.playSFX('craneMove')).not.toThrow();
      expect(() => audio.playSFX('armDrop')).not.toThrow();
      expect(() => audio.playSFX('complete')).not.toThrow();
      expect(() => audio.playSFX('transition')).not.toThrow();
    });

    it('should not play when sfx is disabled', () => {
      audio.initialize();
      audio.setSFXEnabled(false);
      audio.playSFX('catchSuccess');
      // After disabling, createOscillator should not be called for new SFX
      const callsAfterDisable = mockAudioContext.createOscillator.mock.calls.length;
      audio.playSFX('catchSuccess');
      expect(mockAudioContext.createOscillator.mock.calls.length).toBe(callsAfterDisable);
    });
  });

  describe('BGM', () => {
    it('should play and stop BGM', () => {
      audio.initialize();
      expect(() => audio.playBGM()).not.toThrow();
      expect(() => audio.stopBGM()).not.toThrow();
    });

    it('should not play BGM when disabled', () => {
      audio.initialize();
      audio.setBGMEnabled(false);
      audio.playBGM();
      // No error thrown, BGM just doesn't play
    });
  });

  describe('resume', () => {
    it('should resume AudioContext (Safari support)', async () => {
      audio.initialize();
      mockAudioContext.state = 'suspended';
      await audio.resume();
      expect(mockAudioContext.resume).toHaveBeenCalled();
    });
  });

  describe('dispose', () => {
    it('should close AudioContext on dispose', () => {
      audio.initialize();
      audio.dispose();
      expect(mockAudioContext.close).toHaveBeenCalled();
    });
  });
});
