import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TutorialSystem } from '@/game/systems/TutorialSystem';
import { SaveManager } from '@/game/storage/SaveManager';

describe('TutorialSystem', () => {
  let tutorial: TutorialSystem;
  let saveManager: SaveManager;

  beforeEach(() => {
    localStorage.clear();
    saveManager = new SaveManager();
    tutorial = new TutorialSystem(saveManager);
  });

  describe('step progression', () => {
    it('should start at step 0', () => {
      expect(tutorial.getCurrentStep()).toBe(0);
    });

    it('should advance to next step', () => {
      tutorial.completeStep();
      expect(tutorial.getCurrentStep()).toBe(1);
    });

    it('should have multiple tutorial steps', () => {
      expect(tutorial.getTotalSteps()).toBeGreaterThan(1);
    });
  });

  describe('completion', () => {
    it('should not be complete initially', () => {
      expect(tutorial.isComplete()).toBe(false);
    });

    it('should be complete after all steps', () => {
      const total = tutorial.getTotalSteps();
      for (let i = 0; i < total; i++) {
        tutorial.completeStep();
      }
      expect(tutorial.isComplete()).toBe(true);
    });

    it('should save completion to SaveManager', () => {
      const total = tutorial.getTotalSteps();
      for (let i = 0; i < total; i++) {
        tutorial.completeStep();
      }
      expect(saveManager.isTutorialCompleted()).toBe(true);
    });
  });

  describe('skip condition', () => {
    it('should skip if tutorial already completed', () => {
      saveManager.setTutorialCompleted();
      const fresh = new TutorialSystem(saveManager);
      expect(fresh.shouldSkip()).toBe(true);
    });

    it('should not skip if tutorial not completed', () => {
      expect(tutorial.shouldSkip()).toBe(false);
    });
  });

  describe('step messages', () => {
    it('should provide instruction text for current step', () => {
      const msg = tutorial.getCurrentMessage();
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});
