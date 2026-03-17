import type { SpawnedItem, CatchResult } from '@/types/index';

export class CatchSystem {
  evaluate(
    craneX: number,
    grabRadius: number,
    items: readonly SpawnedItem[],
    baseCatchRate: number,
  ): CatchResult {
    // Find items within grab radius
    let closest: SpawnedItem | null = null;
    let closestDist = Infinity;

    for (const item of items) {
      const dx = Math.abs(item.position.x - craneX);
      if (dx <= grabRadius && dx < closestDist) {
        closest = item;
        closestDist = dx;
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
