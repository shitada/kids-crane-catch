import { describe, it, expect, beforeEach } from 'vitest';
import { SaveManager } from '../src/game/storage/SaveManager';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { for (const k of Object.keys(store)) delete store[k]; },
  get length() { return Object.keys(store).length; },
  key: (i: number) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('SaveManager', () => {
  let saveManager: SaveManager;

  beforeEach(() => {
    localStorageMock.clear();
    saveManager = new SaveManager();
  });

  it('returns default data when no save exists', () => {
    const data = saveManager.load();
    expect(data.collectedVehicles).toEqual([]);
  });

  it('saves and loads collected vehicles', () => {
    saveManager.addCollected('shinkansen');
    saveManager.addCollected('airplane');
    const data = saveManager.load();
    expect(data.collectedVehicles).toContain('shinkansen');
    expect(data.collectedVehicles).toContain('airplane');
    expect(data.collectedVehicles).toHaveLength(2);
  });

  it('does not duplicate collected vehicles', () => {
    saveManager.addCollected('bus');
    saveManager.addCollected('bus');
    const data = saveManager.load();
    expect(data.collectedVehicles).toHaveLength(1);
  });

  it('isCollected returns correct status', () => {
    expect(saveManager.isCollected('rocket')).toBe(false);
    saveManager.addCollected('rocket');
    expect(saveManager.isCollected('rocket')).toBe(true);
  });

  it('handles corrupted data gracefully', () => {
    localStorageMock.setItem('kids-crane-catch2-save', 'invalid json');
    const data = saveManager.load();
    expect(data.collectedVehicles).toEqual([]);
  });

  it('handles invalid structure gracefully', () => {
    localStorageMock.setItem('kids-crane-catch2-save', JSON.stringify({ collectedVehicles: 'not an array' }));
    const data = saveManager.load();
    expect(data.collectedVehicles).toEqual([]);
  });

  it('clear() removes save data', () => {
    saveManager.addCollected('ship');
    saveManager.clear();
    const data = saveManager.load();
    expect(data.collectedVehicles).toEqual([]);
  });
});
