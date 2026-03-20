import type { SaveData, VehicleId } from '../../types';

const STORAGE_KEY = 'kids-crane-catch2-save';

export class SaveManager {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return this.defaultData();

      const parsed = JSON.parse(raw);
      if (!this.isValid(parsed)) return this.defaultData();
      return parsed;
    } catch {
      return this.defaultData();
    }
  }

  save(data: SaveData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  addCollected(vehicleId: VehicleId): void {
    const data = this.load();
    if (!data.collectedVehicles.includes(vehicleId)) {
      data.collectedVehicles.push(vehicleId);
    }
    data.catchCounts[vehicleId] = (data.catchCounts[vehicleId] ?? 0) + 1;
    data.totalCatches = (data.totalCatches ?? 0) + 1;
    this.save(data);
  }

  incrementPlays(): void {
    const data = this.load();
    data.totalPlays = (data.totalPlays ?? 0) + 1;
    this.save(data);
  }

  isCollected(vehicleId: VehicleId): boolean {
    return this.load().collectedVehicles.includes(vehicleId);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private defaultData(): SaveData {
    return { collectedVehicles: [], catchCounts: {}, totalPlays: 0, totalCatches: 0 };
  }

  private isValid(data: unknown): data is SaveData {
    if (typeof data !== 'object' || data === null) return false;
    const d = data as Record<string, unknown>;
    if (!Array.isArray(d.collectedVehicles)) return false;
    if (!d.catchCounts || typeof d.catchCounts !== 'object') d.catchCounts = {};
    if (typeof d.totalPlays !== 'number') d.totalPlays = 0;
    if (typeof d.totalCatches !== 'number') d.totalCatches = 0;
    return d.collectedVehicles.every((v: unknown) => typeof v === 'string');
  }
}
