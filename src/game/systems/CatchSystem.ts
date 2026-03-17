import type { SpawnedItem, CatchResult } from '@/types/index';

export class CatchSystem {
  evaluate(
    craneX: number,
    craneZ: number,
    grabRadius: number,
    items: readonly SpawnedItem[],
    baseCatchRate: number,
  ): CatchResult {
    // Find items within grab radius (2D distance on X-Z plane)
    let closest: SpawnedItem | null = null;
    let closestDist = Infinity;

    for (const item of items) {
      const dx = item.position.x - craneX;
      const dz = item.position.z - craneZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= grabRadius && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }

    if (!closest) {
      return { success: false, item: null, isNewItem: false };
    }

    // Calculate success rate: baseCatchRate * (1 - catchDifficulty)
    const successRate = baseCatchRate * (1 - closest.itemDefinition.catchDifficulty);
    const roll = Math.random();

    if (roll < successRate) {
      return { success: true, item: closest.itemDefinition, isNewItem: false };
    }

    return { success: false, item: null, isNewItem: false };
  }
}
