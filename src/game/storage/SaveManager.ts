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
      this.save(data);
    }
  }

  isCollected(vehicleId: VehicleId): boolean {
    return this.load().collectedVehicles.includes(vehicleId);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private defaultData(): SaveData {
    return { collectedVehicles: [] };
  }

  private isValid(data: unknown): data is SaveData {
    if (typeof data !== 'object' || data === null) return false;
    const d = data as Record<string, unknown>;
    if (!Array.isArray(d.collectedVehicles)) return false;
    return d.collectedVehicles.every((v: unknown) => typeof v === 'string');
  }
}
