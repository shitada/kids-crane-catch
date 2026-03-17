import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '@/game/storage/SaveManager';
import type { SaveData } from '@/types/index';

describe('SaveManager', () => {
  let manager: SaveManager;

  beforeEach(() => {
    localStorage.clear();
    manager = new SaveManager();
  });

  describe('load', () => {
    it('should return default save data when no data exists', () => {
      const data = manager.load();
      expect(data.version).toBe(1);
      expect(data.tutorialCompleted).toBe(false);
      expect(Object.keys(data.collection)).toHaveLength(0);
      expect(data.settings.bgmEnabled).toBe(true);
      expect(data.settings.sfxEnabled).toBe(true);
    });

    it('should load existing save data', () => {
      const saveData: SaveData = {
        version: 1,
        collection: { lion: { capturedAt: '2026-01-01T00:00:00.000Z' } },
        tutorialCompleted: true,
        settings: { bgmEnabled: false, sfxEnabled: true },
      };
      localStorage.setItem('kids-crane-catch', JSON.stringify(saveData));
      const fresh = new SaveManager();
      const data = fresh.load();
      expect(data.tutorialCompleted).toBe(true);
      expect(data.collection['lion']).toBeDefined();
    });
  });

  describe('save', () => {
    it('should save data to localStorage', () => {
      const data = manager.load();
      const result = manager.save(data);
      expect(result).toBe(true);
      const stored = localStorage.getItem('kids-crane-catch');
      expect(stored).not.toBeNull();
    });

    it('should return false when localStorage is unavailable', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const data = manager.load();
      const result = manager.save(data);
      expect(result).toBe(false);
      vi.restoreAllMocks();
    });
  });

  describe('collection', () => {
    it('should add item to collection', () => {
      manager.addToCollection('lion');
      expect(manager.isCollected('lion')).toBe(true);
    });

    it('should not duplicate collected items', () => {
      manager.addToCollection('lion');
      manager.addToCollection('lion');
      const collection = manager.getCollection();
      expect(collection.size).toBe(1);
    });

    it('should return false for uncollected items', () => {
      expect(manager.isCollected('lion')).toBe(false);
    });

    it('should persist collection across loads', () => {
      manager.addToCollection('lion');
      const manager2 = new SaveManager();
      expect(manager2.isCollected('lion')).toBe(true);
    });
  });

  describe('tutorial', () => {
    it('should return false initially', () => {
      expect(manager.isTutorialCompleted()).toBe(false);
    });

    it('should set tutorial as completed', () => {
      manager.setTutorialCompleted();
      expect(manager.isTutorialCompleted()).toBe(true);
    });

    it('should persist tutorial state', () => {
      manager.setTutorialCompleted();
      const manager2 = new SaveManager();
      expect(manager2.isTutorialCompleted()).toBe(true);
    });
  });

  describe('settings', () => {
    it('should return default settings', () => {
      const settings = manager.getSettings();
      expect(settings.bgmEnabled).toBe(true);
      expect(settings.sfxEnabled).toBe(true);
    });

    it('should update settings partially', () => {
      manager.updateSettings({ bgmEnabled: false });
      const settings = manager.getSettings();
      expect(settings.bgmEnabled).toBe(false);
      expect(settings.sfxEnabled).toBe(true);
    });

    it('should persist settings', () => {
      manager.updateSettings({ sfxEnabled: false });
      const manager2 = new SaveManager();
      expect(manager2.getSettings().sfxEnabled).toBe(false);
    });
  });
});
