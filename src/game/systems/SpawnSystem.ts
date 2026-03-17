import type { SpawnedItem } from '@/types/index';
import { ItemRegistry } from '@/game/entities/registry/ItemRegistry';

export class SpawnSystem {
  constructor(private registry: ItemRegistry) {}

  spawnItems(
    categoryId: string,
    count: number,
    areaWidth: number,
    areaDepth: number,
  ): SpawnedItem[] {
    const categoryItems = this.registry.getByCategory(categoryId);
    if (categoryItems.length === 0) return [];

    const spawned: SpawnedItem[] = [];
    for (let i = 0; i < count; i++) {
      const item = categoryItems[Math.floor(Math.random() * categoryItems.length)]!;
      spawned.push({
        itemDefinition: item,
        position: {
          x: (Math.random() - 0.5) * areaWidth,
          y: 0,
          z: (Math.random() - 0.5) * areaDepth,
        },
      });
    }

    return spawned;
  }
}
