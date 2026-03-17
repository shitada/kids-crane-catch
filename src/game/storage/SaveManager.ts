import type { SaveData, GameSettings, CollectionEntry } from '@/types/index';

const STORAGE_KEY = 'kids-crane-catch';

function createDefaultSaveData(): SaveData {
  return {
    version: 1,
    collection: {},
    tutorialCompleted: false,
    settings: { bgmEnabled: true, sfxEnabled: true },
  };
}

export class SaveManager {
  private data: SaveData;
  private storageAvailable: boolean;

  constructor() {
    this.storageAvailable = this.checkStorageAvailable();
    this.data = this.loadFromStorage();
  }

  load(): SaveData {
    return this.data;
  }

  save(data: SaveData): boolean {
    this.data = data;
    return this.persist();
  }

  addToCollection(itemId: string): void {
    if (!this.data.collection[itemId]) {
      this.data.collection[itemId] = { capturedAt: new Date().toISOString() };
      this.persist();
    }
  }

  isCollected(itemId: string): boolean {
    return itemId in this.data.collection;
  }

  getCollection(): ReadonlyMap<string, CollectionEntry> {
    const map = new Map<string, CollectionEntry>();
    for (const [id, entry] of Object.entries(this.data.collection)) {
      map.set(id, { itemId: id, capturedAt: entry.capturedAt });
    }
    return map;
  }

  isTutorialCompleted(): boolean {
    return this.data.tutorialCompleted;
  }

  setTutorialCompleted(): void {
    this.data.tutorialCompleted = true;
    this.persist();
  }

  getSettings(): GameSettings {
    return { ...this.data.settings };
  }

  updateSettings(settings: Partial<GameSettings>): void {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
  }

  private loadFromStorage(): SaveData {
    if (!this.storageAvailable) {
      return createDefaultSaveData();
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultSaveData();
      const parsed = JSON.parse(raw) as SaveData;
      if (parsed.version === 1) return parsed;
      return createDefaultSaveData();
    } catch {
      return createDefaultSaveData();
    }
  }

  private persist(): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch {
      return false;
    }
  }

  private checkStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
